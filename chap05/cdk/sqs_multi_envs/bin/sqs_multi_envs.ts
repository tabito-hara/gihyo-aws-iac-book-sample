#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SqsMultiStack } from '../lib/sqs_multi_envs-stack';
import { Stages, environmentProps } from '../lib/environments';

// 静的にスタックを定義する場合
/*
const app = new cdk.App();

// forループですべての環境のスタックを記述
for (const stage of Object.keys(environmentProps) as Stages[]) {
  const environment = environmentProps[stage];
  const env: cdk.Environment = {
    account: environment.account,
    region: environment.region,
  };
  new SqsMultiStack(app, `${stage}-SqsMultiStack1`, {
    queueName: `${stage}-MyQueue1`,
    env,
  });
  new SqsMultiStack(app, `${stage}-SqsMultiStack2`, {
    queueName: `${stage}-MyQueue2`,
    env,
  });
}
 */

// 動的にスタックを定義する場合（Stageコンストラクタは使わない）
/*
const stage = process.env.STAGE as Stages;
if (!stage) {
  throw new Error('STAGE is not defined');
}

const environment = environmentProps[stage];
if (!environment) {
  throw new Error(`Invalid stage: ${stage}`);
}

const env: cdk.Environment = {
  account: environment.account,
  region: environment.region,
}

const app = new cdk.App();
new SqsMultiStack(app, `${stage}-SqsMultiStack1`, {
  queueName: `${stage}-MyQueue1`,
  env,
});
new SqsMultiStack(app, `${stage}-SqsMultiStack2`, {
  queueName: `${stage}-MyQueue2`,
  env,
});
*/

// 動的にスタックを定義する場合（Stageコンストラクタを使う）
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
  env: {
    account: environment.account,
    region: environment.region,
  }
});
new SqsMultiStack(st, 'SqsMultiStack1', {
  queueName: `${stage}-MyQueue1`,
});
new SqsMultiStack(st, 'SqsMultiStack2', {
  queueName: `${stage}-MyQueue2`,
});
