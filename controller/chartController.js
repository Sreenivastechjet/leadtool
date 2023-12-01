const Auth = require("../model/authModel");
const Chart = require("../model/chartModel");

const chartController = {
    getAllUsers : async (req, res, next) => {
        try {
          const users = await Auth.find({ _id: { $ne: req.params.id } }).select([
            "email",
            "username",
            "avatarImage",
            "_id",
          ]);
          return res.json(users);
        } catch (ex) {
          next(ex);
        }
      },
  addMessage: async (req, res, next) => {
    try {
      const { from, to, message } = req.body;
      const data = await Chart.create({
        message: { text: message },
        users: [from, to],
        sender: from,
      });

      if (data) return res.json({ msg: "Message added successfully." });
      else return res.json({ msg: "Failed to add message to the database" });
    } catch (ex) {
      next(ex);
    }
  },
  getMessages: async (req, res, next) => {
    try {
      const { from, to } = req.body;

      const messages = await Chart.find({
        users: {
          $all: [from, to],
        },
      }).sort({ updatedAt: 1 });

      const projectedMessages = messages.map((msg) => {
        return {
          fromSelf: msg.sender.toString() === from,
          message: msg.message.text,
        };
      });
      res.json(projectedMessages);
    } catch (ex) {
      next(ex);
    }
  },
};

module.exports = chartController;
