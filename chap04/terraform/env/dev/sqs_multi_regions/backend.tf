terraform {
  backend "s3" {
    bucket = "dev-tfstate-aws-iac-book-project"
    key    = "sqs_multi_regions/terraform.tfstate"
    region = "ap-northeast-1"
  }
}
