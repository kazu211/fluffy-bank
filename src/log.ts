/**
 * ログをシートに記録します
 * @param {String} level
 * @param {String} message
 */
function log(level: string, message: string) {
    const logMaxRow = 101;
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('log')!!;

    sheet.appendRow([new Date(), level.toUpperCase(), message]);

    if (logMaxRow < sheet.getLastRow()) {
        sheet.deleteRow(2);
    }
}
