import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as cfn from "aws-cdk-lib/aws-cloudformation";
import * as fs from "node:fs";
import * as cr from 'aws-cdk-lib/custom-resources'

export class CustomResourceS3ObjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucketName = `${cdk.Stack.of(this).account}-test-bucket`;
    const bucket = s3.Bucket.fromBucketName(this, "Bucket", bucketName);

    const code = fs.readFileSync(
      "lambda/put_s3_object/main.py",
      "utf-8"
    );

    const lambdaFunction = new lambda.Function(this, "Function", {
      functionName: "CRPutS3ObjectCRProvider",
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: "index.lambda_handler",
      code: lambda.Code.fromInline(code),
      timeout: cdk.Duration.seconds(15),
      architecture: lambda.Architecture.ARM_64,
    });
    bucket.grantRead(lambdaFunction);
    bucket.grantPut(lambdaFunction);
    bucket.grantDelete(lambdaFunction);

    const crProvider = new cr.Provider(this, 'PutS3CustomResourceProvider', {
      onEventHandler: lambdaFunction,
    });

    const customResource = new cdk.CustomResource(this, 'PutS3CustomResource', {
      serviceToken: crProvider.serviceToken,
      properties: {
        Bucket: bucketName,
        Key: 'test-key-cdk-cr-provider',
        Body: 'Hello, World!!!',
      }
    });
    (customResource.node.defaultChild as cfn.CfnCustomResource).serviceTimeout = 30
  }
}
