function postItems(params: PostItemsParams): Item | Message {
  const item = params.item

  if (!isValid(item)) {
    log('error', `[onPostItems] 不正なリクエストパラメータのため登録出来ませんでした`)
    return {
      error: '不正なリクエストパラメータのため登録できませんでした'
    };
  }

  const { date, type, category1, category2, amount, description } = item;

  const d = new Date(date);
  const year = d.getFullYear().toString();

  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(year)

  // シートがない場合は新しく作る
  if (sheet == null) {
    log('info', `[onPostItems] 新しいシートを作成しました | sheet: ${year}`)
    const copy = tmpSheet.copyTo(ss);
    sheet = copy.setName(year)
  }

  // id は uuid にする
  const id = Utilities.getUuid();
  const row = [ id, date, type, category1, category2, amount, description ];

  sheet.appendRow(row);

  log('info', `[onPostItems] データを追加しました | id: ${id}`)

  return {id, date, type, category1, category2, amount, description};
}
