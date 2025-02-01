import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { LambdaPrintEventGoStack } from '../lib/lambda_print_event_go-stack';
import 'jest-specific-snapshot';
import * as path from 'path';
import { CodeConfig } from 'aws-cdk-lib/aws-lambda';

jest.mock('aws-cdk-lib/aws-lambda', () => {
  const originalModule = jest.requireActual<typeof import("aws-cdk-lib/aws-lambda")>('aws-cdk-lib/aws-lambda');
  originalModule.Code.fromDockerBuild = (path: string): any => ({
    path,
    isInline: false,
    bind: (): CodeConfig => {
      return {
        s3Location: {
          bucketName: 'bucketName',
          objectKey: 'objectKey',
        },
      };
    },
    bindToResource: () => { },
  });
  return originalModule;
});

const snapshotFileName = (stage: string, stackName: string): string => {
  return `./__snapshots__/${path.basename(__filename).split(".")[0]}/${stage}/${stackName}.snapshot`
}

const awsAccountId: { [key: string]: string } = {
  "dev": "123456789012"
}
const stages = Object.keys(awsAccountId);

describe('lambda_print_event_go', () => {
  describe.each(stages)('[stage: %s] should match snapshot', (stage) => {
    const app = new cdk.App();

    const stacks = [
      new LambdaPrintEventGoStack(app, 'LambdaPrintEventGoStack', {
        stage,
        env: {account: awsAccountId[stage], region: 'ap-northeast-1'},
      }),
    ]

    stacks.forEach(stack => {
      it(`[${stack.stackName}] should match the snapshot`, () => {
        const template = Template.fromStack(stack).toJSON();
        expect(template).toMatchSpecificSnapshot(snapshotFileName(stage, stack.stackName));
      });
    })
  });
});
