function getCategories(): Category[] {
  // ヘッダー(1行目)は除く
  const range = categorySheet.getRange(2, 1, categorySheet.getLastRow()-1, categorySheet.getLastColumn())

  const categories = range.getValues().map(row => {
    const [id ,type, category1, category2, color] = row

    return {
      id,
      type,
      category1,
      category2,
      color,
    }
  });

  log('info', `[onGetCategories] ${categories.length} 件のデータを取得しました`)

  return categories
}
