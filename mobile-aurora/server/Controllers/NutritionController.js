const NutritionModel = require("../Models/NutritionModel");

const addNutrition = async (req, res) => {
  try {
    const { userId, calories, protein, carbs, fats, mealType, date } = req.body;

    if (!userId || !mealType || !date) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "userId, mealType and date are required!!",
      });
    }

    const nutrition = await NutritionModel.create({
      userId,
      calories: calories || 0,
      protein: protein || 0,
      carbs: carbs || 0,
      fats: fats || 0,
      mealType,
      date,
    });

    return res.status(201).json({
      responseCode: "201",
      responseMessage: "Nutrition added successfully!!",
      data: nutrition,
    });
  } catch (error) {
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server error!!",
    });
  }
};

const getNutritionByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const data = await NutritionModel.find({ userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Nutrition fetched successfully!!",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server error!!",
    });
  }
};

const getTodayNutrition = async (req, res) => {
  try {
    const { userId } = req.params;

    const today = new Date().toISOString().split("T")[0];

    const allRecords = await NutritionModel.find({
      userId,
      date: today,
    });

    const summary = allRecords.reduce(
      (acc, item) => {
        acc.calories += Number(item.calories || 0);
        acc.protein += Number(item.protein || 0);
        acc.carbs += Number(item.carbs || 0);
        acc.fats += Number(item.fats || 0);
        return acc;
      },
      {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
      },
    );

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Today's Nutrition fetched successfully!!",
      data: summary,
    });
  } catch (error) {
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server error!!",
    });
  }
};

const deleteNutrition = async (req, res) => {
  try {
    const { nutritionId } = req.params;

    await NutritionModel.findByIdAndDelete(nutritionId);

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Nutrition deleted successfully!!",
    });
  } catch (error) {
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server error!!",
    });
  }
};

module.exports = {
  addNutrition,
  getNutritionByUser,
  getTodayNutrition,
  deleteNutrition,
};
