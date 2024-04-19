const roomId = prompt("Enter room ID:");
    const eventSource = new EventSource(`/events/${roomId}`);

    eventSource.onmessage = function(event) {
      const data = JSON.parse(event.data);
      // Handle game state updates from the server
      updateGameState(data);
    };

    function updateGameState(gameState) {
      // Update game UI based on the received game state
      
    }

    function sendGameAction(action) {
      // Send game actions to the server
      fetch(`/broadcast/${roomId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action })
      });
    }