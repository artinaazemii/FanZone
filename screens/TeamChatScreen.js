// screens/TeamChatScreen.js
import React, { useEffect, useLayoutEffect, useState } from "react";
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
  Modal,
  Image,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
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
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  limit,
} from "firebase/firestore";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function TeamChatScreen({ route }) {
  const { teamId, teamName } = route.params;
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [members, setMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const [adminId, setAdminId] = useState(null);
  const [isMemberEnsured, setIsMemberEnsured] = useState(false);

  // 1) Marrim adminId aktual nga "teamChats/{teamId}"
  useEffect(() => {
    const chatRef = doc(db, "teamChats", teamId);
    getDoc(chatRef)
      .then(snap => {
        if (snap.exists()) setAdminId(snap.data().adminId);
      })
      .catch(e => console.error("Error fetching adminId:", e));
  }, [teamId]);

  // 2) Sigurojmë hyrjen e përdoruesit (members/{uid}) para se të hapim listener-at
  useEffect(() => {
    let isCancelled = false;

    async function ensureMember() {
      try {
        const memberRef = doc(db, "teamChats", teamId, "members", auth.currentUser.uid);
        const snap = await getDoc(memberRef);

        if (!snap.exists()) {
          await setDoc(memberRef, {
            displayName: auth.currentUser.displayName || "User",
            joinedAt: serverTimestamp(),
          });
        }
        if (!isCancelled) {
          setIsMemberEnsured(true);
        }
      } catch (e) {
        console.error("Error ensuring memberDoc:", e);
      }
    }

    ensureMember();
    return () => {
      isCancelled = true;
    };
  }, [teamId]);

  // 3) Pasi "isMemberEnsured" === true, hapim listener për mesazhe
  useEffect(() => {
    if (!isMemberEnsured) return;

    const q = query(
      collection(db, "teamChats", teamId, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsubscribeMessages = onSnapshot(
      q,
      snap => setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
      e => console.error("Message snapshot error:", e)
    );

    return () => unsubscribeMessages();
  }, [teamId, isMemberEnsured]);

  // 4) Pasi "isMemberEnsured" === true, hapim listener për anëtarët
  useEffect(() => {
    if (!isMemberEnsured) return;

    const unsubscribeMembers = onSnapshot(
      collection(db, "teamChats", teamId, "members"),
      snap => {
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setMembers(docs);
      },
      e => console.error("Members snapshot error:", e)
    );
    return () => unsubscribeMembers();
  }, [teamId, isMemberEnsured]);

  // 5) Nëse admin-i aktual nuk është më në "members", caktojmë admin të ri: anëtari me 'joinedAt' më të vogël
  useEffect(() => {
    if (!isMemberEnsured || adminId === null) return;

    // Kontrollojmë nëse admin-i aktual është ende në listë
    const stillAdmin = members.some(member => member.id === adminId);

    if (!stillAdmin && members.length > 0) {
      // Përdorim një query për të marrë anëtarin me 'joinedAt' më të vogël (limit 1 në renditje rritëse)
      const earliestQuery = query(
        collection(db, "teamChats", teamId, "members"),
        orderBy("joinedAt", "asc"),
        limit(1)
      );
      getDocs(earliestQuery)
        .then(qSnap => {
          if (!qSnap.empty) {
            const newAdminId = qSnap.docs[0].id;
            const chatRef = doc(db, "teamChats", teamId);
            updateDoc(chatRef, { adminId: newAdminId })
              .then(() => {
                setAdminId(newAdminId);
              })
              .catch(err => console.error("Error updating new admin:", err));
          }
        })
        .catch(err => console.error("Error fetching earliest member:", err));
    }
  }, [members, adminId, isMemberEnsured, teamId]);

  // 6) Konfigurojmë header-in me butonin për modal "Members"
  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${teamName} Chat`,
      headerRight: () => (
        <TouchableOpacity onPress={() => setShowMembers(true)} style={{ marginRight: 12 }}>
          <Ionicons name="people" size={24} color="#3498db" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, members, teamName]);

  // 7) Funksioni për të dërguar mesazh
  const sendMessage = async () => {
    if (!input.trim()) return;
    try {
      await addDoc(collection(db, "teamChats", teamId, "messages"), {
        text: input.trim(),
        createdAt: serverTimestamp(),
        userId: auth.currentUser.uid,
        displayName: auth.currentUser.displayName || "User",
        type: "text",
      });
      setInput("");
    } catch (e) {
      console.error("Error sending message:", e);
      Alert.alert("Send failed", e.message);
    }
  };

  // 8) Funksioni për të fshirë mesazh (vetëm i vetë përdoruesit)
  const confirmDelete = msgId =>
    Alert.alert("Delete message?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "teamChats", teamId, "messages", msgId));
          } catch (e) {
            console.error("Message delete failed:", e);
            Alert.alert("Delete failed", e.message);
          }
        },
      },
    ]);

  // 9) Renderojmë mesazhet në FlatList
  const renderMessage = ({ item }) => {
    const isMe = item.userId === auth.currentUser.uid;
    return (
      <View style={[styles.row, isMe ? styles.rowR : styles.rowL]}>
        <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
          {!isMe && <Text style={styles.name}>{item.displayName}</Text>}
          {item.type === "image" ? (
            <Image source={{ uri: item.imageUrl }} style={styles.img} />
          ) : (
            <Text style={styles.msg}>{item.text}</Text>
          )}
        </View>
        {isMe && (
          <TouchableOpacity onPress={() => confirmDelete(item.id)} style={styles.trash}>
            <Ionicons name="trash" size={18} color="#900" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.list}
        />

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder={`Message ${teamName}`}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity onPress={sendMessage}>
            <Ionicons name="send" size={24} color="#3498db" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Modal visible={showMembers} animationType="slide" onRequestClose={() => setShowMembers(false)}>
        <SafeAreaView style={[styles.modal, { paddingTop: insets.top }]}>
          <Text style={styles.modalTitle}>{teamName} Members ({members.length})</Text>
          <FlatList
            data={members}
            keyExtractor={m => m.id}
            renderItem={({ item }) => {
              const amIAdmin = auth.currentUser.uid === adminId;
              const isNotMe = item.id !== auth.currentUser.uid;
              const isAdmin = item.id === adminId;
              const isCurrent = item.id === auth.currentUser.uid;

              return (
                <View style={styles.memberRow}>
                  <Ionicons name="person-circle" size={24} color="#555" />
                  <Text style={styles.memberName}>
                    {item.displayName}
                    {isCurrent && <Text style={styles.youTxt}> (You)</Text>}
                    {isAdmin && <Text style={styles.adminTxt}> (Admin)</Text>}
                  </Text>

                  {amIAdmin && isNotMe && (
                    <TouchableOpacity
                      onPress={async () => {
                        try {
                          await deleteDoc(doc(db, "teamChats", teamId, "members", item.id));
                        } catch (e) {
                          console.error("Kick failed:", e);
                          Alert.alert("Kick failed", e.message);
                        }
                      }}
                      style={styles.kickBtn}
                    >
                      <Text style={styles.kickTxt}>Kick</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            }}
          />
          <TouchableOpacity onPress={() => setShowMembers(false)} style={styles.closeBtn}>
            <Text style={styles.closeTxt}>Close</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  list: { padding: 16 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  rowR: { alignSelf: "flex-end" },
  rowL: { alignSelf: "flex-start" },
  bubble: { padding: 10, borderRadius: 8, maxWidth: "75%" },
  myBubble: { backgroundColor: "#dcf8c6" },
  theirBubble: { backgroundColor: "#f1f0f0" },
  name: { fontSize: 12, fontWeight: "bold", marginBottom: 4 },
  msg: { fontSize: 16 },
  img: { width: 200, height: 200, borderRadius: 8 },
  trash: { marginLeft: 8, padding: 4 },
  inputRow: { flexDirection: "row", alignItems: "center", padding: 8, borderTopWidth: 1, borderColor: "#ddd" },
  input: { flex: 1, padding: 10, borderRadius: 20, backgroundColor: "#f5f5f5", marginRight: 8 },
  modal: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
  modalTitle: { fontSize: 20, fontWeight: "700", textAlign: "center", marginBottom: 12 },
  memberRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  memberName: { marginLeft: 8, fontSize: 16 },
  youTxt: { fontSize: 12, fontStyle: "italic", color: "#555" },
  adminTxt: { fontSize: 12, fontWeight: "600", color: "#f39c12" },
  kickBtn: { marginLeft: 12, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: "#e74c3c", borderRadius: 4 },
  kickTxt: { color: "#fff", fontSize: 14, fontWeight: "600" },
  closeBtn: { alignSelf: "center", marginTop: 24, paddingHorizontal: 24, paddingVertical: 12, backgroundColor: "#3498db", borderRadius: 24 },
  closeTxt: { color: "#fff", fontWeight: "600", fontSize: 16 },
});