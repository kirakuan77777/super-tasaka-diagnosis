
function onEdit(e) {
  const sheet = e.source.getSheetByName("回答記録");
  const row = e.range.getRow();
  if (row < 2 || e.range.getColumn() === 1) return;

  const calcSheet = e.source.getSheetByName("スコア計算");
  const userId = sheet.getRange(row, 1).getValue();
  const userRow = findRow(calcSheet, userId);

  if (userRow) {
    const scores = calcSheet.getRange(userRow, 2, 1, 16).getValues()[0];
    const maxScore = Math.max(...scores);
    const index = scores.indexOf(maxScore);
    const buddhaName = calcSheet.getRange(1, 2 + index).getValue();
    calcSheet.getRange(userRow, 18).setValue(buddhaName);
  }
}

function findRow(sheet, userId) {
  const values = sheet.getRange("A2:A").getValues().flat();
  const row = values.findIndex(id => id === userId);
  return row >= 0 ? row + 2 : null;
}
