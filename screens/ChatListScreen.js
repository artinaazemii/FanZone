import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { Logo } from './Logo';

export default function ChatListScreen() {
  const [chatTeams, setChatTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const userSnap = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userSnap.exists()) {
          const { mainTeam, followingTeams = [] } = userSnap.data();
          setChatTeams([mainTeam, ...followingTeams]);
        }
      } catch (e) {
        console.error('Error fetching user teams:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const openChat = (team) => navigation.navigate('TeamChat', { teamId: team.id, teamName: team.name });

  if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color="#3498db" /></View>;

  return (
    <View style={styles.container}>
      <FlatList
        data={chatTeams}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.chatItem} onPress={() => openChat(item)}>
            <Logo id={item.id} size={40} />
            <Text style={styles.chatName}>{item.name} Chat</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  chatItem: { flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 8, backgroundColor: '#f5f5f5', borderRadius: 8 },
  chatName: { marginLeft: 12, fontSize: 16, fontWeight: 'bold' },
});