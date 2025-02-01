import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class VpcStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const vpc = new ec2.Vpc(this, 'Vpc');

    new cdk.CfnOutput(this, 'VpcId', {
      value: vpc.vpcId,
      exportName: `${this.stackName}-VPCID`
    })
  }
}

interface SecurityGroupStackProps extends cdk.StackProps {
  vpcStackName: string;
}

export class SecurityGroupStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: SecurityGroupStackProps) {
    super(scope, id, props);
    new ec2.CfnSecurityGroup(this, 'SecurityGroup', {
      groupDescription: 'test security group',
      vpcId: cdk.Fn.importValue(`${props.vpcStackName}-VPCID`),
    });
  }
}
