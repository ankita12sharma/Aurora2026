import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const OnboardingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Understand your body better</Text>

      <View style={styles.card}>
        <Text style={styles.item}>💧 Hydration tracking</Text>
        <Text style={styles.item}>😴 Sleep insights</Text>
        <Text style={styles.item}>🔥 Habit building</Text>
        <Text style={styles.item}>🤖 AI health coach</Text>
      </View>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.btnText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#F4F6FB",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#5B5EF7",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 20,
    marginTop: 20,
  },
  item: { marginVertical: 6, color: "#334155", fontSize: 20 },
  btn: {
    marginTop: 30,
    backgroundColor: "#5B5EF7",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "600" },
});
