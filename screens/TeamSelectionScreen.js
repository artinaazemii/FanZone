// TeamSelectionScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebaseConfig';
import { doc, setDoc, getFirestore } from 'firebase/firestore';

const logos = {
  '1':  require('../assets/crests/1.png'),
  '2':  require('../assets/crests/2.png'),
  '3':  require('../assets/crests/3.png'),
  '4':  require('../assets/crests/4.png'),
  '5':  require('../assets/crests/5.png'),
  '6':  require('../assets/crests/6.png'),
  '7':  require('../assets/crests/7.png'),
  '8':  require('../assets/crests/8.png'),
  '9':  require('../assets/crests/9.png'),
  '10': require('../assets/crests/10.png'),
  '11': require('../assets/crests/11.png'),
  '12': require('../assets/crests/12.png'),
  '13': require('../assets/crests/13.png'),
  '14': require('../assets/crests/14.png'),
  '15': require('../assets/crests/15.png'),
  '16': require('../assets/crests/16.png'),
  '17': require('../assets/crests/17.png'),
  '18': require('../assets/crests/18.png'),
  '19': require('../assets/crests/19.png'),
  '20': require('../assets/crests/20.png'),
  '21': require('../assets/crests/21.png'),
  '22': require('../assets/crests/22.png'),
  '23': require('../assets/crests/23.png'),
  '24': require('../assets/crests/24.png'),
  '25': require('../assets/crests/25.png'),
  '26': require('../assets/crests/26.png'),
  '27': require('../assets/crests/27.png'),
  '28': require('../assets/crests/28.png'),
  '29': require('../assets/crests/29.png'),
  '30': require('../assets/crests/30.png'),
  '31': require('../assets/crests/31.png'),
  '32': require('../assets/crests/32.png'),
  '33': require('../assets/crests/33.png'),
  '34': require('../assets/crests/34.png'),
  '35': require('../assets/crests/35.png'),
  '36': require('../assets/crests/36.png'),
  '37': require('../assets/crests/37.png'),
  '38': require('../assets/crests/38.png'),
  '39': require('../assets/crests/39.png'),
  '40': require('../assets/crests/40.png'),
  '41': require('../assets/crests/41.png'),
  '42': require('../assets/crests/42.png'),
  '43': require('../assets/crests/43.png'),
  '44': require('../assets/crests/44.png'),
  '45': require('../assets/crests/45.png'),
  '46': require('../assets/crests/46.png'),
  '47': require('../assets/crests/47.png'),
  '48': require('../assets/crests/48.png'),
  '49': require('../assets/crests/49.png'),
  '50': require('../assets/crests/50.png'),
  '51': require('../assets/crests/51.png'), 
  '52': require('../assets/crests/52.png'),
  '53': require('../assets/crests/53.png'),
  '54': require('../assets/crests/54.png'),
  '55': require('../assets/crests/55.png'),
  '56': require('../assets/crests/56.png'),
  '57': require('../assets/crests/57.png'),

};


const Logo = ({ id, size = 40, style }) => (
  <Image source={logos[id]} style={[{ width: size, height: size }, style]} />
);

const TEAMS = [
  { id: '1',  name: 'Manchester United' },      { id: '2',  name: 'Barcelona' },
  { id: '3',  name: 'Real Madrid' },            { id: '4',  name: 'Bayern Munich' },
  { id: '5',  name: 'Liverpool' },              { id: '6',  name: 'Chelsea' },
  { id: '7',  name: 'Juventus' },               { id: '8',  name: 'PSG' },
  { id: '9',  name: 'Manchester City' },        { id: '10', name: 'Arsenal' },
  { id: '11', name: 'AC Milan' },               { id: '12', name: 'Tottenham Hotspur' },
  { id: '13', name: 'AS Roma' },                { id: '14', name: 'Inter Milan' },
  { id: '15', name: 'Atletico Madrid' },        { id: '16', name: 'Sevilla FC' },
  { id: '17', name: 'Borussia Dortmund' },      { id: '18', name: 'RB Leipzig' },
  { id: '19', name: 'Olympique Lyonnais' },     { id: '20', name: 'Marseille' },
  { id: '21', name: 'FC Porto' },               { id: '22', name: 'Benfica' },
  { id: '23', name: 'Ajax' },                   { id: '24', name: 'PSV Eindhoven' },
  { id: '25', name: 'Galatasaray' },            { id: '26', name: 'Boca Juniors' },
  { id: '27', name: 'River Plate' },            { id: '28', name: 'Flamengo' },
  { id: '29', name: 'Sao Paulo FC' },           { id: '30', name: 'LA Galaxy' },
  { id: '31', name: 'New York City FC' },       { id: '32', name: 'Villarreal CF' },
  { id: '33', name: 'Real Sociedad' },          { id: '34', name: 'Athletic Bilbao' },
  { id: '35', name: 'Valencia CF' },            { id: '36', name: 'Wolverhampton' },
  { id: '37', name: 'Leicester City' },         { id: '38', name: 'West Ham United' },
  { id: '39', name: 'Everton FC' },             { id: '40', name: 'Bayer Leverkusen' },
  { id: '41', name: 'Schalke 04' },             { id: '42', name: 'Werder Bremen' },
  { id: '43', name: 'Eintracht Frankfurt' },    { id: '44', name: 'OGC Nice' },
  { id: '45', name: 'Celtic FC' },              { id: '46', name: 'Rangers FC' },
  { id: '47', name: 'Fenerbahçe' },             { id: '48', name: 'Trabzonspor' },
  { id: '49', name: 'Al Ahly SC' },             { id: '50', name: 'Al Hilal' },
  { id: '51', name: 'Al Nassr' },              
  { id: '52', name: 'Guangzhou Evergrande' },   { id: '53', name: 'Sydney FC' },
  { id: '54', name: 'Melbourne Victory' },      { id: '55', name: 'Kaizer Chiefs' },
  { id: '56', name: 'Orlando Pirates' },
];

