terraform {
  backend "s3" {
    bucket = "dev-tfstate-aws-iac-book-project"
    key    = "sqs/terraform.tfstate"
    region = "ap-northeast-1"
  }
}
