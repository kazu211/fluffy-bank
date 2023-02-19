const authToken = PropertiesService.getScriptProperties().getProperty('authToken') || ''

/**
 * トークンをセットするため初回のみ実行してください
 * トークンはアプリ側にローカル保存してください
 */
function setUp() {
    PropertiesService.getScriptProperties().setProperties({
        authToken: 'xxxxx'
    })
}

/**
 * レスポンスを作成して返します
 * @param {*} content
 * @returns {TextOutput}
 */
function response(content) {
    const res = ContentService.createTextOutput();
    res.setMimeType(ContentService.MimeType.JSON);
    res.setContent(JSON.stringify(content));
    return res;
}

/**
 * アプリにPOSTリクエストが送信されたとき実行されます
 * @param {Event} e
 * @returns {TextOutput}
 */
function doPost(e) {
    let contents;
    try {
        contents = JSON.parse(e.postData.contents);
    } catch (e) {
        log('error', '[doPost] JSONのパースに失敗しました')
        return response({ error: 'JSONの形式が不正です' });
    }

    if (contents.authToken !== authToken) {
        log('error', '[doPost] 認証に失敗しました')
        return response({ error: '認証に失敗しました' });
    }

    const { method = '', params = {} } = contents;

    let result;
    try {
        switch (method) {
            case 'POST':
                result = onPost(params);
                break;
            case 'GET':
                result = onGet(params);
                break;
            case 'PUT':
                result = onPut(params);
                break;
            case 'DELETE':
                result = onDelete(params);
                break;
            default:
                result = { error: 'methodの指定がありません' };
        }
    } catch (e) {
        log('error', '[doPost] ' + e)
        result = { error: e };
    }

    return response(result);
}
