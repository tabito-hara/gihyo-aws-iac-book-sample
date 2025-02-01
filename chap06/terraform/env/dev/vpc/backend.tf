terraform {
  backend "s3" {
    bucket = "dev-tfstate-aws-iac-book-project"
    key    = "vpc/terraform.tfstate"
    region = "ap-northeast-1"
  }
}
