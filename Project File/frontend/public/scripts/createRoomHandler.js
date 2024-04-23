import { deleteRoom, getRoomInfo } from "./api.js";

const roomIdText = document.querySelector("#createRoom-code");
const backButton = document.querySelector('#create-button-back');

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get("roomId");
const playerName = urlParams.get('playerName');

setRoomIdText();

setInterval(()=>{
    checkGameState();
}, 100);

backButton.addEventListener('click', async ()=>{
    await deleteRoom(roomId);
    window.location.href = 'index.html';
})

async function setRoomIdText() {
    roomIdText.innerHTML = roomId;
}

async function checkGameState() {
    let room = await getRoomInfo(roomId);
    if (room.state) {
        window.location.href = `./gameScreen.html?playerName=${playerName}&roomId=${roomId}`;
    }
}
