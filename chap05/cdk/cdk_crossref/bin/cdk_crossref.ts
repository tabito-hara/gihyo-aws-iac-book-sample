import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { VpcStack, SecurityGroupStack } from '../lib/cdk_crossref-stack';

const app = new cdk.App();

const vpcStack = new VpcStack(app, 'VpcStack');
new SecurityGroupStack(app, 'SecurityGroupStack', {
  vpcId: vpcStack.vpcId,
});

// インスタンス変数の型をec2.Vpcにした場合
/*
new SecurityGroupStack(app, 'SecurityGroupStack', {
  vpc: vpcStack.vpc
});
*/
