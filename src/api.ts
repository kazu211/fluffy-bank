function response(content: Item[] | Item | Category[] | Message) {
  const res = ContentService.createTextOutput();
  res.setMimeType(ContentService.MimeType.JSON);
  res.setContent(JSON.stringify(content));
  return res;
}

function doPost(e: GoogleAppsScript.Events.DoPost) {
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

  const { method = '', path = '', params = {} } = contents;

  let result;
  try {
    switch (path) {
      case '/items':
        switch (method) {
          case 'POST':
            result = postItems(params);
            break;
          case 'GET':
            result = getItems(params);
            break;
          case 'PUT':
            result = putItems(params);
            break;
          case 'DELETE':
            result = deleteItems(params);
            break;
          default:
            result = { error: 'method の指定が不正です (GET,POST,PUT,DELETE)' };
        }
        break;
      case '/categories':
        switch (method) {
          case 'GET':
            result = getCategories()
            break;
          default:
            result = { error: 'method の指定が不正です (GET)' };
        }
        break;
      default:
        result = { error: 'path の指定が不正です (/items,/categories)' }
    }
  } catch (e) {
    log('error', '[doPost] ' + e)
    result = { error: String(e) };
  }

  return response(result);
}
