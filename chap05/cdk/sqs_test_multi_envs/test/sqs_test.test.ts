import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as SqsTest from '../lib/sqs_test-stack';
import { propsLong, propsShort, STAGE } from '../lib/config';
import 'jest-specific-snapshot';
import * as path from 'path';

const stages = Object.keys(propsLong) as STAGE[];

const snapshotFileName = (stage: string, stackName: string): string => {
  return `./__snapshots__/${path.basename(__filename).split(".")[0]}/${stage}/${stackName}.snapshot`
}

describe.each(stages)('[stage: %s] should match snapshot', (stage) => {
  const app = new cdk.App();
  const stacks = [
    new SqsTest.SqsTestStack(app, 'SqsTestLongStack', propsLong[stage]),
    new SqsTest.SqsTestStack(app, 'SqsTestShortStack', propsShort[stage]),
  ]

  stacks.forEach(stack => {
    it(`[${stack.stackName}] should match the snapshot`, () => {
      const template = Template.fromStack(stack).toJSON();
      expect(template).toMatchSpecificSnapshot(snapshotFileName(stage, stack.stackName));
    });
  })
});
