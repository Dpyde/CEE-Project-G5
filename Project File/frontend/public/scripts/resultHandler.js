import { createEnd, deleteRoom, getRoomInfo } from "./api.js";

const headerText = document.querySelector("#result-header-text");
const playerScore1 = document.querySelector('#result-playerScore-1');
const playerScore2 = document.querySelector('#result-playerScore-2');
const icon = document.querySelector("#result-icon");

const urlParams = new URLSearchParams(window.location.search);
const playerName = urlParams.get("playerName");
const roomId = urlParams.get("roomId");
const result = urlParams.get("result");

setUpPage()

const endGameInterval = setInterval(()=>{
    checkGameEnd();
}, 100);

async function checkGameEnd() {
    try {
        let room = await getRoomInfo(roomId);
        if (room.state === "end_game") {
            clearInterval(endGameInterval);
            await deleteRoom(roomId);
        }
    } catch {
        clearInterval(endGameInterval);
    }
    
}

async function setUpPage() {
    const room = await getRoomInfo(roomId);
    playerScore1.innerHTML = room.players[0].score;
    playerScore2.innerHTML = room.players[1].score;
    let lordIcon = document.createElement("lord-icon");
    lordIcon.trigger = "loop";
    lordIcon.delay = "700"
    lordIcon.colors = "primary:#1c1c1c"
    lordIcon.style = "width: 64px; height: 64px"
    if (result === "winner") {
        headerText.innerHTML = "You Win";
        lordIcon.src = "https://cdn.lordicon.com/jcepibgt.json"
        icon.appendChild(lordIcon);
    } else {
        headerText.innerHTML = "You Lose";
        lordIcon.src = "https://cdn.lordicon.com/sbrtyqxj.json";
        icon.appendChild(lordIcon);
    }
    await createEnd(playerName, roomId);
}
