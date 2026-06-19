const Water = require("../Models/HydrationModel");

const addWater = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || amount === undefined) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "userId and amount are required!!",
      });
    }

    const newEntry = await Water.create({
      userId,
      amount: Number(amount),
    });

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Water added successfully!!",
      data: newEntry,
    });
  } catch (error) {
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server error!!",
    });
  }
};

const getHydration = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "userId is required!!",
      });
    }

    const logs = await Water.find({ userId }).sort({
      createdAt: -1,
    });

    const today = new Date().toDateString();

    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toDateString();

    const totalWaterMl = logs.reduce(
      (sum, item) => sum + (item.amount || 0),
      0,
    );

    const todayWaterMl = logs
      .filter((item) => new Date(item.createdAt).toDateString() === today)
      .reduce((sum, item) => sum + (item.amount || 0), 0);

    const yesterdayWaterMl = logs
      .filter((item) => new Date(item.createdAt).toDateString() === yesterday)
      .reduce((sum, item) => sum + (item.amount || 0), 0);

    const trend = todayWaterMl >= yesterdayWaterMl ? "up" : "down";

    const daySet = new Set(
      logs.map((item) => new Date(item.createdAt).toDateString()),
    );

    let streak = 0;
    let currentDate = new Date();

    while (daySet.has(currentDate.toDateString())) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    const weeklyData = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const dayLabel = d.toLocaleDateString("en-US", {
        weekday: "short",
      });

      const dayString = d.toDateString();

      const total = logs
        .filter((item) => new Date(item.createdAt).toDateString() === dayString)
        .reduce((sum, item) => sum + (item.amount || 0), 0);

      weeklyData.push({
        day: dayLabel,
        ml: total,
      });
    }

    let aiMessage = "";

    if (todayWaterMl < 1500) {
      aiMessage = "You are dehydrated 💧 Drink more water today.";
    } else if (todayWaterMl < 2500) {
      aiMessage = "Good progress 👍 Keep drinking water.";
    } else {
      aiMessage = "Excellent hydration 🔥 Keep it up!";
    }

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Hydration data fetched successfully!!",
      data: {
        totalWaterMl,
        todayWaterMl,
        yesterdayWaterMl,
        goalWaterMl: 2500,
        trend,
        streak,
        weeklyData,
        aiMessage,
        logs,
      },
    });
  } catch (error) {
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server error!!",
    });
  }
};

module.exports = {
  addWater,
  getHydration,
};
