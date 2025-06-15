import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { auth, db } from "../firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import Logo from "./Logo";

const ADMIN_UID = "k7CSHSfyfIdycjostOnX0SoHF4w1";

const TEAMS = [
  { id: '1', name: 'Manchester United' },
  { id: '2', name: 'Barcelona' },
  { id: '3', name: 'Real Madrid' },
  { id: '4', name: 'Bayern Munich' },
  { id: '5', name: 'Liverpool' },
  { id: '6', name: 'Chelsea' },
  { id: '7', name: 'Juventus' },
  { id: '8', name: 'PSG' },
  { id: '9', name: 'Manchester City' },
  { id: '10', name: 'Arsenal' },
  { id: '11', name: 'AC Milan' },
  { id: '12', name: 'Tottenham Hotspur' },
  { id: '13', name: 'AS Roma' },
  { id: '14', name: 'Inter Milan' },
  { id: '15', name: 'Atletico Madrid' },
  { id: '16', name: 'Sevilla FC' },
  { id: '17', name: 'Borussia Dortmund' },
  { id: '18', name: 'RB Leipzig' },
  { id: '19', name: 'Olympique Lyonnais' },
  { id: '20', name: 'Marseille' },
  { id: '21', name: 'FC Porto' },
  { id: '22', name: 'Benfica' },
  { id: '23', name: 'Ajax' },
  { id: '24', name: 'PSV Eindhoven' },
  { id: '25', name: 'Galatasaray' },
  { id: '26', name: 'Boca Juniors' },
  { id: '27', name: 'River Plate' },
  { id: '28', name: 'Flamengo' },
  { id: '29', name: 'Sao Paulo FC' },
  { id: '30', name: 'LA Galaxy' },
  { id: '31', name: 'New York City FC' },
  { id: '32', name: 'Villarreal CF' },
  { id: '33', name: 'Real Sociedad' },
  { id: '34', name: 'Athletic Bilbao' },
  { id: '35', name: 'Valencia CF' },
  { id: '36', name: 'Wolverhampton' },
  { id: '37', name: 'Leicester City' },
  { id: '38', name: 'West Ham United' },
  { id: '39', name: 'Everton FC' },
  { id: '40', name: 'Bayer Leverkusen' },
  { id: '41', name: 'Schalke 04' },
  { id: '42', name: 'Werder Bremen' },
  { id: '43', name: 'Eintracht Frankfurt' },
  { id: '44', name: 'OGC Nice' },
  { id: '45', name: 'Celtic FC' },
  { id: '46', name: 'Rangers FC' },
  { id: '47', name: 'Fenerbahçe' },
  { id: '48', name: 'Trabzonspor' },
  { id: '49', name: 'Al Ahly SC' },
  { id: '50', name: 'Al Hilal' },
  { id: '51', name: 'Al Nassr' },
  { id: '52', name: 'Guangzhou Evergrande' },
  { id: '53', name: 'Sydney FC' },
  { id: '54', name: 'Melbourne Victory' },
  { id: '55', name: 'Kaizer Chiefs' },
  { id: '56', name: 'Orlando Pirates' },
];

async function ensureChatDoc(team) {
  const ref = doc(db, "teamChats", team.id);
  const s = await getDoc(ref);
  if (!s.exists()) {
    await setDoc(ref, {
      teamId: team.id,
      teamName: team.name,
      adminId: ADMIN_UID,
      createdAt: serverTimestamp(),
    });
  } else {
    if (s.data().adminId !== ADMIN_UID) await updateDoc(ref, { adminId: ADMIN_UID });
    if (!s.data().teamName) await updateDoc(ref, { teamName: team.name });
  }
}

async function countUnread(teamId, lastSeen) {
  const qUnread = query(
    collection(db, "teamChats", teamId, "messages"),
    where("createdAt", ">", lastSeen || new Date(0))
  );
  return (await getDocs(qUnread)).size;
}

export default function ChatListScreen() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      try {
        if (auth.currentUser.uid === ADMIN_UID) {
          await Promise.all(TEAMS.map(ensureChatDoc));
          setRooms(TEAMS);
        } else {
          const uRef = doc(db, "users", auth.currentUser.uid);
          const uSnap = await getDoc(uRef);
          if (!uSnap.exists()) return;

          const { mainTeam, followingTeams = [] } = uSnap.data();
          const all = [mainTeam, ...followingTeams].filter(Boolean);
          const uniq = Object.values(all.reduce((o, t) => ({ ...o, [t.id]: t }), {}));
          await Promise.all(uniq.map(ensureChatDoc));
          setRooms(uniq);
        }
      } catch (e) {
        Alert.alert("Error", "Could not load chats.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  useFocusEffect(
    useCallback(() => {
      if (auth.currentUser.uid === ADMIN_UID) return;
      let active = true;

      (async () => {
        const stSnap = await getDocs(
          collection(db, "users", auth.currentUser.uid, "chatStatus")
        );

        let tot = 0;
        const perRoom = {};

        await Promise.all(
          stSnap.docs.map(async (d) => {
            const n = await countUnread(d.id, d.data().lastSeen);
            if (n) {
              perRoom[d.id] = n;
              tot += n;
            }
          })
        );

        if (active) {
          setRooms((prev) => prev.map((r) => ({ ...r, unread: perRoom[r.id] || 0 })));
          navigation.setOptions({ tabBarBadge: tot || undefined });
        }
      })();

      return () => {
        active = false;
      };
    }, [navigation])
  );
  const openChat = async (team) => {
    try {
     
      if (
        auth.currentUser.uid !== ADMIN_UID &&
        (await getDoc(doc(db, "teamChats", team.id, "bans", auth.currentUser.uid)))
          .exists()
      ) {
        Alert.alert("Access denied", "You have been removed by admin.");
        return;
      }

      await setDoc(
        doc(db, "users", auth.currentUser.uid, "chatStatus", team.id),
        { lastSeen: serverTimestamp() },
        { merge: true }
      );

      navigation.navigate("TeamChat", { teamId: team.id, teamName: team.name });
    } catch (e) {
      Alert.alert("Error", e.message);
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
        data={rooms}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => openChat(item)}>
            <Logo id={item.id} />
            <Text style={styles.title}>{item.name} Chat</Text>
            {!!item.unread && (
              <View style={styles.dot}>
                <Text style={styles.dotTxt}>{item.unread}</Text>
              </View>
            )}
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
  dot: {
    marginLeft: "auto",
    backgroundColor: "#e74c3c",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  dotTxt: { color: "#fff", fontSize: 12, fontWeight: "700" },
});
