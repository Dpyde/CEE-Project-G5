import Room from "../models/roomModel.js";

export const createRoom = async (req, res) => {
  try {
    const newRoom = new Room(req.body);
    await newRoom.save();

    res.status(200).json({ message: "OK" });
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).json({ error: "Bad Request" });
    } else {
      res.status(500).json({ error: "Internal server error." });
    }
  }
};

export const getRooms = async (req, res) => {
  const Rooms = await Room.find();

  res.status(200).json(Rooms);
};

export const deleteRoom = async (req, res) => {
  const id = req.originalUrl.split("/")[req.originalUrl.split("/").length - 1];
  try {
    await Room.deleteOne({ _id: id });

    res.status(200).send("Deleted!");
  } catch (err) {
    res.status(404).send("Not Found");
    return;
  }
};