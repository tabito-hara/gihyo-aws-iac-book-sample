module "vpc" {
  source                 = "../../../usecases/vpc"
  stage                  = "dev"
  vpc_cidr               = "10.0.0.0/16"
  enable_nat_gateway     = false
  one_nat_gateway_per_az = false
}
