import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';

export class SqsDoubleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const queue1 = new sqs.Queue(this, 'Queue1', {
      queueName: 'test-queue-cdk-1'
    })
    const queue2 = new sqs.Queue(this, 'Queue2', {
      queueName: 'test-queue-cdk-2'
    })
    //queue2.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN)
  }
}
