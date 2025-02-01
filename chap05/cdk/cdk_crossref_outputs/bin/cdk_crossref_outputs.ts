import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { VpcStack, SecurityGroupStack } from '../lib/cdk_crossref_outputs-stack';

const app = new cdk.App();
const vpcStack = new VpcStack(app, 'VpcStack');
new SecurityGroupStack(app, 'SecurityGroupStack', {
  vpcStackName: vpcStack.stackName
});
