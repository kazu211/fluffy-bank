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
  const { start, end } = params;

  const [ startYear, startMonth, startDay ] = start.split('-');
  const [ endYear, endMonth, endDay ] = end.split('-');

  const startDate = new Date(startYear, Number(startMonth)-1, Number(startDay));
  const endDate = new Date(endYear, Number(endMonth)-1, Number(endDay));

  const range = budgetSheet.getRange(1, 1, budgetSheet.getLastRow(), 9);

  const items = range.getValues().filter(row => {
    return (startDate <= row[1]) && (row[1] <= endDate)
  }).map(row => {
    const [id, d, title, category1, category2, tags, income, outgo, memo] = row
    // TODO: 日付を扱うクラスを作る
    const date = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
    return {
      id,
      date,
      title,
      category1,
      category2,
      tags,
      income: (income === '') ? null : income,
      outgo: (outgo === '') ? null : outgo,
      memo
    }
  });

  log('info', `[onGet] データを取得しました start: ${start} - end: ${end}`)
  return items;
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
