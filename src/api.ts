function response(content) {
  const res = ContentService.createTextOutput();
  res.setMimeType(ContentService.MimeType.JSON);
  res.setContent(JSON.stringify(content));
  return res;
}

function doPost(e) {
  let contents;
  try {
    log('info', '[doPost] postData=' + e.postData.contents)
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
