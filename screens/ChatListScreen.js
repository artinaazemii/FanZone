// screens/ChatListScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import Logo from "./Logo";

// Ensure the chat document exists (with adminId if new)
const ensureChatDoc = async (team) => {
  const chatRef = doc(db, "teamChats", team.id);
  const snap = await getDoc(chatRef);
  if (!snap.exists()) {
    await setDoc(chatRef, {
      teamId: team.id,
      teamName: team.name,
      adminId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    });
  }
};

export default function ChatListScreen() {
  const [chatTeams, setChatTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) return;

        const { mainTeam, followingTeams = [] } = userSnap.data();
        const all = [mainTeam, ...followingTeams].filter(Boolean);
        const unique = Object.values(
          all.reduce((acc, t) => ({ ...acc, [t.id]: t }), {})
        );

        // Ensure chat docs exist
        await Promise.all(unique.map(ensureChatDoc));

        // Show all chats; membership gating on tap
        setChatTeams(unique);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const handlePress = async (team) => {
    try {
      const memSnap = await getDoc(
        doc(db, "teamChats", team.id, "members", auth.currentUser.uid)
      );
      if (!memSnap.exists()) {
        Alert.alert(
          "Access denied",
          "You have been removed from this chat by the admin."
        );
        return;
      }
      navigation.navigate("TeamChat", {
        teamId: team.id,
        teamName: team.name,
      });
    } catch (e) {
      console.error("Error checking membership:", e);
      Alert.alert("Error", "Could not verify access. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={chatTeams}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handlePress(item)}
          >
            <Logo id={item.id} />
            <Text style={styles.title}>{item.name} Chat</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  title: { marginLeft: 12, fontSize: 16, fontWeight: "bold" },
});
