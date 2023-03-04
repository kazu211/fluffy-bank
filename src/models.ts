interface Item {
  // ID
  id: string;
  // 日付
  date: string;
  // 収入/支出
  title: string;
  // 収支の分類1
  category1: string;
  // 収支の分類2
  category2: string;
  // 収支の付随情報
  tags: string;
  // 収入(円)
  income?: number;
  // 支出(円)
  outgo?: number;
  // 備考
  memo: string;
}

interface Message {
  info?: string;
  error?: string;
}

interface GetParams {
  // 取得開始日
  start: string;
  // 取得終了日
  end: string;
}

interface PostParams {
  // 登録する収支情報
  item: Item;
}

interface DeleteParams {
  // 削除する収支情報ID
  id: string;
}

interface PutParams {
  // 更新する収支情報
  item: Item;
}
