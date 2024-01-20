function onPutItems(params: PutItemsParams): Item | Message {
  const item = params.item

  if (!isValid(item)) {
    log('error', `[onPutItems] 不正なリクエストパラメータのため更新出来ませんでした`)
    return {
      error: '不正なリクエストパラメータのため更新出来ませんでした'
    };
  }

  const { id, date, type, category1, category2, amount, description } = item;

  const [, year,] = id.split('-');

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(year)

  if (sheet == null) {
    log('error', `[onPutItems] シートが存在しないため更新できませんでした | id: ${id} sheet: ${year}`)
    return {
      error: '指定のデータが存在しないため更新できませんでした'
    }
  }

  const index = sheet.getRange(1, 1, sheet.getLastRow()).getValues().flat().findIndex(v => v === id);

  if (index === -1) {
    log('error', `[onPutItems] 指定のデータが存在しないため更新できませんでした | id: ${id}`)
    return {
      error: '指定のデータが存在しないため更新できませんでした'
    }
  }

  sheet.getRange(index + 1, 1, 1, 7).setValues([
    [id, date, type, category1, category2, amount, description]
  ]);

  log('info', `[onPutItems] データを更新しました | id: ${id}`)
  return item;
}
