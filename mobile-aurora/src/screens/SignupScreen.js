import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useSignupMutation } from "../redux/userSlice";
import { handleError, handleSuccess } from "../utils";

const Signup = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [signup, { isLoading }] = useSignupMutation();

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      handleError("Please fill all fields!!");
      return;
    }

    try {
      const response = await signup({
        name: name.trim(),
        email: email.trim(),
        password,
      }).unwrap();

      if (response?.userId) {
        await AsyncStorage.setItem("userId", String(response.userId));
      }

      handleSuccess("Signup Successful!!");

      navigation.navigate("SignupDetails");
    } catch (err) {
      handleError("Signup Failed!!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <Text style={styles.sub}>Start your health journey with Aurora</Text>

      <View style={styles.inputContainer}>
        <Ionicons
          name="person-outline"
          size={22}
          color="#7A7A7A"
          style={styles.icon}
        />

        <TextInput
          placeholder="Full Name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name="mail-outline"
          size={22}
          color="#7A7A7A"
          style={styles.icon}
        />

        <TextInput
          placeholder="Email Address"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name="lock-closed-outline"
          size={22}
          color="#7A7A7A"
          style={styles.icon}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          style={styles.input}
        />

        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-outline" : "eye-off-outline"}
            size={22}
            color="#7A7A7A"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.btn}
        onPress={handleSignup}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Create Account</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
        Already have an account? Login
      </Text>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#F4F6FB",
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#5B5EF7",
    textAlign: "center",
    marginBottom: 8,
  },

  sub: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 35,
    lineHeight: 22,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 15,
    marginBottom: 16,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },

  icon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#111",
    paddingVertical: 16,
  },

  btn: {
    backgroundColor: "#5B5EF7",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",

    shadowColor: "#5B5EF7",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },

  btnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  link: {
    marginTop: 24,
    textAlign: "center",
    color: "#5B5EF7",
    fontWeight: "600",
    fontSize: 15,
  },
});
