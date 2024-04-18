import Room from "../models/roomModel.js";

// Server side (Node.js) - Example using WebSocket library
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

const rooms = {};

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        const data = JSON.parse(message);
        switch (data.type) {
            case 'create':
                const roomId = generateRoomId();
                rooms[roomId] = [];
                rooms[roomId].push(ws);
                ws.send(JSON.stringify({ type: 'created', roomId: roomId }));
                break;
            case 'join':
                const roomIdToJoin = data.roomId;
                if (rooms[roomIdToJoin]) {
                    rooms[roomIdToJoin].push(ws);
                    ws.send(JSON.stringify({ type: 'joined', roomId: roomIdToJoin }));
                } else {
                    ws.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
                }
                break;
        }
    });
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