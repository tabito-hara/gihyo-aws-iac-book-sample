resource "aws_ecs_cluster" "flask_api" {
  name = "${var.stage}-flask-api-tf"
}

resource "aws_ecs_cluster_capacity_providers" "flask_api" {
  capacity_providers = [
    "FARGATE",
  ]
  cluster_name = aws_ecs_cluster.flask_api.name
}

# すでに作成したSSMパラメータストアについてのデータソース
# IAM ポリシーのリソース、ECSタスク定義で参照する。
data "aws_ssm_parameter" "flask_api_correct_answer" {
  name = "/flask-api-tf/${var.stage}/correct_answer"
}

# 信頼関係ポリシー
data "aws_iam_policy_document" "ecs_task_execution_assume_role" {
  statement {
    effect = "Allow"
    actions = [
      "sts:AssumeRole"
    ]
    principals {
      identifiers = [
        "ecs-tasks.amazonaws.com"
      ]
      type = "Service"
    }
  }
}

# ECRやCloudWatch Logsのアクションを許可するAWSマネージドポリシー
data "aws_iam_policy" "managed_ecs_task_execution" {
  name = "AmazonECSTaskExecutionRolePolicy"
}

# タスク実行ロールにアタッチするインラインポリシー
# 起動時にSSMパラメータストアから環境変数を取得するのでその許可を記述
data "aws_iam_policy_document" "ecs_task_execution" {
  statement {
    effect = "Allow"
    actions = [
      "ssm:GetParameters",
      "ssm:GetParameter",
    ]
    # 参照できるパラメータストアを限定
    resources = [
      data.aws_ssm_parameter.flask_api_correct_answer.arn
    ]
  }
}

# IAMロールを記述
resource "aws_iam_role" "ecs_task_execution_role" {
  name               = "${var.stage}-flask-api-execution-role-tf"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_execution_assume_role.json
}

# IAMロールにAWSマネージドポリシーをアタッチ
resource "aws_iam_role_policy_attachments_exclusive" "ecs_task_execution_managed_policy" {
  policy_arns = [data.aws_iam_policy.managed_ecs_task_execution.arn]
  role_name   = aws_iam_role.ecs_task_execution_role.name
}

# IAMロールにインラインポリシーをアタッチ
resource "aws_iam_role_policy" "ecs_task_execution_inline_policy" {
  name   = "${var.stage}-flask-api-ecs-task-execution-policy"
  policy = data.aws_iam_policy_document.ecs_task_execution.json
  role   = aws_iam_role.ecs_task_execution_role.name
}

# 信頼関係ポリシー
data "aws_iam_policy_document" "ecs_task_assume_role" {
  statement {
    effect = "Allow"
    actions = [
      "sts:AssumeRole"
    ]
    principals {
      identifiers = [
        "ecs-tasks.amazonaws.com"
      ]
      type = "Service"
    }
  }
}

# タスクロールにアタッチするインラインポリシー
data "aws_iam_policy_document" "ecs_task" {
  # ECS Execの実行に必要なアクションを許可
  statement {
    effect = "Allow"
    actions = [
      "ssmmessages:CreateControlChannel",
      "ssmmessages:CreateDataChannel",
      "ssmmessages:OpenControlChannel",
      "ssmmessages:OpenDataChannel"
    ]
    resources = ["*"]
  }
}

# タスクロールを記述
resource "aws_iam_role" "ecs_task" {
  name               = "${var.stage}-flask-api-ecs-task-role-tf"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_assume_role.json
}

# タスクロールにインラインポリシーをアタッチ
resource "aws_iam_role_policy" "ecs_task_inline_policy" {
  name   = "${var.stage}-flask-api-ecs-task-policy"
  policy = data.aws_iam_policy_document.ecs_task.json
  role   = aws_iam_role.ecs_task.name
}

# 何回か参照するVPC名をlocalsで定義しておく
locals {
  vpc_name = "${var.stage}-vpc-tf"
}

# データソースによるVPCの情報の照会
# Name というタグの値で指定
data "aws_vpc" "this" {
  filter {
    name   = "tag:Name"
    values = [local.vpc_name]
  }
}
# データソースによるサブネットの情報の照会
# Name というタグの値で指定
data "aws_subnets" "public" {
  filter {
    name = "tag:Name"
    values = [
      "${local.vpc_name}-public-ap-northeast-1a",
      "${local.vpc_name}-public-ap-northeast-1c",
      "${local.vpc_name}-public-ap-northeast-1d"
    ]
  }
}

# ALB 用のセキュリティグループ
resource "aws_security_group" "alb" {
  name   = "${var.stage}-flask_api_alb_tf"
  vpc_id = data.aws_vpc.this.id
}

# ECS Fargate インスタンス用のセキュリティグループ
resource "aws_security_group" "ecs_instance" {
  name   = "${var.stage}-flask_api_ecs_instance_tf"
  vpc_id = data.aws_vpc.this.id
}

# ALB 用のセキュリティグループのインバウンドルール
# 任意のIPアドレスからの80番ポートへの接続を許可
resource "aws_vpc_security_group_ingress_rule" "lb_from_http" {
  ip_protocol       = "tcp"
  security_group_id = aws_security_group.alb.id
  from_port         = 80
  to_port           = 80
  cidr_ipv4         = "0.0.0.0/0"
}

