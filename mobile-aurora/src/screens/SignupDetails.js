import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useOnboardingMutation } from "../redux/userSlice";
import { handleError, handleSuccess } from "../utils";

const SignupDetails = ({ navigation }) => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [sleepTime, setSleepTime] = useState("");
  const [selectedGoals, setSelectedGoals] = useState([]);

  const [onboarding, { isLoading }] = useOnboardingMutation();

  const goals = [
    "Hydration",
    "Better Sleep",
    "Better Habits",
    "Eat Healthier",
    "More Energy",
  ];

  const toggleGoal = (goal) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleContinue = async () => {
    try {
      const cleanAge = age.trim();
      const cleanGender = gender.trim();
      const cleanHeight = height.trim();
      const cleanWeight = weight.trim();
      const cleanWake = wakeTime.trim();
      const cleanSleep = sleepTime.trim();

      if (
        !cleanAge ||
        !cleanGender ||
        !cleanHeight ||
        !cleanWeight ||
        !cleanWake ||
        !cleanSleep
      ) {
        handleError("Please fill all fields!!");
        return;
      }

      if (selectedGoals.length === 0) {
        handleError("Select at least one goal");
        return;
      }

      if (
        isNaN(Number(cleanAge)) ||
        isNaN(Number(cleanHeight)) ||
        isNaN(Number(cleanWeight))
      ) {
        handleError("Age, height, weight must be numbers!!");
        return;
      }

      let userId = await AsyncStorage.getItem("userId");

      if (!userId) {
        handleError("User not found. Please login again.");
        return;
      }

      const payload = {
        userId: userId.trim(),
        age: Number(cleanAge),
        gender: cleanGender,
        height: Number(cleanHeight),
        weight: Number(cleanWeight),
        wakeTime: cleanWake,
        sleepTime: cleanSleep,
        goals: selectedGoals,
      };

      const res = await onboarding(payload).unwrap();

      console.log("ONBOARDING RESPONSE:", res);

      handleSuccess("Profile setup completed!!");

      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      }, 500);
    } catch (error) {
      console.log("ONBOARDING ERROR:", error);
      handleError("Server error!!");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Complete Your Profile</Text>

      <View style={styles.card}>
        <TextInput
          placeholder="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          placeholder="Gender"
          value={gender}
          onChangeText={setGender}
          style={styles.input}
        />

        <TextInput
          placeholder="Height (cm)"
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          placeholder="Weight (kg)"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          placeholder="Wake Time (e.g. 7:00 AM)"
          value={wakeTime}
          onChangeText={setWakeTime}
          style={styles.input}
        />

        <TextInput
          placeholder="Sleep Time (e.g. 11:00 PM)"
          value={sleepTime}
          onChangeText={setSleepTime}
          style={styles.input}
        />

        <Text style={styles.goalTitle}>Select Goals</Text>

        <View style={styles.goalContainer}>
          {goals.map((goal) => (
            <TouchableOpacity
              key={goal}
              onPress={() => toggleGoal(goal)}
              style={[
                styles.goalChip,
                selectedGoals.includes(goal) && styles.selectedGoal,
              ]}
            >
              <Text
                style={[
                  styles.goalText,
                  selectedGoals.includes(goal) && styles.selectedGoalText,
                ]}
              >
                {goal}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && { opacity: 0.7 }]}
          onPress={handleContinue}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SignupDetails;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F5F7FA",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    color: "#5B5EF7",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 18,
    elevation: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 10,
  },
  goalContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  goalChip: {
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 20,
    margin: 5,
  },
  selectedGoal: {
    backgroundColor: "#6C63FF",
  },
  goalText: {
    color: "#000",
  },
  selectedGoalText: {
    color: "#fff",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#6C63FF",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
