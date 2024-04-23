import { createWinner, createResult, getRoomInfo, updateChoice } from "./api.js";
import { MAX_SCORE } from "./config.js";

const playerName1 = document.querySelector("#playerName-1");
const playerScore1 = document.querySelector("#playerScore-1");
const playerPane1 = document.querySelectorAll(".game-img");
const playerName2 = document.querySelector("#playerName-2");
const playerScore2 = document.querySelector("#playerScore-2");
const playerPane2 = document.querySelector("#playerPane-2");

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get("roomId");
const playerName = urlParams.get("playerName");
let round = 0;

roomSetting();

playerPane1.forEach((icon) => {
    icon.addEventListener("click", clickIconHandle);
});

function clickIconHandle(e) {
    findWinner(e.target.id);
}

//room settings
async function roomSetting() {
    const roomInfo = await getRoomInfo(roomId);
    roomInfo.players.forEach((player) => {
        if (player.name == playerName) {
            playerName1.innerHTML = player.name;
            playerScore1.innerHTML = player.score;
        } else {
            playerName2.innerHTML = player.name;
            playerScore2.innerHTML = player.score;
        }
    });
}

function scoreSetting(player1, player2) {
    if (playerName1.innerHTML === player1.name) {
        playerScore1.innerHTML = player1.score;
        playerScore2.innerHTML = player2.score;
    } else {
        playerScore1.innerHTML = player2.score;
        playerScore2.innerHTML = player1.score;
    }
}

async function checkGameState(timeInterval) {
    const room = await getRoomInfo(roomId);
    if (room.state === "ready") {
        clearInterval(timeInterval);
        let anotherPlayer;
        if (room.players[0].choice !== room.players[1].choice) {
            round += 1;
        }
        room.players.forEach((player) => {
            if (player.name === playerName2.innerHTML) {
                anotherPlayer = player;
            }
        });
        revealAnotherPlayerValue(anotherPlayer.choice);
        setTimeout(() => {
            scoreSetting(room.players[0], room.players[1]);
            setTimeout(() => {
                resetPlayerIcon(room.players[0], room.players[1]);
            }, 1000);
        }, 1000);
    }
}

async function findWinner(chilckedIcon) {
    playerPane1.forEach(async (icon) => {
        if (icon.id != chilckedIcon) {
            icon.style.display = "none";
        } else {
            icon.removeEventListener("click", clickIconHandle);
            await createWinner(roomId, playerName, icon.id);
            const getStateInterval = setInterval(() => {
                checkGameState(getStateInterval);
            }, 100);
        }
    });
}

async function goToResultPage() {
    const result = await createResult(playerName, roomId);
    if (result.message === 'win') {
        window.location.href = `../resultScreen.html?playerName=${playerName}&roomId=${roomId}&result=winner`
    } else {
        window.location.href = `../resultScreen.html?playerName=${playerName}&roomId=${roomId}&result=loser`
    }
}

function revealAnotherPlayerValue(choice) {
    playerPane2.removeChild(playerPane2.firstChild);
    const imgPath = `../asset/${choice}.png`;
    let img = document.createElement("img");
    img.src = imgPath;
    img.classList.add("game-img");
    playerPane2.appendChild(img);
}

async function resetPlayerIcon(player1, player2) {
    if (player1.score === MAX_SCORE || player2.score === MAX_SCORE) {
        goToResultPage();
    } else {
        await updateChoice(roomId);
        playerPane1.forEach((icon) => {
            icon.style.display = "inline-block";
            icon.addEventListener("click", clickIconHandle);
        });
        let icon = document.createElement("lord-icon");
        icon.src = "https://cdn.lordicon.com/ojnjgkun.json";
        icon.trigger = "loop";
        icon.delay = "1000";
        icon.colors = "primary:#1c1c1c";
        icon.style = "width: 80px; height: 80px";
        playerPane2.removeChild(playerPane2.firstChild);
        playerPane2.appendChild(icon);
    }
}
