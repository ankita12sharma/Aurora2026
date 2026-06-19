const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    age: {
      type: Number,
      required: true,
    },

    gender: {
      type: String,
      required: true,
    },

    height: {
      type: Number,
      required: true,
    },

    weight: {
      type: Number,
      required: true,
    },

    goalWeight: {
      type: Number,
      required: true,
    },

    waterGoal: {
      type: Number,
      default: 2500,
    },

    sleepGoal: {
      type: Number,
      default: 8,
    },

    calorieGoal: {
      type: Number,
      default: 2000,
    },

    theme: {
      type: String,
      default: "Light",
    },

    language: {
      type: String,
      default: "English",
    },

    units: {
      type: String,
      enum: ["Metric", "Imperial"],
      default: "Metric",
    },

    notifications: {
      type: Boolean,
      default: true,
    },

    waterReminders: {
      type: Boolean,
      default: true,
    },

    sleepReminders: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("profile_coll", profileSchema);
