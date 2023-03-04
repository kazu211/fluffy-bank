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

const logSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('log')!!;
const budgetSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('budget')!!;
