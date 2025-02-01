import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as SqsTest from '../lib/sqs_test-stack';
import { props } from '../lib/config';

describe('SQS Stack', () => {
  const app = new cdk.App();
  const stack = new SqsTest.SqsTestStack(app, 'SqsTestStack', props);
  const template = Template.fromStack(stack).toJSON();
  it('should match the snapshot', () => {
    expect(template).toMatchSnapshot();
  });
});
