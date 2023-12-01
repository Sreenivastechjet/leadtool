const mongoose = require("mongoose");

const Chat = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    users: Array,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { collection: "chat", timestamps: true }
);

module.exports = mongoose.model("Chat", Chat);
