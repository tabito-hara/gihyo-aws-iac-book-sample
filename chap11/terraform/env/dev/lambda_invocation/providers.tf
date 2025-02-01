provider "aws" {
  region = "ap-northeast-1"
  default_tags {
    tags = {
      Terraform = "true"
      STAGE     = "dev"
      MODULE    = "lambda_invocation"
    }
  }
}
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
  default_tags {
    tags = {
      Terraform = "true"
      STAGE     = "dev"
      MODULE    = "lambda_invocation"
    }
  }
}
