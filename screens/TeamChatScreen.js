// screens/TeamChatScreen.js

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
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../firebaseConfig";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
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
        setMessages(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))),
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

  const handleDelete = (messageId) => {
    Alert.alert(
      "Delete message",
      "Are you sure you want to delete this message?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(
                doc(db, "teamChats", teamId, "messages", messageId)
              );
            } catch (err) {
              console.error("Delete failed:", err);
              Alert.alert("Error", "Could not delete message.");
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const isMe = item.userId === auth.currentUser.uid;

    // Wrap bubble + optional delete icon in a row
    return (
      <View
        style={[
          styles.row,
          isMe ? styles.rowRight : styles.rowLeft
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isMe ? styles.myMessage : styles.theirMessage
          ]}
        >
          {!isMe && <Text style={styles.name}>{item.displayName}</Text>}
          <Text style={styles.messageText}>{item.text}</Text>
        </View>

        {isMe && (
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            style={styles.trashContainer}
          >
            <Ionicons name="trash" size={18} color="#900" />
          </TouchableOpacity>
        )}
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

  // New row styles
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  rowRight: {
    alignSelf: "flex-end",
  },
  rowLeft: {
    alignSelf: "flex-start",
  },

  messageBubble: {
    padding: 10,
    borderRadius: 8,
    maxWidth: "80%",
  },
  myMessage: {
    backgroundColor: "#dcf8c6",
  },
  theirMessage: {
    backgroundColor: "#f1f0f0",
  },
  name: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
  },

  // Trash sits just beside the bubble
  trashContainer: {
    marginLeft: 8,
    marginRight: Platform.OS === "web" ? 0 : 4,
    padding: 4,
  },

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
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  sendText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3498db",
  },
});
