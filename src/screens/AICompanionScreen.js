import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  FlatList,
  KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Speech from "expo-speech";
import { Ionicons } from "@expo/vector-icons";

const AICompanionScreen = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState("");

  const flatListRef = useRef(null);

  useEffect(() => {
    const loadUser = async () => {
      const id = await AsyncStorage.getItem("userId");
      setUserId(id || "");

      const welcomeText =
        "Hi Ankita, I am your Aurora AI companion. How may I help you today?";

      setMessages([
        {
          id: "welcome",
          text: welcomeText,
          sender: "ai",
          time: getTime(),
        },
      ]);

      Speech.stop();
      Speech.speak(welcomeText, {
        rate: 1,
        pitch: 1,
      });
    };

    loadUser();

    return () => Speech.stop();
  }, []);

  const getTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const sendMessage = async (text) => {
    if (!text.trim() || !userId) return;

    const userText = text.trim();

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + "_user",
        text: userText,
        sender: "user",
        time: getTime(),
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://192.168.29.35:8084/ai-agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          message: userText,
        }),
      });

      const data = await res.json();

      if (data?.responseCode !== "200") {
        throw new Error(data?.responseMessage);
      }

      const aiText = data?.data?.reply || "No response from Aurora.";

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + "_ai",
          text: aiText,
          sender: "ai",
          time: getTime(),
        },
      ]);

      Speech.stop();

      Speech.speak(aiText.replace(/[^\w\s,.!?]/g, ""), {
        rate: 1,
        pitch: 1,
      });
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + "_error",
          text: "⚠️ Server not responding. Try again.",
          sender: "ai",
          time: getTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      flatListRef.current?.scrollToEnd({
        animated: true,
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [messages]);

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageRow,
        item.sender === "user" && {
          justifyContent: "flex-end",
        },
      ]}
    >
      {item.sender === "ai" && (
        <Ionicons
          name="sparkles"
          size={22}
          color="#5B5EF7"
          style={styles.avatar}
        />
      )}

      <View
        style={[
          styles.bubble,
          item.sender === "user" ? styles.userBubble : styles.aiBubble,
        ]}
      >
        <Text style={styles.text}>{item.text}</Text>
        <Text style={styles.timestamp}>{item.time}</Text>
      </View>

      {item.sender === "user" && (
        <Ionicons
          name="person-circle"
          size={24}
          color="#29B6F6"
          style={styles.avatar}
        />
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.chatContainer}
      />

      {loading && (
        <View style={styles.typingBox}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      )}

      <View style={styles.inputBox}>
        <TouchableOpacity>
          <Ionicons name="mic" size={24} color="#555" />
        </TouchableOpacity>

        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Talk to Aurora..."
          style={styles.input}
          multiline
        />

        <TouchableOpacity onPress={() => sendMessage(message)}>
          <Ionicons
            name="send"
            size={24}
            color={message.trim() ? "#5B5EF7" : "#AAA"}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AICompanionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },

  chatContainer: {
    padding: 12,
    paddingBottom: 10,
  },

  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 6,
  },

  avatar: {
    marginHorizontal: 6,
  },

  bubble: {
    padding: 12,
    borderRadius: 18,
    maxWidth: "75%",
  },

  userBubble: {
    backgroundColor: "#DCF8C6",
    borderBottomRightRadius: 6,
  },

  aiBubble: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderBottomLeftRadius: 6,
  },

  text: {
    fontSize: 15,
    color: "#333",
    lineHeight: 21,
  },

  timestamp: {
    fontSize: 11,
    color: "#888",
    marginTop: 4,
    textAlign: "right",
  },

  typingBox: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#5B5EF7",
    marginHorizontal: 3,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#EEE",
    backgroundColor: "#FFF",
    marginBottom: Platform.OS === "android" ? 5 : 0,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 10,
    backgroundColor: "#FAFAFA",
    maxHeight: 100,
  },
});
