import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  useGetTodayNutritionQuery,
  useGetNutritionByUserQuery,
} from "../redux/nutritionSlice";

const NutritionScreen = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const id = await AsyncStorage.getItem("userId");
      if (id) {
        setUserId(id.trim());
      }
    };

    getUser();
  }, []);

  const skip = !userId;

  useGetTodayNutritionQuery(userId, { skip });

  const {
    data: nutritionData,
    isLoading,
    isFetching,
  } = useGetNutritionByUserQuery(userId, { skip });

  const allMeals = nutritionData?.data || [];
  const todayStr = new Date().toDateString();

  const nutritionList = useMemo(() => {
    return allMeals.filter((item) => {
      if (!item?.date) return false;
      return new Date(item.date).toDateString() === todayStr;
    });
  }, [allMeals]);

  const summary = useMemo(() => {
    return nutritionList.reduce(
      (acc, item) => ({
        calories: acc.calories + Number(item?.calories || 0),
        protein: acc.protein + Number(item?.protein || 0),
        carbs: acc.carbs + Number(item?.carbs || 0),
        fats: acc.fats + Number(item?.fats || 0),
      }),
      {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
      },
    );
  }, [nutritionList]);

  const insight = useMemo(() => {
    if (nutritionList.length === 0) {
      return null;
    }

    let messages = [];

    if (summary.calories < 1000) {
      messages.push(
        "⚠️ Your energy intake is low today. Add balanced meals with healthy carbohydrates and proteins.",
      );
    } else if (summary.calories > 2500) {
      messages.push(
        "🔥 Your calorie intake is high today. Pay attention to portions and choose nutritious foods.",
      );
    } else {
      messages.push("✅ Your calorie intake looks balanced today.");
    }

    if (summary.protein < 50) {
      messages.push(
        "💪 Protein is low. Include eggs, paneer, dal, chicken, fish, milk, or sprouts.",
      );
    } else {
      messages.push("💪 Good protein intake supporting muscle health.");
    }

    if (summary.carbs > 250) {
      messages.push(
        "🌾 Carbohydrate intake is high. Add more vegetables and protein to maintain balance.",
      );
    } else if (summary.carbs < 100) {
      messages.push(
        "🌾 Carbohydrate intake is low. Include whole grains, fruits, or other healthy carb sources.",
      );
    }

    if (summary.fats > 70) {
      messages.push(
        "🥑 Fat intake is high. Reduce fried and heavily processed foods.",
      );
    }

    const foods = nutritionList
      .flatMap((item) => item.foods || [])
      .join(" ")
      .toLowerCase();

    const hasFruit = /(apple|banana|orange|mango|fruit|fruits)/.test(foods);

    const hasVegetables = /(vegetable|vegetables|salad|cucumber|tomato)/.test(
      foods,
    );

    if (!hasFruit) {
      messages.push(
        "🍎 Try adding fruits to improve your vitamin and fiber intake.",
      );
    }

    if (!hasVegetables) {
      messages.push(
        "🥗 Add vegetables or salad for better fiber and micronutrients.",
      );
    }

    return messages.join("\n\n");
  }, [summary, nutritionList]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🥗 Nutrition</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Today's Summary</Text>

        <Text style={styles.summaryText}>
          🔥 Calories: {summary.calories} kcal
        </Text>

        <Text style={styles.summaryText}>💪 Protein: {summary.protein} g</Text>

        <Text style={styles.summaryText}>🌾 Carbs: {summary.carbs} g</Text>

        <Text style={styles.summaryText}>🥑 Fats: {summary.fats} g</Text>
      </View>

      <Text style={styles.sectionTitle}>Today's Meals</Text>

      {nutritionList.length === 0 ? (
        <View style={styles.mealCard}>
          <Text style={styles.mealText}>No meals logged today 🍽️</Text>
        </View>
      ) : (
        nutritionList.map((item) => (
          <View key={item._id} style={styles.mealCard}>
            <Text style={styles.mealType}>
              🍽 {item?.mealType?.toUpperCase() || "MEAL"}
            </Text>

            <Text style={styles.mealName}>
              {(
                item?.mealName ||
                item?.foods?.join(", ") ||
                "Food not available"
              ).replace(/^\d+\.?\s*/, "")}
            </Text>

            <Text style={styles.info}>
              🔥 Calories: {item?.calories || 0} kcal
            </Text>

            <Text style={styles.info}>💪 Protein: {item?.protein || 0} g</Text>

            <Text style={styles.info}>🌾 Carbs: {item?.carbs || 0} g</Text>

            <Text style={styles.info}>🥑 Fats: {item?.fats || 0} g</Text>
          </View>
        ))
      )}

      {insight && (
        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>Aurora Insight ✨</Text>

          <Text style={styles.insightText}>{insight}</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default NutritionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FB",
    padding: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F6FB",
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#5B5EF7",
    textAlign: "center",
    marginBottom: 16,
  },

  summaryCard: {
    backgroundColor: "#5B5EF7",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },

  summaryTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 10,
  },

  summaryText: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 4,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 10,
  },

  mealCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 3,
  },

  mealType: {
    fontSize: 15,
    fontWeight: "900",
    color: "#5B5EF7",
    marginBottom: 4,
  },

  mealName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },

  mealText: {
    fontSize: 14,
    color: "#475569",
    fontWeight: "600",
  },

  info: {
    fontSize: 13,
    color: "#475569",
    marginBottom: 3,
  },

  insightCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
    marginBottom: 30,
  },

  insightTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 6,
  },

  insightText: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 20,
  },
});
