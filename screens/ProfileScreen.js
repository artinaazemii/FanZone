// ProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
  Alert,
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  TextInput,
} from 'react-native';
import { auth } from '../firebaseConfig';
import {
  doc,
  getDoc,
  updateDoc,
  getFirestore,
} from 'firebase/firestore';
import {
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';

const db = getFirestore();

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

const Crest = ({ team, size = 60, style }) => (
  <Image
    source={logos[team.id] ?? { uri: team.logo }}
    style={[{ width: size, height: size }, style]}
  />
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

const ProfileScreen = () => {
  const [loading,   setLoading]   = useState(true);
  const [userData,  setUserData]  = useState(null);
  const [userPhoto, setUserPhoto] = useState(auth.currentUser?.photoURL);

  /* name modal */
  const [showName,  setShowName]  = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');

  /* teams modal */
  const [showTeams, setShowTeams] = useState(false);
  const [tempTeams, setTempTeams] = useState({ mainTeam: null, followingTeams: [] });

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (snap.exists()) {
          const d = snap.data();
          setUserData(d);
          setTempTeams({
            mainTeam: d.mainTeam,
            followingTeams: d.followingTeams || [],
          });
          setFirstName(d.firstName ?? auth.currentUser.displayName?.split(' ')[0] ?? '');
          setLastName (d.lastName  ?? auth.currentUser.displayName?.split(' ').slice(1).join(' ') ?? '');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveName = async () => {
    if (!firstName.trim() || !lastName.trim())
      return Alert.alert('Required', 'First and last name must not be empty');
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        firstName: firstName.trim(),
        lastName : lastName.trim(),
        updatedAt: new Date().toISOString(),
      });
      await updateProfile(auth.currentUser, {
        displayName: `${firstName.trim()} ${lastName.trim()}`,
      });
      setUserData((p) => ({ ...p, firstName, lastName }));
      setShowName(false);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const status = (team) =>
    tempTeams.mainTeam?.id === team.id
      ? 'main'
      : tempTeams.followingTeams.some((t) => t.id === team.id)
      ? 'following'
      : 'none';

  const toggleTeam = (team) => {
    if (tempTeams.mainTeam?.id === team.id)
      return setTempTeams((p) => ({ ...p, mainTeam: null }));

    if (tempTeams.followingTeams.some((t) => t.id === team.id))
      return setTempTeams((p) => ({
        ...p,
        followingTeams: p.followingTeams.filter((t) => t.id !== team.id),
      }));

    if (!tempTeams.mainTeam)
      return setTempTeams((p) => ({ ...p, mainTeam: team }));

    if (tempTeams.followingTeams.length < 3)
      return setTempTeams((p) => ({
        ...p,
        followingTeams: [...p.followingTeams, team],
      }));

    Alert.alert('Limit', 'Select only 3 following teams');
  };

  const saveTeams = async () => {
    if (!tempTeams.mainTeam || tempTeams.followingTeams.length < 3)
      return Alert.alert('Pick 1 main & 3 following teams');

    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        mainTeam: tempTeams.mainTeam,
        followingTeams: tempTeams.followingTeams,
        updatedAt: new Date().toISOString(),
      });
      setUserData((p) => ({
        ...p,
        mainTeam: tempTeams.mainTeam,
        followingTeams: tempTeams.followingTeams,
      }));
      setShowTeams(false);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  const displayName =
    (userData?.firstName && userData?.lastName)
      ? `${userData.firstName} ${userData.lastName}`
      : (auth.currentUser.displayName || 'Football Fan');

  
  return (
    <ScrollView style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') return;
            const res = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 1,
            });
            if (res.canceled) return;
            await updateProfile(auth.currentUser, { photoURL: res.assets[0].uri });
            await auth.currentUser.reload();
            setUserPhoto(auth.currentUser.photoURL);
          }}
        >
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: userPhoto || 'https://via.placeholder.com/100' }}
              style={styles.profileImage}
            />
          </View>
        </TouchableOpacity>

        <Text style={styles.userName}>{displayName}</Text>
        <TouchableOpacity onPress={() => setShowName(true)}>
          <Text style={styles.editNameLink}>Edit name</Text>
        </TouchableOpacity>
        <Text style={styles.userEmail}>{auth.currentUser.email}</Text>
      </View>

      {/* teams block */}
      <View style={styles.teamsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Teams</Text>
          <TouchableOpacity style={styles.editButton} onPress={() => setShowTeams(true)}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {userData?.mainTeam && (
          <View style={styles.mainTeamContainer}>
            <Text style={styles.teamSectionTitle}>Main Team</Text>
            <View style={styles.mainTeamCard}>
              <Crest team={userData.mainTeam} size={60} style={{ marginRight: 16 }} />
              <Text style={styles.mainTeamName}>{userData.mainTeam.name}</Text>
            </View>
          </View>
        )}

        {!!userData?.followingTeams?.length && (
          <View style={styles.followingTeamsContainer}>
            <Text style={styles.teamSectionTitle}>Teams I Follow</Text>
            <View style={styles.followingTeamsGrid}>
              {userData.followingTeams.map((t) => (
                <View key={t.id} style={styles.followingTeamCard}>
                  <Crest team={t} size={60} />
                  <Text style={styles.followingTeamName}>{t.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

    
      <TouchableOpacity
        style={styles.changePasswordButton}
        onPress={() =>
          sendPasswordResetEmail(auth, auth.currentUser.email)
            .then(() => Alert.alert('Email sent', 'Check your inbox'))
            .catch((err) => Alert.alert('Error', err.message))
        }
      >
        <Text style={styles.changePasswordText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signOutButton} onPress={() => signOut(auth)}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>

      <Modal visible={showName} animationType="fade" transparent onRequestClose={() => setShowName(false)}>
        <View style={styles.nameModalBackdrop}>
          <View style={styles.nameModalCard}>
            <Text style={styles.nameModalTitle}>Update your name</Text>

            <TextInput
              placeholder="First name"
              placeholderTextColor="#999"
              value={firstName}
              onChangeText={setFirstName}
              style={styles.nameInput}
            />
            <TextInput
              placeholder="Last name"
              placeholderTextColor="#999"
              value={lastName}
              onChangeText={setLastName}
              style={styles.nameInput}
            />

            <View style={styles.nameModalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setShowName(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.saveBtn]}
                onPress={saveName}
              >
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showTeams} animationType="slide" onRequestClose={() => setShowTeams(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Your Teams</Text>
            <TouchableOpacity onPress={() => setShowTeams(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.instructionContainer}>
            <Text style={styles.instruction}>Select 1 main team and 3 to follow</Text>
            <Text style={styles.selectionStatus}>
              Main: {tempTeams.mainTeam ? tempTeams.mainTeam.name : '—'}
            </Text>
            <Text style={styles.selectionStatus}>
              Following: {tempTeams.followingTeams.length}/3
            </Text>
          </View>

          <FlatList
            data={TEAMS}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const s = status(item);
              return (
                <TouchableOpacity
                  style={[
                    styles.teamItem,
                    s === 'main' && styles.mainTeamItem,
                    s === 'following' && styles.followingTeamItem,
                  ]}
                  onPress={() => toggleTeam(item)}
                >
                  <Crest team={item} size={40} style={{ marginRight: 12 }} />
                  <Text style={styles.teamName}>{item.name}</Text>
                  {s === 'main' && (
                    <View style={styles.badge}><Text style={styles.badgeText}>Main</Text></View>
                  )}
                  {s === 'following' && (
                    <View style={[styles.badge, styles.followingBadge]}>
                      <Text style={styles.badgeText}>Following</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            }}
          />

          <TouchableOpacity
            style={[
              styles.saveButton,
              (!tempTeams.mainTeam || tempTeams.followingTeams.length < 3) && styles.disabledButton,
            ]}
            disabled={!tempTeams.mainTeam || tempTeams.followingTeams.length < 3}
            onPress={saveTeams}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: { backgroundColor: '#3498db', padding: 20, alignItems: 'center' },
  profileImageContainer: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12, overflow: 'hidden',
  },
  profileImage: { width: 100, height: 100 },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  editNameLink: { color: '#fff', textDecorationLine: 'underline', marginTop: 4 },
  userEmail: { fontSize: 16, color: 'rgba(255,255,255,.8)', marginTop: 2 },

  teamsContainer: { padding: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold' },
  editButton: { backgroundColor: '#3498db', padding: 8, borderRadius: 4 },
  editButtonText: { color: '#fff', fontSize: 14 },

  teamSectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#666' },
  mainTeamContainer: { marginBottom: 24 },
  mainTeamCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 8, elevation: 2 },
  mainTeamName: { fontSize: 18, fontWeight: 'bold' },

  followingTeamsContainer: { marginBottom: 24 },
  followingTeamsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  followingTeamCard: { width: '48%', backgroundColor: '#fff', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 12, elevation: 1 },
  followingTeamName: { fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginTop: 8 },

  changePasswordButton: { margin: 16, backgroundColor: '#3498db', padding: 16, borderRadius: 8, alignItems: 'center' },
  changePasswordText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  signOutButton: { margin: 16, backgroundColor: '#f44336', padding: 16, borderRadius: 8, alignItems: 'center' },
  signOutButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  /* Name modal */
  nameModalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 },
  nameModalCard: { backgroundColor: '#fff', borderRadius: 12, padding: 24, elevation: 4 },
  nameModalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  nameInput: {
    backgroundColor: '#f5f5f5', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 16, marginBottom: 14, borderWidth: 1, borderColor: '#e0e0e0',
  },
  nameModalButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  modalBtn: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, marginLeft: 8 },
  cancelBtn: { backgroundColor: '#e0e0e0' },
  saveBtn: { backgroundColor: '#3498db' },
  cancelText: { color: '#333', fontSize: 16 },
  saveText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  /* Teams modal */
  modalContainer: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  closeButton: { color: '#3498db', fontSize: 16 },
  instructionContainer: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 },
  instruction: { fontSize: 16, marginBottom: 8, textAlign: 'center' },
  selectionStatus: { fontSize: 14, color: '#666', marginBottom: 4 },
  teamItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 8 },
  mainTeamItem: { backgroundColor: '#e8f4ff', borderWidth: 2, borderColor: '#3498db' },
  followingTeamItem: { backgroundColor: '#f0f9eb', borderWidth: 1, borderColor: '#67c23a' },
  teamName: { fontSize: 16, flex: 1 },
  badge: { backgroundColor: '#3498db', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  followingBadge: { backgroundColor: '#67c23a' },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  saveButton: { backgroundColor: '#3498db', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  disabledButton: { backgroundColor: '#b3b3b3' },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default ProfileScreen;
