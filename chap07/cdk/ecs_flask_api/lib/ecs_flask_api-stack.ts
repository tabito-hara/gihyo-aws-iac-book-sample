import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";
import * as logs from "aws-cdk-lib/aws-logs";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as sm from "aws-cdk-lib/aws-secretsmanager";

interface EcsFlaskApiStackProps extends cdk.StackProps {
  stage: string;
  repositoryName: string;
  secretsName: string;
  //serviceSubnetIds: string[];
}

export class EcsFlaskApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: EcsFlaskApiStackProps) {
    super(scope, id, props);

    // VPCの名前から、インターフェースIVpcを満たすインスタンスを作成
    const vpc = ec2.Vpc.fromLookup(this, "EcsFlaskApiVpc", {
      vpcName: `${props.stage}-vpc-cdk`,
    });

    // 既存のシークレットからインターフェースISecretを満たすインスタンスを作成
    const secrets = sm.Secret.fromSecretNameV2(
      this,
      "EcsFlaskApiSecrets",
      props.secretsName
    );

    // 既存のリポジトリの名前から、IRepositoryインターフェースを満たすインスタンスを作成
    const repository = ecr.Repository.fromRepositoryName(
      this,
      "EcsFlaskApiRepository",
      props.repositoryName
    );

    const cluster = new ecs.Cluster(this, "EcsFlaskApiCluster", {
      clusterName: `${props.stage}-flask-api-cdk`,
      enableFargateCapacityProviders: true,
      vpc,
    });

    // ECSタスク実行ロールを作成（自分で記述する場合はコメントインする）
    /*
    const executionRole = new iam.Role(this, "EcsFlaskApiTaskExecRole", {
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
      roleName: `${props.stage}-flask-api-execution-role-cdk`,
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AmazonECSTaskExecutionRolePolicy"
        ),
      ],
    });
    // ECSタスク定義でSecrets Managerを参照していると自動的に付与されるが、
    // 明示的に付与する場合は次のように記述する
    // secrets.grantRead(executionRole);
    */

    // ECSタスクロールを作成（自分で記述する場合はコメントインする）
    /*
    const taskRole = new iam.Role(this, "EcsFlaskApiTaskRole", {
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
      roleName: `${props.stage}-flask-api-task-role-cdk`,
    });
     */


    // ALB用のセキュリティグループを作成（自分で記述する場合はコメントインする）
    /*
    const albSecurityGroup = new ec2.SecurityGroup(
      this,
      "EcsFlaskApiAlbSecurityGroup",
      {
        vpc,
        securityGroupName: `${props.stage}-flask-api-alb-sg-cdk`,
        // これを入れておかないと、アウトバウンドのすべての通信が許可されるので注意
        allowAllOutbound: false,
      }
    );
    // ECS Fargateインスタンス用のセキュリティグループを作成
    const ecsSecurityGroup = new ec2.SecurityGroup(
      this,
      "EcsFlaskApiEcsSecurityGroup",
      {
        vpc,
        securityGroupName: `${props.stage}-flask-api-ecs-sg-cdk`,
        allowAllOutbound: false,
      }
    );

    // ALB用のセキュリティグループで、任意のIPアドレスからのHTTP通信を許可
    albSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80));

    // ALB用のセキュリティグループで、ECS Fargateインスタンスの5000番ポートへの通信を許可
    albSecurityGroup.addEgressRule(ecsSecurityGroup, ec2.Port.tcp(5000));

    // ECS Fargateインスタンス用のセキュリティグループで、ALBから5000番ポートへの通信を許可
    ecsSecurityGroup.addIngressRule(albSecurityGroup, ec2.Port.tcp(5000));

    // ECS Fargateインスタンス用のセキュリティグループで、任意のIPアドレスの443番ポートへの通信を許可
    ecsSecurityGroup.addEgressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443));
    */

    // ALBを記述
    const alb = new elbv2.ApplicationLoadBalancer(this, "EcsFlaskApiAlb", {
      loadBalancerName: `${props.stage}-flask-api-alb-cdk`,
      vpc,
      internetFacing: true,
      // セキュリティグループを自動作成しない場合はコメントインする
      // securityGroup: albSecurityGroup,
    });
    // ALBのターゲットグループを記述
    const defaultTargetGroup = new elbv2.ApplicationTargetGroup(
      this,
      "EcsFlaskApiAlbTargetGroup",
      {
        targetGroupName: `${props.stage}-flask-api-cdk`,
        vpc,
        port: 5000,
        // ECSでALBを使う場合にはターゲットタイプをIPにする
        targetType: elbv2.TargetType.IP,
        protocol: elbv2.ApplicationProtocol.HTTP,
        healthCheck: {
          enabled: true,
          path: "/health",
          protocol: elbv2.Protocol.HTTP,
          interval: cdk.Duration.seconds(10),
          healthyHttpCodes: "200",
        },
      }
    );
    // ALBに80番ポートへの通信を受け付けるリスナーを追加
    alb.addListener("EcsFlaskApiAlbListener", {
      port: 80,
      open: true,
      protocol: elbv2.ApplicationProtocol.HTTP,
      defaultAction: elbv2.ListenerAction.forward([defaultTargetGroup]),
    });

    const taskDefinition = new ecs.FargateTaskDefinition(
      this,
      "EcsFlaskApiTaskDefinition",
      {
        cpu: 256,
        memoryLimitMiB: 512,
        // ECSタスク実行ロールを自動作成しない場合はコメントインする
        // executionRole,

        // ECSタスクロールを自動作成しない場合はコメントインする
        // taskRole,
        family: `${props.stage}-flask-api-cdk`,
      }
    );

    // ECSタスクのロググループを作成
    const logGroup = new logs.LogGroup(this, "EcsFlaskApiLogGroup", {
      logGroupName: `/ecs/${props.stage}-flask-api-cdk`,
      retention: logs.RetentionDays.THREE_MONTHS,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    })

    // タスク定義にコンテナを追加
    taskDefinition.addContainer("EcsFlaskApi", {
      image: ecs.ContainerImage.fromEcrRepository(repository, "latest"),
      // 環境変数
      // SSMパラメータストアやSecrets Managerから取得する値を設定
      secrets: {
        CORRECT_ANSWER: ecs.Secret.fromSecretsManager(secrets),
      },
      portMappings: [
        {
          containerPort: 5000,
          hostPort: 5000,
        },
      ],
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: "flask-api",
        logGroup,
      }),
    });

    // ECSサービスを記述
    const service = new ecs.FargateService(this, "EcsFlaskApiService", {
      serviceName: "flask-api-cdk",
      cluster,
      taskDefinition,

      // リソースの作成時にタスクが起動しないようにしておく。後で手動で起動する
      desiredCount: 0,

      // セキュリティグループを自動作成しない場合はコメントインする
      // securityGroups: [ecsSecurityGroup],

      // パブリックサブネットに配置するので、trueにする
      // これをtrueにすることで、ECSタスクはパブリックサブネットに配置される
      assignPublicIp: true,
      /*
      vpcSubnets: {
        subnets: props.serviceSubnetIds
          .map((subnetId, index) =>
            ec2.Subnet.fromSubnetId(this, `ServiceSubnet${index}`, subnetId)),
      },
       */
      healthCheckGracePeriod: cdk.Duration.seconds(60),

      // サーキットブレーカーを有効にする
      circuitBreaker: {
        enable: true,
        rollback: false,
      },

      // ECS Execでコンテナに接続できるようにする
      enableExecuteCommand: true,
    });
    // ECSサービスをALBのターゲットグループに登録する
    service.attachToApplicationTargetGroup(defaultTargetGroup);

  }
}
