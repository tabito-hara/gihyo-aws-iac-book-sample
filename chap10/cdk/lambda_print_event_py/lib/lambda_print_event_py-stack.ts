import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";

export interface LambdaPrintEventPyStackProps extends cdk.StackProps {
  stage: string;
  lambdaZipFileName: string;
}

const lambdaName = "print_event_py";

const getLambdaBucket = (stage: string): string =>{
  return `${stage}-lambda-deploy-123456789012-apne1`;
}

export const getSSMParameterName = (stage: string): string => {
  return `/lambda_zip/${stage}/${lambdaName}`
}

// スタックのコンストラクタ
export class LambdaPrintEventPyStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props: LambdaPrintEventPyStackProps
  ) {
    super(scope, id, props);

    // アセットが配置されたS3バケットのインスタンスを静的メソッドで作成
    const bucket = s3.Bucket.fromBucketName(
      this,
      "LambdaPrintEventPyBucket",
      getLambdaBucket(props.stage)
    );

    const lambdaFunc = new lambda.Function(this, "LambdaPrintEventPy", {
      functionName: `${props.stage}-${lambdaName}-cdk`,
      code: lambda.Code.fromBucket(bucket, `${lambdaName}/${props.lambdaZipFileName}.zip`),
      handler: "main.handler",
      runtime: lambda.Runtime.PYTHON_3_12,
      architecture: lambda.Architecture.ARM_64,
    });
  }
}