# ALB 用のセキュリティグループのアウトバウンドルール
# ECS Fargate インスタンスの5000番ポートへの接続を許可
resource "aws_vpc_security_group_egress_rule" "lb_to_ecs_instance" {
  ip_protocol       = "tcp"
  security_group_id = aws_security_group.alb.id
  from_port         = 5000
  to_port           = 5000
  # ECS Fargate インスタンス用のセキュリティグループがアタッチされた ENI への通信を許可
  referenced_security_group_id = aws_security_group.ecs_instance.id
}

# ECS Fargate インスタンス用のセキュリティグループのインバウンドルール
# ALB からの5000番ポートへの接続を許可
resource "aws_vpc_security_group_ingress_rule" "ecs_instance_from_lb" {
  ip_protocol       = "tcp"
  security_group_id = aws_security_group.ecs_instance.id
  from_port         = 5000
  to_port           = 5000
  # ALB 用のセキュリティグループがアタッチされた ENI からの通信を許可
  referenced_security_group_id = aws_security_group.alb.id
}

# ECS Fargate インスタンス用のセキュリティグループのアウトバウンドルール
# 任意のIPアドレスの443番ポートへの接続を許可
# AWS API のエンドポイント(ECR, SSMなど)と通信できるようにするため
resource "aws_vpc_security_group_egress_rule" "ecs_instance_to_https" {
  ip_protocol       = "tcp"
  security_group_id = aws_security_group.ecs_instance.id
  from_port         = 443
  to_port           = 443
  cidr_ipv4         = "0.0.0.0/0"
}

# ALB 本体
resource "aws_lb" "flask_api" {
  name               = "${var.stage}-flask-api-alb-tf"
  internal           = false
  load_balancer_type = "application"
  # ALB用のセキュリティグループを指定
  security_groups = [aws_security_group.alb.id]
  # パブリックサブネットに配置
  subnets = data.aws_subnets.public.ids
}

# ALBのターゲットグループ
# 5000番ポートで通信を受け付ける
resource "aws_lb_target_group" "flask_api" {
  name        = "flask-api-tf"
  port        = 5000
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = data.aws_vpc.this.id
  health_check {
    path     = "/health"
    protocol = "HTTP"
    matcher  = "200"
    interval = 10
  }
}

# ALBのリスナー
# 80番ポートで受け付けたリクエストをターゲットグループに転送
resource "aws_lb_listener" "flask_api" {
  load_balancer_arn = aws_lb.flask_api.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.flask_api.arn
  }
}

# リージョンの問い合わせ
data "aws_region" "current" {}

# ECRリポジトリの問い合わせ
data "aws_ecr_repository" "flask_api" {
  name = "${var.stage}-flask-api-tf"
}

# ECSタスクのロググループ
resource "aws_cloudwatch_log_group" "flask_api" {
  name              = "/ecs/${var.stage}-flask-api-tf"
  retention_in_days = 90
}

# コンテナ定義を locals で定義しておく。
# このようにすることで、aws_ecs_task_definition の container_definitions 以外からも参照できる
locals {
  container_definitions = {
    # flask-api コンテナのコンテナ定義
    flask_api = {
      name = "flask-api"
      # 環境変数 CORRECT_ANSWER はSSMパラメータストアから取得
      secrets = [
        {
          name      = "CORRECT_ANSWER"
          valueFrom = data.aws_ssm_parameter.flask_api_correct_answer.arn
        },
      ]
      essential = true
      # ECR レポジトリのデータソースを参照
      image = "${data.aws_ecr_repository.flask_api.repository_url}:latest"
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.flask_api.name
          awslogs-region        = data.aws_region.current.name
          awslogs-stream-prefix = "flask_api"
        }
      }
      portMappings = [
        {
          containerPort = 5000
          hostPort      = 5000
          protocol      = "tcp"
        },
      ]
    },
  }
}

resource "aws_ecs_task_definition" "flask_api" {
  # jsonencode を使うと、HCLの記述(JSONの記述法が混在していてもよい)をJSONに変換してくれる
  # values() を使うとマップの値だけをリストとして取得できる
  container_definitions = jsonencode(
    values(local.container_definitions)
  )
  cpu                = "256"
  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn
  family             = "${var.stage}-flask-api-tf"
  memory             = "512"
  network_mode       = "awsvpc"
  requires_compatibilities = [
    "FARGATE",
  ]
  task_role_arn = aws_iam_role.ecs_task.arn
  # タスク定義の過去バージョンを削除しない
  skip_destroy = true
}

resource "aws_ecs_service" "flask_api" {
  cluster                           = aws_ecs_cluster.flask_api.arn
  desired_count                     = 0
  enable_execute_command            = true
  health_check_grace_period_seconds = 60
  launch_type                       = "FARGATE"
  name                              = "flask-api-tf"
  task_definition                   = aws_ecs_task_definition.flask_api.arn

  # デプロイに失敗しても再起動を繰り返さないようにサーキットブレーカーを入れておく
  deployment_circuit_breaker {
    enable   = true
    rollback = false
  }

  load_balancer {
    # container_definitions を locals のマップにしておくことでコンテナ名を参照できる
    container_name   = local.container_definitions.flask_api.name
    container_port   = 5000
    target_group_arn = aws_lb_target_group.flask_api.arn
  }

  network_configuration {
    security_groups = [
      aws_security_group.ecs_instance.id
    ]
    # このケースではパブリックサブネットにECS Fargateインスタンスを配置する
    subnets          = data.aws_subnets.public.ids
    assign_public_ip = true
  }

  lifecycle {
    ignore_changes = [
      # desired_count は変動するので、差分を無視する
      desired_count
    ]
  }
}
