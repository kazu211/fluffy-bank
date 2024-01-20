function deleteItems(params: DeleteItemsParams): Item | Message {
  const item = params.item;
  const { id, date } = item;

  const [year,,] = date.split('-');
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(year)

  if (sheet == null) {
    log('error', `[onDeleteItems] シートが存在しないため削除できませんでした | id: ${id} sheet: ${year}`)
    return {
      error: '指定のデータが存在しないため削除できませんでした'
    }
  }

  const index = sheet.getRange(1, 1, sheet.getLastRow()).getValues().flat().findIndex(v => v === id);

  if (index === -1) {
    log('error', `[onDeleteItems] 指定のデータが存在しないため削除できませんでした | id: ${id}`)
    return {
      error: '指定のデータが存在しないため削除できませんでした'
    }
  }

  sheet!!.deleteRow(index + 1)

  log('info', `[onDeleteItems] データを削除しました | id: ${id}`)
  return item
}
