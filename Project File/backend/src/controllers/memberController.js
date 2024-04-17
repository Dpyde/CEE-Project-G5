// TODO: you may need to import something here
import Member from "../models/memberModel.js";
import Item from "../models/itemModel.js";

export const createMember = async (req, res) => {
  // TODO: implement this function
  try {
    const newMember = new Member(req.body);
    await newMember.save();

    res.status(200).json({ message: "OK" });
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).json({ error: "Bad Request" });
    } else {
      res.status(500).json({ error: "Internal server error." });
    }
  }
};

export const getMembers = async (req, res) => {
  // TODO: implement this function
  const members = await Member.find();

  res.status(200).json(members);
};

export const deleteMember = async (req, res) => {
  try {
    const memberId = req.params.id;
    // First, find the member by ID to get their name
    const member = await Member.findById(memberId);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Now that you have the member and their name, proceed to delete the member
    await Member.findByIdAndDelete(memberId);

    // Delete all items associated with this member's name
    await Item.deleteMany({ name: member.name });

    res
      .status(200)
      .json({ message: "Member and their items deleted successfully" });
  } catch (err) {
    console.error(
      "Error during member deletion by ID and associated items by name:",
      err
    );
    res.status(500).json({ error: "Internal server error." });
  }
};
