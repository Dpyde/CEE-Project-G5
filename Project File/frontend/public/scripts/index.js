import { createRoom } from "./api.js";

const usernameInput = document.querySelector("#username-input");
const buttonCreateGame = document.querySelector('#button-createGame');
const buttonJoinGame = document.querySelector('#button-joinGame');

buttonCreateGame.addEventListener('click', async ()=>{
    if (!usernameInput.value) {
        alert("please fill your username first");
    } else {
        const roomId = await createRoom(usernameInput.value);
        window.location.href = `./creatRoomScreen.html?playerName=${usernameInput.value}&roomId=${roomId.roomId}`;
    }
});

buttonJoinGame.addEventListener('click', async ()=>{
    if (!usernameInput.value) {
        alert("please fill your username first");
    } else {
        window.location.href = `./joinRoomScreen.html?playerName=${usernameInput.value}`;
    }
})