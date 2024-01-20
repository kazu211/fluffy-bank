function getItems(params: GetItemsParams): Item[] {
  const { year, month } = params
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(year)

  if (sheet == null) {
    log('info', `[onGetItems] シートが存在しませんでした | sheet: ${year}`)
    return []
  }

  const range = sheet.getRange(1, 1, sheet.getLastRow(), 7)

  const items = range.getValues().filter(row => {
    const date = new Date(row[1]);

    // 月の指定がない場合は年だけでフィルタする
    if (month == null) {
      return date.getFullYear().toString() === year;
    } else {
      return date.getFullYear().toString() === year && (date.getMonth() + 1).toString().padStart(2, '0') === month;
    }
  }).map(row => {
    const [id, d, type, category1, category2, amount, description] = row
    const date = new Date(d)

    return {
      id,
      date: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`,
      type,
      category1,
      category2,
      amount,
      description
    }
  });

  log('info', `[onGetItems] ${items.length} 件のデータを取得しました | year: ${year}, month: ${month}`)

  return items
}
