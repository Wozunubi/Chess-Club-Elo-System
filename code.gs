function submitGame() {
  let dashboard = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Input");
  let games = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Games");
  let players = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Players");

  let whitePlayer = [dashboard.getRange(3, 2).getValue(), -1];
  let blackPlayer = [dashboard.getRange(3, 3).getValue(), -1];
  let outcome = dashboard.getRange(3, 4).getValue();
  let totalGames = games.getRange(2, 6).getValue();
  let totalMembers = players.getRange(2, 8).getValue();
  
  dashboard.getRange(3, 2, 1, 3).setValues([["", "", ""]]);
  games.getRange(totalGames+2, 1, 1, 4).setValues([[new Date(), whitePlayer[0], blackPlayer[0], outcome]]);
  games.getRange(2, 6).setValue(++totalGames);

  for (let i = 0; i < totalMembers; i++) {
    let members = players.getRange(2, 1, totalMembers, 6).getValues();

    if (members[i][0] == whitePlayer[0]) {
      whitePlayer[1] = i+2;
    } else if (members[i][0] == blackPlayer[0]) {
      blackPlayer[1] = i+2;
    }
  }

  if (whitePlayer[1] == -1) {
    whitePlayer[1] = totalMembers+2;
    players.getRange(totalMembers+2, 1, 1, 6).setValues([[whitePlayer[0], 1500, 0, 0, 0, 0]]);
    players.getRange(2, 8).setValue(++totalMembers);
  }

  if (blackPlayer[1] == -1) {
    blackPlayer[1] = totalMembers+2;
    players.getRange(totalMembers+2, 1, 1, 6).setValues([[blackPlayer[0], 1500, 0, 0, 0, 0]]);
    players.getRange(2, 8).setValue(++totalMembers);
  }

  let whiteElo = players.getRange(whitePlayer[1], 2).getValue();
  let blackElo = players.getRange(blackPlayer[1], 2).getValue();
  let whiteExpected = 1/(1+(10**((blackElo-whiteElo)/400)));
  let blackExpected = 1/(1+(10**((whiteElo-blackElo)/400)));

  k = (180 * (1.2 ** (-players.getRange(whitePlayer[1], 6).getValue()))) + 20
  //players.getRange(10, 10).setValue(whitePlayer[1]);
  players.getRange(whitePlayer[1], 2).setValue(Math.round(whiteElo + (k * (outcome - whiteExpected))));

  k = (180 * (1.2 ** (-players.getRange(blackPlayer[1], 6).getValue()))) + 20
  players.getRange(blackPlayer[1], 2).setValue(Math.round(blackElo + (k * ((1-outcome) - blackExpected))));

  if (outcome == 1) {
    players.getRange(whitePlayer[1], 3).setValue(players.getRange(whitePlayer[1], 3).getValue()+1);
    players.getRange(blackPlayer[1], 4).setValue(players.getRange(blackPlayer[1], 4).getValue()+1);
  } else if (outcome == 0) {
    players.getRange(whitePlayer[1], 4).setValue(players.getRange(whitePlayer[1], 4).getValue()+1);
    players.getRange(blackPlayer[1], 3).setValue(players.getRange(blackPlayer[1], 3).getValue()+1);
  } else {
    players.getRange(whitePlayer[1], 5).setValue(players.getRange(whitePlayer[1], 5).getValue()+1);
    players.getRange(blackPlayer[1], 5).setValue(players.getRange(blackPlayer[1], 5).getValue()+1);
  }

  players.getRange(whitePlayer[1], 6).setValue(players.getRange(whitePlayer[1], 6).getValue()+1);
  players.getRange(blackPlayer[1], 6).setValue(players.getRange(blackPlayer[1], 6).getValue()+1);

  let ranking = players.getRange(2, 1, totalMembers, 2).getValues(); 
  ranking = ranking.sort(function(a, b) {
    return b[1] - a[1];
  });

  for (let i = 0; i < totalMembers; i++) {
    players.getRange(i+2, 1).setValue(ranking[i][0]);
    players.getRange(i+2, 2).setValue(ranking[i][1]);
  }

  return;
}
