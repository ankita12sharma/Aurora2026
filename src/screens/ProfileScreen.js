import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useGetProfileQuery } from "../redux/profileSlice";

const ProfileScreen = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const id = await AsyncStorage.getItem("userId");
      setUserId(id);
    };
    loadUser();
  }, []);

  const { data, isLoading, error } = useGetProfileQuery(userId, {
    skip: !userId,
  });

  if (isLoading || !userId) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>Failed to load profile</Text>
      </View>
    );
  }

  const profile = data?.data;

  const menu = [
    {
      title: "Personal Information",
      subtitle: `${profile?.age || "-"} yrs • ${profile?.gender || "-"}`,
      icon: "person-outline",
    },
    {
      title: "Body Details",
      subtitle: `Height: ${profile?.height || "-"} cm | Weight: ${profile?.weight || "-"} kg`,
      icon: "body-outline",
    },
    {
      title: "Goals",
      subtitle: `Goal Weight: ${profile?.goalWeight || "-"} kg`,
      icon: "trophy-outline",
    },
    {
      title: "Health Goals",
      subtitle: `Water: ${profile?.waterGoal || 0}ml | Sleep: ${profile?.sleepGoal || 0}h`,
      icon: "heart-outline",
    },
    {
      title: "Nutrition Goal",
      subtitle: `${profile?.calorieGoal || 0} kcal/day`,
      icon: "restaurant-outline",
    },
    {
      title: "Preferences",
      subtitle: `${profile?.theme || "Light"} • ${profile?.language || "English"} • ${profile?.units || "Metric"}`,
      icon: "options-outline",
    },
    {
      title: "Notifications",
      subtitle: profile?.notifications ? "Enabled" : "Disabled",
      icon: "notifications-outline",
    },
    {
      title: "Water Reminders",
      subtitle: profile?.waterReminders ? "ON" : "OFF",
      icon: "water-outline",
    },
    {
      title: "Sleep Reminders",
      subtitle: profile?.sleepReminders ? "ON" : "OFF",
      icon: "moon-outline",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={45} color="#555" />
        </View>

        <Text style={styles.name}>Ankita Sharma</Text>
        <Text style={styles.sub}>Manage your health & settings</Text>
      </View>

      <View style={styles.card}>
        {menu.map((item, index) => (
          <View key={index} style={styles.row}>
            <Ionicons name={item.icon} size={22} color="#444" />

            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
  },

  header: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#E9ECEF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#5B5EF7",
  },

  sub: {
    fontSize: 13,
    color: "gray",
    marginTop: 3,
  },

  card: {
    marginTop: 15,
    marginHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 8,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 15,
  },

  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },

  subtitle: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
