// screens/TeamChatScreen.js  – TEXT-ONLY VERSION
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
import { Ionicons } from "@expo/vector-icons";
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
  setDoc,
  getDoc,
} from "firebase/firestore";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function TeamChatScreen({ route }) {
  const { teamId, teamName } = route.params;
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [members, setMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);

  /* join the member list once */
  useEffect(() => {
    const ref = doc(db, "teamChats", teamId, "members", auth.currentUser.uid);
    getDoc(ref).then((snap) => {
      if (!snap.exists()) {
        setDoc(ref, {
          displayName: auth.currentUser.displayName || "User",
          joinedAt: serverTimestamp(),
        });
      }
    });
  }, [teamId]);

  /* live listeners */
  useEffect(() => {
    const q = query(
      collection(db, "teamChats", teamId, "messages"),
      orderBy("createdAt", "asc")
    );
    return onSnapshot(q, (snap) =>
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
  }, [teamId]);

  useEffect(() => {
    return onSnapshot(
      collection(db, "teamChats", teamId, "members"),
      (snap) => setMembers(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
  }, [teamId]);

  /* header */
  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${teamName} Chat`,
      headerRight: () => (
        <TouchableOpacity onPress={() => setShowMembers(true)} style={{ marginRight: 12 }}>
          <Ionicons name="people" size={24} color="#3498db" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, members]);

  /* send TEXT */
  const sendMessage = async () => {
    if (!input.trim()) return;
    await addDoc(collection(db, "teamChats", teamId, "messages"), {
      text: input.trim(),
      createdAt: serverTimestamp(),
      userId: auth.currentUser.uid,
      displayName: auth.currentUser.displayName || "User",
      type: "text",
    });
    setInput("");
  };

  /* delete */
  const confirmDelete = (id) =>
    Alert.alert("Delete?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          deleteDoc(doc(db, "teamChats", teamId, "messages", id)),
    }]);

  /* render each message */
  const renderItem = ({ item }) => {
    const isMe = item.userId === auth.currentUser.uid;
    const bubble = [styles.bubble, isMe ? styles.my : styles.their];

    return (
      <View style={[styles.row, isMe ? styles.rowR : styles.rowL]}>
        <View style={bubble}>
          {!isMe && <Text style={styles.name}>{item.displayName}</Text>}
          {item.type === "image" ? (
            /* still display historical images, but no way to add new ones */
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
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />

        <View style={styles.inputRow}>
          {/* 🔹 Photo icon removed — only text remains */}
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

      {/* members modal */}
      <Modal visible={showMembers} animationType="slide" onRequestClose={() => setShowMembers(false)}>
        <SafeAreaView style={[styles.modal, { paddingTop: insets.top }]}>
          <Text style={styles.modalTitle}>
            {teamName} Members ({members.length})
          </Text>
          <FlatList
            data={members}
            keyExtractor={(m) => m.id}
            renderItem={({ item }) => (
              <View style={styles.memberRow}>
                <Ionicons name="person-circle" size={24} color="#555" />
                <Text style={styles.memberName}>{item.displayName}</Text>
              </View>
            )}
          />
          <TouchableOpacity onPress={() => setShowMembers(false)} style={styles.closeBtn}>
            <Text style={styles.closeTxt}>Close</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </>
  );
}

/* -------------- styles -------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  list: { padding: 16 },

  row:  { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  rowR: { alignSelf: "flex-end" },
  rowL: { alignSelf: "flex-start" },

  bubble: { padding: 10, borderRadius: 8, maxWidth: "75%" },
  my:     { backgroundColor: "#dcf8c6" },
  their:  { backgroundColor: "#f1f0f0" },

  name: { fontSize: 12, fontWeight: "bold", marginBottom: 4 },
  msg:  { fontSize: 16 },
  img:  { width: 200, height: 200, borderRadius: 8 },   // only for historic images

  trash: { marginLeft: 8, padding: 4 },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
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

  modal: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
  modalTitle: { fontSize: 20, fontWeight: "700", textAlign: "center", marginBottom: 12 },
  memberRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  memberName: { marginLeft: 8, fontSize: 16 },
  closeBtn: {
    alignSelf: "center",
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#3498db",
    borderRadius: 24,
  },
  closeTxt: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
