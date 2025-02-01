terraform {
  backend "s3" {
    bucket = "dev-tfstate-aws-iac-book-project"
    key    = "ecs_flask_api_infra/terraform.tfstate"
    region = "ap-northeast-1"
  }
}
