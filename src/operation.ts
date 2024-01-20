function onPost(params: PostParams): Item | Message {
  const item = params.item

  if (!isValid(item)) {
    log('error', `[onPost] 不正なリクエストパラメータのため登録出来ませんでした`)
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
    log('info', `[onPut] 新しいシートを作成しました | sheet: ${year}`)
    const copy = tmpSheet.copyTo(ss);
    sheet = copy.setName(year)
  }

  // id は \d{4}-YYYY-MM-DD 形式にする
  const seq = sheet.getLastRow().toString().padStart(4, '0');
  const id = `${seq}-${date}`;
  const row = [ id, date, type, category1, category2, amount, description ];

  sheet.appendRow(row);

  log('info', `[onPost] データを追加しました | id: ${id}`)

  return {id, date, type, category1, category2, amount, description};
}

function onGet(params: GetParams): Item[] {
  const { year, month } = params
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(year)

  if (sheet == null) {
    log('info', `[onGet] シートが存在しませんでした | sheet: ${year}`)
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

  log('info', `[onGet] ${items.length} 件のデータを取得しました | year: ${year}, month: ${month}`)

  return items
}

function onDelete(params: DeleteParams): Item | Message {
  const item = params.item;
  const { id } = item;

  const [, year,] = id.split('-');

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(year)

  if (sheet == null) {
    log('error', `[onDelete] シートが存在しないため削除できませんでした | id: ${id} sheet: ${year}`)
    return {
      error: '指定のデータが存在しないため削除できませんでした'
    }
  }

  const index = sheet.getRange(1, 1, sheet.getLastRow()).getValues().flat().findIndex(v => v === id);

  if (index === -1) {
    log('error', `[onDelete] 指定のデータが存在しないため削除できませんでした | id: ${id}`)
    return {
      error: '指定のデータが存在しないため削除できませんでした'
    }
  }

  sheet!!.deleteRow(index + 1)

  log('info', `[onDelete] データを削除しました | id: ${id}`)
  return item
}

function onPut(params: PutParams): Item | Message {
  const item = params.item

  if (!isValid(item)) {
    log('error', `[onPut] 不正なリクエストパラメータのため更新出来ませんでした`)
    return {
      error: '不正なリクエストパラメータのため更新出来ませんでした'
    };
  }

  const { id, date, type, category1, category2, amount, description } = item;

  const [, year,] = id.split('-');

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(year)

  if (sheet == null) {
    log('error', `[onPut] シートが存在しないため更新できませんでした | id: ${id} sheet: ${year}`)
    return {
      error: '指定のデータが存在しないため更新できませんでした'
    }
  }

  const index = sheet.getRange(1, 1, sheet.getLastRow()).getValues().flat().findIndex(v => v === id);

  if (index === -1) {
    log('error', `[onPut] 指定のデータが存在しないため更新できませんでした | id: ${id}`)
    return {
      error: '指定のデータが存在しないため更新できませんでした'
    }
  }

  sheet.getRange(index + 1, 1, 1, 7).setValues([
    [id, date, type, category1, category2, amount, description]
  ]);

  log('info', `[onPut] データを更新しました | id: ${id}`)
  return item;
}
