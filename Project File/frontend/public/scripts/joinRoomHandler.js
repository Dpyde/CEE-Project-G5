import { getRoomInfo, getRoomJoining } from "./api.js";

const joinRoomForm = document.querySelector('#joinRoom-form');
const roomInput = document.querySelector('#joinRoom-input');

joinRoomForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    joinRoom();
})

roomInput.addEventListener('input', function() {
    const uppercaseText = this.value.toUpperCase();
    this.value = uppercaseText;
});

async function joinRoom() {
    let room;
    const urlParams = new URLSearchParams(window.location.search);
    const playerName = urlParams.get('playerName');
    await getRoomJoining(playerName, roomInput.value);
    setTimeout(async ()=>{
        room = await getRoomInfo(roomInput.value);
        if (room.state) {
            window.location.href = `./gameScreen.html?playerName=${playerName}&roomId=${roomInput.value}`;
        }
    }, 1000);    
}


