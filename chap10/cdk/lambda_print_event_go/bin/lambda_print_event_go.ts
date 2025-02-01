#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { LambdaPrintEventGoStack } from '../lib/lambda_print_event_go-stack';
import { environmentProps, Stages} from "../lib/environments";

const stage = process.env.STAGE as Stages;
if (!stage) {
  throw new Error('STAGE is not defined');
}

const environment = environmentProps[stage];
if (!environment) {
  throw new Error(`Invalid stage: ${stage}`);
}

const app = new cdk.App();
const st = new cdk.Stage(app, stage, {
  env: {account: environment.account, region: 'ap-northeast-1'},
})
new LambdaPrintEventGoStack(st, 'LambdaPrintEventGoStack', {
  stage
});
