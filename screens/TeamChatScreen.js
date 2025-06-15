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
import { useNavigation, useFocusEffect } from "@react-navigation/native";
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
} from "firebase/firestore";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const ADMIN_UID = "k7CSHSfyfIdycjostOnX0SoHF4w1";

const dayKey = (ts) => {
  const d = ts?.toDate?.() ?? new Date(0);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};
const dateLabel = (ts) =>
  ts?.toDate?.().toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).toUpperCase() || "";
const timeOnly = (ts) =>
  ts?.toDate?.().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) || "";

const markRead = (teamId) =>
  setDoc(
    doc(db, "users", auth.currentUser.uid, "chatStatus", teamId),
    { lastSeen: serverTimestamp() },
    { merge: true }
  );

const kickMember = async (uid, teamId, displayName) => {
  try {
    await deleteDoc(doc(db, "teamChats", teamId, "members", uid));
    await setDoc(doc(db, "teamChats", teamId, "bans", uid), {
      displayName,
      kickedAt: serverTimestamp(),
    });
  } catch (e) {
    Alert.alert("Kick failed", e.message);
  }
};
const confirmKick = (member, teamId) =>
  Alert.alert(
    "Confirm",
    `Kick ${member.displayName}?`,
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Kick",
        style: "destructive",
        onPress: () => kickMember(member.id, teamId, member.displayName),
      },
    ],
    { cancelable: true }
  );

