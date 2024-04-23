import Room from "../models/roomModel.js";
import express from "express";
import { startGame, generateRoomId, generatePlayerId, checkWinner } from "../utils.js"

const app = express.Router();

app.use(express.static("public"));

app.use((req, res, next) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    next();
});

app.get("/get/room/:roomId?", async (req, res) => {
    const roomId = req.params.roomId;

    const room = await Room.findOne({ roomId });
    res.status(200).send(room);
});

app.get("/get/join/:playerName/:roomId?", async (req, res) => {
    const playerName = req.params.playerName;
    const roomId = req.params.roomId;

    try {
        const room = await Room.findOne({ roomId });

        if (playerName && roomId && !room) {
            res.send("Room not found");
        } else {
            if (room?.players.length === 2) {
                res.status(406).send("Room already full");
                return;
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
            await startGame(roomId).then(res.send(room));
            return room;
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Join room error");
    }
});

app.post("/create/room", async (req, res) => {
    const playerName = req.body.playerName;

    try {
        const newRoom = new Room({
            roomId: generateRoomId(),
            players: [
                {
                    id: generatePlayerId(),
                    name: playerName,
                    choice: null,
                    score: 0,
                },
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

app.post("/create/winner/:roomId?", async (req, res) => {
    const roomId = req.params.roomId;
    const playerName = req.body.playerName;
    const choice = req.body.choice;

    try {
        const room = await Room.findOne({ roomId });

        const playerIndex = room.players.findIndex(
            (player) => player.name === playerName
        );

        room.players[playerIndex].choice = choice;
        await room.save();

        const allPlayersChose = room.players.every(
            (player) => player.choice !== null
        );

        if (allPlayersChose) {
            await checkWinner(roomId);
            room.state = "ready";
            await room.save();
            res.status(200).send('ready');
        } else {
            room.state = "waiting";
            await room.save();
            res.status(200).send('waiting');
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal server error");
    }
});

app.post("/create/result/:roomId?", async (req, res) => {
    const roomId = req.params.roomId;
    const playerName = req.body.playerName;
    let thisPlayer;
    let anotherPlayer;

    try {
        const room = await Room.findOne({ roomId });
        room.players.forEach((player)=>{
            if (player.name === playerName) {
                thisPlayer = player;
            } else {
                anotherPlayer = player;
            }
        })
        if (thisPlayer.score > anotherPlayer.score) {
            res.status(200).send({ message: "win" });
            return;
        } else {
            res.status(200).send({ message: "lose" });
            return;
        }
    } catch {
        res.status(500).send({ message: "error connection" });
    }
});

app.post("/create/end/:roomId?", async (req, res) => {
    const roomId = req.params.roomId;
    const playerName = req.body.playerName;

    const room = await Room.findOne({ roomId });

    const playerIndex = room.players.findIndex(
        (player) => player.name === playerName
    );

    room.players[playerIndex].choice = "end";
    await room.save();

    const allPlayersEnd = room.players.every(
        (player) => player.choice === "end"
    );

    if (allPlayersEnd) {
        room.state = "end_game";
        await room.save();
        res.status(200).send('ready');
    }
})

app.put("/update/choice/:roomId?", async (req, res) => {
    const roomId = req.params.roomId;

    const room = await Room.findOne({ roomId });
    room.players[0].choice = null;
    room.players[1].choice = null;
    await room.save();
    res.status(200).send("update choice successfully");
});

app.delete("/delete/:roomId", async (req, res) => {
    const rId = req.params.roomId;

    const room = Room.findOne({ rId });

    if (!room) {
        res.status(404).send("Room not found");
    } else {
        await Room.deleteOne({ roomId: rId });
        res.status(200).send("deleted");
    }
});

export default app;
