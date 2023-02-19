/**
 * データが正しい形式か検証します
 * @param {Object} item
 * @returns {Boolean} isValid
 */
function isValid(item): boolean {
    // TODO category1 と category2 の連携が取れていることを確認する

    // 日付
    const dateReg = /^[0-9]{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/
    if (!dateReg.test(item.date)) {
        log('warn', `[isValid] item.date が不正な値です ${item.date}`)
        return false
    }

    // 収支
    if (item.income === null && item.expenditure === null) {
        log('warn', `[isValid] income/expenditure 両方とも NULL です`)
        return false
    }
    if (item.income !== null && item.expenditure !== null) {
        log('warn', `[isValid] income/expenditure 両方とも NOT NULL です income: ${item.income} expenditure: ${item.expenditure}`)
        return false
    }
    if (item.income !== null && typeof item.income !== 'number') {
        log('warn', `[isValid] income が数値ではありません income: ${item.income}`)
        return false
    }
    if (item.expenditure !== null && typeof item.expenditure !== 'number') {
        log('warn', `[isValid] expenditure が数値ではありません expenditure: ${item.expenditure}`)
        return false
    }
    return true
}

/**
 * データを追加します
 * @param {Object} params
 * @param {Object} params.item 家計簿データ
 * @returns {Object} 追加した家計簿データ
 */
function onPost(params) {
    const item = params.item

    if (!isValid(item)) {
        log('warn', `[onPost] 不正なリクエストパラメータです item: ${item}`)
        return {
            error: '不正なリクエストパラメータです'
        };
    };

    const {id: _, date, title, category1, category2, tags, income, expenditure, memo} = item;
    const id = Utilities.getUuid();
    const row = [id, date, title, category1, category2, tags, income, expenditure, memo];

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('budget')!!;
    sheet.appendRow(row);

    log('info', `[onPost] データを追加しました id: ${id}`)
    return {id, date, title, category1, category2, tags, income, expenditure, memo};
}

/**
 * データを取得します
 * @param {Object} params
 * @param {String} params.start 取得開始日
 * @param {String} params.end 取得終了日
 * @returns {Object[]} 家計簿データ
 */
function onGet(params) {
    const {start, end} = params;
    const startDate = new Date(start);
    const endDate = new Date(end);

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('budget')!!;
    const range = sheet.getRange(1, 1, sheet.getLastRow(), 9);

    const items = range.getValues().filter(row => {
        return (startDate <= row[1]) && (row[1] <= endDate)
    }).map(row => {
        const [id, d, title, category1, category2, tags, income, expenditure, memo] = row
        // TODO date の扱いを検討する
        const date = `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`
        return {
            id,
            date,
            title,
            category1,
            category2,
            tags,
            income: (income === '') ? null : income,
            expenditure: (expenditure === '') ? null : expenditure,
            memo
        }
    });

    log('info', `[onGet] データを取得しました start: ${start} - end: ${end}`)
    return items;
}

/**
 * データを削除します
 * @param {Object} params
 * @param {String} params.id 家計簿データID
 * @returns {Object} メッセージ
 */
function onDelete(params) {
    const id = params.id;

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('budget')!!;
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
        message: 'ok'
    }
}

/**
 * データを更新します
 * @param {Object} params
 * @param {Object} params.item 家計簿データ
 * @returns {Object} 更新した家計簿データ
 */
function onPut(params) {
    const item = params.item

    if (!isValid(item)) {
        log('warn', `[onPut] 不正なリクエストパラメータです item: ${item}`)
        return {
            error: '不正なリクエストパラメータです'
        };
    };

    const {id, date, title, category1, category2, tags, income, expenditure, memo} = item;

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('budget')!!;
    const index = sheet.getRange(1, 1, sheet.getLastRow()).getValues().flat().findIndex(v => v === id);

    if (index === -1) {
        log('warn', `[onPut] 指定のデータが存在しませんでした id: ${id}`)
        return {
            error: '指定のデータが存在しませんでした'
        }
    };

    sheet.getRange(index + 1, 1, 1, 9).setValues([
        [id, date, title, category1, category2, tags, income, expenditure, memo]
    ]);

    log('info', `[onPut] データを更新しました id: ${id}`)
    return item;
}