const db = getFirestore();

const TeamSelectionScreen = () => {
  const [mainTeam, setMainTeam] = useState(null);
  const [followingTeams, setFollowingTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const { currentUser } = auth;


  const handleSelect = (team) => {
    if (mainTeam?.id === team.id) return setMainTeam(null);

    const isFollowing = followingTeams.some((t) => t.id === team.id);
    if (isFollowing)
      return setFollowingTeams(followingTeams.filter((t) => t.id !== team.id));

    if (!mainTeam) return setMainTeam(team);

    if (followingTeams.length < 3)
      return setFollowingTeams([...followingTeams, team]);

    Alert.alert('Selection limit', 'You can only follow three teams');
  };

  const statusOf = (team) =>
    mainTeam?.id === team.id
      ? 'main'
      : followingTeams.some((t) => t.id === team.id)
      ? 'following'
      : 'none';

  const save = async () => {
    if (!mainTeam)
      return Alert.alert('Select a main team first');
    if (followingTeams.length < 3)
      return Alert.alert('Select three following teams');

    setLoading(true);
    try {
      await setDoc(
        doc(db, 'users', currentUser.uid),
        {
          mainTeam: { id: mainTeam.id, name: mainTeam.name },
          followingTeams: followingTeams.map(({ id, name }) => ({ id, name })),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      navigation.reset({ index: 0, routes: [{ name: 'MainApp' }] });
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Could not save your teams');
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Teams</Text>

      <View style={styles.instructionContainer}>
        <Text style={styles.instruction}>Pick 1 main team and 3 to follow</Text>
        <Text style={styles.selectionStatus}>
          Main: {mainTeam ? mainTeam.name : '—'}
        </Text>
        <Text style={styles.selectionStatus}>
          Following: {followingTeams.length}/3
        </Text>
      </View>

      <FlatList
        data={TEAMS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const status = statusOf(item);
          return (
            <TouchableOpacity
              style={[
                styles.teamItem,
                status === 'main' && styles.mainItem,
                status === 'following' && styles.followItem,
              ]}
              onPress={() => handleSelect(item)}
            >
              <Logo id={item.id} style={{ marginRight: 12 }} />
              <Text style={styles.teamName}>{item.name}</Text>

              {status !== 'none' && (
                <View
                  style={[
                    styles.badge,
                    status === 'following' && styles.followBadge,
                  ]}
                >
                  <Text style={styles.badgeText}>
                    {status === 'main' ? 'Main' : 'Following'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
      />

      <TouchableOpacity
        style={[
          styles.saveButton,
          (!mainTeam || followingTeams.length < 3) && styles.disabledButton,
        ]}
        onPress={save}
        disabled={!mainTeam || followingTeams.length < 3 || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Continue</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  instructionContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  instruction: { fontSize: 16, marginBottom: 8, textAlign: 'center' },
  selectionStatus: { fontSize: 14, color: '#666', marginBottom: 4 },

  teamItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
  },
  mainItem: {
    backgroundColor: '#e8f4ff',
    borderWidth: 2,
    borderColor: '#3498db',
  },
  followItem: {
    backgroundColor: '#f0f9eb',
    borderWidth: 1,
    borderColor: '#67c23a',
  },
  teamName: { fontSize: 16, flex: 1 },

  badge: {
    backgroundColor: '#3498db',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  followBadge: { backgroundColor: '#67c23a' },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  saveButton: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: { backgroundColor: '#b3b3b3' },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default TeamSelectionScreen;
