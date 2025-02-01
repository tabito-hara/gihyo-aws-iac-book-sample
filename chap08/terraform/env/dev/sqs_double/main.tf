resource "aws_sqs_queue" "my_queue_1" {
  name = "test-queue-tf-1"
}
resource "aws_sqs_queue" "my_queue_2" {
  name = "test-queue-tf-2"
}
