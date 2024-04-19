import Room from "../models/roomModel.js";
import { startGame, generateRoomId, checkWinner } from "../service/serv.js";
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
    if (playerName && roomId && !room) {
      res.status(404).send("Room not found");
    } else if (!room) {
      const newRoom = new Room({
        roomId: generateRoomId(),
        players: [{ id: v4(), name: playerName, choice: null, score: 0 }],
        state: null,
      });
      await newRoom.save();
      res.redirect(`/events/${playerName}/${roomId}`);
      return;
    } else {
      if (room.players.length === 2) {
        res.status(406).send("Room already full");
        return;
      }
      if (!room.players) {
        room.players = [];
      }
      room.players.push({
        id: v4(),
        name: playerName,
        choice: null,
        score: 0,
      });
      await room.save();
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.write(`event: connected\ndata: ${clientId}\n\n`);

    if (room.players.length === 2) {
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

app.post("/choose/:roomId?/:choice?", async (req, res) => {
  const roomId = req.params.roomId;
  const playerId = req.body.playerId;
  const choice = req.params.choice;

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
      const result = checkWinner(roomId);
      if (result === "Tie") {
        room.state["winner"] = "Tie";
        await room.save();
      } else if (result === "P1") {
        const fname = room.players[0].name;
        room.players[0].score = room.players[0].score + 1;
        room.state["winner"] = fname;
        await room.save();
      } else if (result === "P2") {
        const fname = room.players[1].name;
        room.players[1].score = room.players[1].score + 1;
        room.state["winner"] = fname;
        await room.save();
      }
      sendToRoom(roomId, { type: "game_state_update", state: room.state });
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal server error");
  }
});

export default app;
