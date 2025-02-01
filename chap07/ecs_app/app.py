#!/usr/bin/env python3

from flask import Flask, request
import os

app = Flask(__name__)

# ヘルスチェックに応答するためのエンドポイント
@app.route("/health")
def health():
    return "OK", 200

# 回答を受け取るエンドポイント
@app.route("/q")
def q():
    # リクエストパラメータの"a"から回答を取得
    answer_input = request.args.get("a")
    if not answer_input:
        return "No message provided", 400
    try:
        if answer_input == os.environ["CORRECT_ANSWER"]:
            return "Correct", 200
        else:
            return "Incorrect", 400
    except Exception:
        return "Error", 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
