import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';

export interface SqsMultiStackProps extends cdk.StackProps {
  queueName: string;
}

export class SqsMultiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: SqsMultiStackProps) {
    super(scope, id, props);

    new sqs.Queue(this, 'Queue', {
      queueName: props.queueName,
    });
  }
}
