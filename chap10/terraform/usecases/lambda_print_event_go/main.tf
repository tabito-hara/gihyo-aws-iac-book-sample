locals {
  lambda_name   = "lambda_print_event_go"
  lambda_bucket = "${var.stage}-lambda-deploy-123456789012-apne1"
  # path.moduleはこのモジュールのディレクトリを示す。このディレトリからの相対パスで指定する。
  lambda_local_code_dir = abspath("${path.module}/../../../lambda/print_event_go")
}

# create_asset_zip.shを、externalプロバイダが提供するデータソースexternalを使って実行する。
# データソースなので、実行計画を作成するときに毎回実行される。
data "external" "create_asset_zip" {
  # create_asset_zip.shのパスをこのモジュールのパス(path.module)からの相対パスで指定する。
  program = ["sh", "${path.module}/../../../scripts/create_asset_zip.sh"]
  query = {
    lambda_local_code_dir = local.lambda_local_code_dir
    lambda_name           = local.lambda_name
    # コンテナイメージのビルドの中でGo言語のコードをコンパイルするためDOCKERを指定
    method     = "DOCKER"
    dockerfile = "${local.lambda_local_code_dir}/Dockerfile.build"
  }
}

# zipファイルの名前が変更されたら、zipファイルをS3にアップロードする。
# リソースなので、terraform apply のときにのみ実行される。
resource "terraform_data" "upload_zip_s3" {
  provisioner "local-exec" {
    command = "aws s3 cp ${data.external.create_asset_zip.result.zipfile} s3://${local.lambda_bucket}/${local.lambda_name}/"
  }
  triggers_replace = [
    basename(data.external.create_asset_zip.result.zipfile),
  ]
}

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

data "aws_iam_policy" "lambda_basic_execution" {
  name = "AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role" "lambda" {
  assume_role_policy = data.aws_iam_policy_document.assume_role_lambda.json
  name               = "${var.stage}-${local.lambda_name}-lambda-role"
}

resource "aws_iam_role_policy_attachments_exclusive" "lambda_managed_policy" {
  policy_arns = [data.aws_iam_policy.lambda_basic_execution.arn]
  role_name   = aws_iam_role.lambda.name
}

resource "aws_lambda_function" "print_event" {
  function_name = "${var.stage}-${local.lambda_name}-tf"
  s3_bucket     = local.lambda_bucket
  # データソースexternalで作成したzipファイルを指定する
  s3_key = "${local.lambda_name}/${basename(data.external.create_asset_zip.result.zipfile)}"
  # Go言語で記述されたコードを使用する場合は、provided.al2023を指定する。
  runtime = "provided.al2023"
  # Go言語で記述されたコードを使用する場合は、bootstrapを指定する。
  handler       = "bootstrap"
  memory_size   = 128
  timeout       = 30
  role          = aws_iam_role.lambda.arn
  architectures = ["arm64"]
  depends_on    = [terraform_data.upload_zip_s3]
}
