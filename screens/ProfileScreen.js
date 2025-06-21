// screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
  Alert,
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  TextInput,
  Image,
} from 'react-native';
import { auth, db } from '../firebaseConfig';
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import {
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import Logo from './Logo';

const TEAMS = [
  { id: '1',  name: 'Manchester United' },  { id: '2',  name: 'Barcelona' },
  { id: '3',  name: 'Real Madrid' },       { id: '4',  name: 'Bayern Munich' },
  { id: '5',  name: 'Liverpool' },         { id: '6',  name: 'Chelsea' },
  { id: '7',  name: 'Juventus' },          { id: '8',  name: 'PSG' },
  { id: '9',  name: 'Manchester City' },   { id: '10', name: 'Arsenal' },
  { id: '11', name: 'AC Milan' },          { id: '12', name: 'Tottenham Hotspur' },
  { id: '13', name: 'AS Roma' },           { id: '14', name: 'Inter Milan' },
  { id: '15', name: 'Atletico Madrid' },   { id: '16', name: 'Sevilla FC' },
  { id: '17', name: 'Borussia Dortmund' }, { id: '18', name: 'RB Leipzig' },
  { id: '19', name: 'Olympique Lyonnais' },{ id: '20', name: 'Marseille' },
  { id: '21', name: 'FC Porto' },          { id: '22', name: 'Benfica' },
  { id: '23', name: 'Ajax' },              { id: '24', name: 'PSV Eindhoven' },
  { id: '25', name: 'Galatasaray' },       { id: '26', name: 'Boca Juniors' },
  { id: '27', name: 'River Plate' },       { id: '28', name: 'Flamengo' },
  { id: '29', name: 'Sao Paulo FC' },      { id: '30', name: 'LA Galaxy' },
  { id: '31', name: 'New York City FC' },  { id: '32', name: 'Villarreal CF' },
  { id: '33', name: 'Real Sociedad' },     { id: '34', name: 'Athletic Bilbao' },
  { id: '35', name: 'Valencia CF' },       { id: '36', name: 'Wolverhampton' },
  { id: '37', name: 'Leicester City' },    { id: '38', name: 'West Ham United' },
  { id: '39', name: 'Everton FC' },        { id: '40', name: 'Bayer Leverkusen' },
  { id: '41', name: 'Schalke 04' },        { id: '42', name: 'Werder Bremen' },
  { id: '43', name: 'Eintracht Frankfurt' },{ id: '44', name: 'OGC Nice' },
  { id: '45', name: 'Celtic FC' },         { id: '46', name: 'Rangers FC' },
  { id: '47', name: 'Fenerbahçe' },        { id: '48', name: 'Trabzonspor' },
  { id: '49', name: 'Al Ahly SC' },        { id: '50', name: 'Al Hilal' },
  { id: '51', name: 'Al Nassr' },          { id: '52', name: 'Guangzhou Evergrande' },
  { id: '53', name: 'Sydney FC' },         { id: '54', name: 'Melbourne Victory' },
  { id: '55', name: 'Kaizer Chiefs' },     { id: '56', name: 'Orlando Pirates' },
];

const Crest = ({ team, size = 60, style }) => (
  <Logo id={team.id} size={size} style={style} />
);

export default function ProfileScreen() {
  const [loading, setLoading]   = useState(true);
  const [userData, setUserData] = useState(null);
  const [userPhoto, setUserPhoto] = useState(auth.currentUser?.photoURL);

  /* modal “name” */
  const [showName,  setShowName]  = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');

  /* modal “teams” */
  const [showTeams, setShowTeams] = useState(false);
  const [temp, setTemp] = useState({ mainTeam: null, followingTeams: [] });

  /* ───────── ngarkimi fillestar ───────── */
  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (snap.exists()) {
          const d = snap.data();
          setUserData(d);
          setTemp({
            mainTeam: d.mainTeam,
            followingTeams: d.followingTeams ?? [],
          });
          setFirstName(d.firstName ?? '');
          setLastName(d.lastName ?? '');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ───────── helpers ───────── */
  const status = (team) =>
    temp.mainTeam?.id === team.id
      ? 'main'
      : temp.followingTeams.some((t) => t.id === team.id)
      ? 'following'
      : 'none';

  const toggleTeam = (team) => {
    if (temp.mainTeam?.id === team.id)
      return setTemp((p) => ({ ...p, mainTeam: null }));

    if (temp.followingTeams.some((t) => t.id === team.id))
      return setTemp((p) => ({
        ...p,
        followingTeams: p.followingTeams.filter((t) => t.id !== team.id),
      }));

    if (!temp.mainTeam)
      return setTemp((p) => ({ ...p, mainTeam: team }));

    if (temp.followingTeams.length < 3)
      return setTemp((p) => ({
        ...p,
        followingTeams: [...p.followingTeams, team],
      }));

    Alert.alert('Limit', 'Select only 3 following teams');
  };

  /* ───────── save name ───────── */
  const saveName = async () => {
    if (!firstName.trim() || !lastName.trim())
      return Alert.alert('Required', 'First and last name must not be empty');
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
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

  /* ───────── save teams ───────── */
  const saveTeams = async () => {
    if (!temp.mainTeam || temp.followingTeams.length < 3)
      return Alert.alert('Pick 1 main & 3 following teams');

    const uid = auth.currentUser.uid;
    const oldMain   = userData.mainTeam;
    const oldFollow = userData.followingTeams ?? [];
    const newTeams  = [temp.mainTeam, ...temp.followingTeams];

    try {
      /* update user doc */
      await updateDoc(doc(db, 'users', uid), {
        mainTeam: temp.mainTeam,
        followingTeams: temp.followingTeams,
        updatedAt: new Date().toISOString(),
      });
      setUserData((p) => ({
        ...p,
        mainTeam: temp.mainTeam,
        followingTeams: temp.followingTeams,
      }));
      setShowTeams(false);

      /* teams added / removed */
      const removed = [
        ...(oldMain && !newTeams.some((t) => t.id === oldMain.id) ? [oldMain] : []),
        ...oldFollow.filter((t) => !newTeams.some((n) => n.id === t.id)),
      ];
      const added = newTeams.filter(
        (t) => ![oldMain, ...oldFollow].some((o) => o?.id === t.id)
      );

      /* leave removed teams */
      await Promise.all(
        removed.map((team) =>
          deleteDoc(doc(db, 'teamChats', team.id, 'members', uid)).catch(() => {})
        )
      );

      /* join added teams */
      const participant = {
        displayName: auth.currentUser.displayName || auth.currentUser.email,
        joinedAt: serverTimestamp(),
      };
      await Promise.all(
        added.map((team) =>
          setDoc(
            doc(db, 'teamChats', team.id, 'members', uid),
            participant,
            { merge: true }
          )
        )
      );
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  /* ───────── UI ───────── */
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  const displayName =
    userData?.firstName && userData?.lastName
      ? `${userData.firstName} ${userData.lastName}`
      : auth.currentUser.displayName || 'Football Fan';

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

      {/* teams */}
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

      {/* other buttons */}
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

      {/* ───────── Modal Name ───────── */}
      <Modal visible={showName} animationType="fade" transparent onRequestClose={() => setShowName(false)}>
        <View style={styles.nameBackdrop}>
          <View style={styles.nameCard}>
            <Text style={styles.modalTitle}>Update your name</Text>
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
            <View style={styles.rowEnd}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => setShowName(false)}>
                <Text style={styles.btnCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.btnSave]} onPress={saveName}>
                <Text style={styles.btnSaveTxt}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ───────── Modal Teams ───────── */}
      <Modal
        visible={showTeams}
        animationType="slide"
        onRequestClose={() => setShowTeams(false)}
      >
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
              Main: {temp.mainTeam ? temp.mainTeam.name : '—'}
            </Text>
            <Text style={styles.selectionStatus}>
              Following: {temp.followingTeams.length}/3
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
                    s === 'main' && styles.mainItem,
                    s === 'following' && styles.followItem,
                  ]}
                  onPress={() => toggleTeam(item)}
                >
                  <Crest team={item} size={40} style={{ marginRight: 12 }} />
                  <Text style={styles.teamName}>{item.name}</Text>
                  {s === 'main' && (
                    <View style={styles.badge}><Text style={styles.badgeTxt}>Main</Text></View>
                  )}
                  {s === 'following' && (
                    <View style={[styles.badge, styles.badgeFollow]}>
                      <Text style={styles.badgeTxt}>Following</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            }}
          />

          <TouchableOpacity
            style={[
              styles.saveButton,
              (!temp.mainTeam || temp.followingTeams.length < 3) && styles.disabled,
            ]}
            disabled={!temp.mainTeam || temp.followingTeams.length < 3}
            onPress={saveTeams}
          >
            <Text style={styles.saveBtnTxt}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}

