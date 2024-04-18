const ws = new WebSocket('ws://localhost:8080');

ws.onopen = function() {
    console.log('Connected');
};

ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    const messagesDiv = document.getElementById('joinRoom-input');
    switch (data.type) {
        case 'waiting':
            messagesDiv.innerHTML = data.player + ' is waiting for another player.';
            break;
        case 'created':
            messagesDiv.innerHTML = 'Room created with ID: ' + data.roomId;
            document.getElementById('choices').style.display = 'block';
            break;
        case 'joined':
            messagesDiv.innerHTML = 'Joined room with ID: ' + data.roomId;
            document.getElementById('choices').style.display = 'block';
            break;
        case 'start':
            messagesDiv.innerHTML = 'Game started! You are ' + data.player;
            break;
        case 'error':
            messagesDiv.innerHTML = 'Error: ' + data.message;
            break;
        case 'opponent_choice':
            messagesDiv.innerHTML = 'Opponent chose: ' + data.choice;
            break;
    }
};

function createRoom() {
    ws.send(JSON.stringify({ type: 'create' }));
}

function joinRoom(roomId) {
    ws.send(JSON.stringify({ type: 'join', roomId: roomId }));
}

function sendChoice(roomId, choice) {
    ws.send(JSON.stringify({ type: 'choice', roomId: roomId, choice: choice }));
}