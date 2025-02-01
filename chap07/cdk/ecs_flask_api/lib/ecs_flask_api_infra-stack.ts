import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as sm from 'aws-cdk-lib/aws-secretsmanager';

interface EcsFlaskApiInfraStackProps extends cdk.StackProps {
  stage: string;
}

export class EcsFlaskApiInfraStack extends cdk.Stack {
  // インスタンス変数を定義。クラス外から参照できるようにする。
  repositoryName: string;
  secretsName: string;

  constructor(scope: Construct, id: string, props: EcsFlaskApiInfraStackProps) {
    super(scope, id, props);

    const repository = new ecr.Repository(this, 'EcsFlaskApiRepository', {
      repositoryName: `${props.stage}-flask-api-cdk`
    });
    const secrets = new sm.Secret(this, 'EcsFlaskApiSecrets', {
      secretName: `/flask-api-cdk/${props.stage}/correct_answer`,
    })
    // インスタンス変数に値を代入
    this.repositoryName = repository.repositoryName;
    this.secretsName = secrets.secretName;
  }
}
