terraform {
  backend "s3" {
    bucket = "dev-tfstate-aws-iac-book-project"
    key    = "import_sqs_block/terraform.tfstate"
    region = "ap-northeast-1"
  }
}
