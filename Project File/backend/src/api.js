export async function getRooms() {
    const rooms = await fetch(`${BACKEND_URL}/rooms`).then((r) => r.json());
  
    return rooms;
}
  
export async function createRoom(room) {
    await fetch(`${BACKEND_URL}/rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(room),
    });
}

export async function deleteItem(id, room) {
    await fetch(`${BACKEND_URL}/rooms/${id}`, {
      method: "DELETE",
    });
  }