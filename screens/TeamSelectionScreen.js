// screens/TeamSelectionScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc, arrayUnion } from 'firebase/firestore';
import Logo from './Logo';

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

export default function TeamSelectionScreen() {
  const [mainTeam, setMainTeam] = useState(null);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const nav = useNavigation();

  const handleSelect = (t) => {
    if (!mainTeam) return setMainTeam(t);
    if (mainTeam.id === t.id) return setMainTeam(null);
    const exists = following.some((f) => f.id === t.id);
    if (exists) return setFollowing(following.filter((f) => f.id !== t.id));
    if (following.length < 3) return setFollowing([...following, t]);
    Alert.alert('Limit reached', 'You can only follow 3 teams');
  };

  const save = async () => {
    if (!mainTeam) return Alert.alert('Select a main team first');
    if (following.length < 3) return Alert.alert('Select 3 following teams');

    setLoading(true);
    const uid = auth.currentUser.uid;
    try {
      await setDoc(
        doc(db, 'users', uid),
        {
          mainTeam,
          followingTeams: following,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      const participant = {
        uid,
        name: auth.currentUser.displayName || auth.currentUser.email,
      };
      const teams = [mainTeam, ...following];
      await Promise.all(
        teams.map((team) =>
          setDoc(
            doc(db, 'teamChats', team.id),
            { participants: arrayUnion(participant) },
            { merge: true }
          )
        )
      );

      nav.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Could not save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select 1 main + 3 to follow</Text>
      <FlatList
        data={TEAMS}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => {
          const isMain = mainTeam?.id === item.id;
          const isFollow = following.some((f) => f.id === item.id);
          return (
            <TouchableOpacity
              style={[
                styles.item,
                isMain && styles.mainItem,
                isFollow && styles.followItem,
              ]}
              onPress={() => handleSelect(item)}
            >
              <Logo id={item.id} size={40} style={{ marginRight: 12 }} />
              <Text>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.disabled]}
        onPress={save}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Continue</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 8,
  },
  mainItem: { borderWidth: 2, borderColor: '#3498db' },
  followItem: { borderWidth: 1, borderColor: '#67c23a' },
  button: { backgroundColor: '#3498db', padding: 16, borderRadius: 8, alignItems: 'center' },
  disabled: { backgroundColor: '#999' },
  btnText: { color: '#fff', fontSize: 16 },
});
