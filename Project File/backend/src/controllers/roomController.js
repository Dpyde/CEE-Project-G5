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
  const rooms = await Room.find();

  res.status(200).json(rooms);
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

export const filterItems = async (req, res) => {
  const { name, lowerPrice, upperPrice } = req.query;
  if (
    name === undefined ||
    lowerPrice === undefined ||
    upperPrice === undefined
  ) {
    res.status(400).send("Bad Request");
    return;
  }
  if (name != "ทั้งหมด") {
    const items = await Item.find({
      name: { $regex: name, $options: "i" },
      price: { $gte: lowerPrice, $lte: upperPrice },
    });
    res.status(200).json(items);
  } else {
    const items = await Item.find({
      price: { $gte: lowerPrice, $lte: upperPrice },
    });
    res.status(200).json(items);
  }
};