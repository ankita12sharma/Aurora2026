import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import {
  useGetHabitsByUserQuery,
  useToggleHabitMutation,
  useDeleteHabitMutation,
} from "../redux/habitSlice";

import { handleSuccess, handleError } from "../utils";

const HabitScreen = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const load = async () => {
      const id = await AsyncStorage.getItem("userId");
      setUserId(id);
    };
    load();
  }, []);

  const { data, isLoading, isError, refetch } = useGetHabitsByUserQuery(
    userId,
    {
      skip: !userId,
    },
  );

  const [toggleHabit, { isLoading: toggleLoading }] = useToggleHabitMutation();

  const [deleteHabit, { isLoading: deleteLoading }] = useDeleteHabitMutation();

  const habits = data?.data?.habits || [];

  const handleToggle = async (id) => {
    try {
      await toggleHabit(id).unwrap();

      await refetch();

      handleSuccess("Habit updated successfully");
    } catch (error) {
      console.log(error);
      handleError("Failed to update habit");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteHabit(id).unwrap();

      await refetch();

      handleSuccess("Habit deleted successfully");
    } catch (error) {
      console.log(error);
      handleError("Failed to delete habit");
    }
  };

  if (!userId || isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#5B5EF7" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Failed to load habits</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="run-fast" size={28} color="#5B5EF7" />
        <Text style={styles.title}>My Habits</Text>
      </View>

      {habits.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="clipboard-text-outline" size={70} color="#CBD5E1" />
          <Text style={styles.emptyText}>No habits added yet</Text>
        </View>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.habitName}>{item.habitName}</Text>

                <View
                  style={[
                    styles.badge,
                    item.completed ? styles.doneBadge : styles.pendingBadge,
                  ]}
                >
                  <Text style={styles.badgeText}>
                    {item.completed ? "Done ✅" : "Pending ⏳"}
                  </Text>
                </View>
              </View>

              <Text style={styles.streak}>
                🔥 Streak: {item.streakCount || 0} days
              </Text>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  item.completed ? styles.pendingButton : styles.doneButton,
                ]}
                disabled={toggleLoading}
                onPress={() => handleToggle(item._id)}
              >
                <Text style={styles.buttonText}>
                  {item.completed ? "Mark Pending" : "Mark Done"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                disabled={deleteLoading}
                onPress={() => handleDelete(item._id)}
              >
                <Text style={styles.buttonText}>Delete Habit</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default HabitScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FC",
    padding: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 5,
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#5B5EF7",
    marginLeft: 10,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  habitName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1E293B",
    flex: 1,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  doneBadge: {
    backgroundColor: "#DCFCE7",
  },

  pendingBadge: {
    backgroundColor: "#FEF3C7",
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },

  streak: {
    marginTop: 10,
    color: "#64748B",
    fontWeight: "600",
  },

  actionButton: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  doneButton: {
    backgroundColor: "#22C55E",
  },

  pendingButton: {
    backgroundColor: "#F59E0B",
  },

  deleteButton: {
    marginTop: 10,
    backgroundColor: "#EF4444",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },

  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: "#64748B",
    fontWeight: "600",
  },

  errorText: {
    fontSize: 16,
    color: "red",
  },
});
