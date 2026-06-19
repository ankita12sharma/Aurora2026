import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Onboarding");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={["#5B5EF7", "#7C4DFF", "#9C6BFF"]}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/2966/2966486.png",
          }}
          style={styles.logoImage}
        />
      </View>

      <Text style={styles.logo}>Aurora</Text>

      <Text style={styles.sub}>Your Daily Health & Wellness Companion</Text>

      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loading}>Preparing your dashboard...</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </LinearGradient>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },

  logoImage: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },

  logo: {
    fontSize: 42,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 1,
  },

  sub: {
    marginTop: 10,
    fontSize: 15,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    paddingHorizontal: 30,
  },

  loaderContainer: {
    marginTop: 50,
    alignItems: "center",
  },

  loading: {
    marginTop: 12,
    color: "#FFFFFF",
    fontSize: 14,
    opacity: 0.9,
  },

  footer: {
    position: "absolute",
    bottom: 50,
  },

  version: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
  },
});
