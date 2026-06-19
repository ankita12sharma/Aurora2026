const express = require("express");

const router = express.Router();

const {
  createProfile,
  getProfile,
  updateProfile,
} = require("../Controllers/ProfileController");

router.post("/create-profile", createProfile);

router.get("/get-profile/:userId", getProfile);

router.put("/update-profile/:userId", updateProfile);

module.exports = router;
