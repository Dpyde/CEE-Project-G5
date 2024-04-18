import Room from "../models/roomModel.js";

let roomUniqueId = null;
let player1 = false;

function createGame() {
    player1 = true;
}

function joinGame() {
    roomUniqueId = document.getElementById('roomUniqueId').value;
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

function sendChoice(rpsValue) {
    const choiceEvent = player1 ? "p1Choice" : "p2Choice";
    socket.emit(choiceEvent,{
        rpsValue: rpsValue,
        roomUniqueId: roomUniqueId
    });
    let playerChoiceButton = document.getElementById('button');
    playerChoiceButton.style.display = 'block';
    playerChoiceButton.classList.add(rpsValue.toString().toLowerCase());
    playerChoiceButton.innerText = rpsValue;
    document.getElementById('player1Choice').innerHTML = "";
    document.getElementById('player1Choice').appendChild(playerChoiceButton);
}

function createOpponentChoiceButton(data) {
    document.getElementById('opponentState').innerHTML = "Opponent made a choice";
    let opponentButton = document.createElement('button');
    opponentButton.id = 'opponentButton';
    opponentButton.classList.add(data.rpsValue.toString().toLowerCase());
    opponentButton.style.display = 'none';
    opponentButton.innerText = data.rpsValue;
    document.getElementById('player2Choice').appendChild(opponentButton);
}