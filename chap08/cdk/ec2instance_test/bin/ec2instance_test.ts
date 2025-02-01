#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { Ec2InstanceTestStack } from '../lib/ec2instance_test-stack';

const app = new cdk.App();
new Ec2InstanceTestStack(app, 'Ec2InstanceTestStack', {
  env: {
    account: '123456789012',
    region: 'ap-northeast-1',
  }
});