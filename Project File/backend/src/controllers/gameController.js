import { createRoom, getRooms } from '../api.js';
import { deleteRoom } from './roomController.js';

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let rooms = {};

wss.on('connection', function connection(ws) {
    ws.on('message', async function incoming(message) {
        const data = JSON.parse(message);
        switch (data.type) {
            case 'create':
                const roomId = generateRoomId();
                rooms[roomId] = { roomUniqueId: roomId, player1: ws, player2: null, score1: 0, score2: 0 };
                // await createRoom(rooms[roomId]);
                ws.send(JSON.stringify({ type: 'created', roomId: roomId }));
                break;
            case 'join':
                const roomIdToJoin = data.roomId;
                if (rooms[roomIdToJoin] && !rooms[roomIdToJoin].player2) {
                    rooms[roomIdToJoin].player2 = ws;
                    // const roomss = await getRooms();
                    // await deleteRoom(roomss._id);
                    // roomss[roomIdToJoin].player2 = ws;
                    // await createRoom(roomss[roomIdToJoin]);
                    ws.send(JSON.stringify({ type: 'joined', roomId: roomIdToJoin }));
                    startGame(roomIdToJoin);
                } else {
                    ws.send(JSON.stringify({ type: 'error', message: 'Room not found or full' }));
                }
                break;
            case 'choice':
                const roomIdToSend = data.roomId;
                const choice = data.choice;
                if (rooms[roomIdToSend]) {
                    const player1 = rooms[roomIdToSend].player1;
                    const player2 = rooms[roomIdToSend].player2;
                    if (ws === player1) {
                        player2.send(JSON.stringify({ type: 'opponent_choice', choice: choice }));
                    } else if (ws === player2) {
                        player1.send(JSON.stringify({ type: 'opponent_choice', choice: choice }));
                    }
                }
                break;
        }
    });
});

function startGame(roomId) {
    rooms[roomId].player1.send(JSON.stringify({ type: 'start', player: 'Player 1' }));
    rooms[roomId].player2.send(JSON.stringify({ type: 'start', player: 'Player 2' }));
}

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
}