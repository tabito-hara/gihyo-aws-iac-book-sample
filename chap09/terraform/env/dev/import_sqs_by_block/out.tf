# __generated__ by Terraform
# Please review these resources and move them into your main configuration files.

# __generated__ by Terraform from "https://sqs.ap-northeast-1.amazonaws.com/123456789012/import-test"
resource "aws_sqs_queue" "import_test" {
  content_based_deduplication       = false
  deduplication_scope               = null
  delay_seconds                     = 0
  fifo_queue                        = false
  fifo_throughput_limit             = null
  kms_data_key_reuse_period_seconds = 300
  kms_master_key_id                 = null
  max_message_size                  = 262144
  message_retention_seconds         = 345600
  name                              = "import-test"
  name_prefix                       = null
  policy                            = null
  receive_wait_time_seconds         = 0
  redrive_allow_policy              = null
  redrive_policy                    = null
  sqs_managed_sse_enabled           = true
  tags                              = {}
  tags_all                          = {}
  visibility_timeout_seconds        = 10
}
