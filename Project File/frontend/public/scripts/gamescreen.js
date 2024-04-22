// import { rooms } from '../backend/src/controllers/gameController.js';

import { createPlayerValue } from "./api";

const PlayerChoices = document.querySelectorAll(".game-img");
const Player2 = document.querySelector("#player2pane");

//room settings
function roomSetting(player1name, player2name) {
    document.getElementById("player1name").innerHTML = player1name;
    document.getElementById("player2name").innerHTML = player2name;
}

//function to change each side icon
const player1interface = document.getElementById("player1pane");
const player2interface = document.getElementById("player2pane");

function choosePlayer1Value(choiceId) {
    PlayerChoices.forEach((playerChoice) => {
        if (playerChoice.id != choiceId) {
            playerChoice.style.visibility = "hidden";
        } else {
            console.log(choiceId);
            createPlayerValue(choiceId);
        }
    });
}

function showPlayer2Value(choice) {
    Player2.removeChild(Player2.firstChild);
    // Player2.appendChild(<img src="../asset/test.png"/>)
}

function resetPlayerIcon() {
    PlayerChoices.forEach((choice) => {
        choice.style.visibility = "visible";
    });
    let icon = document.createElement("lord-icon");
    icon.src = "https://cdn.lordicon.com/ojnjgkun.json";
    icon.trigger = "loop";
    icon.delay = "1000";
    icon.colors = "primary:#1c1c1c";
    icon.style = "width: 80px; height: 80px";
    Player2.removeChild(Player2.firstChild);
    Player2.appendChild(icon);
}

//method about function of icon

function addIconFunction() {
    player1interface
        .getElementById("rock1")
        .addEventListener("click", sendToserver);
    player1interface
        .getElementById("paper1")
        .addEventListener("click", sendToserver);
    player1interface
        .getElementById("scrissor1")
        .addEventListener("cllick", sendToserver);
}
function sendToserver(choice) {
    player1interface
        .getElementById("rock1")
        .removeEventListener("click", sendToserver);
    player1interface
        .getElementById("paper1")
        .removeEventListener("click", sendToserver);
    player1interface
        .getElementById("scrissor1")
        .removeEventListener("cllick", sendToserver);
}
