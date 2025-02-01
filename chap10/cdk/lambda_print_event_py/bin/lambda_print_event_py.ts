import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { LambdaPrintEventPyStack, getSSMParameterName } from '../lib/lambda_print_event_py-stack';
import { getParameterFromSSM } from "../lib/utils";
import { environmentProps, Stages } from '../lib/environments';

const stage = process.env.STAGE as Stages;
if (!stage) {
  throw new Error('STAGE is not defined');
}

const environment = environmentProps[stage];
if (!environment) {
  throw new Error(`Invalid stage: ${stage}`);
}

(async () => {
  const app = new cdk.App();

  // 非同期処理
  const lambdaZipFileName = await getParameterFromSSM(
    getSSMParameterName(stage),
  );

  const st = new cdk.Stage(app, stage, {
    env: { account: environment.account, region: 'ap-northeast-1' },
  });

  new LambdaPrintEventPyStack(st, 'LambdaPrintEventPyStack', {
    stage,
    lambdaZipFileName,
  });
})();
