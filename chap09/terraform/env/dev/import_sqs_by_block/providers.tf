provider "aws" {
  region = "ap-northeast-1"
  /*
  default_tags {
    tags = {
      Terraform = "true"
      STAGE     = "dev"
      MODULE    = "import_sqs_block"
    }
  }
  */
}
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
  /*
  default_tags {
    tags = {
      Terraform = "true"
      STAGE     = "dev"
      MODULE    = "import_sqs_block"
    }
  }
 */
}
