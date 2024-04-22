import Room from "../models/roomModel.js";
//import { startGame, generateRoomId, checkWinner } from "../service/serv.js";
import express from "express";
import { v4 } from "uuid";

const uuidv4 = v4();
const app = express.Router();

// Store game rooms and their players
const rooms = {};

app.use(express.static("public"));

app.get("/events/:roomId?", async (req, res) => {
  const roomId = req.params.roomId;
  const playerName = req.body.playerName;
  
  try {
    const room = await Room.findOne({ roomId });
    console.log(room);
    if (playerName && roomId && !room) {
      console.log("One 1");
      res.status(404).send("Room not found");
    } else if (!room) {
      console.log("Two 2");
      const newRoom = new Room({
        roomId: generateRoomId(),
        players: [
          { id: generatePlayerId(), name: playerName, choice: null, score: 0 },
        ],
        state: null,
      });
      await newRoom.save();

      res.redirect(`/events/${playerName}/${roomId}`);
      return;
    } else {
      console.log("Three 3");
      if (room?.players.length === 2) {
        res.status(406).send("Room already full");
        return;
      }
      if (!room.players) {
        room.players = [];
      }
      const clientId = generatePlayerId();
      room.players.push({
        id: clientId,
        name: playerName,
        choice: null,
        score: 0,
      });
      await room.save();

    }

    // res.setHeader("Content-Type", "text/event-stream");
    // res.setHeader("Cache-Control", "no-cache");
    // res.setHeader("Connection", "keep-alive");

    // res.write(`event: connected\ndata: ${clientId}\n\n`);

    if (room?.players.length === 2) {
      startGame(roomId);
    }

    req.on("close", async () => {
      room.players = room.players.filter((player) => player.id !== clientId);
      await room.save();
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal server error");
  }
});

app.post("/choose/:roomId?", async (req, res) => {
  const roomId = req.params.roomId;
  const playerId = req.body.playerId;
  const choice = req.body.choice;

  try {
    const room = await Room.findOne({ roomId });

    if (!room) {
      res.status(404).send("Room not found");
      return;
    }

    const playerIndex = room.players.findIndex(
      (player) => player.id === playerId
    );
    if (playerIndex === -1) {
      res.status(404).send("Player not found");
      return;
    }

    room.players[playerIndex].choice = choice;
    await room.save();

    const allPlayersChose = room.players.every(
      (player) => player.choice !== null
    );

    if (allPlayersChose) {
      const l = checkWinner(roomId);
      const result = l[0];
      if (result === "Tie") {
        room.state["winner"] = "Tie";
      } else if (result === "P1") {
        const fname = room.players[0].name;
        room.players[0].score = room.players[0].score + 1;
        room.state["winner"] = fname;
      } else if (result === "P2") {
        const fname = room.players[1].name;
        room.players[1].score = room.players[1].score + 1;
        room.state["winner"] = fname;
      }
      room.players[0].choice = null;
      room.players[1].choice = null;
      await room.save();
      res.send(l);
    }

    res.status(200);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal server error");
  }
});

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

function generatePlayerId() {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 6; i++) {
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

  const l = [result, p1Choice, p2Choice]

  return l;
}

export default app;
