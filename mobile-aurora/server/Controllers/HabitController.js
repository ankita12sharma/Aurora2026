const HabitModel = require("../Models/HabitModel");

const getTodayDate = () => {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });
};
const addHabit = async (req, res) => {
  try {
    const { userId, habitName } = req.body;

    if (!userId || !habitName) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "userId and habitName required!!",
      });
    }

    const habit = await HabitModel.create({
      userId,
      habitName,
      streakCount: 0,
      lastCompletedDate: null,
      date: getTodayDate(),
    });

    return res.status(201).json({
      responseCode: "201",
      responseMessage: "Habit added successfully!!",
      data: habit,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server Error!!",
    });
  }
};

const getHabitsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "userId is required!!",
      });
    }

    const today = getTodayDate();

    const habits = await HabitModel.find({ userId });

    const updatedHabits = habits.map((h) => {
      const lastDate = h.lastCompletedDate
        ? new Date(h.lastCompletedDate).toLocaleDateString("en-CA", {
            timeZone: "Asia/Kolkata",
          })
        : null;
      return {
        ...h.toObject(),
        completed: lastDate === today,
      };
    });

    const total = updatedHabits.length;
    const completed = updatedHabits.filter((h) => h.completed).length;

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Habits fetched successfully!!",
      data: {
        habits: updatedHabits,
        summary: {
          total,
          completed,
          completionRate: total ? Math.round((completed / total) * 100) : 0,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server Error!!",
    });
  }
};

const toggleHabit = async (req, res) => {
  try {
    const { habitId } = req.params;

    if (!habitId) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "habitId required!!",
      });
    }

    const habit = await HabitModel.findById(habitId);

    if (!habit) {
      return res.status(404).json({
        responseCode: "404",
        responseMessage: "Habit not found!!",
      });
    }

    const today = getTodayDate();

    const lastDate = habit.lastCompletedDate
      ? new Date(habit.lastCompletedDate).toLocaleDateString("en-CA", {
          timeZone: "Asia/Kolkata",
        })
      : null;
    if (lastDate === today) {
      habit.lastCompletedDate = null;
      if (habit.streakCount > 0) {
        habit.streakCount -= 1;
      }
    } else {
      habit.lastCompletedDate = new Date();
      habit.streakCount = (habit.streakCount || 0) + 1;
    }

    await habit.save();

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Habit updated successfully!!",
      data: habit,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server Error!!",
    });
  }
};

const deleteHabit = async (req, res) => {
  try {
    const { habitId } = req.params;

    if (!habitId) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "habitId required!!",
      });
    }

    await HabitModel.findByIdAndDelete(habitId);

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Habit deleted successfully!!",
    });
  } catch (error) {
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server Error!!",
    });
  }
};

module.exports = {
  addHabit,
  getHabitsByUser,
  toggleHabit,
  deleteHabit,
};
