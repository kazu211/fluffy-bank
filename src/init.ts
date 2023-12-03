function init() {
  log('info', '[init] 初期化を実施します');

  // token
  const response1 = Browser.msgBox('tokenを初期化しますか？', Browser.Buttons.YES_NO);
  if (response1 === 'yes') {
    log('info', '[init] 新しい token を設定します');
    const token = Utilities.getUuid();
    setToken(token);
    log('info', '[init] 設定した token を token シートに記載しました');
  } else {
    log('info', '[init] token の初期化をスキップします');
  }

  log('info', '[init] 初期化が完了しました')
}

function setToken(token: string) {
  PropertiesService.getScriptProperties().setProperties({
    authToken: token
  })
  tokenSheet?.getRange(1, 1).setValues([[token]]);
}
