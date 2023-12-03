const authToken = PropertiesService.getScriptProperties().getProperty('authToken') || ''

/**
 * トークンをセットするため初回のみ実行してください
 * トークンはローカル保存してください
 */
function setUp() {
  PropertiesService.getScriptProperties().setProperties({
    authToken: 'xxxxx'
  })
}

const ss = SpreadsheetApp.getActiveSpreadsheet();
const logSheet = ss.getSheetByName('log')!!;
const tmpSheet = ss.getSheetByName('tmp')!!;
