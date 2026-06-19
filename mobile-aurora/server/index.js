const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const app = express();
const UserRouter = require("./Routes/userRoute");
const HydrationRouter = require("./Routes/hydrationRoute");
const SleepRouter = require("./Routes/sleepRoute");
const HabitRouter = require("./Routes/habitRoute");
const NutritionRouter = require("./Routes/nutritionRoute");
const ProfileRouter = require("./Routes/profileRoute");
const AIRouter = require("./Routes/aiRoute");
const PORT = 8084;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to database successfully!!");
  })
  .catch((err) => {
    console.error("Error in connecting to database!!", err);
  });

app.use(bodyParser.json());
app.use(cors());

app.use("/", UserRouter);
app.use("/", HydrationRouter);
app.use("/", SleepRouter);
app.use("/", HabitRouter);
app.use("/", NutritionRouter);
app.use("/", ProfileRouter);
app.use("/", AIRouter);

app.listen(PORT, () => {
  console.log(`Listening to server on port ${PORT}`);
});
