const express = require("express");
const router = express.Router();

const {
  addWater,
  getHydration,
} = require("../Controllers/HydrationController");

router.post("/add-water", addWater);

router.get(`/get/:userId`, getHydration);

module.exports = router;
