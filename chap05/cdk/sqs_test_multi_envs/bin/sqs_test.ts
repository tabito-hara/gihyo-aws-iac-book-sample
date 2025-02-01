#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SqsTestStack } from '../lib/sqs_test-stack';
import { propsLong, propsShort, STAGE } from '../lib/config';

const stage = process.env.STAGE as STAGE;
const app = new cdk.App();
new SqsTestStack(app, `${stage}-SqsTestLongStack`, {
  ...propsLong[stage],
});
new SqsTestStack(app, `${stage}-SqsTestShortStack`, {
  ...propsShort[stage],
});

