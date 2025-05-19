import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebaseConfig";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import Logo from "./Logo";



const ensureChatDoc = async (team) => {
  const ref = doc(db, "teamChats", team.id);
  if (!(await getDoc(ref)).exists()) {
    await setDoc(ref, {
      teamId: team.id,
      teamName: team.name,
      createdAt: serverTimestamp(),
    });
  }
};

const ensureMemberDoc = async (team) => {
  const ref = doc(db, "teamChats", team.id, "members", auth.currentUser.uid);
  const snap = await getDoc(ref);
  const displayName = auth.currentUser.displayName || "User";

  if (!snap.exists()) {
    await setDoc(ref, { displayName, joinedAt: serverTimestamp() });
  } else if (snap.data().displayName !== displayName) {
    await setDoc(ref, { ...snap.data(), displayName });
  }
};

export default function ChatListScreen() {
  const [chatTeams, setChatTeams] = useState([]);
  const [loading, setLoading]     = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const userSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (!userSnap.exists()) return;

        const { mainTeam, followingTeams = [] } = userSnap.data();
        const all = [mainTeam, ...followingTeams].filter(Boolean);
        const unique = Object.values(all.reduce((o, t) => ({ ...o, [t.id]: t }), {}));

        await Promise.all(
          unique.map(async (t) => {
            await ensureChatDoc(t);
            await ensureMemberDoc(t);
          })
        );

        setChatTeams(unique);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const openChat = (team) =>
    navigation.navigate("TeamChat", { teamId: team.id, teamName: team.name });

  if (loading)
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );

  return (
    <View style={styles.container}>
      <FlatList
        data={chatTeams}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => openChat(item)}>
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
  loader:    { flex: 1, justifyContent: "center", alignItems: "center" },
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
