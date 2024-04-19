import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomId: String,
  players: [{ id: String, name: String, choice: String, score: Number }],
  state: mongoose.Schema.Types.Mixed // For storing game state (can be any type)
});

const Room = mongoose.model('Room', roomSchema);

export default Room;
