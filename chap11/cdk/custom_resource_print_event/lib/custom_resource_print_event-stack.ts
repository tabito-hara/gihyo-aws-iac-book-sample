import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cfn from "aws-cdk-lib/aws-cloudformation";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as fs from "node:fs";

export class CustomResourcePrintEventStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const code = fs.readFileSync("lambda/print_event/main.py", "utf-8");

    const func = new lambda.Function(this, "PrintEventLambda", {
      functionName: "PrintEventLambda",
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: "index.lambda_handler",
      code: lambda.Code.fromInline(code),
      architecture: lambda.Architecture.ARM_64,
      timeout: cdk.Duration.seconds(10),
    });

    const cr = new cdk.CustomResource(this, "PrintEventCustomResource", {
      serviceToken: func.functionArn,
      properties: {
        Greeting: "Hello",
      },
    });
    (cr.node.defaultChild as cfn.CfnCustomResource).serviceTimeout = 15
  }
}
