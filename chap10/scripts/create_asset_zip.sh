#!/bin/sh

set -e

# jq を用いて標準入力から受け取ったJSONから変数を取り出す
eval "$(jq -r '@sh "LAMBDA_LOCAL_CODE_DIR=\(.lambda_local_code_dir) LAMBDA_NAME=\(.lambda_name) METHOD=\(.method) DOCKERFILE=\(.dockerfile)"')"

PLATFORM="linux/arm64"
OUTPUT_DIR=$(cd "$(dirname $0)" && pwd)/tf.out
TMP_ZIP_FILE="${OUTPUT_DIR}/${LAMBDA_NAME}.zip"

mkdir -p "${OUTPUT_DIR}/asset"
rm -rf "${OUTPUT_DIR}/asset/*"
rm -f "${TMP_ZIP_FILE}"

cd "${LAMBDA_LOCAL_CODE_DIR}" || exit 1

rm -rf "${OUTPUT_DIR}/asset"

# ${OUTPUT_DIR}/asset にアセットが作成される
case "${METHOD}" in
  "LOCAL")
    mkdir -p "${OUTPUT_DIR}/asset"
    # LAMBDA_LOCAL_CODE_DIR の中身をコピー
    cp -r . "${OUTPUT_DIR}/asset"
    ;;
  "DOCKER")
    IMAGE=${LAMBDA_NAME}
    # コンテナイメージをビルド
    docker build -t "${IMAGE}" --platform "${PLATFORM:-linux/arm64}" -f "${DOCKERFILE}" .
    # コンテナを作成
    CONTAINER_ID=$(docker create "${IMAGE}")
    # コンテナからアセットをコピー
    docker cp "${CONTAINER_ID}:/asset" "${OUTPUT_DIR}"
    # コンテナを削除
    docker rm -v "${CONTAINER_ID}" > /dev/null
    ;;
  *)
    echo "METHOD must be either DOCKER or LOCAL"
    exit 1
    ;;
esac

# 作成されたアセットを deterministic-zip で zip ファイルにアーカイブ
(cd "${OUTPUT_DIR}/asset" && deterministic-zip -q -r "${TMP_ZIP_FILE}" .)

# 作成された zip ファイルの SHA256 ハッシュを計算し、ファイル名を変更
SHA256HASH=$(sha256sum "${TMP_ZIP_FILE}" | cut -d ' ' -f 1)
ASSET_ZIPFILE="${OUTPUT_DIR}/${LAMBDA_NAME}/${SHA256HASH}.zip"
mkdir -p "$(dirname "${ASSET_ZIPFILE}")"
mv "${TMP_ZIP_FILE}" "${ASSET_ZIPFILE}"

jq -n --arg zipfile "${ASSET_ZIPFILE}" '{"zipfile":$zipfile}'

exit 0
