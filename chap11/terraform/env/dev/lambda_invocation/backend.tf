terraform {
  backend "s3" {
    bucket = "dev-tfstate-aws-iac-book-project"
    key    = "lambda_invocation/terraform.tfstate"
    region = "ap-northeast-1"
  }
}
