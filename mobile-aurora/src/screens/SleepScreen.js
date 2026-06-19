import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Animated,
  TouchableOpacity,
  RefreshControl,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useGetSleepByUserQuery } from "../redux/sleepSlice";

const SleepScreen = () => {
  const [userId, setUserId] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loadUser = async () => {
      const id = await AsyncStorage.getItem("userId");
      if (id) setUserId(id);
    };

    loadUser();
  }, []);

  const { data: sleepData, refetch } = useGetSleepByUserQuery(userId, {
    skip: !userId,
  });

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        refetch();
      }
    }, [userId]),
  );

  const sleepInfo = sleepData?.data ?? sleepData ?? {};

  const sortedLogs = [...(sleepInfo?.logs ?? [])].sort(
    (a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date),
  );

  const lastNightSleep = Number(sortedLogs[0]?.totalHours ?? 0);

  const yesterdaySleep = Number(sortedLogs[1]?.totalHours ?? 0);

  const avgSleep = Number(sleepInfo?.avgSleep ?? 0);
  const totalSleep = Number(sleepInfo?.totalSleepHours ?? 0);

  const trend = sleepInfo?.trend ?? "stable";
  const aiMessage = sleepInfo?.aiMessage ?? "";

  const logs = sortedLogs;

  const format = (value) => {
    return typeof value === "number" ? value.toFixed(1) : "0.0";
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.97,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const renderCard = (title, value, sub) => (
    <TouchableOpacity activeOpacity={0.9} onPress={animatePress}>
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.label}>{title}</Text>

        <Text style={styles.value}>{value}</Text>

        {sub ? <Text style={styles.sub}>{sub}</Text> : null}
      </Animated.View>
    </TouchableOpacity>
  );

  const renderSmallCard = (title, value) => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={animatePress}
      style={styles.smallWrap}
    >
      <Animated.View
        style={[
          styles.smallCard,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.label}>{title}</Text>

        <Text style={styles.valueSmall}>{value}</Text>
      </Animated.View>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <View style={styles.logCard}>
      <Text style={styles.logText}>
        💤 {item?.sleepTime ?? "--"} → {item?.wakeTime ?? "--"}
      </Text>

      <Text style={styles.logSub}>
        {item?.totalHours ? item.totalHours.toFixed(1) : "0.0"} hrs
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>😴 Sleep Tracker</Text>

      {renderCard(
        "Last Night Sleep",
        `${format(lastNightSleep)} hrs`,
        "Average 👍",
      )}

      <View style={styles.grid}>
        {renderSmallCard("Yesterday", `${format(yesterdaySleep)} hrs`)}

        <View style={styles.trendBox}>
          <Text style={styles.label}>Trend</Text>

          <Text style={styles.trendIcon}>
            {trend === "up" ? "📈" : trend === "down" ? "📉" : "➖"}
          </Text>
        </View>

        {renderSmallCard("Average", `${format(avgSleep)} hrs`)}

        {renderSmallCard("Total", `${format(totalSleep)} hrs`)}
      </View>

      <TouchableOpacity activeOpacity={0.8} onPress={animatePress}>
        <Animated.View
          style={[
            styles.aiCard,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.aiText}>{aiMessage || "No insights yet"}</Text>
        </Animated.View>
      </TouchableOpacity>

      <Text style={styles.section}>Sleep History</Text>

      <FlatList
        data={logs}
        keyExtractor={(item, index) =>
          item?._id?.toString() || index.toString()
        }
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No sleep records yet</Text>
        }
      />
    </View>
  );
};

export default SleepScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
    padding: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    color: "#5B5EF7",
    marginVertical: 12,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    marginBottom: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  smallWrap: {
    width: "48%",
    marginBottom: 10,
  },

  smallCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },

  trendBox: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },

  label: {
    fontSize: 14,
    color: "#8A8FA3",
    fontWeight: "700",
  },

  value: {
    fontSize: 26,
    fontWeight: "900",
    color: "#2D2A6E",
    marginTop: 8,
  },

  valueSmall: {
    fontSize: 20,
    fontWeight: "900",
    color: "#2D2A6E",
    marginTop: 8,
  },

  sub: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
    color: "#6C63FF",
  },

  trendIcon: {
    fontSize: 28,
    marginTop: 10,
  },

  aiCard: {
    backgroundColor: "#6C63FF",
    borderRadius: 22,
    padding: 16,
    marginVertical: 12,
    elevation: 3,
  },

  aiText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
  },

  section: {
    fontSize: 20,
    fontWeight: "900",
    marginVertical: 10,
    color: "#2D2A6E",
  },

  logCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: "#6C63FF",
    elevation: 2,
  },

  logText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D2A6E",
  },

  logSub: {
    fontSize: 14,
    color: "#8A8FA3",
    marginTop: 4,
  },

  empty: {
    textAlign: "center",
    marginTop: 30,
    color: "#8A8FA3",
    fontSize: 15,
  },
});
