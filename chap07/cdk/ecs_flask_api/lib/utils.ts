import { EC2Client, DescribeSubnetsCommand } from '@aws-sdk/client-ec2';

export const getSubnetIdsFromName = async (subnetNamePattern: string) => {
  const client = new EC2Client();
  const command = new DescribeSubnetsCommand({
    Filters: [
      {
        Name: 'tag:Name',
        Values: [subnetNamePattern]
      }
    ]
  });
  const response = await client.send(command);
  if (!response.Subnets) {
    throw new Error(`Subnet not found: ${subnetNamePattern}`);
  }
  return response.Subnets.map(subnet => {
    if (!subnet.SubnetId) {
      throw new Error('SubnetId not found');
    }
    return subnet.SubnetId
  });
}
