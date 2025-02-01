import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';

const lambdaName = 'lambda_print_event_go'

export interface LambdaPrintEventGoStackProps extends cdk.StackProps {
  stage: string;
}

export class LambdaPrintEventGoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: LambdaPrintEventGoStackProps) {
    super(scope, id, props);

    new lambda.Function(this, "LambdaPrintEventZip", {
      functionName: `${props.stage}-${lambdaName}-cdk`,
      code: lambda.Code.fromDockerBuild("../../lambda/print_event_go", {
        file: "Dockerfile.build",
      }),
      handler: "bootstrap",
      runtime: lambda.Runtime.PROVIDED_AL2023,
      architecture: lambda.Architecture.ARM_64,
    });
  }
}
