const params1 = {
    item: {
        id: "",
        date: '2023/01/01',
        title: '支出',
        category1: '食費',
        category2: '食費',
        tags: 'タグ1,タグ2',
        income: null,
        expenditure: 3000,
        memo: 'メモ'
    }
}

const params2 = {
    item: {
        id: "",
        date: '2023/01/31',
        title: '収入',
        category1: '給与',
        category2: '給与',
        tags: 'タグ1',
        income: 260000,
        expenditure: null,
        memo: ''
    }
}

const params3 = {
    item: {
        id: "",
        date: '2023/02/01',
        title: '支出',
        category1: '交際費',
        category2: '旅行外出',
        tags: 'タグ1,タグ2',
        income: null,
        expenditure: 5600,
        memo: 'レジャー'
    }
}

function test() {
    // データが投入されること
    const item1 = onPost(params1);
    const item2 = onPost(params2);
    const item3 = onPost(params3);

    // データが2件取得できること
    console.log(onGet({start: '2023/01/01', end: '2023/01/31'}))

    // データを修正できること
    item3.date = '2023/01/30';
    item3.expenditure = 6500;
    const newItem3 = onPut({item: item3});

    // データが3件取得できること
    console.log(onGet({start: '2023/01/01', end: '2023/01/31'}))

    // データを削除できること
    onDelete(item1);

    // データが2件取得できること
    console.log(onGet({start: '2023/01/01', end: '2023/01/31'}))

    // データを削除できること
    onDelete(item2);
    onDelete(newItem3);

    // データが0件取得できること
    console.log(onGet({start: '2023/01/01', end: '2023/01/31'}))
}
