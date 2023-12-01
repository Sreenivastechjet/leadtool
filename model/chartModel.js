const mongoose = require("mongoose");

const Chart = new mongoose.Schema(
  {
    messgae: {
      typeof: String,
      require: true,
    },
    users: Array,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { collection: "charts", timestamps: true }
);

module.exports = mongoose.model("Chart", Chart);
