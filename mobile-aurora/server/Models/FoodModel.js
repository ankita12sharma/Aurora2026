const mongoose = require("mongoose");

const foodMasterSchema = new mongoose.Schema(
  {
    foodName: {
      type: String,
      lowercase: true,
      trim: true,
    },

    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number,

    userId: {
      type: String,
    },

    foods: {
      type: [String],
      default: undefined,
    },

    rawMessage: String,

    mealType: String,

    date: String,

    type: {
      type: String,
      enum: ["master", "log"],
      default: "master",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("food_coll", foodMasterSchema);
