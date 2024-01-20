function isValidDate(item: Item): boolean {
  // 日付が YYYY-MM-DD 形式でなければエラーにする
  const dateReg = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
  if (!dateReg.test(item.date)) {
    return false
  }

  // ありえない日付をエラーにする
  const [ year, month, day ] = item.date.split('-').map(Number)
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
}

function isValidCategory(item: Item): boolean {
  // type シートにある type, category1, category2 以外の組み合わせはエラーにする
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("type");
  const range = sheet!!.getRange(1, 1, sheet!!.getLastRow(), 3)!!;

  return range.getValues().some(row => {
      const [ type, category1, category2 ] = row;
      return item.type === type && item.category1 === category1 && item.category2 === category2;
    }
  )
}

function isValidAmount(item: Item): boolean {
  // 金額が正でなければエラーにする
  return typeof item.amount === 'number' && item.amount >= 0;
}

function isValid(item: Item): boolean {
  const { id, date, type, category1, category2, amount, description } = item

  if (!isValidDate(item)) {
    log('error', `[isValid] 不正な日付です | date: ${date}`)
    return false
  }

  if (!isValidCategory(item)) {
    log('error', `[isValid] 不正な組み合わせです | type: ${type}, category1: ${category1}, category2: ${category2}`)
    return false
  }

  if (!isValidAmount(item)) {
    log('error', `[isValid] 不正な金額です | amount: ${amount}`)
    return false
  }

  return true
}