export default function TeamChatScreen({ route }) {
  const { teamId, teamName } = route.params;
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [input, setInput] = useState("");
  const [showMembers, setShowMembers] = useState(false);

  useEffect(() => {
    const ref = doc(db, "teamChats", teamId);
    return onSnapshot(ref, (s) => {
      if (s.exists() && s.data().adminId !== ADMIN_UID)
        updateDoc(ref, { adminId: ADMIN_UID });
    });
  }, [teamId]);

  useEffect(() => {
    const memberRef = doc(db, "teamChats", teamId, "members", auth.currentUser.uid);
    let unsub;

    (async () => {
    
      if (
        auth.currentUser.uid !== ADMIN_UID &&
        (await getDoc(doc(db, "teamChats", teamId, "bans", auth.currentUser.uid))).exists()
      ) {
        Alert.alert("Access denied", "You were removed by admin.");
        navigation.goBack();
        return;
      }

      if (!(await getDoc(memberRef)).exists()) {
        await setDoc(memberRef, {
          displayName: auth.currentUser.displayName || "User",
          joinedAt: serverTimestamp(),
        });
      }
      unsub = onSnapshot(memberRef, (s) => {
        if (!s.exists()) {
          Alert.alert("Removed", "You were kicked by admin.", [
            { text: "OK", onPress: () => navigation.goBack() },
          ]);
        }
      });
    })();

    return () => unsub && unsub();
  }, [teamId, navigation]);

  useFocusEffect(
    React.useCallback(() => {
      markRead(teamId);
      return () => markRead(teamId);
    }, [teamId])
  );

  useEffect(() => {
    const q = query(
      collection(db, "teamChats", teamId, "messages"),
      orderBy("createdAt", "asc")
    );
    return onSnapshot(q, (s) => setMessages(s.docs.map((d) => ({ id: d.id, ...d.data() }))));
  }, [teamId]);

  useEffect(() => {
    return onSnapshot(
      collection(db, "teamChats", teamId, "members"),
      (s) => setMembers(s.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
  }, [teamId]);


  useLayoutEffect(() => {
    navigation.setOptions({
      title: teamName,
      headerRight: () => (
        <TouchableOpacity onPress={() => setShowMembers(true)} style={{ marginRight: 12 }}>
          <Ionicons name="people" size={24} color="#3498db" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, teamName]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    await addDoc(collection(db, "teamChats", teamId, "messages"), {
      text: input.trim(),
      createdAt: serverTimestamp(),
      userId: auth.currentUser.uid,
      displayName: auth.currentUser.displayName || "User",
      type: "text",
    }).catch((e) => Alert.alert("Send failed", e.message));
    setInput("");
  };


  const confirmDelete = (id) =>
    Alert.alert("Delete message?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          deleteDoc(doc(db, "teamChats", teamId, "messages", id)).catch((e) =>
            Alert.alert("Delete failed", e.message)
          ),
      },
    ]);
  const renderMsg = ({ item, index }) => {
    const isMe = item.userId === auth.currentUser.uid;
    const prev = index > 0 ? messages[index - 1] : null;
    const showDate = !prev || dayKey(prev.createdAt) !== dayKey(item.createdAt);

    return (
      <>
        {showDate && (
          <View style={styles.dateWrap}>
            <Text style={styles.dateTxt}>{dateLabel(item.createdAt)}</Text>
          </View>
        )}

        <View style={[styles.row, isMe ? styles.rowR : styles.rowL]}>
          <View style={[styles.bubble, isMe ? styles.my : styles.their]}>
            {!isMe && <Text style={styles.name}>{item.displayName}</Text>}
            {item.type === "image" ? (
              <Image source={{ uri: item.imageUrl }} style={styles.img} />
            ) : (
              <Text style={styles.msg}>{item.text}</Text>
            )}
            <Text style={styles.time}>{timeOnly(item.createdAt)}</Text>
          </View>

          {isMe && (
            <TouchableOpacity onPress={() => confirmDelete(item.id)} style={styles.trash}>
              <Ionicons name="trash" size={18} color="#900" />
            </TouchableOpacity>
          )}
        </View>
      </>
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
          keyExtractor={(i) => i.id}
          renderItem={renderMsg}
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
          <Text style={styles.modalTitle}>
            {teamName} Members ({members.length})
          </Text>

          <FlatList
            data={members}
            keyExtractor={(m) => m.id}
            renderItem={({ item }) => (
              <View style={styles.memberRow}>
                <Ionicons name="person-circle" size={24} color="#555" />
                <Text style={styles.memberName}>
                  {item.displayName}
                  {item.id === auth.currentUser.uid && <Text style={styles.youTxt}> (You)</Text>}
                  {item.id === ADMIN_UID && <Text style={styles.adminTxt}> (Admin)</Text>}
                </Text>

                {auth.currentUser.uid === ADMIN_UID && item.id !== auth.currentUser.uid && (
                  <TouchableOpacity
                    onPress={() => confirmKick(item, teamId)}
                    style={styles.kickBtn}
                  >
                    <Text style={styles.kickTxt}>Kick</Text>
                  </TouchableOpacity>
                )}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  list: { padding: 16 },
  dateWrap: { alignItems: "center", marginVertical: 8 },
  dateTxt: {
    backgroundColor: "#eee",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "600",
    color: "#555",
  },
  row: { flexDirection: "row", alignItems: "flex-end", marginBottom: 12 },
  rowR: { alignSelf: "flex-end" },
  rowL: { alignSelf: "flex-start" },
  bubble: { padding: 10, borderRadius: 8, maxWidth: "75%" },
  my: { backgroundColor: "#dcf8c6" },
  their: { backgroundColor: "#f1f0f0" },
  name: { fontSize: 12, fontWeight: "bold", marginBottom: 4 },
  msg: { fontSize: 16 },
  time: { fontSize: 10, color: "#777", marginTop: 4, alignSelf: "flex-end" },
  img: { width: 200, height: 200, borderRadius: 8 },
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
  youTxt: { fontSize: 12, fontStyle: "italic", color: "#555" },
  adminTxt: { fontSize: 12, fontWeight: "600", color: "#f39c12" },
  kickBtn: {
    marginLeft: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#e74c3c",
    borderRadius: 4,
  },
  kickTxt: { color: "#fff", fontSize: 14, fontWeight: "600" },
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
