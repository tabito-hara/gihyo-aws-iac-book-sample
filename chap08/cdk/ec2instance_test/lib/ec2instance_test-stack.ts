import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class Ec2InstanceTestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, 'VPC', {
      vpcName: 'dev-vpc'
    });
    const sg = new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc: vpc,
      allowAllOutbound: false
    });
    sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22),
      'allow ssh access from the world');

    new ec2.Instance(this, 'Instance', {
      vpc,
      instanceType: new ec2.InstanceType('t3.micro'),
      machineImage: new ec2.AmazonLinuxImage(
        {
          generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2023,
          //cachedInContext: true,
        }
      ),
      securityGroup: sg,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC
      }
    });
  }
}
