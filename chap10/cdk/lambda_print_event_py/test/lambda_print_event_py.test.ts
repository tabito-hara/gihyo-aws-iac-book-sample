import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { LambdaPrintEventPyStack, getSSMParameterName, getLambdaZipFileNameFromSSM } from '../lib/lambda_print_event_py-stack';
import 'jest-specific-snapshot';
import * as path from 'path';
import { mockClient } from "aws-sdk-client-mock";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

const snapshotFileName = (stage: string, stackName: string): string => {
  return `./__snapshots__/${path.basename(__filename).split(".")[0]}/${stage}/${stackName}.snapshot`
}

const awsAccountId: { [key: string]: string } = {
  "dev": "123456789012"
}
const profiles: { [key: string]: string } = {
  "dev": "admin"
}
const stages = Object.keys(awsAccountId);

// SSMClient をモック化
const ssmMock = mockClient(SSMClient);

describe('lambda_print_event_py', () => {
  describe.each(stages)('[stage: %s] should match snapshot', (stage) => {
    const app = new cdk.App();

    // テストケース実行前に SSMClient のモックをリセット
    beforeAll(() => {
      ssmMock.reset();
    });
    // SSMClient のモックを設定
    ssmMock.on(GetParameterCommand, {
      Name: getSSMParameterName(stage),
    }).resolves({
      // モックのレスポンスを設定
      Parameter: {
        Name: getSSMParameterName(stage),
        Value: '1234567890abcdef',
      }
    });

    const lambdaZipFileName = getLambdaZipFileNameFromSSM(stage, profiles[stage]);

    const stacks = [
      new LambdaPrintEventPyStack(app, 'LambdaPrintEventPyStack', {
        stage,
        profile: profiles[stage],
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
