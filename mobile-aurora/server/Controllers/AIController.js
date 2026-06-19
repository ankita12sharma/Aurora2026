const Water = require("../Models/HydrationModel");
const Sleep = require("../Models/SleepModel");
const Habit = require("../Models/HabitModel");
const Nutrition = require("../Models/NutritionModel");
const AIChat = require("../Models/AIModel");
const Profile = require("../Models/ProfileModel");
const Food = require("../Models/FoodModel");

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const askAuroraAI = async (message) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are Aurora AI, a professional health, fitness, and wellness coach.

User question:
${message}


Provide a well-structured response using this format:

📌 Key Insight:

1-2 concise sentences explaining the topic.
✅ Benefits:
List 4-6 important benefits when relevant.

💡 Recommendation:
Give practical and realistic advice.

✨ Aurora Note:
End with a short motivational professional note.

Rules:
- Keep the total response under 80 words.
- Use a professional and supportive tone.
- Provide evidence-based wellness guidance.
- Keep the response easy to understand.
- Do not diagnose medical conditions or claim to replace healthcare professionals.
`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.log("Gemini Chat ERROR:", error.message);
    return "🤖 AI temporarily unavailable.";
  }
};

const getHealthInsight = async (type, data) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are Aurora AI, an expert health, fitness, and wellness coach.

Your role:
- Provide professional, evidence-based health and fitness guidance.
- Explain topics in a structured and easy-to-understand manner.
- Maintain a supportive and professional tone.
- Give practical recommendations.
- Do not diagnose medical conditions or prescribe medications.
- If a serious health concern is mentioned, suggest consulting a healthcare professional.

User question:
${message}

Format your response as:

📌 Explanation:
Give a clear professional explanation.

💡 Recommendations:
Provide 2-4 practical tips.

Keep the response concise (100-150 words) and easy to understand.
`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.log("Gemini Health Insight ERROR:", error.message);
    return `📌 Insight:
Data recorded successfully.

💡 Recommendation:
Keep maintaining healthy habits.`;
  }
};
const foodDatabase = {
  chapati: { calories: 120, protein: 3, carbs: 24, fats: 1 },
  chapatis: { calories: 120, protein: 3, carbs: 24, fats: 1 },
  roti: { calories: 120, protein: 3, carbs: 24, fats: 1 },
  rotis: { calories: 120, protein: 3, carbs: 24, fats: 1 },
  paratha: { calories: 250, protein: 5, carbs: 30, fats: 10 },
  naan: { calories: 260, protein: 8, carbs: 40, fats: 7 },

  rice: { calories: 200, protein: 4, carbs: 45, fats: 0 },
  "brown rice": { calories: 180, protein: 4, carbs: 38, fats: 1 },
  biryani: { calories: 350, protein: 15, carbs: 45, fats: 12 },

  dal: { calories: 180, protein: 10, carbs: 25, fats: 2 },
  curry: { calories: 150, protein: 4, carbs: 15, fats: 8 },
  rajma: { calories: 220, protein: 13, carbs: 40, fats: 1 },
  chole: { calories: 240, protein: 12, carbs: 35, fats: 5 },
  sprouts: { calories: 100, protein: 8, carbs: 15, fats: 1 },

  milk: { calories: 150, protein: 8, carbs: 12, fats: 8 },
  curd: { calories: 100, protein: 6, carbs: 8, fats: 4 },
  yogurt: { calories: 100, protein: 6, carbs: 8, fats: 4 },
  paneer: { calories: 265, protein: 18, carbs: 6, fats: 20 },
  "green tea": {
    calories: 2,
    protein: 0,
    carbs: 0,
    fats: 0,
  },
  almonds: {
    calories: 170,
    protein: 6,
    carbs: 6,
    fats: 15,
  },
  peanuts: {
    calories: 160,
    protein: 7,
    carbs: 5,
    fats: 14,
  },

  tofu: {
    calories: 80,
    protein: 8,
    carbs: 2,
    fats: 5,
  },
  cheese: { calories: 110, protein: 7, carbs: 1, fats: 9 },

  egg: { calories: 70, protein: 6, carbs: 1, fats: 5 },
  eggs: { calories: 70, protein: 6, carbs: 1, fats: 5 },
  omelette: { calories: 150, protein: 10, carbs: 2, fats: 10 },

  fruit: { calories: 80, protein: 1, carbs: 20, fats: 0 },
  fruits: { calories: 80, protein: 1, carbs: 20, fats: 0 },
  banana: { calories: 105, protein: 1, carbs: 27, fats: 0 },
  apple: { calories: 95, protein: 0, carbs: 25, fats: 0 },
  orange: { calories: 62, protein: 1, carbs: 15, fats: 0 },
  mango: { calories: 135, protein: 1, carbs: 35, fats: 0 },

  vegetable: {
    calories: 50,
    protein: 2,
    carbs: 10,
    fats: 0,
  },

  vegetables: {
    calories: 50,
    protein: 2,
    carbs: 10,
    fats: 0,
  },

  salad: { calories: 50, protein: 2, carbs: 10, fats: 0 },
  cucumber: { calories: 15, protein: 1, carbs: 4, fats: 0 },
  tomato: { calories: 20, protein: 1, carbs: 4, fats: 0 },

  chicken: { calories: 250, protein: 30, carbs: 0, fats: 8 },
  fish: { calories: 220, protein: 25, carbs: 0, fats: 10 },

  tea: { calories: 40, protein: 1, carbs: 5, fats: 1 },
  chai: { calories: 40, protein: 1, carbs: 5, fats: 1 },
  coffee: { calories: 5, protein: 0, carbs: 1, fats: 0 },
  "cold coffee": { calories: 150, protein: 4, carbs: 20, fats: 5 },
  juice: { calories: 120, protein: 1, carbs: 28, fats: 0 },
  smoothie: { calories: 180, protein: 6, carbs: 30, fats: 4 },
  shake: { calories: 220, protein: 8, carbs: 35, fats: 6 },

  oats: { calories: 150, protein: 5, carbs: 27, fats: 3 },
  poha: { calories: 180, protein: 4, carbs: 35, fats: 3 },
  upma: { calories: 200, protein: 5, carbs: 30, fats: 6 },
  idli: { calories: 60, protein: 2, carbs: 12, fats: 0 },
  dosa: { calories: 170, protein: 4, carbs: 25, fats: 6 },
  pakora: {
    calories: 200,
    protein: 4,
    carbs: 20,
    fats: 10,
  },
  pakoda: {
    calories: 200,
    protein: 4,
    carbs: 20,
    fats: 10,
  },
  burger: { calories: 300, protein: 12, carbs: 35, fats: 12 },
  pizza: { calories: 280, protein: 12, carbs: 33, fats: 10 },
  "bread pizza": { calories: 250, protein: 8, carbs: 30, fats: 10 },
  sandwich: { calories: 250, protein: 10, carbs: 30, fats: 8 },
  sandwiches: { calories: 250, protein: 10, carbs: 30, fats: 8 },
  fries: { calories: 350, protein: 4, carbs: 45, fats: 17 },

  biscuits: { calories: 70, protein: 1, carbs: 10, fats: 3 },
  chips: { calories: 150, protein: 2, carbs: 15, fats: 9 },
  nuts: { calories: 170, protein: 6, carbs: 6, fats: 15 },
  samosa: {
    calories: 250,
    protein: 5,
    carbs: 30,
    fats: 12,
  },
  pakora: {
    calories: 200,
    protein: 4,
    carbs: 20,
    fats: 10,
  },
  maggi: {
    calories: 350,
    protein: 8,
    carbs: 50,
    fats: 14,
  },
  pasta: {
    calories: 300,
    protein: 10,
    carbs: 55,
    fats: 7,
  },
  icecream: {
    calories: 210,
    protein: 4,
    carbs: 25,
    fats: 11,
  },
};
const getNutritionInsight = (protein, calories, carbs, fats) => {
  let insight = [];
  let recommendation = [];

  if (calories < 300) {
    insight.push("Low calorie intake for a full meal.");
    recommendation.push("Try adding more energy foods like rice, roti, oats.");
  } else if (calories > 700) {
    insight.push("High calorie meal.");
    recommendation.push("Balance with lighter meals later in the day.");
  }

  if (protein < 10) {
    insight.push("Low protein intake.");
    recommendation.push("Add eggs, paneer, milk, yogurt or sprouts.");
  } else if (protein >= 20) {
    insight.push("Good protein intake.");
  }

  if (carbs > 80) {
    insight.push("High carbs load.");
    recommendation.push("Add fiber (salad, vegetables) to balance digestion.");
  }

  if (fats > 25) {
    insight.push("High fat intake.");
    recommendation.push("Reduce fried foods and oily items.");
  }

  if (insight.length === 0) {
    insight.push("Balanced meal 👍");
  }

  return {
    insight: insight.join(" "),
    recommendation:
      recommendation.join(" ") || "Keep maintaining balanced meals.",
  };
};

