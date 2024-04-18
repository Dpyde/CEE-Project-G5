import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomUniqueId: {
    type: String,
    required: true,
  },
  name1: {
    type: String,
    required: true,
  },
  score1: {
    type: Number,
    required: true,
  },
});

const Room = mongoose.model("Room", roomSchema);

export default Room;
