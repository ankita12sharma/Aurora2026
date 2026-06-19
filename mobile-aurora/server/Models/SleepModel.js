const mongoose = require("mongoose");

const sleepSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sleepTime: {
      type: String,
      required: true,
    },

    wakeTime: {
      type: String,
      required: true,
    },

    totalHours: {
      type: Number,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("sleep_coll", sleepSchema);
