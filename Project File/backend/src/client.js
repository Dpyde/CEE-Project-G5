const ws = new WebSocket('ws://localhost:8080');

ws.onopen = function() {
    console.log('Connected');
};

ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    switch (data.type) {
        case 'created':
            console.log('Room created with ID: ' + data.roomId);
            break;
        case 'joined':
            console.log('Joined room with ID: ' + data.roomId);
            break;
        case 'error':
            console.error(data.message);
            break;
    }
};


// create room
// ws.send(JSON.stringify({ type: 'create' }));

// join room
// ws.send(JSON.stringify({ type: 'join', roomId: 'roomId' }));
