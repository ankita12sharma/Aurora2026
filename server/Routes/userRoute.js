const express = require("express");
const {
  signupValidation,
  loginValidation,
} = require("../Middleware/AuthValidation");
const {
  signupUser,
  loginUser,
  completeOnboarding,
  getUserProfile,
} = require("../Controllers/UserController");
const router = new express.Router();

router.post("/signup", signupValidation, signupUser);
router.post("/login", loginValidation, loginUser);
router.post("/onboarding", completeOnboarding);
router.get("/profile/:userId", getUserProfile);

module.exports = router;
