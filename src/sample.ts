function runOnGet() {
  const params: GetParams = {
    year: "2021",
    month: "09",
  }

  const items = onGet(params);

  console.log(items)
}
