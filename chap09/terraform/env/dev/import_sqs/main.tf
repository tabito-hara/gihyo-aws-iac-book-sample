resource "aws_sqs_queue" "import_test" {

}

/*
resource "aws_sqs_queue" "import_test" {
  content_based_deduplication       = false
  delay_seconds                     = 0
  fifo_queue                        = false
  kms_data_key_reuse_period_seconds = 300
  max_message_size                  = 262144
  message_retention_seconds         = 345600
  name                              = "import-test"
  receive_wait_time_seconds         = 0
  sqs_managed_sse_enabled           = true
  tags                              = {}
  tags_all                          = {}
  visibility_timeout_seconds        = 10
}
*/

/*
module "sqs" {
  source = "../../../usecases/import_sqs"
}
*/