/* ───────── styles ───────── */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  /* header */
  header: { backgroundColor: '#0a3d62', padding: 20, alignItems: 'center' },
  profileImageContainer: {
    width: 100, height: 100, borderRadius: 50, overflow: 'hidden',
    backgroundColor: '#2c2c2e', justifyContent: 'center', alignItems: 'center', marginBottom: 12
  },
  profileImage: { width: 100, height: 100 },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  editNameLink: { color: '#fff', textDecorationLine: 'underline', marginTop: 4 },
  userEmail: { fontSize: 16, color: 'rgba(255,255,255,.8)', marginTop: 2 },

  /* teams block */
  teamsContainer: { padding: 16 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  editButton: { backgroundColor: '#0a3d62', padding: 8, borderRadius: 4 },
  editButtonText: { color: '#fff', fontSize: 14 },

  teamSectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#ccc' },
  mainTeamContainer: { marginBottom: 24 },
  mainTeamCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#1f1f1f',
    padding: 16, borderRadius: 8, elevation: 2,
  },
  mainTeamName: { fontSize: 18, fontWeight: 'bold', color: '#fff' },

  followingTeamsContainer: { marginBottom: 24 },
  followingTeamsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  followingTeamCard: {
    width: '48%', backgroundColor: '#1f1f1f', padding: 12,
    borderRadius: 8, alignItems: 'center', marginBottom: 12, elevation: 1,
  },
  followingTeamName: { fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginTop: 8, color: '#fff' },

  /* other buttons */
  changePasswordButton: {
    margin: 16, backgroundColor: '#0a3d62', padding: 16, borderRadius: 8, alignItems: 'center',
  },
  changePasswordText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  signOutButton: {
    margin: 16, backgroundColor: '#d32f2f', padding: 16, borderRadius: 8, alignItems: 'center',
  },
  signOutButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  /* modal name */
  nameBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,.6)', justifyContent: 'center', padding: 24 },
  nameCard: { backgroundColor: '#1f1f1f', borderRadius: 12, padding: 24, elevation: 4 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#fff' },
  nameInput: {
    backgroundColor: '#2c2c2e', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 16, marginBottom: 14, borderWidth: 1, borderColor: '#333', color: '#fff',
  },
  rowEnd: { flexDirection: 'row', justifyContent: 'flex-end' },
  modalBtn: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, marginLeft: 8 },
  btnCancel: { color: '#ccc', fontSize: 16 },
  btnSave: { backgroundColor: '#0a3d62' },
  btnSaveTxt: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  /* modal teams */
  modalContainer: { flex: 1, padding: 16, backgroundColor: '#121212' },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20,
  },
  closeButton: { color: '#0a3d62', fontSize: 16 },
  instructionContainer: {
    backgroundColor: '#1f1f1f', padding: 16, borderRadius: 8, marginBottom: 16,
  },
  instruction: { fontSize: 16, marginBottom: 8, textAlign: 'center', color: '#fff' },
  selectionStatus: { fontSize: 14, color: '#ccc', marginBottom: 4 },

  teamItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#1f1f1f',
    padding: 12, borderRadius: 8, marginBottom: 8,
  },
  mainItem: { backgroundColor: '#003366', borderWidth: 2, borderColor: '#0a3d62' },
  followItem: { backgroundColor: '#1b3c1b', borderWidth: 1, borderColor: '#67c23a' },
  teamName: { fontSize: 16, flex: 1, color: '#fff' },

  badge: { backgroundColor: '#0a3d62', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeFollow: { backgroundColor: '#67c23a' },
  badgeTxt: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  saveButton: {
    backgroundColor: '#0a3d62', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 16,
  },
  disabled: { backgroundColor: '#444' },
  saveBtnTxt: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

