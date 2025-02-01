import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';

export class SqsLoopStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    for (const suffix of ['First', 'Second', 'Third']) {
      // id に suffix を含めてこのクラスの中で一意になるようにしている
      new sqs.Queue(this, `Queue-${suffix}`, {
        queueName: `Queue-${suffix}`,
      });
    }
  }
}
