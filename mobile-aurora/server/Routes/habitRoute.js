const express = require("express");

const router = express.Router();

const {
  addHabit,
  getHabitsByUser,
  toggleHabit,
  deleteHabit,
} = require("../Controllers/HabitController");

router.post("/add-habit", addHabit);

router.get("/get-habits/:userId", getHabitsByUser);

router.put("/toggle-habit/:habitId", toggleHabit);

router.delete("/delete-habit/:habitId", deleteHabit);

module.exports = router;
