import  Room from "./models/roomModel.js";

export async function startGame(roomId) {
    const room = await Room.findOne({ roomId });
    room.state = "game_start";
    await room.save();
}

export function generateRoomId() {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < 4; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
}

export function generatePlayerId() {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < 6; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
}

export async function checkWinner(roomId) {
    const room = await Room.findOne({ roomId });
    let p1Choice = room.players[0].choice;
    let p2Choice = room.players[1].choice;
    if (p1Choice !== p2Choice) {
        if (p1Choice == "rock") {
            if (p2Choice == "scissor") {
                room.players[0].score += 1;
            } else {
                room.players[1].score += 1;
            }
        } else if (p1Choice == "scissor") {
            if (p2Choice == "paper") {
                room.players[0].score += 1;
            } else {
                room.players[1].score += 1;
            }
        } else if (p1Choice == "paper") {
            if (p2Choice == "rock") {
                room.players[0].score += 1;
            } else {
                room.players[1].score += 1;
            }
        }
        await room.save();
    }
}