const getFoodRecommendation = (foods) => {
  const foodText = foods.join(" ").toLowerCase();

  let hasCarbs =
    foodText.includes("chapati") ||
    foodText.includes("roti") ||
    foodText.includes("rice") ||
    foodText.includes("bread") ||
    foodText.includes("oats");

  let hasProtein =
    foodText.includes("dal") ||
    foodText.includes("rajma") ||
    foodText.includes("chole") ||
    foodText.includes("paneer") ||
    foodText.includes("egg") ||
    foodText.includes("eggs") ||
    foodText.includes("chicken") ||
    foodText.includes("fish") ||
    foodText.includes("milk") ||
    foodText.includes("curd") ||
    foodText.includes("yogurt");

  let hasVegetables =
    foodText.includes("vegetable") ||
    foodText.includes("vegetables") ||
    foodText.includes("salad") ||
    foodText.includes("cucumber") ||
    foodText.includes("tomato") ||
    foodText.includes("sabji");

  let hasFruits =
    foodText.includes("fruit") ||
    foodText.includes("fruits") ||
    foodText.includes("apple") ||
    foodText.includes("banana") ||
    foodText.includes("orange") ||
    foodText.includes("mango");

  let hasFastFood =
    foodText.includes("pizza") ||
    foodText.includes("burger") ||
    foodText.includes("fries") ||
    foodText.includes("chips");

  let hasSweetSnack =
    foodText.includes("biscuits") ||
    foodText.includes("cold coffee") ||
    foodText.includes("icecream");

  if (hasCarbs && hasProtein && hasVegetables) {
    return `
📌 Insight:
This meal provides a good balance of carbohydrates, protein, and vegetables that support energy, muscle maintenance, and overall wellness.

💡 Recommendation:
Continue maintaining balanced meals with a variety of whole foods and adequate hydration.
`;
  }

  if (hasCarbs && hasVegetables && !hasProtein) {
    return `
📌 Insight:
Your meal provides energy from carbohydrates and beneficial vitamins and fiber from vegetables.

💡 Recommendation:
Consider adding a protein source like dal, paneer, eggs, curd, or lean meat to make your meal more balanced.
`;
  }

  if (hasCarbs && hasProtein && !hasVegetables) {
    return `
📌 Insight:
Your meal contains a good combination of energy and protein that supports daily activities and muscle health.

💡 Recommendation:
Adding vegetables or salad can improve fiber, vitamin, and mineral intake.
`;
  }

  if (hasFruits) {
    return `
📌 Insight:
Fruits provide natural sugars, fiber, vitamins, and antioxidants that support immunity and digestion.

💡 Recommendation:
Include a variety of seasonal fruits and combine them with nuts or yogurt for better fullness.
`;
  }

  if (hasFastFood || hasSweetSnack) {
    return `
📌 Insight:
This meal contains foods that may be higher in added sugars, refined carbohydrates, or unhealthy fats.

💡 Recommendation:
Enjoy them in moderation and balance your day with protein-rich foods, fruits, vegetables, and enough water.
`;
  }

  if (hasProtein) {
    return `
📌 Insight:
Your meal contains quality protein that supports muscle repair and overall body functions.

💡 Recommendation:
Pair protein-rich foods with vegetables and whole grains for a more complete meal.
`;
  }

  return `
📌 Insight:
Your meal contributes to your daily nutrition and energy needs.

💡 Recommendation:
Aim for a balanced plate containing protein, vegetables, whole grains, healthy fats, and adequate hydration.
`;
};
const detectIntent = (msg = "") => {
  const text = msg.toLowerCase().trim();

  if (/(progress|report|status|how am i|summary)/i.test(text)) {
    return "progress";
  }

  if (/(gain weight|increase weight|weight gain)/i.test(text)) {
    return "weight_gain";
  }

  if (
    /(lose weight|reduce weight|reduce my weight|fat loss|burn fat|belly fat)/i.test(
      text,
    )
  ) {
    return "weight_loss";
  }

  if (
    /(mental strength|mental health|stress|anxiety|focus|concentration)/i.test(
      text,
    )
  ) {
    return "mental_health";
  }

  if (/(immune|immunity)/i.test(text)) {
    return "immunity";
  }

  if (/(cholesterol|heart health)/i.test(text)) {
    return "cholesterol";
  }
  if (
    /(benefits of a balanced diet|balanced diet benefits|why is a balanced diet important)/i.test(
      text,
    )
  ) {
    return "balanced_diet_benefits";
  }
  if (/(eyesight|vision|eye health)/i.test(text)) {
    return "eyesight";
  }

  if (/(sugar|sugary)/i.test(text)) {
    return "sugar";
  }

  if (/(how much water should i drink|water intake|daily water)/i.test(text)) {
    return "water_requirement";
  }

  if (/(how much sleep|required sleep|sleep required)/i.test(text)) {
    return "sleep_requirement";
  }
  if (
    /(water|hydration)/i.test(text) &&
    /(\d+)\s*(ml|liter|litre|l)/i.test(text)
  ) {
    return "water";
  }

  if (
    /(i slept|i sleep|i napped|i took a nap|went to bed|woke up)/i.test(text)
  ) {
    return "sleep";
  }

  const hasActivityVerb =
    /\b(did|done|completed|finished|went for|trained|worked out|exercised)\b/i.test(
      text,
    );

  const hasActivityType =
    /\b(walk|run|workout|exercise|gym|yoga|meditation|cycling|swimming|dance|sport)\b/i.test(
      text,
    );

  const hasAction =
    /\b(i did|did|completed|finished|went for|performed|practiced|played|done)\b/i.test(
      text,
    );

  const hasActivity =
    /\b(walk|walking|run|running|workout|exercise|gym|yoga|meditation|cycling|swimming|dance|sport)\b/i.test(
      text,
    );

  if (hasAction && hasActivity) {
    return "habit";
  }
  if (
    /(activity|activities|exercise|workout|stay fit|fitness|physical activity|how to stay fit|recommended activities)/i.test(
      text,
    )
  ) {
    return "fitness_advice";
  }
  if (
    /(healthy food|diet plan|food suggestion|what should i eat|healthy diet|weight loss food|meal plan|healthy meals|fit food|healthy eating|suggest food|food items)/i.test(
      text,
    )
  ) {
    return "diet_plan";
  }
  const isStrongLog =
    /(\bi ate\b|\bi had\b|\bi slept\b|\bi walked\b|\bi ran\b|\bi drank\b|\blog\b)/i.test(
      msg,
    );
  if (/(i ate|i had|breakfast|lunch|dinner|snack|meal)/i.test(text)) {
    return "nutrition";
  }

  if (
    /(i drank|i had).*(coffee|cold coffee|tea|juice|milk|smoothie|shake)/i.test(
      text,
    )
  ) {
    return "beverage";
  }

  return "chat";
};
const extractNumber = (text) => {
  const match = text.match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[0]) : null;
};
const extractWaterAmount = (text) => {
  const match = text.match(/(\d+(\.\d+)?)\s*(ml|liter|litre|l)/i);

  if (!match) return null;

  let amount = parseFloat(match[1]);
  const unit = match[3].toLowerCase();

  if (unit === "l" || unit === "liter" || unit === "litre") {
    amount *= 1000;
  }

  return amount;
};
const extractMinutes = (text) => {
  const match = text.match(/(\d+)\s*(min|mins|minute|minutes)/i);
  return match ? parseInt(match[1]) : null;
};

