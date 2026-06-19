const SleepModel = require("../Models/SleepModel");

const calculateSleepHours = (sleepTime, wakeTime) => {
  const [sleepH, sleepM] = sleepTime.split(":").map(Number);
  const [wakeH, wakeM] = wakeTime.split(":").map(Number);

  let sleepMinutes = sleepH * 60 + sleepM;
  let wakeMinutes = wakeH * 60 + wakeM;

  if (wakeMinutes < sleepMinutes) {
    wakeMinutes += 24 * 60;
  }

  return (wakeMinutes - sleepMinutes) / 60;
};

const addSleep = async (req, res) => {
  try {
    const { userId, sleepTime, wakeTime, date } = req.body;

    if (!userId || !sleepTime || !wakeTime || !date) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "All fields are required!!",
      });
    }

    const totalHours = calculateSleepHours(sleepTime, wakeTime);

    const sleep = await SleepModel.create({
      userId,
      sleepTime,
      wakeTime,
      date: new Date().toISOString().split("T")[0],
      totalHours,
    });
    return res.status(201).json({
      responseCode: "201",
      responseMessage: "Sleep data added successfully!!",
      data: sleep,
    });
  } catch (error) {
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server error!!",
    });
  }
};

const getSleepByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "userId is required!!",
      });
    }

    const logs = await SleepModel.find({ userId }).sort({ createdAt: -1 });

    const safeLogs = Array.isArray(logs) ? logs : [];

    const todayStr = new Date().toDateString();

    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toDateString();

    const todaySleepHours = safeLogs
      .filter(
        (l) =>
          l && l.createdAt && new Date(l.createdAt).toDateString() === todayStr,
      )
      .map((l) => Number(l.totalHours || 0))
      .reduce((sum, val) => sum + val, 0);

    const yesterdaySleepHours = safeLogs
      .filter(
        (l) =>
          l &&
          l.createdAt &&
          new Date(l.createdAt).toDateString() === yesterdayStr,
      )
      .map((l) => Number(l.totalHours || 0))
      .reduce((sum, val) => sum + val, 0);

    const totalSleepHours = safeLogs
      .map((l) => Number(l?.totalHours || 0))
      .reduce((sum, val) => sum + val, 0);

    const avgSleep =
      safeLogs.length > 0 ? totalSleepHours / safeLogs.length : 0;

    let trend = "stable";

    if (todaySleepHours > yesterdaySleepHours) trend = "up";
    else if (todaySleepHours < yesterdaySleepHours) trend = "down";

    let sleepStatus = "";

    if (todaySleepHours >= 7 && todaySleepHours <= 9) {
      sleepStatus = "Excellent 🟢";
    } else if (todaySleepHours >= 6) {
      sleepStatus = "Average 🟡";
    } else {
      sleepStatus = "Poor 🔴";
    }

    let aiMessage = "";

    if (todaySleepHours < 6) {
      aiMessage = "You are sleeping too less 😴 Try 7–9 hours";
    } else if (todaySleepHours < 7) {
      aiMessage = "Almost good 👍 Try improving to 7+ hours";
    } else if (todaySleepHours <= 9) {
      aiMessage = "Excellent sleep 🔥 Keep it consistent";
    } else {
      aiMessage = "Oversleeping ⚠️ Try maintaining balance";
    }

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Sleep data fetched successfully!!",
      data: {
        totalSleepHours: Number(totalSleepHours.toFixed(2)),
        avgSleep: Number(avgSleep.toFixed(2)),
        todaySleepHours: Number(todaySleepHours.toFixed(2)),
        yesterdaySleepHours: Number(yesterdaySleepHours.toFixed(2)),
        trend,
        sleepStatus,
        aiMessage,
        logs: safeLogs,
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
  addSleep,
  getSleepByUser,
};
