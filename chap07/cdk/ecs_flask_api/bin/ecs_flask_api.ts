#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { EcsFlaskApiInfraStack } from '../lib/ecs_flask_api_infra-stack';
import { EcsFlaskApiStack } from '../lib/ecs_flask_api-stack';
import { environmentProps, Stages } from '../lib/environments';
//import { getSubnetIdsFromName } from '../lib/utils';

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
    region: 'ap-northeast-1'}
})
const infraStack = new EcsFlaskApiInfraStack(st, 'EcsFlaskApiInfraStack', {
  stage
});
new EcsFlaskApiStack(st, 'EcsFlaskApiStack', {
  stage,
  // infraStack のインスタンス変数を参照している
  repositoryName: infraStack.repositoryName,
  secretsName: infraStack.secretsName
});

/*
// 8.4 の修正を反映したもの
(async () => {
  const subnetIds = await getSubnetIdsFromName(
      `${stage}/VpcStack/Vpc/Public*`
  );
  if (!subnetIds) {
    throw new Error(`Subnet not found: ${stage}/VpcStack/Vpc/Public*`);
  }

  const app = new cdk.App();
  const st = new cdk.Stage(app, stage, {
    env: {account: environment.account, region: 'ap-northeast-1'}
  })
  const infraStack = new EcsFlaskApiInfraStack(st, 'EcsFlaskApiInfraStack', {
    stage
  });
  new EcsFlaskApiStack(st, 'EcsFlaskApiStack', {
    stage,
    repositoryName: infraStack.repositoryName,
    secretsName: infraStack.secretsName,
    serviceSubnetIds: subnetIds
  });
})();
*/