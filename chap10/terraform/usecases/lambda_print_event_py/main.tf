locals {
  // アセットをアップロードしたS3バケット
  lambda_bucket      = "${var.stage}-lambda-deploy-123456789012-apne1"
  lambda_name        = "print_event_py"
  ssm_parameter_name = "/lambda_zip/${var.stage}/${local.lambda_name}"
}

// SSM パラメータストアの値を取得
data "aws_ssm_parameter" "sha256" {
  name = local.ssm_parameter_name
}

// IAMロールの信頼関係ポリシーを記述
// AWSのサービスlambda.amazonaws.comにIAMロールの引き受けを許可する
data "aws_iam_policy_document" "assume_role_lambda" {
  statement {
    actions = ["sts:AssumeRole"]
    effect  = "Allow"
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}
// IAMポリシー(AWSLambdaBasicExecutionRole)の情報を取得
data "aws_iam_policy" "lambda_basic_execution" {
  name = "AWSLambdaBasicExecutionRole"
}

// Lambda関数にアタッチするIAMロールを記述
resource "aws_iam_role" "lambda_role" {
  name               = "${var.stage}-${local.lambda_name}-lambda-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role_lambda.json
}

resource "aws_iam_role_policy_attachments_exclusive" "lambda_role_policy" {
  policy_arns = [data.aws_iam_policy.lambda_basic_execution.arn]
  role_name   = aws_iam_role.lambda_role.name
}

// Lambda関数本体を記述
resource "aws_lambda_function" "print_event" {
  function_name = "${var.stage}-${local.lambda_name}-tf"
  s3_bucket     = local.lambda_bucket
  // SSMパラメータストアから取得したsha256ハッシュによってオブジェクトキーを指定する
  s3_key  = nonsensitive("${local.lambda_name}/${data.aws_ssm_parameter.sha256.value}.zip")
  runtime = "python3.12"
  // runtimeがPythonの場合には、[ファイル名(拡張子を除く)].[関数名]を指定する
  handler       = "main.handler"
  architectures = ["arm64"]
  timeout       = 30
  role          = aws_iam_role.lambda_role.arn
}
