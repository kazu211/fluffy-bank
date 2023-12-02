# fluffy-bank

Google SpreadSheet を DB に見立てて GAS で家計簿情報を取得更新する API

GAS + clasp で開発します

## 環境構築

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

## 設定

github Action で clasp を使ってデプロイをするために github の Actions Secrets で設定をします

| Name           | Value                         |
|----------------|-------------------------------|
| ACCESS_TOKEN   | clasprc.json > access_token   |
| CLIENT_ID      | clasprc.json > client_id      |
| CLIENT_SECRET  | clasprc.json > client_secret  |
| ID_TOKEN       | clasprc.json > id_token       |
| REFRESH_TOKEN  | clasprc.json > refresh_token  |
| SCRIPT_ID_DEV  | SpreadSheet(dev) > script_id  |
| SCRIPT_ID_PROD | SpreadSheet(prod) > script_id |

※長期間デプロイしていないと再度 clasp の情報を設定し直す必要がありそう
