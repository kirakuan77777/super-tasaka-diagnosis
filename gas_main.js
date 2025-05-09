
function doGet(e) {
  const action = e.parameter.action;
  if (action === 'getQuestions') {
    return getQuestions();
  }
  return ContentService.createTextOutput("Invalid request");
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("回答記録");
  const { action, userId, questionIndex, answer } = data;

  if (action === 'submitAnswer') {
    const userRow = findOrCreateUserRow(sheet, userId);
    const col = questionIndex + 2; // A列=userId, B〜=Q1〜
    sheet.getRange(userRow, col).setValue(answer);
    return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({ success: false })).setMimeType(ContentService.MimeType.JSON);
}

function getQuestions() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("質問データ");
  const values = sheet.getRange("C2:C89").getValues(); // C列：質問文
  const questions = values.flat();
  return ContentService.createTextOutput(JSON.stringify({ questions: questions })).setMimeType(ContentService.MimeType.JSON);
}

function findOrCreateUserRow(sheet, userId) {
  const users = sheet.getRange("A2:A").getValues().flat();
  let row = users.findIndex(u => u === userId);
  if (row === -1) {
    row = users.findIndex(u => !u);
    if (row === -1) row = users.length;
    sheet.getRange(row + 2, 1).setValue(userId);
  }
  return row + 2;
}
