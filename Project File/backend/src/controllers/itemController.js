import Item from "../models/itemModel.js";

export const createItem = async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();

    res.status(200).json({ message: "OK" });
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).json({ error: "Bad Request" });
    } else {
      res.status(500).json({ error: "Internal server error." });
    }
  }
};

export const getItems = async (req, res) => {
  const items = await Item.find();

  res.status(200).json(items);
};

export const deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const result = await Item.findByIdAndDelete(itemId);

    if (result) {
      res.status(200).json({ message: "DONE" });
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
};

export const filterItems = async (req, res) => {
  try {
    let { filterName, lowerPrice, upperPrice } = req.body;
    const filter = {};

    // Corrected variable names and parsing method
    lowerPrice = parseInt(lowerPrice);
    upperPrice = parseInt(upperPrice);
    console.log(filterName);
    if (filterName != "ทั้งหมด") {
      filter.name = { $regex: filterName };
    }
    console.log(lowerPrice);

    filter.price = { $gte: lowerPrice, $lte: upperPrice };

    const filteredItems = await Item.find(filter);

    res.status(200).json(filteredItems);
  } catch (error) {
    console.error("Error filtering items:", error);
    res.status(500).json({ error: "Internal server errorxx" });
  }
};
