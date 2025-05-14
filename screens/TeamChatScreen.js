import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { auth, db } from "../firebaseConfig";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function TeamChatScreen({ route }) {
  const { teamId, teamName } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "teamChats", teamId, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) =>
        setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))),
      (error) => console.error("Snapshot error:", error)
    );
    return unsubscribe;
  }, [teamId]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    try {
      await addDoc(collection(db, "teamChats", teamId, "messages"), {
        text: input.trim(),
        createdAt: serverTimestamp(),
        userId: auth.currentUser.uid,
        displayName: auth.currentUser.displayName || "User",
      });
      setInput("");
    } catch (err) {
      console.error("Send failed:", err);
      Alert.alert("Could not send message", err.message);
    }
  };

  const renderItem = ({ item }) => {
    const isMe = item.userId === auth.currentUser.uid;
    return (
      <View
        style={[
          styles.messageContainer,
          isMe ? styles.myMessage : styles.theirMessage,
        ]}
      >
        {!isMe && <Text style={styles.name}>{item.displayName}</Text>}
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.messagesList}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder={`Message ${teamName}`}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  messagesList: { padding: 16 },
  messageContainer: {
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
    maxWidth: "80%",
  },
  myMessage: { backgroundColor: "#dcf8c6", alignSelf: "flex-end" },
  theirMessage: { backgroundColor: "#f1f0f0", alignSelf: "flex-start" },
  name: { fontSize: 12, fontWeight: "bold", marginBottom: 4 },
  messageText: { fontSize: 16 },
  inputRow: {
    flexDirection: "row",
    padding: 8,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    marginRight: 8,
  },
  sendButton: { justifyContent: "center", alignItems: "center", padding: 8 },
  sendText: { fontSize: 16, fontWeight: "bold", color: "#3498db" },
});
