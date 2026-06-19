import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import {
  useAddWaterMutation,
  useGetHydrationQuery,
} from "../redux/hydrationSlice";

import { handleSuccess, handleError } from "../utils";

const HydrationScreen = () => {
  const [userId, setUserId] = useState(null);
  const [fillAnim] = useState(new Animated.Value(0));

  const [addWater, { isLoading: adding }] = useAddWaterMutation();

  useEffect(() => {
    const loadUser = async () => {
      const id = await AsyncStorage.getItem("userId");
      setUserId(id);
    };

    loadUser();
  }, []);

  const { data, isLoading, isFetching, refetch } = useGetHydrationQuery(
    userId,
    {
      skip: !userId,
    },
  );

  const hydration = data?.data ?? {};

  const goal = hydration?.goalWaterMl ?? 2500;
  const todayWater = hydration?.todayWaterMl ?? 0;
  const totalWater = hydration?.totalWaterMl ?? 0;
  const streak = hydration?.streak ?? 0;

  const percent = goal ? Math.min((todayWater / goal) * 100, 100) : 0;

  const remaining = Math.max(goal - todayWater, 0);

  const insight = useMemo(() => {
    if (!todayWater) return "Start your day with water 💧";

    if (todayWater < goal * 0.3) return "You are behind your goal.";

    if (todayWater < goal) return "Good progress 👍 Keep going.";

    return "Goal completed 🎉 Great job!";
  }, [todayWater, goal]);

  useEffect(() => {
    Animated.timing(fillAnim, {
      toValue: percent / 100,
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, [percent]);

  const handleAddWater = async (amount) => {
    try {
      const res = await addWater({
        userId,
        amount,
      }).unwrap();

      handleSuccess("Water added successfully!!");

      await refetch();
    } catch (err) {
      handleError("Failed to add water");
    }
  };

  if (!userId || isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#29B6F6" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons
          name="water"
          size={26}
          color="#29B6F6"
          style={styles.headerDrop}
        />

        <Text style={styles.title}>Hydration</Text>
      </View>

      {isFetching && <Text style={styles.refresh}>Updating...</Text>}

      <View style={styles.card}>
        <Text style={styles.label}>Today's Intake</Text>

        <Text style={styles.big}>{(todayWater / 1000).toFixed(1)} L</Text>

        <Text style={styles.sub}>
          {todayWater} / {goal} ml
        </Text>

        <View style={styles.bar}>
          <View
            style={[
              styles.fill,
              {
                width: `${percent}%`,
              },
            ]}
          />
        </View>

        <Text style={styles.percent}>{percent.toFixed(0)}%</Text>

        <View style={styles.bottle}>
          <Animated.View
            style={[
              styles.water,
              {
                height: fillAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 145],
                }),
              },
            ]}
          />

          <View style={styles.percentOverlay}>
            <Text style={styles.bottlePercent}>{percent.toFixed(0)}%</Text>
          </View>
        </View>
      </View>

      <View style={styles.goalCard}>
        <Ionicons name="trophy" size={24} color="#F59E0B" />

        <View style={{ marginLeft: 12 }}>
          <Text style={styles.goalTitle}>Daily Goal</Text>

          <Text style={styles.goalValue}>{goal} ml</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.small}>
          <Ionicons name="flame" size={22} color="#FF9800" />

          <Text style={styles.val}>{streak}</Text>

          <Text style={styles.txt}>Streak</Text>
        </View>

        <View style={styles.small}>
          <Ionicons name="water" size={22} color="#29B6F6" />

          <Text style={styles.val}>{totalWater}</Text>

          <Text style={styles.txt}>Total ML</Text>
        </View>
      </View>

      <View style={styles.insightBox}>
        <Text style={styles.insightTitle}>Insight</Text>

        <Text style={styles.insight}>{insight}</Text>

        <Text style={styles.insight}>Remaining: {remaining} ml</Text>
      </View>

      <View style={styles.quickRow}>
        {[200, 250, 500, 750].map((amount) => (
          <TouchableOpacity
            key={amount}
            style={[
              styles.btn,
              adding && {
                opacity: 0.7,
              },
            ]}
            disabled={adding}
            onPress={() => handleAddWater(amount)}
          >
            {adding ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.btnText}>+{amount}ml</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default HydrationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FB",
    padding: 20,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F6FB",
  },

  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  headerDrop: {
    marginRight: 8,
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#5B5EF7",
  },

  refresh: {
    textAlign: "center",
    marginBottom: 10,
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 22,
    borderRadius: 22,
    marginBottom: 18,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 4,
  },

  goalCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 22,
    borderRadius: 20,
    marginBottom: 18,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 4,
  },

  goalTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },

  goalValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },

  label: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
  },

  big: {
    fontSize: 30,
    fontWeight: "900",
    color: "#29B6F6",
    marginTop: 5,
  },

  sub: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 6,
  },

  bar: {
    height: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 50,
    marginTop: 16,
    overflow: "hidden",
  },

  fill: {
    height: "100%",
    borderRadius: 50,
    backgroundColor: "#29B6F6",
  },

  percent: {
    textAlign: "right",
    marginTop: 8,
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },

  bottle: {
    height: 190,
    width: 90,
    borderWidth: 3,
    borderColor: "#29B6F6",
    borderRadius: 25,
    marginTop: 25,
    alignSelf: "center",
    overflow: "hidden",
    backgroundColor: "#EAF6FF",
  },

  water: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#29B6F6",
  },

  percentOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },

  bottlePercent: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.25)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 3,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  small: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 18,
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },

  val: {
    fontSize: 22,
    fontWeight: "800",
    marginTop: 8,
    color: "#111827",
  },

  txt: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },

  insightBox: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 18,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#5B5EF7",
  },

  insightTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#5B5EF7",
    marginBottom: 8,
  },

  insight: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
    marginTop: 4,
  },

  quickRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 20,
  },

  btn: {
    width: "48%",
    backgroundColor: "#5B5EF7",
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 12,
    alignItems: "center",
  },

  btnText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 14,
  },
});
