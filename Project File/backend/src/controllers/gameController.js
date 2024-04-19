import Room from '../models/roomModel';

const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Store game rooms and their players
const rooms = {};

app.use(express.static('public'));

app.get('/events/:roomId/:playerName', async (req, res) => {
    const roomId = req.params.roomId;
    const playerName = req.params.playerName;
  
    try {
      let room = await Room.findOne({ roomId });
  
      if (!room) {
        // If the room ID is not found, create a new room
        room = new Room({
          roomId: generateRoomId(),
          players: [{ id: uuidv4(), name: playerName, choice: null, score: 0 }],
          state: null
        });
  
        await room.save();
        res.redirect(`/events/${roomId}/${playerName}`);
        return;
      }
  
      // Add player to the existing room
      const clientId = uuidv4();
      room.players.push({ id: clientId, name: playerName, choice: null, score: 0 });
      await room.save();

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
  
      res.write(`event: connected\ndata: ${clientId}\n\n`);
  
      // If the room is full (has two players), start the game
      if (room.players.length === 2) {
        startGame(roomId);
      }
  
      // Handle client disconnect
      req.on('close', async () => {
        room.players = room.players.filter(player => player.id !== clientId);
        await room.save();
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal server error');
    }
  });
  
  app.post('/choose/:roomId/:choice', async (req, res) => {
    const roomId = req.params.roomId;
    const playerId = req.body.playerId;
    const choice = req.params.choice;
  
    try {
      const room = await Room.findOne({ roomId });
  
      if (!room) {
        res.status(404).send('Room not found');
        return;
      }
  
      const playerIndex = room.players.findIndex(player => player.id === playerId);
      if (playerIndex === -1) {
        res.status(404).send('Player not found');
        return;
      }
  
      // Update player's choice
      room.players[playerIndex].choice = choice;
      await room.save();
  
      // Check if all players have made their choices
      const allPlayersChose = room.players.every(player => player.choice !== null);
  
      if (allPlayersChose) {
        const result = checkWinner();
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
        sendToRoom(roomId, { type: 'game_state_update', state: room.state });
      }
  
      res.sendStatus(200);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal server error');
    }
  });

function sendToRoom(roomId, message) {
  if (rooms[roomId]) {
    rooms[roomId].players.forEach(player => {
      player.res.write(`data: ${JSON.stringify(message)}\n\n`);
    });
  }
}

function startGame(roomId) {
    const initialGameState = { playerChoices: {} };
    rooms[roomId].players.forEach(player => {
      initialGameState.playerChoices[player.id] = null;
    });
    sendToRoom(roomId, { type: 'game_start', state: initialGameState });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function generateRoomId() {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < 4; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function checkWinner() {
    let p1Choice = "";
    let p2Choice = "";
    let result = "";
    if (p1Choice === p2Choice) {
        result = "Tie";
    }
    else if (p1Choice == "rock") {
        if (p2Choice == "scissors") {result = "P1";}
        else {result = "P2";}
    }
    else if (p1Choice == "scissors") {
        if (p2Choice == "paper") {result = "P1";}
        else {result = "P2";}
    }
    else if (p1Choice == "paper") {
        if (p2Choice == "rock") {result = "P1";}
        else {result = "P2";}
    }
    return result;
}