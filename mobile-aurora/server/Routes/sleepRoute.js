const express = require("express");
const router = express.Router();

const { addSleep, getSleepByUser } = require("../Controllers/sleepController");

router.post("/add-sleep", addSleep);

router.get("/get-sleep/:userId", getSleepByUser);

module.exports = router;
