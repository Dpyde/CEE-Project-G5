import Room from "../models/roomModel.js";
import express from "express";

const app = express.Router();

// Store game rooms and their players
const rooms = {};

app.use(express.static("public"));

app.use((req, res, next) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  next();
});

app.get("/create", async (req, res) => {
  const playerName = req.body.playerName;

  try {
    const newRoom = new Room({
      roomId: generateRoomId(),
      players: [
        { id: generatePlayerId(), name: playerName, choice: null, score: 0 },
      ],
      state: null,
    });
    await newRoom.save();

    res.send(newRoom);
    return newRoom;
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Create room error");
  }
});

app.get("/join/:playerName/:roomId?", async (req, res) => {
  const playerName = req.params.playerName;
  const roomId = req.params.roomId;

  try {
    const room = await Room.findOne({ roomId });
    //console.log(roomId, room);
    if (!room) {
      res.send("Room not found");
    } else {
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

    if (room?.players.length === 2) {
      const r = startGame(roomId);
      //res.redirect("/frontend/gameScreen.html");
      res.send(r);
      return r;
    }

    // req.on("close", async () => {
    //   room.players = room.players.filter((player) => player.id !== clientId);
    //   await room.save();
    // });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Join room error");
  }
});

app.get("/create/getState/:roomId?", async (req, res) => {
  const roomId = req.params.roomId;

  const room = await Room.findOne({ roomId });
  res.status(200).send(room);
});

app.post("/playerValue/:roomId?", async (req, res) => {
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

async function startGame(roomId) {
  const room = await Room.findOne({ roomId });
  //console.log(room);
  if (!room) {
    res.status(404).send("Room not found");
    return;
  }

  if (room) {
    room.state = "game_start";
  }
  await room.save();
  //console.log(room);
  return room;
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

  const l = [result, p1Choice, p2Choice];

  return l;
}

export default app;
