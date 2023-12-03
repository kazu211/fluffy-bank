# fluffy-bank

家計簿情報API

Google Spreadsheet の家計簿情報を取得更新します

## 開発

GAS + clasp で開発します

### 環境構築

```console
$ nmp i
```

## デプロイ

### 検証環境

検証環境は push すると反映されます

```console
$ git push
```

### 本番環境

本番環境は tag をつけて push すると反映されます

```console
$ git tag v1.0.0
$ git push --tags
```

### ローカル

ローカル環境からデプロイする場合は .clasp.json を作成して clasp コマンドを使います

```json
{"scriptId": "${ScriptId}"}
```

```console
$ clasp push

# デプロイ履歴を確認します
$ clasp deployments

# 最新の DEPLOY_ID を使ってデプロイします
$ clasp deploy -d ${Comment} -i ${DEPLOY_ID}
```

※ `DEPLOY_ID` を指定してデプロイしないと API の URL が変わります

clasp push

## 設定

github Action で clasp を使ってデプロイをするために github の Actions Secrets で設定をします

| Name           | Value                          |
|----------------|--------------------------------|
| ACCESS_TOKEN   | clasprc.json > access_token    |
| CLIENT_ID      | clasprc.json > client_id       |
| CLIENT_SECRET  | clasprc.json > client_secret   |
| ID_TOKEN       | clasprc.json > id_token        |
| REFRESH_TOKEN  | clasprc.json > refresh_token   |
| SCRIPT_ID_DEV  | Apps Script (dev) > script_id  |
| SCRIPT_ID_PROD | Apps Script (prod) > script_id |
