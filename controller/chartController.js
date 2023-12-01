const Auth = require("../model/authModel");
const Chat = require("../model/chartModel");

const chartController = {
  
  getAllUsers: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const pageSize = parseInt(req.query.pageSize) || 8;
      const searchKey = req.query.search || "";
      const searchRegex = new RegExp(searchKey, "i");

      // const skip = (page - 1) * pageSize;
      const skip = Math.max((page - 1) * pageSize, 0);
      const limit = pageSize;

      const emplist = await Auth.find({
        _id: { $ne: req.params.id },
        $or: [
          { name: { $regex: searchRegex } },
          { email: { $regex: searchRegex } },
        ],
      })
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .select(["email", "name", "image", "_id"])
        .lean();
      res.status(200).json(emplist);
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },
  addMessage: async (req, res, next) => {
    try {
      const { from, to, message } = req.body;
      const data = await Chat.create({
        message:  message,
        users: [from, to],
        sender: from,
      });
      // await data.save();
      if (data) return res.json({ msg: "Message added successfully." });
      else return res.json({ msg: "Failed to add message to the database" });
    } catch (ex) {
      next(ex);
    }
  },
  getMessages: async (req, res, next) => {
    try {
      const { from, to } = req.body;

      const messages = await Chat.find({
        users: {
          $all: [from, to],
        },
      }).sort({ updatedAt: 1 });

      const projectedMessages = messages.map((msg) => {
        return {
          fromSelf: msg.sender.toString() === from,
          message: msg.message,
        };
      });
      res.json(projectedMessages);
    } catch (ex) {
      next(ex);
    }
  },
};

module.exports = chartController;
