const SHEET_ID = '1RiOD6cIdkp_lL2OMJjg6H7uHl4nnLOJWrHz0p9BSX0E'; 

function doPost(e) {
  try {
    const sheetApp = SpreadsheetApp.openById(SHEET_ID);
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    // 1. Handle Registration
    if (action === "register") {
      const sheet = sheetApp.getSheetByName("Users");
      sheet.appendRow([data.username, data.password, new Date()]);
      return ContentService.createTextOutput(JSON.stringify({status: "success", message: "Registered"})).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 2. Handle Login
    if (action === "login") {
      const sheet = sheetApp.getSheetByName("Users");
      const rows = sheet.getDataRange().getValues();
      for (let i = 1; i < rows.length; i++) {
        if (rows[i][0] === data.username && rows[i][1] === data.password) {
          return ContentService.createTextOutput(JSON.stringify({status: "success", message: "Logged in"})).setMimeType(ContentService.MimeType.JSON);
        }
      }
      return ContentService.createTextOutput(JSON.stringify({status: "error", message: "Invalid username or password"})).setMimeType(ContentService.MimeType.JSON);
    }

    // 3. Handle Leaderboard Saving
    if (action === "submitScore") {
      const sheet = sheetApp.getSheetByName("Leaderboard");
      sheet.appendRow([data.username, data.wpm, data.rawWpm, data.accuracy, data.totalErrors, data.totalChars, data.correctChars, data.maxCombo, data.mode, data.difficulty, data.language, data.codeLanguage, data.timeSeconds, new Date(), data.rescueUsed]);
      return ContentService.createTextOutput(JSON.stringify({status: "success", message: "Score saved"})).setMimeType(ContentService.MimeType.JSON);
    }

    // 4. Handle Leaderboard Fetching (This is what you were missing!)
    if (action === "getLeaderboard") {
      const sheet = sheetApp.getSheetByName("Leaderboard");
      const rows = sheet.getDataRange().getValues();
      
      if (rows.length <= 1) {
          return ContentService.createTextOutput(JSON.stringify({status: "success", data: []})).setMimeType(ContentService.MimeType.JSON);
      }

      const dataRows = rows.slice(1);
      const formattedData = dataRows.map(row => {
          let dateStr = "";
          if (row[13] instanceof Date) {
              dateStr = row[13].toISOString().split('T')[0];
          } else {
              dateStr = String(row[13]).split('T')[0];
          }

          return {
              username: String(row[0]),
              speed: Number(row[1]),
              accuracy: Number(row[3]),
              date: dateStr,
              isSteno: row[10] === 'steno'
          };
      });

      formattedData.sort((a, b) => b.speed - a.speed);
      const topData = formattedData.slice(0, 50);
      return ContentService.createTextOutput(JSON.stringify({status: "success", data: topData})).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({status: "error", message: "Unknown action sent to server"})).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({status: "error", message: error.message})).setMimeType(ContentService.MimeType.JSON);
  }
}