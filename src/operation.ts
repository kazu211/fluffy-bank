function onPost(params: PostParams): Item | Message {
  const item = params.item

  if (!isValid(item)) {
    log('error', `[onPost] 不正なリクエストパラメータのため登録出来ませんでした`)
    return {
      error: '不正なリクエストパラメータのため登録できませんでした'
    };
  }

  const { date, type, category1, category2, amount, tags, description } = item;

  const d = new Date(date);
  const year = d.getFullYear().toString();
  // TODO: シートがない場合は新しく作る
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(year)!!

  // id は \d{4}-YYYY-MM-DD 形式にする
  const seq = sheet.getLastRow().toString().padStart(4, '0');
  const id = `${seq}-${date}`;
  const row = [ id, date, type, category1, category2, amount, tags, description ];

  sheet.appendRow(row);

  log('info', `[onPost] データを追加しました id: ${id}`)

  return {id, date, type, category1, category2, tags, amount, description};
}

function onGet(params: GetParams): Item[] {
  const { year, month } = params
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(year)!!
  const range = sheet.getRange(1, 1, sheet.getLastRow(), 8)

  const items = range.getValues().filter(row => {
    const date = new Date(row[1]);

    // 月の指定がない場合は年だけでフィルタする
    if (month == null) {
      return date.getFullYear().toString() == year;
    } else {
      return date.getFullYear().toString() == year && (date.getMonth() + 1).toString().padStart(2, '0') == month;
    }
  }).map(row => {
    const [id, d, type, category1, category2, amount, tags, description] = row
    const date = new Date(d)

    return {
      id,
      date: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`,
      type,
      category1,
      category2,
      amount,
      tags,
      description
    }
  });

  log('info', `[onGet] ${items.length} 件のデータを取得しました year: ${year}, month: ${month}`)

  return items
}

function onDelete(params: DeleteParams): Message {
  const id = params.id;

  const [ seq,  year, month, day ] = id.split('-');

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(year)!!
  const index = sheet.getRange(1, 1, sheet.getLastRow()).getValues().flat().findIndex(v => v === id);

  if (index === -1) {
    log('warn', `[onDelete] 指定のデータが存在しませんでした id: ${id}`)
    return {
      error: '指定のデータが存在しませんでした'
    }
  }

  sheet.deleteRow(index + 1)

  log('info', `[onDelete] データを削除しました id: ${id}`)
  return {
    info: 'ok'
  }
}

function onPut(params: PutParams): Item | Message {
  const item = params.item

  if (!isValid(item)) {
    log('warn', `[onPut] 不正なリクエストパラメータです item: ${item}`)
    return {
      error: '不正なリクエストパラメータです'
    };
  };

  const { id, date, title, category1, category2, tags, income, outgo, memo } = item;

  const index = budgetSheet.getRange(1, 1, budgetSheet.getLastRow()).getValues().flat().findIndex(v => v === id);

  if (index === -1) {
    log('warn', `[onPut] 指定のデータが存在しませんでした id: ${id}`)
    return {
      error: '指定のデータが存在しませんでした'
    }
  };

  budgetSheet.getRange(index + 1, 1, 1, 9).setValues([
    [id, date, title, category1, category2, tags, income, outgo, memo]
  ]);

  log('info', `[onPut] データを更新しました id: ${id}`)
  return item;
}
