const UserModel = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SleepModel = require("../Models/SleepModel");
const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "All fields are required!!",
      });
    }
    const userData = await UserModel.findOne({ email });
    if (userData) {
      return res.status(409).json({
        responseCode: "409",
        responseMessage: "User already exist,you can login!!",
      });
    }
    const usermodel = new UserModel({ name, email, password });
    usermodel.password = await bcrypt.hash(password, 10);
    await usermodel.save();

    res.status(201).json({
      responseCode: "201",
      responseMessage: "Signup successful!!",
      userId: usermodel._id,
    });
  } catch (err) {
    res.status(500).json({
      responseCode: "500",
      responseMessage: "Error in signing up!!",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "All fields are required!!",
      });
    }
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        responseCode: "404",
        responseMessage: "User not found!!",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        responseCode: "401",
        responseMessage: "Invalid email or password!!",
      });
    }
    const token = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_TOKEN,
      { expiresIn: "24h" },
    );
    res.status(200).json({
      responseCode: "200",
      responseMessage: "Login successful!!",
      token,
      userId: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({
      responseCode: "500",
      responseMessage: "Error in logging in!!",
    });
  }
};
const completeOnboarding = async (req, res) => {
  try {
    let { userId, age, gender, height, weight, wakeTime, sleepTime, goals } =
      req.body;

    if (!userId) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "User ID is required!!",
      });
    }

    const cleanString = (v) => (typeof v === "string" ? v.trim() : v);

    age = Number(age);
    gender = cleanString(gender);
    height = Number(height);
    weight = Number(weight);
    wakeTime = cleanString(wakeTime);
    sleepTime = cleanString(sleepTime);
    goals = Array.isArray(goals) ? goals : [];

    if (!age || !gender || !height || !weight || !wakeTime || !sleepTime) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "All onboarding fields are required!!",
      });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        responseCode: "404",
        responseMessage: "User not found!!",
      });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        age,
        gender,
        height,
        weight,
        wakeTime,
        sleepTime,
        goals,
        onboardingCompleted: true,
      },
      { new: true, runValidators: true },
    );

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

    const totalHours = calculateSleepHours(sleepTime, wakeTime);

    await SleepModel.create({
      userId,
      sleepTime,
      wakeTime,
      totalHours,
      date: new Date().toISOString().split("T")[0],
    });

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Onboarding completed successfully!!",
      user: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Error in creating record!!",
    });
  }
};
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await UserModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        responseCode: "404",
        responseMessage: "User not found!!",
      });
    }

    return res.status(200).json({
      responseMessage: "Profile fetched successfully!!",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Error in fetching record!!",
    });
  }
};

module.exports = { signupUser, loginUser, completeOnboarding, getUserProfile };
