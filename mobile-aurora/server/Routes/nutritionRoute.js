const express = require("express");
const router = express.Router();

const {
  addNutrition,
  getNutritionByUser,
  getTodayNutrition,
  deleteNutrition,
} = require("../Controllers/nutritionController");

router.post("/add-nutrition", addNutrition);

router.get("/get-nutrition/:userId", getNutritionByUser);

router.get("/get-today-nutrition/:userId", getTodayNutrition);

router.delete("/delete-nutrition/:nutritionId", deleteNutrition);

module.exports = router;
