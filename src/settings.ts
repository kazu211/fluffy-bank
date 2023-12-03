// token
const authToken = PropertiesService.getScriptProperties().getProperty('authToken') || ''

// シート
const ss = SpreadsheetApp.getActiveSpreadsheet();
const readmeSheet = ss.getSheetByName('readme')!!;
const tokenSheet = ss.getSheetByName('token')!!;
const typeSheet = ss.getSheetByName('type')!!;
const tagsSheet = ss.getSheetByName('tags')!!;
const logSheet = ss.getSheetByName('log')!!;
const tmpSheet = ss.getSheetByName('tmp')!!;
