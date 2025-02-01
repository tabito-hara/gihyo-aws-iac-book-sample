module "sqs_module_multi_regions" {
  source                               = "../../../modules/sqs_multi_regions"
  stage                                = "dev"
  queue_name_suffix                    = "queue-test"
  sqs_queue_visibility_timeout_seconds = 60
  providers = {
    aws.another_region = aws.us_east_1
  }
}
