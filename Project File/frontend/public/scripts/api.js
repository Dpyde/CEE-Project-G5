export async function getRoomInfo(roomId) {
    const room = await fetch(`http://localhost:3222/get/room/${roomId}`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "GET",
    }).then((res) => res.json());
    return room;
}

export async function getRoomJoining(playerName, roomId) {
    try {
        const room = await fetch(
            `http://localhost:3222/get/join/${playerName}/${roomId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "GET",
            }
        ).then((res) => res.json())
        return room;
    } catch (e) {
        alert("Room not found");
        return;
    }
}

export async function createRoom(playerName) {
    const room = await fetch("http://localhost:3222/create/room", {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
            playerName: playerName,
        }),
    }).then((res) => res.json());
    return room;
}

export async function createWinner(roomId, playerName, choice) {
    await fetch(`http://localhost:3222/create/winner/${roomId}`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
            playerName: playerName,
            choice: choice,
        }),
    })
    return ;
}

export async function createResult(playerName, roomId) {
    const result = await fetch(`http://localhost:3222/create/result/${roomId}`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
            playerName: playerName
        })
    }).then((res) => res.json())
    .catch(err => console.error(err));
    return result;
}

export async function createEnd(playerName, roomId) {
    await fetch(`http://localhost:3222/create/end/${roomId}`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
            playerName: playerName
        })
    })
    return;
}

export async function updateChoice(roomId) {
    await fetch(`http://localhost:3222/update/choice/${roomId}`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "PUT",
    });
    return;
}

export async function deleteRoom(roomId) {
    await fetch(`http://localhost:3222/delete/${roomId}`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "DELETE",
    });
    return;
}