const aiAgent = async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "userId and message are required!!",
      });
    }

    let msg = message.toLowerCase();
    const intent = detectIntent(msg);

    const isGeneralHealthQuery = (text) => {
      return (
        !/(water|sleep|ate|had|logged|run|walk|gym|ml|liter|\d+)/i.test(text) &&
        /(health|fitness|diet|nutrition|tips|exercise|workout|lifestyle)/i.test(
          text,
        )
      );
    };

    const today = new Date().toISOString().split("T")[0];

    let responseMessage = "";
    let action = null;

    await AIChat.create({
      userId,
      role: "user",
      message,
    }).catch(() => {});

    switch (intent) {
      case "water": {
        const ml = extractWaterAmount(message) || 250;

        await Water.create({
          userId,
          amount: ml,
          // date: new Date(),
        });

        const waterAdvice = await getHealthInsight(
          "hydration",
          `Water consumed: ${ml} ml`,
        );

        responseMessage = `
💧 Water Logged

Amount: ${ml} ml

${waterAdvice}
`;

        action = "water_logged";

        break;
      }

      case "sleep": {
        let logDate = new Date();

        if (msg.includes("yesterday")) {
          logDate.setDate(logDate.getDate() - 1);
        }

        logDate.setHours(0, 0, 0, 0);

        const dateKey = logDate.toISOString().split("T")[0];
        let sleepTime = null;
        let wakeTime = null;
        let hours = null;
        let isNap = false;

        const timeMatch = msg.match(
          /(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?)\s*(?:to|-)\s*(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?)/i,
        );
        if (timeMatch) {
          let [
            ,
            startHour,
            startMin = "00",
            startPeriod,
            endHour,
            endMin = "00",
            endPeriod,
          ] = timeMatch;

          sleepTime = `${startHour}:${startMin.padStart(2, "0")} ${startPeriod.toUpperCase()}`;
          wakeTime = `${endHour}:${endMin.padStart(2, "0")} ${endPeriod.toUpperCase()}`;

          startHour = parseInt(startHour);
          startMin = parseInt(startMin);
          endHour = parseInt(endHour);
          endMin = parseInt(endMin);

          if (startPeriod.toLowerCase() === "pm" && startHour !== 12)
            startHour += 12;
          if (startPeriod.toLowerCase() === "am" && startHour === 12)
            startHour = 0;

          if (endPeriod.toLowerCase() === "pm" && endHour !== 12) endHour += 12;
          if (endPeriod.toLowerCase() === "am" && endHour === 12) endHour = 0;

          const startMinutes = startHour * 60 + startMin;
          let endMinutes = endHour * 60 + endMin;

          if (endMinutes <= startMinutes) {
            endMinutes += 24 * 60;
          }

          hours = (endMinutes - startMinutes) / 60;
        }

        if (hours === null) {
          const minMatch = msg.match(/(\d+)\s*(min|mins|minute|minutes)/i);

          if (minMatch) {
            hours = parseInt(minMatch[1]) / 60;
            isNap = true;
          }
        }

        if (hours === null) {
          const hrMatch = msg.match(/(\d+(\.\d+)?)\s*(h|hr|hrs|hour|hours)/i);

          if (hrMatch) {
            hours = parseFloat(hrMatch[1]);
          }
        }

        if (hours === null || isNaN(hours) || hours <= 0) {
          hours = 0.5;
          isNap = true;
        }

        const totalHours = Number(hours.toFixed(2));

        const updateData = {
          totalHours,
          updatedAt: new Date(),
        };

        if (sleepTime) {
          updateData.sleepTime = sleepTime;
        }

        if (wakeTime) {
          updateData.wakeTime = wakeTime;
        }

        await Sleep.findOneAndUpdate(
          { userId, date: dateKey },
          { $set: updateData },
          {
            upsert: true,
            new: true,
          },
        );

        let sleepSummary = "";

        if (isNap || totalHours < 1.5) {
          sleepSummary = `
😴 Nap Analysis

⏳ Duration: ${Math.round(totalHours * 60)} minutes

📌 Insight:
A short nap can help improve alertness, reduce temporary fatigue, and enhance focus during the day.

💡 Recommendation:
A 10–30 minute power nap is generally considered ideal for boosting energy without affecting nighttime sleep.
`;
        } else {
          let sleepAdvice = "";

          if (totalHours < 6) {
            sleepAdvice = `
📌 Insight:
Your sleep duration is below the recommended range. Consistently getting too little sleep may impact your energy, concentration, mood, and overall health.

💡 Recommendation:
Aim for 7–9 hours of quality sleep each night. Try maintaining a regular bedtime, reducing screen time before sleep, and creating a comfortable sleep environment.
`;
          } else if (totalHours < 7) {
            sleepAdvice = `
📌 Insight:
Your sleep duration is slightly below the ideal range. Getting a little more sleep may improve recovery, focus, and daily performance.

💡 Recommendation:
Try to consistently achieve 7–9 hours of sleep to support your physical and mental well-being.
`;
          } else if (totalHours <= 9) {
            sleepAdvice = `
📌 Insight:
Excellent! Your sleep duration falls within the recommended range for most adults. Adequate sleep supports recovery, memory, immune function, and overall wellness.

💡 Recommendation:
Continue maintaining a consistent sleep schedule and prioritize healthy sleep habits.
`;
          } else {
            sleepAdvice = `
📌 Insight:
Your sleep duration is longer than the typical recommended range. Occasional longer sleep may aid recovery, but regularly oversleeping can sometimes indicate poor sleep quality or other factors.

💡 Recommendation:
Maintain a consistent sleep routine. If excessive sleep becomes frequent or is accompanied by persistent tiredness, consider consulting a healthcare professional.
`;
          }

          sleepSummary = `
😴 Sleep Analysis

🛌 Sleep Time: ${sleepTime || "Not provided"}
⏰ Wake Time: ${wakeTime || "Not provided"}
⏳ Total Sleep: ${totalHours} hours

${sleepAdvice}
`;
        }

        responseMessage = sleepSummary;
        action = "sleep_logged";

        break;
      }

      case "habit": {
        const minutes = extractMinutes(message);

        const today = new Date().toISOString().split("T")[0];

        const existingHabit = await Habit.findOne({
          userId,
          habitName: message.toLowerCase(),
        });

        if (existingHabit) {
          responseMessage = `
      💪 Habit Already Logged

      You have already completed this habit today.
      `;
          action = "habit_already_logged";
          break;
        }

        await Habit.create({
          userId,
          habitName: message.toLowerCase(),
          lastCompletedDate: new Date(),
          streakCount: 1,
        });

        const habitAdvice = await getHealthInsight(
          "exercise/habit",
          `
      Activity: ${message}
      Duration: ${minutes || 0} minutes
      `,
        );

        responseMessage = `
      💪 Habit Logged Successfully

      🏃 Activity: ${message}
      ⏱ Duration: ${minutes || 0} minutes

      ${habitAdvice}
      `;

        action = "habit_logged";

        break;
      }
      case "weight_gain": {
        responseMessage = `
🌟 Aurora Healthy Weight Gain Guide

💡 Key Insight:
Healthy weight gain focuses on increasing muscle mass and improving nutrition.

✅ Recommendations:
• Increase calories gradually
• Eat protein-rich foods like eggs, paneer, milk, chicken, and dal
• Include healthy fats such as nuts and seeds
• Strength train 3–4 times per week
• Eat frequent balanced meals

🎯 Today's Goal:
Add one extra protein-rich snack.

✨ Aurora Note:
Focus on strength and muscle growth, not only the number on the scale.
`;

        action = "weight_gain_advice";
        break;
      }

      case "mental_health": {
        responseMessage = `
🧠 Aurora Mental Wellness Guide

💡 Key Insight:
Mental wellness improves through consistent healthy habits.

✅ Recommendations:
• Practice meditation or deep breathing
• Exercise regularly
• Sleep 7–9 hours daily
• Take breaks from excessive screen time
• Set small achievable goals

🎯 Today's Goal:
Spend 10 minutes focusing on mindful breathing.

✨ Aurora Note:
Small daily habits can improve resilience and focus.
`;

        action = "mental_health_advice";
        break;
      }

      case "immunity": {
        responseMessage = `
🛡️ Aurora Immunity Guide

💡 Key Insight:
Immunity is supported by proper nutrition, sleep, movement, and stress management.

✅ Recommendations:
• Eat Vitamin C rich fruits
• Consume enough protein
• Sleep 7–9 hours
• Exercise regularly
• Stay hydrated

🎯 Today's Goal:
Eat a fruit and complete your daily water target.

✨ Aurora Note:
Consistency is the key to long-term health.
`;

        action = "immunity_advice";
        break;
      }

      case "cholesterol": {
        responseMessage = `
❤️ Aurora Heart Health Guide

💡 Key Insight:
A heart-friendly lifestyle can help maintain healthy cholesterol levels.

✅ Recommendations:
• Increase fiber intake
• Eat oats, fruits, vegetables, and nuts
• Limit fried and processed foods
• Stay physically active
• Maintain a healthy weight

🎯 Today's Goal:
Replace one unhealthy snack with a healthier option.

✨ Aurora Note:
Small choices every day contribute to better heart health.
`;

        action = "cholesterol_advice";
        break;
      }
      case "balanced_diet_benefits": {
        responseMessage = `
🥗 Aurora Balanced Diet Benefits

💡 Key Insight:
A balanced diet provides essential nutrients that help your body function properly and maintain overall health.

✅ Benefits:
• Provides steady energy throughout the day
• Supports a strong immune system
• Helps maintain a healthy body weight
• Improves digestion and gut health
• Supports muscle growth and tissue repair
• Keeps bones and teeth strong
• Supports heart health
• Improves concentration and mood

🎯 Today's Goal:
Include a healthy combination of protein, whole grains, fruits, vegetables, and healthy fats in your meals today.

✨ Aurora Note:
A balanced diet is a long-term investment in your health and well-being.
`;

        action = "balanced_diet_benefits";
        break;
      }
      case "eyesight": {
        responseMessage = `
👁️ Aurora Eye Health Guide

💡 Key Insight:
Good vision is supported by nutrition, rest, and reduced eye strain.

✅ Recommendations:
• Follow the 20-20-20 screen rule
• Eat carrots, spinach, and citrus fruits
• Stay hydrated
• Get adequate sleep
• Avoid prolonged screen exposure

🎯 Today's Goal:
Take a 20-second eye break every 20 minutes.

✨ Aurora Note:
Protecting your eyes today supports healthy vision in the future.
`;

        action = "eyesight_advice";
        break;
      }

      case "sugar": {
        responseMessage = `
🍭 Aurora Sugar Awareness Guide

💡 Key Insight:
Too much added sugar may affect energy balance and overall health.

✅ Recommendations:
• Reduce sugary drinks
• Prefer fruits over sweets
• Check food labels
• Limit processed foods

🎯 Today's Goal:
Replace one sugary snack with a healthier alternative.

✨ Aurora Note:
Small reductions in added sugar can make a big difference.
`;

        action = "sugar_advice";
        break;
      }

      case "water_requirement": {
        responseMessage = `
💧 Aurora Hydration Guide

💡 Key Insight:
Most adults generally need around 2–3 liters of fluids per day, depending on their activity and environment.

✅ Recommendations:
• Drink water throughout the day
• Increase intake after exercise
• Start your morning with a glass of water
• Monitor signs of hydration

🎯 Today's Goal:
Try reaching 8–12 glasses of water today.
`;

        action = "water_advice";
        break;
      }

      case "sleep_requirement": {
        responseMessage = `
😴 Aurora Sleep Guide

💡 Key Insight:
Most adults need 7–9 hours of quality sleep for recovery and performance.

✅ Recommendations:
• Keep a regular bedtime
• Avoid caffeine close to bedtime
• Reduce screen time before sleeping
• Create a calming night routine

🎯 Today's Goal:
Plan for at least 7.5 hours of sleep tonight.
`;

        action = "sleep_advice";
        break;
      }
      case "fitness_advice": {
        responseMessage = `
🏃 Aurora Fitness Guide

💡 Key Insight:
Regular physical activity improves heart health, strength, flexibility, and mental well-being.

✅ Recommended Activities:
• Walking or jogging for 30–45 minutes
• Strength training 2–3 times per week
• Yoga or stretching for flexibility
• Cycling, swimming, or dancing for cardio
• Daily movement and reducing long sitting periods

🎯 Today's Goal:
Complete at least 30 minutes of any activity you enjoy.

✨ Aurora Note:
Consistency is more important than intensity. Small daily efforts create long-term fitness.
`;

        action = "fitness_advice";
        break;
      }

      case "diet_plan": {
        responseMessage = `
🥗 Aurora Healthy Diet Plan

🍳 Breakfast:
• Oats, eggs, milk, fruit

🍛 Lunch:
• Roti or rice with dal, vegetables, and protein

🍎 Snacks:
• Fruits, nuts, or yogurt

🍲 Dinner:
• Vegetables with lean protein and a lighter meal

💡 Key Insight:
Balanced meals provide energy and support long-term health.

✅ Recommendations:
• Add protein to every meal
• Eat colorful fruits and vegetables
• Drink enough water
• Avoid excessive processed foods

🎯 Today's Goal:
Include one fruit and one protein-rich item in your meals.
`;

        action = "diet_plan_advice";
        break;
      }
      case "weight_loss": {
        responseMessage = `
🔥 Aurora Weight Loss Guide

🥗 Diet:
• Eat protein-rich foods like eggs, paneer, dal, fish, or chicken
• Reduce excess sugar, fried foods, and soft drinks
• Control portion sizes

🏃 Activity:
• Walk or exercise for 30–45 minutes daily
• Aim for 7,000–10,000 steps

💧 Hydration:
• Drink 2–3 liters of water daily

😴 Sleep:
• Maintain 7–9 hours of quality sleep

📌 Key Rule:
A sustainable calorie deficit supports healthy fat loss.

✨ Aurora Note:
Consistency beats extreme dieting. Build habits you can maintain.
`;

        action = "weight_loss_advice";
        break;
      }

      case "beverage": {
        const drink = message.toLowerCase();

        let insight = "";
        let recommendation = "";

        if (drink.includes("coffee")) {
          insight =
            "Coffee can improve alertness but may affect sleep when consumed late.";
          recommendation =
            "Limit coffee during evening hours and balance it with water intake.";
        } else if (drink.includes("tea")) {
          insight =
            "Tea can be part of a healthy routine when consumed in moderation.";
          recommendation =
            "Avoid too much added sugar and maintain proper hydration.";
        } else if (drink.includes("milk")) {
          insight =
            "Milk provides protein and calcium that support muscles and bones.";
          recommendation = "A good option as part of a balanced diet.";
        } else {
          insight = "Beverage recorded successfully.";
          recommendation =
            "Prefer drinks with less added sugar and stay hydrated.";
        }

        await Food.create({
          userId,
          foods: drink ? [drink] : ["unknown beverage"],
          rawMessage: message || "",
          mealType: "beverage",
          date: new Date(),
          type: "log",
        });
        responseMessage = `
☕ Beverage Logged

📌 Insight:
${insight}

💡 Recommendation:
${recommendation}
`;

        action = "beverage_logged";
        break;
      }
      case "nutrition": {
        try {
          const normalizedMsg = message
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, " ");
          let mealType = null; // default fallback

          const text = normalizedMsg;

          if (/\bbreakfast\b/.test(text)) {
            mealType = "breakfast";
          } else if (/\blunch\b/.test(text)) {
            mealType = "lunch";
          } else if (/\bdinner\b/.test(text)) {
            mealType = "dinner";
          } else if (
            /(coffee|tea|chips|biscuits|cookies|juice|cold coffee|snacks|namkeen|fries|pakoda|pakora|fruit|fruits|apple|banana|orange|mango|nuts|almonds|peanuts|yogurt|curd)/i
          ) {
            mealType = "snack";
          } else if (/(morning|early morning)/i.test(text)) {
            mealType = "breakfast";
          } else if (/(afternoon|noon|midday)/i.test(text)) {
            mealType = "lunch";
          } else if (/(evening)/i.test(text)) {
            mealType = "snack";
          } else if (/(night)/i.test(text)) {
            mealType = "dinner";
          }
          let totalCalories = 0;
          let totalProtein = 0;
          let totalCarbs = 0;
          let totalFats = 0;

          let foodDetails = [];

          for (const food in foodDatabase) {
            const foodRegex = new RegExp(`\\b${food}\\b`, "i");

            if (foodRegex.test(normalizedMsg)) {
              let quantity = 1;

              const quantityMatch = normalizedMsg.match(
                new RegExp(
                  `(\\d+)\\s*(plate|plates|piece|pieces|bowl|bowls)?\\s*${food}`,
                  "i",
                ),
              );

              if (quantityMatch) {
                quantity = parseInt(quantityMatch[1]);
              }

              const nutrition = foodDatabase[food];

              foodDetails.push({
                food,
                quantity,
              });

              totalCalories += nutrition.calories * quantity;
              totalProtein += nutrition.protein * quantity;
              totalCarbs += nutrition.carbs * quantity;
              totalFats += nutrition.fats * quantity;
            }
          }

          if (foodDetails.length === 0) {
            await Food.create({
              userId,
              foods: ["unknown_food"],
              mealName: message,
              rawMessage: message,
              mealType: mealType || "snack",
              date: new Date(),
              type: "unknown_log",
            });

            const aiResponse = await askAuroraAI(
              `The user ate: ${message}.
    Explain its nutritional value and give health advice.`,
            );

            responseMessage = `
🥗 Meal Recorded

🍽️ Food:
${message}

${aiResponse}
`;

            action = "unknown_food_ai_analysis";

            break;
          }

          const mealName =
            foodDetails.length > 0
              ? foodDetails.map((i) => `${i.quantity} ${i.food}`).join(", ")
              : "Unknown meal";

          const aiFeedback = getFoodRecommendation(
            foodDetails.map((item) => item.food),
          );

          await Food.create({
            userId,
            foods: foodDetails.map((item) => item.food),
            mealName,
            rawMessage: message,
            mealType,
            date: new Date(),
            type: "log",
          });

          await Nutrition.create({
            userId,
            mealType: mealType || "snack",
            date: new Date(),

            mealName: mealName || message,

            foods: foodDetails.map((i) => ({
              food: i.food,
              quantity: i.quantity || 1,
            })),

            calories: Number(totalCalories) || 0,
            protein: Number(totalProtein) || 0,
            carbs: Number(totalCarbs) || 0,
            fats: Number(totalFats) || 0,
          });
          responseMessage = `
🥗 ${mealType.toUpperCase()} Logged

🍽️ Meal:
${mealName}

🔥 Calories: ${totalCalories} kcal
💪 Protein: ${totalProtein} g
🌾 Carbs: ${totalCarbs} g
🥑 Fats: ${totalFats} g

${aiFeedback}
`;

          action = "nutrition_logged";

          break;
        } catch (err) {
          console.log("Nutrition Error:", err);

          responseMessage = `
❌ Unable to log your meal right now.
Please try again.
    `;

          action = "nutrition_error";

          await AIChat.create({
            userId,
            role: "assistant",
            message: responseMessage,
            intent: "nutrition",
            action,
            metadata: {},
          }).catch(() => {});

          break;
        }
      }

      case "progress": {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const waterLogs = await Water.find({
          userId,
          createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        }).catch(() => []);

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const sleepDate = yesterday.toISOString().split("T")[0];

        const sleepLogs = await Sleep.find({
          userId,
          date: sleepDate,
        }).catch(() => []);

        const habitLogs = await Habit.find({
          userId,
          lastCompletedDate: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        });
        const mealLogs = await Nutrition.find({
          userId,
          date: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        }).catch(() => []);
        const totalCalories = mealLogs.reduce(
          (sum, meal) => sum + (meal.calories || 0),
          0,
        );

        const totalProtein = mealLogs.reduce(
          (sum, meal) => sum + (meal.protein || 0),
          0,
        );
        const totalWater = waterLogs.reduce(
          (sum, item) => sum + (item.amount || 0),
          0,
        );

        const totalSleep = sleepLogs.reduce(
          (sum, item) => sum + (item.totalHours || 0),
          0,
        );

        responseMessage = `
📊 Aurora Daily Progress

💧 Water: ${totalWater} ml
😴 Sleep: ${totalSleep} hours
💪 Habits Completed: ${habitLogs.length}
🥗 Meals Logged: ${mealLogs.length}

🔥 Total Calories: ${totalCalories} kcal
💪 Total Protein: ${totalProtein} g

📌 Insight:
${
  totalWater < 2000
    ? "Your hydration is below the usual daily target."
    : "Great hydration consistency today."
}

${
  totalSleep < 7
    ? "Try improving your sleep duration for better recovery."
    : "Your sleep duration looks good."
}

💡 Recommendation:
Keep balancing nutrition, movement, hydration, and recovery to achieve your goals. 🔥
`;
        action = "progress_generated";
        break;
      }

      case "chat":
      default: {
        try {
          responseMessage = await askAuroraAI(message);

          action = "ai_generated";
        } catch (error) {
          responseMessage = `
🤖 Aurora AI

I am currently unable to generate a response.

Please try again in a few moments.
`;

          action = "ai_error";
        }

        break;
      }
    }

    await AIChat.create({
      userId,
      role: "assistant",
      message: responseMessage,
      action,
    }).catch(() => {});

    return res.status(200).json({
      responseCode: "200",
      responseMessage: "AI response generated successfully!!",
      intent,
      action,
      data: {
        reply: responseMessage,
      },
    });
  } catch (error) {
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Internal server error!!",
    });
  }
};
module.exports = { aiAgent };
