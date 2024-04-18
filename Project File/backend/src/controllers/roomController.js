import Room from "../models/roomModel.js";

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
                const newRoom = new Room(rooms[roomId]);
                await newRoom.save();
                ws.send(JSON.stringify({ type: 'created', roomId: roomId }));
                break;
            case 'join':
                const roomIdToJoin = data.roomId;
                if (rooms[roomIdToJoin] && !rooms[roomIdToJoin].player2) {
                    rooms[roomIdToJoin].player2 = ws;
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