#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SqsMultiStack } from '../lib/sqs_multi-stack';

const app = new cdk.App();
new SqsMultiStack(app, 'SqsMultiStack1', {
  queueName: 'MyQueue1'
});
new SqsMultiStack(app, 'SqsMultiStack2', {
  queueName: 'MyQueue2'
});
