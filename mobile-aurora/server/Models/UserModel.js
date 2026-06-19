const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      default: null,
    },

    gender: {
      type: String,
      default: null,
    },

    height: {
      type: Number,
      default: null,
    },

    weight: {
      type: Number,
      default: null,
    },

    wakeTime: {
      type: String,
      default: null,
    },

    sleepTime: {
      type: String,
      default: null,
    },

    goals: {
      type: [String],
      default: [],
    },

    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("User", userSchema);
