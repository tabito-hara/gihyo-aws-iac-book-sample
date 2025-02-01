import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { cidrSubnet } from './utils';

export interface VpcStackProps extends cdk.StackProps {
  stage: string;
  cidr: string;
  enableNatGateway: boolean;
  oneNatGatewayPerAz: boolean;
}

export class VpcStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: VpcStackProps) {
    super(scope, id, props);

    const vpcCidrMask = Number(props.cidr.split('/')[1]);
    const subnetCidrMask = vpcCidrMask + 4;

    const subnetConfiguration: ec2.SubnetConfiguration[] = [
      {
        name: "Public",
        subnetType: ec2.SubnetType.PUBLIC,
        cidrMask: subnetCidrMask,
      },
      {
        name: "Isolated",
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        cidrMask: subnetCidrMask,
      },
      // enableNatGateway が true のときのみPRIVATE_WITH_EGRESSのサブネットを追加
      ...(props.enableNatGateway ? [{
        name: "Private",
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        cidrMask: subnetCidrMask,
      }] : []),
    ];
    const natGateways = props.enableNatGateway
      ? (props.oneNatGatewayPerAz ? 3 : 1)
      : 0;

    new ec2.Vpc(this, 'Vpc', {
      vpcName: `${props.stage}-vpc-cdk`,
      ipAddresses: ec2.IpAddresses.cidr(props.cidr),
      subnetConfiguration,
      natGateways
    });

    // CIDRブロックを指定してサブネットを作成する場合
    /*
    const cidrBlocks: {[key: string]: string[]} = {
      'PublicSubnet': [
        cidrSubnet(props.cidr, 4, 0),
        cidrSubnet(props.cidr, 4, 1),
        cidrSubnet(props.cidr, 4, 2),
      ],
      'IsolatedSubnet': [
        cidrSubnet(props.cidr, 4, 4),
        cidrSubnet(props.cidr, 4, 5),
        cidrSubnet(props.cidr, 4, 6),
      ],
      ...(props.enableNatGateway && {
        'PrivateSubnet': [
          cidrSubnet(props.cidr, 4, 8),
          cidrSubnet(props.cidr, 4, 9),
          cidrSubnet(props.cidr, 4, 10),
        ],
      }),
    };
    Object.entries(cidrBlocks).forEach(([subnetType, cidrBlockList]) => {
      cidrBlockList.forEach((cidrBlock, index) => {
        const cfnSubnet = this
          .node.findChild("Vpc")
          .node.findChild(`${subnetType}${index + 1}`)
          .node.findChild("Subnet") as ec2.CfnSubnet;
        cfnSubnet.cidrBlock = cidrBlock;
        //cfnSubnet.addOverride("Properties.CidrBlock", cidrBlock);
        //cfnSubnet.addPropertyOverride("CidrBlock", cidrBlock);
        cfnSubnet.addPropertyOverride(
          "Tags.2.Value",
          `${props.stage}-vpc-cdk-${subnetType}-${index + 1}`
        );
      });
    });
    */
  }
}
