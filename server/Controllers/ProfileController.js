const ProfileModel = require("../Models/ProfileModel");

const createProfile = async (req, res) => {
  try {
    const { userId, age, gender, height, weight, goalWeight } = req.body;

    if (!userId || !age || !gender || !height || !weight || !goalWeight) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "All fields are required!!",
      });
    }

    const existing = await ProfileModel.findOne({ userId });

    if (existing) {
      return res.status(409).json({
        responseCode: "409",
        responseMessage: "Profile already exists!!",
      });
    }

    const profile = await ProfileModel.create({
      userId,
      age,
      gender,
      height,
      weight,
      goalWeight,
    });

    return res.status(201).json({
      responseCode: "201",
      responseMessage: "Profile created successfully!!",
      data: profile,
    });
  } catch (error) {
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server error!!",
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "userId is required!!",
      });
    }

    const profile = await ProfileModel.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        responseCode: "404",
        responseMessage: "Profile not found!!",
      });
    }

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Profile fetched successfully!!",
      data: profile,
    });
  } catch (error) {
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server error!!",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "userId is required!!",
      });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "No update data provided!!",
      });
    }

    const updatedProfile = await ProfileModel.findOneAndUpdate(
      { userId },
      { $set: req.body },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedProfile) {
      return res.status(404).json({
        responseCode: "404",
        responseMessage: "Profile not found!!",
      });
    }

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "Profile updated successfully!!",
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Server error!!",
    });
  }
};

module.exports = {
  createProfile,
  getProfile,
  updateProfile,
};
