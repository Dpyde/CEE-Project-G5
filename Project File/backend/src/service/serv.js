
function startGame(roomId) {
  const initialGameState = { playerChoices: {} };
  rooms[roomId].players.forEach((player) => {
    initialGameState.playerChoices[player.id] = null;
  });
  sendToRoom(roomId, { type: "game_start", state: initialGameState });
}

function generateRoomId() {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 4; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function checkWinner(roomId) {
  const room = await Room.findOne({ roomId });
  let p1Choice = room.players[0].choice;
  let p2Choice = room.players[1].choice;
  let result = "";
  if (p1Choice === p2Choice) {
    result = "Tie";
  } else if (p1Choice == "rock") {
    if (p2Choice == "scissors") {
      result = "P1";
    } else {
      result = "P2";
    }
  } else if (p1Choice == "scissors") {
    if (p2Choice == "paper") {
      result = "P1";
    } else {
      result = "P2";
    }
  } else if (p1Choice == "paper") {
    if (p2Choice == "rock") {
      result = "P1";
    } else {
      result = "P2";
    }
  }
  return result;
}
