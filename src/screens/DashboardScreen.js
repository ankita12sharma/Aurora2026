import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import { useGetSleepByUserQuery } from "../redux/sleepSlice";
import { useGetHydrationQuery } from "../redux/hydrationSlice";
import { useGetHabitsByUserQuery } from "../redux/habitSlice";
import { useGetNutritionByUserQuery } from "../redux/nutritionSlice";
import { LinearGradient } from "expo-linear-gradient";
const DashboardScreen = () => {
  const [userId, setUserId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const id = await AsyncStorage.getItem("userId");
      if (id) setUserId(id.trim());
    };
    loadUser();
  }, []);

  const skip = !userId;

  const {
    data: sleepData,
    refetch: refetchSleep,
    isLoading: sleepLoading,
  } = useGetSleepByUserQuery(userId, { skip });

  const {
    data: hydrationData,
    refetch: refetchWater,
    isLoading: waterLoading,
  } = useGetHydrationQuery(userId, { skip });

  const {
    data: habitData,
    refetch: refetchHabits,
    isLoading: habitLoading,
  } = useGetHabitsByUserQuery(userId, { skip });

  const {
    data: nutritionData,
    refetch: refetchNutrition,
    isLoading: nutritionLoading,
  } = useGetNutritionByUserQuery(userId, { skip });

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refetchSleep(),
      refetchWater(),
      refetchHabits(),
      refetchNutrition(),
    ]);
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        refetchSleep();
        refetchWater();
        refetchHabits();
        refetchNutrition();
      }
    }, [userId]),
  );

  if (
    !userId ||
    sleepLoading ||
    waterLoading ||
    habitLoading ||
    nutritionLoading
  ) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  const sleepInfo = sleepData?.data ?? sleepData ?? {};

  const sleepLogs = [...(sleepInfo?.logs ?? [])].sort(
    (a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date),
  );

  const todaySleep = Number(
    sleepLogs[0]?.totalHours ||
      sleepLogs[0]?.hours ||
      sleepLogs[0]?.sleepHours ||
      0,
  );

  const yesterdaySleep = Number(
    sleepLogs[1]?.totalHours ||
      sleepLogs[1]?.hours ||
      sleepLogs[1]?.sleepHours ||
      0,
  );

  const avgSleep = Number(sleepInfo?.avgSleep ?? 0);
  const hydration = hydrationData?.data ?? {};
  const habits =
    habitData?.data?.habits ?? habitData?.habits ?? habitData ?? [];
  const allMeals = nutritionData?.data ?? [];

  const isToday = (date) => {
    if (!date) return false;
    return new Date(date).toDateString() === new Date().toDateString();
  };

  const todayMeals = allMeals.filter((m) => isToday(m.date));

  const nutritionSummary = todayMeals.reduce(
    (acc, item) => {
      acc.calories += item.calories || 0;
      acc.protein += item.protein || 0;
      acc.carbs += item.carbs || 0;
      acc.fats += item.fats || 0;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 },
  );

  const waterIntake = Number(hydration?.todayWaterMl ?? 0);
  const waterGoal = Number(hydration?.goalWaterMl ?? 2500);

  const totalHabits = habits.length;
  const completedHabits = habits.filter((h) => h.completed).length;

  const habitProgress =
    totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

  const insight =
    todaySleep < avgSleep
      ? `You slept ${(avgSleep - todaySleep).toFixed(1)} hrs less than average.`
      : "Great job! Keep going 🔥";

  const Card = ({ icon, color, title, children }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={20} color={color} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.header}>🏠 Home Dashboard</Text>

      <LinearGradient
        colors={["#5B5EF7", "#7B7FFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.insightCard}
      >
        <Text style={styles.insightTitle}>💡 Daily Insight</Text>

        <Text style={styles.insightText}>{insight}</Text>

        <Text style={styles.insightSub}>
          You're building a healthier you every day!
        </Text>
      </LinearGradient>

      <View style={styles.grid}>
        <View style={styles.smallCard}>
          <View style={styles.cardTopRow}>
            <Text style={styles.smallTitle}>Hydration</Text>
            <Ionicons name="water-outline" size={20} color="#2196F3" />
          </View>
          <View style={styles.valueRow}>
            <Text style={styles.bigNumber}>{waterIntake}</Text>
            <Text style={styles.unit}>ml</Text>
          </View>

          <Text style={styles.goalText}>Goal: {waterGoal} ml</Text>
        </View>

        <View style={styles.smallCard}>
          <View style={styles.cardTopRow}>
            <Text style={styles.smallTitle}>Sleep</Text>
            <Ionicons name="moon-outline" size={20} color="#7C6CF2" />
          </View>

          <View style={styles.valueRow}>
            <Text style={styles.bigNumber}>{todaySleep}</Text>
            <Text style={styles.unit}>hrs</Text>
          </View>
          <Text style={styles.goalText}>Last Night: {yesterdaySleep} hrs</Text>

          <Text style={styles.goalText}>Weekly Avg: {avgSleep} hrs</Text>
        </View>

        <View style={styles.smallCard}>
          <View style={styles.cardTopRow}>
            <Text style={styles.smallTitle}>Habits</Text>
            <Ionicons name="checkmark-done-outline" size={20} color="#4CAF50" />
          </View>

          <View style={styles.valueRow}>
            <Text style={styles.bigNumber}>{habitProgress}</Text>
            <Text style={styles.unit}>%</Text>
          </View>
          <Text style={styles.goalText}>
            {completedHabits}/{totalHabits} completed
          </Text>
        </View>

        <View style={styles.smallCard}>
          <View style={styles.cardTopRow}>
            <Text style={styles.smallTitle}>Nutrition</Text>
            <Ionicons name="nutrition-outline" size={20} color="#FF9800" />
          </View>

          <View style={styles.valueRow}>
            <Text style={styles.bigNumber}>{nutritionSummary.calories}</Text>
            <Text style={styles.unit}>kcal</Text>
          </View>
          <Text style={styles.goalText}>Meals: {todayMeals.length}</Text>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>🍎 Daily Nutrition Summary</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Protein</Text>

          <Text style={styles.summaryValue}>{nutritionSummary.protein} g</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Carbs</Text>

          <Text style={styles.summaryValue}>{nutritionSummary.carbs} g</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Fats</Text>

          <Text style={styles.summaryValue}>{nutritionSummary.fats} g</Text>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>📅 Today's Summary</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>💧 Water</Text>

          <Text style={styles.summaryValue}>{waterIntake} ml</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>🌙 Sleep</Text>

          <Text style={styles.summaryValue}>{todaySleep} hrs</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>✅ Habits</Text>

          <Text style={styles.summaryValue}>{completedHabits}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>🍎 Calories</Text>

          <Text style={styles.summaryValue}>
            {nutritionSummary.calories} kcal
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
    paddingHorizontal: 16,
  },

  header: {
    fontSize: 28,
    fontWeight: "900",
    color: "#5B5EF7",
    textAlign: "center",
    marginTop: 15,
    marginBottom: 20,
  },

  insightCard: {
    borderRadius: 26,
    padding: 10,
    marginBottom: 20,
    elevation: 6,
  },

  insightTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
  },

  insightText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
    marginLeft: 10,
  },

  insightSub: {
    color: "#E8E8FF",
    marginTop: 4,
    marginLeft: 10,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  smallCard: {
    width: "48%",
    minHeight: 190,
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 5,
  },

  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  valueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 24,
  },

  bottomContent: {
    marginTop: "auto",
  },

  smallTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D2A6E",
  },

  bigNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2D2A6E",
    marginBottom: 32,
  },

  unit: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2D2A6E",
    marginLeft: 6,
    marginBottom: 34,
  },

  goalText: {
    color: "#6B7280",
    fontSize: 14,
    marginTop: 6,
    fontWeight: "700",
  },
  summaryCard: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
  },

  summaryTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2D2A6E",
    marginBottom: 15,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  summaryText: {
    color: "#6B7280",
    fontSize: 15,
    fontWeight: "500",
  },

  summaryValue: {
    color: "#2D2A6E",
    fontWeight: "800",
    fontSize: 15,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
