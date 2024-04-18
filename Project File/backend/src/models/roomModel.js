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
  name2: {
    type: String,
    required: function() {
      return typeof this.country === 'undefined' || (this.country != null && typeof this.country != 'string')
    },
  },
  score1: {
    type: Number,
    required: true,
  },

  score2: {
    type: Number,
    required: true,
  },
});

const Room = mongoose.model("Room", roomSchema);

export default Room;
