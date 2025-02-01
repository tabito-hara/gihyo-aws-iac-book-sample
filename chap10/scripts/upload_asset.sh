#!/bin/sh

set -e

# Lambda 関数の名前
LAMBDA_NAME=${1:?}
ZIPFILE_INPUT=${2:?}
STAGE=${3:-dev}

# アセットをアップロードするS3バケット。適宜変更してください。
BUCKET="${STAGE}-lambda-deploy-123456789012-apne1"

SHA256HASH=$(sha256sum "${ZIPFILE_INPUT}" | cut -d ' ' -f 1)

ZIPFILE_BASENAME="${SHA256HASH}.zip"
set +e
# オブジェクトが存在しているか確認
aws s3api head-object --bucket "${BUCKET}" --key "${LAMBDA_NAME}/${ZIPFILE_BASENAME}" > /dev/null 2>&1
RC=$?
set -e
if [ ${RC} -eq 0 ]; then
  # a3api head-object に成功した場合は、既にオブジェクトが存在している
  echo "The object s3://${BUCKET}/${LAMBDA_NAME}/${ZIPFILE_BASENAME} already exists."
  echo "Failed to upload the zip file to S3."
  exit 1
elif [ ${RC} -ne 254 ]; then
  # オブジェクト不存在の場合以外は254以外のエラー
  echo "Failed to check the existence of the object s3://${BUCKET}/${LAMBDA_NAME}/${ZIPFILE_BASENAME}."
  exit 1
fi

aws s3 cp "${ZIPFILE_INPUT}" "s3://${BUCKET}/${LAMBDA_NAME}/${ZIPFILE_BASENAME}"

# SSM パラメータストアに SHA256 ハッシュを登録
aws ssm put-parameter --name "/lambda_zip/${STAGE}/${LAMBDA_NAME}" --value "${SHA256HASH}" --type String --overwrite

exit 0
