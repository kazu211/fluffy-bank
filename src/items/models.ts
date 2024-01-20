interface Item {
  // ID
  id: string;
  // 日付
  date: string;
  // 収入/支出
  type: string;
  // 収支カテゴリ1
  category1: string;
  // 収支カテゴリ2
  category2: string;
  // 額
  amount: number;
  // 補足
  description: string;
}

interface Message {
  error: string;
}

interface GetItemsParams {
  // 取得年
  year: string;
  // 取得月
  month?: string;
}

interface PostItemsParams {
  // 登録する収支情報
  item: Item;
}

interface DeleteItemsParams {
  // 削除する収支情報
  item: Item;
}

interface PutItemsParams {
  // 更新する収支情報
  item: Item;
}
