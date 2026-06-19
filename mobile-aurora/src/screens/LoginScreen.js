import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useLoginMutation } from "../redux/userSlice";
import { handleSuccess, handleError } from "../utils";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      handleError("All fields are mandatory!!");
      return;
    }

    try {
      console.log("Sending Login:", {
        email: email.trim(),
        password,
      });

      const response = await login({
        email: email.trim(),
        password,
      }).unwrap();

      await AsyncStorage.setItem("token", response.token);
      await AsyncStorage.setItem("userId", String(response.userId));
      await AsyncStorage.setItem("userName", String(response.name));

      handleSuccess("Login successful!!");

      setTimeout(() => {
        navigation.replace("Main");
      }, 1000);
    } catch (err) {
      console.log("LOGIN ERROR:", JSON.stringify(err, null, 2));
      handleError("Login failed!!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      <Text style={styles.sub}>Continue your health journey with Aurora</Text>

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

      <TouchableOpacity>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Login</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.link} onPress={() => navigation.navigate("Signup")}>
        Create New Account
      </Text>
    </View>
  );
};

export default LoginScreen;

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

  forgotText: {
    textAlign: "right",
    color: "#5B5EF7",
    fontWeight: "600",
    marginBottom: 20,
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
