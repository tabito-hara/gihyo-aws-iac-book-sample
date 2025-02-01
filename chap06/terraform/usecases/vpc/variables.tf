variable "stage" {
  type        = string
  description = "stage: dev, stg, prd"
}
variable "vpc_cidr" {
  type        = string
  description = "VPC の CIDR。例: 10.0.0.0/16"
}
variable "enable_nat_gateway" {
  type        = bool
  description = "NAT Gateway を使うかどうか"
}
variable "one_nat_gateway_per_az" {
  type        = bool
  description = "AZ ごとに 1 つの NAT Gateway を設置するか"
}
