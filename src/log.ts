function log(level: string, message: string) {
  const logMaxRow = 101;

  logSheet.appendRow([new Date(), level.toUpperCase(), message]);

  if (logMaxRow < logSheet.getLastRow()) {
    logSheet.deleteRow(2);
  }
}
