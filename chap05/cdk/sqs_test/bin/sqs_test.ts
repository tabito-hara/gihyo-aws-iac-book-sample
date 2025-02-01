#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SqsTestStack } from '../lib/sqs_test-stack';
import { props } from '../lib/config';

const app = new cdk.App();
new SqsTestStack(app, 'SqsTestStack', {
  ...props,
});
