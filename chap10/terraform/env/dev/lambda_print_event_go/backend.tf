terraform {
  backend "s3" {
    bucket = "dev-tfstate-aws-iac-book-project"
    key    = "lambda_print_event_go/terraform.tfstate"
    region = "ap-northeast-1"
  }
}
