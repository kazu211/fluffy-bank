function runOnGet() {
  const params: GetParams = {
    year: "2021",
    month: "09",
  }

  const items = onGet(params);

  console.log(items)
}

function runOnPost() {
  const params: PostParams = {
    item: {
      id: "",
      date: "2021-09-30",
      type: "支出",
      category1: "住宅",
      category2: "光熱費",
      amount: 6000,
      tags: "",
      description: "電気ガス"
    },
  }

  const result = onPost(params);

  console.log(result)
}

function runOnDelete() {
  const params: DeleteParams = {
    id: "0177-2021-09-30"
  }

  const result = onDelete(params);

  console.log(result)
}
