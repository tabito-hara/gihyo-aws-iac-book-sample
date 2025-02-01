import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { SqsTestStackProps } from './config';

export class SqsTestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: SqsTestStackProps) {
    super(scope, id, props);

    new sqs.Queue(this, 'SqsTestQueue', {
      visibilityTimeout: props.visibilityTimeout
    });
  }
}
