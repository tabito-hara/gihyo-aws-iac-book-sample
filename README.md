# 『［詳解］AWS Infrastructure as Code――使って比べるTerraform＆AWS CDK』サンプルコード

このリポジトリでは『**[［詳解］AWS Infrastructure as Code ――使って比べるTerraform＆AWS CDK](https://gihyo.jp/book/2025/978-4-297-14724-2)**』のサンプルコードを公開しています。

## 注意事項
* 本文に示したコードと一部異なるものがあります。
  * 本文の中で書き換えをしていたり、いくつかの方法を示していたりする場合には、書き換え後のコードや別の方法をコメントアウトしています。
* 以下のリンクでは、個別のファイルではなく、TerraformのモジュールやAWS CDKのプロジェクト単位でリンクしているものがあります。

## 第3章
* [リスト3.1, 3.9](chap03/terraform)
* [リスト3.5, 3.19](chap03/cloudformation)
* [リスト3.6〜3.7, 3.11](chap03/cdk/sqs)

## 第4章
* [リスト4.9〜4.11](chap04/terraform/modules/sqs)
* [リスト4.12](chap04/terraform/env/dev/sqs)
* [リスト4.13〜4.14](chap04/terraform/modules/sqs_multi_regions)
* [リスト4.15](chap04/terraform/env/dev/sqs_multi_regions)
* [リスト4.17](chap04/terraform/tools/tf_init.sh)

## 第5章
* [リスト5.3〜5.4](chap05/cdk/sqs)
* [リスト5.6](chap05/cdk/sqs_loop)
* [リスト5.7](chap05/cdk/vpc)
* [リスト5.8〜5.9](chap05/cdk/sqs_multi)
* [リスト5.10〜5.13](chap05/cdk/sqs_multi_envs)
* [リスト5.14〜5.15](chap05/cdk/cdk_crossref_outputs)
* [リスト5.18〜5.19](chap05/cdk/cdk_crossref)
* [リスト5.23〜5.26](chap05/cdk/sqs_test)
* [リスト5.28〜5.30](chap05/cdk/sqs_test_multi_envs)

## 第6章
* [リスト6.1〜6.2](chap06/terraform/usecases/vpc)
* [リスト6.3](chap06/terraform/env/dev/vpc)
* [リスト6.5〜6.9](chap06/cdk/vpc)

## 第7章
* [リスト7.1〜7.2](chap07/ecs_app)
* [リスト7.3〜7.4](chap07/terraform/usecases/ecs_flask_api_infra)
* [リスト7.5〜7.13](chap07/terraform/usecases/ecs_flask_api)
* [リスト7.14](chap07/terraform/env/dev/ecs_flask_api_infra)
* [リスト7.15](chap07/terraform/env/dev/ecs_flask_api)
* [リスト7.16〜7.27](chap07/cdk/ecs_flask_api)

## 第8章
* [リスト8.3](chap08/cdk/ec2instance_test)
* [リスト8.4](chap07/cdk/ecs_flask_api/lib/utils.ts) （第7章のサンプルに含まれます）
* [リスト8.5](chap07/cdk/ecs_flask_api/bin/ecs_flask_api.ts)（第7章のサンプルに含まれます）
* [リスト8.6](chap08/terraform/env/dev/sqs_double)
* [リスト8.7〜8.8](chap08/cdk/sqs_double) 

## 第9章
* [リスト9.1, 9.3](chap09/terraform/env/dev/import_sqs)
* [リスト9.4〜9.5](chap09/terraform/env/dev/import_sqs_by_block)
* [リスト9.6](chap09/terraform/env/dev/import_sqs)
* [リスト9.10](chap09/cloudformation/cdk_migrate)

## 第10章
* [リスト10.1](chap10/lambda/print_event_py/src/main.py)
* [リスト10.2](chap10/lambda/print_event_go/src/main.go)
* [リスト10.3](chap10/scripts/upload_asset.sh)
* [リスト10.4〜10.5](chap10/terraform/usecases/lambda_print_event_py)
* [リスト10.6](chap10/terraform/env/dev/lambda_print_event_py)
* [リスト10.7〜10.10](chap10/cdk/lambda_print_event_py)
* [リスト10.11](chap10/lambda/print_event_go/Dockerfile.build)
* [リスト10.12〜10.14](chap10/cdk/lambda_print_event_go)
* [リスト10.15](chap10/scripts/create_asset_zip.sh)
* [リスト10.16〜10.17](chap10/terraform/usecases/lambda_print_event_go)

## 第11章
* [リスト11.3](chap11/cdk/custom_resource_print_event/lambda/print_event/main.py)
* [リスト11.4](chap11/cdk/custom_resource_print_event)
* [リスト11.8](chap11/cdk/custom_resource_s3_object/lambda/put_s3_object/main.py)
* [リスト11.9](chap11/cdk/custom_resource_s3_object)
* [リスト11.10](chap11/cdk/cr_provider_s3_object/lambda/put_s3_object/main.py)
* [リスト11.11](chap11/cdk/cr_provider_s3_object)
* [リスト11.12](chap11/terraform/lambda/print_event/main.py)
* [リスト11.13](chap11/terraform/env/dev/lambda_invocation)
* [リスト11.17](chap11/terraform/lambda/put_s3_object/main.py)
* [リスト11.18](chap11/terraform/env/dev/lambda_invocation_s3_object)