function getCategories(): Category[] {
  const range = categorySheet.getRange(1, 1, categorySheet.getLastRow(), categorySheet.getLastColumn())

  const categories = range.getValues().map(row => {
    const [type, category1, category2] = row

    return {
      type,
      category1,
      category2,
    }
  });

  log('info', `[onGetCategories] ${categories.length} 件のデータを取得しました`)

  return categories
}
