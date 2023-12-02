import Date = GoogleAppsScript.Base.Date;

function isValid(item: Item): boolean {
  // 日付
  const dateReg = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
  if (!dateReg.test(item.date)) {
    log('warn', `[isValid] item.date が不正な値です ${item.date}`)
    return false
  }

  // 収支
  if (item.income === null && item.outgo === null) {
    log('warn', `[isValid] income/outgo 両方とも NULL です`)
    return false
  }
  if (item.income !== null && item.outgo !== null) {
    log('warn', `[isValid] income/outgo 両方とも NOT NULL です income: ${item.income} outgo: ${item.outgo}`)
    return false
  }
  if (item.income !== null && typeof item.income !== 'number') {
    log('warn', `[isValid] income が数値ではありません income: ${item.income}`)
    return false
  }
  if (item.outgo !== null && typeof item.outgo !== 'number') {
    log('warn', `[isValid] outgo が数値ではありません outgo: ${item.outgo}`)
    return false
  }

  // TODO category1 と category2 の連携が取れていることを確認する

  return true
}

function onPost(params: PostParams): Item | Message {
  const item = params.item

  if (!isValid(item)) {
    log('warn', `[onPost] 不正なリクエストパラメータです item: ${item}`)
    return {
      error: '不正なリクエストパラメータです'
    };
  };

  const { date, title, category1, category2, tags, income, outgo, memo } = item;
  const id = Utilities.getUuid();
  const row = [id, date, title, category1, category2, tags, income, outgo, memo];

  budgetSheet.appendRow(row);

  log('info', `[onPost] データを追加しました id: ${id}`)
  return {id, date, title, category1, category2, tags, income, outgo, memo};
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

  const index = budgetSheet.getRange(1, 1, budgetSheet.getLastRow()).getValues().flat().findIndex(v => v === id);

  if (index === -1) {
    log('warn', `[onDelete] 指定のデータが存在しませんでした id: ${id}`)
    return {
      error: '指定のデータが存在しませんでした'
    }
  }

  budgetSheet.deleteRow(index + 1)

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
