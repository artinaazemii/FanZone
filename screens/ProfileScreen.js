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
  FlatList
} from 'react-native';
import { auth } from '../firebaseConfig';
import { doc, getDoc, updateDoc, getFirestore } from 'firebase/firestore';
import { signOut, sendPasswordResetEmail } from 'firebase/auth';

const db = getFirestore();

// Sample football teams data - same as in TeamSelectionScreen
const FOOTBALL_TEAMS = [
  { id: '1', name: 'Manchester United', logo: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQdidTvjgPdvdjwtelmSx8kkV6mhHETmS18aQKb7f6vqEgIYKrf' },
  { id: '2', name: 'Barcelona', logo: 'https://t3.gstatic.com/images?q=tbn:ANd9GcTdlZboGqqXYQquR6s1qeDckeEdPetLAHMKbDaMpE0Pyn009AoV' },
  { id: '3', name: 'Real Madrid', logo: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg' },
  { id: '4', name: 'Bayern Munich', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Logo_FC_Bayern_M%C3%BCnchen_%282002%E2%80%932017%29.svg' },
  { id: '5', name: 'Liverpool', logo: 'https://upload.wikimedia.org/wikipedia/sco/0/0c/Liverpool_FC.svg' },
  { id: '6', name: 'Chelsea', logo: 'https://upload.wikimedia.org/wikipedia/sco/c/cc/Chelsea_FC.svg' },
  { id: '7', name: 'Juventus', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Juventus_Logo.png' },
  { id: '8', name: 'PSG', logo: 'https://upload.wikimedia.org/wikipedia/sco/a/a7/Paris_Saint-Germain_F.C..svg' },
  { id: '9', name: 'Manchester City', logo: 'https://upload.wikimedia.org/wikipedia/sco/e/eb/Manchester_City_FC_badge.svg' },
  { id: '10', name: 'Arsenal', logo: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg' },
  { id: '11', name: 'AC Milan', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg' },
  { id: '12', name: 'Tottenham Hotspur', logo: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg' },
  { id: '13', name: 'AS Roma', logo: 'https://upload.wikimedia.org/wikipedia/en/f/f7/AS_Roma_logo_%282017%29.svg' },
  { id: '14', name: 'Inter Milan', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg' },
  { id: '15', name: 'Atletico Madrid', logo: 'https://upload.wikimedia.org/wikipedia/en/f/f9/Atletico_Madrid_Logo_2024.svg' },
  { id: '16', name: 'Sevilla FC', logo: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Sevilla_FC_logo.svg' },
  { id: '17', name: 'Borussia Dortmund', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg' },
  { id: '18', name: 'RB Leipzig', logo: 'https://upload.wikimedia.org/wikipedia/en/0/04/RB_Leipzig_2014_logo.svg' },
  { id: '19', name: 'Olympique Lyonnais', logo: 'https://upload.wikimedia.org/wikipedia/en/1/1c/Olympique_Lyonnais_logo.svg' },
  { id: '20', name: 'Marseille', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Olympique_Marseille_logo.svg' },
  { id: '21', name: 'FC Porto', logo: 'https://upload.wikimedia.org/wikipedia/en/f/f1/FC_Porto.svg' },
  { id: '22', name: 'Benfica', logo: 'https://upload.wikimedia.org/wikipedia/en/a/a2/SL_Benfica_logo.svg' },
  { id: '23', name: 'Ajax', logo: 'https://upload.wikimedia.org/wikipedia/en/7/79/Ajax_Amsterdam.svg' },
  { id: '24', name: 'PSV Eindhoven', logo: 'https://upload.wikimedia.org/wikipedia/en/0/05/PSV_Eindhoven.svg' },
  { id: '25', name: 'Galatasaray', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Galatasaray_Sports_Club_Logo.svg' },
  { id: '26', name: 'Boca Juniors', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Boca_Juniors_logo18.svg' },
  { id: '27', name: 'River Plate', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Escudo_del_C_A_River_Plate.svg' },
  { id: '28', name: 'Flamengo', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Flamengo_braz_logo.svg' },
  { id: '29', name: 'Sao Paulo FC', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Brasao_do_Sao_Paulo_Futebol_Clube.svg' },
  { id: '30', name: 'LA Galaxy', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Los_Angeles_Galaxy_logo.svg' },
  { id: '31', name: 'New York City FC', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_New_York_City_FC_2025.svg' },
  { id: '32', name: 'Villarreal CF', logo: 'https://upload.wikimedia.org/wikipedia/en/b/b9/Villarreal_CF_logo-en.svg' },
  { id: '33', name: 'Real Sociedad', logo: 'https://upload.wikimedia.org/wikipedia/en/f/f1/Real_Sociedad_logo.svg' },
  { id: '34', name: 'Athletic Bilbao', logo: 'https://upload.wikimedia.org/wikipedia/en/9/98/Club_Athletic_Bilbao_logo.svg' },
  { id: '35', name: 'Valencia CF', logo: 'https://upload.wikimedia.org/wikipedia/en/c/ce/Valenciacf.svg' },
  { id: '36', name: 'Wolverhampton Wanderers', logo: 'https://upload.wikimedia.org/wikipedia/sco/f/fc/Wolverhampton_Wanderers.svg' },
  { id: '37', name: 'Leicester City', logo: 'https://upload.wikimedia.org/wikipedia/en/2/2d/Leicester_City_crest.svg' },
  { id: '38', name: 'West Ham United', logo: 'https://upload.wikimedia.org/wikipedia/en/c/c2/West_Ham_United_FC_logo.svg' },
  { id: '39', name: 'Everton FC', logo: 'https://upload.wikimedia.org/wikipedia/sco/7/7c/Everton_FC_logo.svg' },
  { id: '40', name: 'Bayer Leverkusen', logo: 'https://upload.wikimedia.org/wikipedia/en/5/59/Bayer_04_Leverkusen_logo.svg' },
  { id: '41', name: 'Schalke 04', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/FC_Schalke_04_Logo.svg' },
  { id: '42', name: 'Werder Bremen', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/be/SV-Werder-Bremen-Logo.svg' },
  { id: '43', name: 'Eintracht Frankfurt', logo: 'https://upload.wikimedia.org/wikipedia/en/7/7e/Eintracht_Frankfurt_crest.svg' },
  { id: '44', name: 'Lyon', logo: 'https://upload.wikimedia.org/wikipedia/en/1/1c/Olympique_Lyonnais_logo.svg' },
  { id: '45', name: 'Nice', logo: 'https://upload.wikimedia.org/wikipedia/en/2/2e/OGC_Nice_logo.svg' },
  { id: '46', name: 'Celtic FC', logo: 'https://upload.wikimedia.org/wikipedia/en/7/71/Celtic_FC_crest.svg' },
  { id: '47', name: 'Rangers FC', logo: 'https://upload.wikimedia.org/wikipedia/en/4/43/Rangers_FC.svg' },
  { id: '48', name: 'Fenerbahçe', logo: 'https://upload.wikimedia.org/wikipedia/en/3/39/Fenerbah%C3%A7e.svg' },
  { id: '49', name: 'Trabzonspor', logo: 'https://1000logos.net/wp-content/uploads/2020/09/Trabzonspor-Logo.png' },
  { id: '50', name: 'Al Ahly SC', logo: 'https://upload.wikimedia.org/wikipedia/en/4/45/Al_Ahli_Saudi_FC_logo.svg' },
  { id: '52', name: 'Al Hilal', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Al_Hilal_SFC_Logo.svg' },
  { id: '53', name: 'Al Nassr', logo: 'https://upload.wikimedia.org/wikipedia/en/a/ac/Al_Nassr_FC_Logo.svg' },
  { id: '55', name: 'Guangzhou Evergrande', logo: 'https://upload.wikimedia.org/wikipedia/en/9/98/Guangzhou_Evergrande_Taobao_logo.svg' },
  { id: '56', name: 'Sydney FC', logo: 'https://upload.wikimedia.org/wikipedia/en/e/e0/Sydney_FC_Logo.svg' },
  { id: '57', name: 'Melbourne Victory', logo: 'https://upload.wikimedia.org/wikipedia/en/9/95/Melbourne_Victory.svg' },
  { id: '58', name: 'Kaizer Chiefs', logo: 'https://upload.wikimedia.org/wikipedia/en/1/16/Kaizer_Chiefs_logo.svg' },
  { id: '59', name: 'Orlando Pirates', logo: 'https://upload.wikimedia.org/wikipedia/en/9/95/Orlando_Pirates_FC_logo.svg' }
];


const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTeamEditor, setShowTeamEditor] = useState(false);
  const [tempTeams, setTempTeams] = useState({
    mainTeam: null,
    followingTeams: []
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
          setTempTeams({
            mainTeam: userDoc.data().mainTeam,
            followingTeams: userDoc.data().followingTeams || []
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const changePassword = () => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'User is not authenticated.');
      return;
    }

    sendPasswordResetEmail(auth, auth.currentUser.email)
      .then(() => {
        Alert.alert('Success', 'Password reset email sent!');
      })
      .catch((error) => {
        console.error('Error sending password reset email:', error);
        Alert.alert('Error', error.message);
      });
  };

  const saveTeamChanges = async () => {
    if (!tempTeams.mainTeam || tempTeams.followingTeams.length < 3) {
      Alert.alert('Selection Required', 'Please select 1 main team and 3 following teams');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        mainTeam: tempTeams.mainTeam,
        followingTeams: tempTeams.followingTeams
      });
      
      setUserData({
        ...userData,
        mainTeam: tempTeams.mainTeam,
        followingTeams: tempTeams.followingTeams
      });
      
      setShowTeamEditor(false);
      Alert.alert('Success', 'Your teams have been updated!');
    } catch (error) {
      console.error('Error updating teams:', error);
      Alert.alert('Error', 'Failed to update teams. Please try again.');
    }
  };

  const handleTeamSelect = (team) => {
    // If team is already selected as main, deselect it
    if (tempTeams.mainTeam && tempTeams.mainTeam.id === team.id) {
      setTempTeams(prev => ({...prev, mainTeam: null}));
      return;
    }

    // If team is in following teams, remove it
    if (tempTeams.followingTeams.some(t => t.id === team.id)) {
      setTempTeams(prev => ({
        ...prev,
        followingTeams: prev.followingTeams.filter(t => t.id !== team.id)
      }));
      return;
    }

    // If no main team selected, make this the main team
    if (!tempTeams.mainTeam) {
      setTempTeams(prev => ({...prev, mainTeam: team}));
      return;
    }

    // Otherwise, add to following teams if we have space
    if (tempTeams.followingTeams.length < 3) {
      setTempTeams(prev => ({
        ...prev,
        followingTeams: [...prev.followingTeams, team]
      }));
    } else {
      Alert.alert('Selection Limit', 'You can only select three teams to follow');
    }
  };

  const getTeamStatus = (team) => {
    if (tempTeams.mainTeam && tempTeams.mainTeam.id === team.id) return 'main';
    if (tempTeams.followingTeams.some(t => t.id === team.id)) return 'following';
    return 'none';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: auth.currentUser?.photoURL || 'https://via.placeholder.com/100' }}
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.userName}>{auth.currentUser?.displayName || 'Football Fan'}</Text>
        <Text style={styles.userEmail}>{auth.currentUser?.email}</Text>
      </View>

      <View style={styles.teamsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Teams</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setShowTeamEditor(true)}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
        
        {userData?.mainTeam && (
          <View style={styles.mainTeamContainer}>
            <Text style={styles.teamSectionTitle}>Main Team</Text>
            <View style={styles.mainTeamCard}>
              <Image source={{ uri: userData.mainTeam.logo }} style={styles.teamLogo} />
              <Text style={styles.mainTeamName}>{userData.mainTeam.name}</Text>
            </View>
          </View>
        )}

        {userData?.followingTeams && userData.followingTeams.length > 0 && (
          <View style={styles.followingTeamsContainer}>
            <Text style={styles.teamSectionTitle}>Teams I Follow</Text>
            <View style={styles.followingTeamsGrid}>
              {userData.followingTeams.map((team) => (
                <View key={team.id} style={styles.followingTeamCard}>
                  <Image source={{ uri: team.logo }} style={styles.teamLogo} />
                  <Text style={styles.followingTeamName}>{team.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.changePasswordButton} onPress={changePassword}>
        <Text style={styles.changePasswordText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>

      {/* Team Editor Modal */}
      <Modal
        visible={showTeamEditor}
        animationType="slide"
        onRequestClose={() => setShowTeamEditor(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Your Teams</Text>
            <TouchableOpacity onPress={() => setShowTeamEditor(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.instructionContainer}>
            <Text style={styles.instruction}>
              Select 1 main team and 3 teams to follow
            </Text>
            <Text style={styles.selectionStatus}>
              Main team: {tempTeams.mainTeam ? tempTeams.mainTeam.name : 'Not selected'}
            </Text>
            <Text style={styles.selectionStatus}>
              Following teams: {tempTeams.followingTeams.length}/3 selected
            </Text>
          </View>

          <FlatList
            data={FOOTBALL_TEAMS}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const status = getTeamStatus(item);
              return (
                <TouchableOpacity
                  style={[
                    styles.teamItem,
                    status === 'main' && styles.mainTeamItem,
                    status === 'following' && styles.followingTeamItem
                  ]}
                  onPress={() => handleTeamSelect(item)}
                >
                  <Image source={{ uri: item.logo }} style={styles.teamLogo} />
                  <Text style={styles.teamName}>{item.name}</Text>
                  {status === 'main' && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>Main</Text>
                    </View>
                  )}
                  {status === 'following' && (
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
              (!tempTeams.mainTeam || tempTeams.followingTeams.length < 3) && styles.disabledButton
            ]}
            onPress={saveTeamChanges}
            disabled={!tempTeams.mainTeam || tempTeams.followingTeams.length < 3}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#3498db',
    padding: 20,
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  teamsContainer: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#3498db',
    padding: 8,
    borderRadius: 4,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  teamSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#666',
  },
  mainTeamContainer: {
    marginBottom: 24,
  },
  mainTeamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  teamLogo: {
    width: 60,
    height: 60,
    marginRight: 16,
  },
  mainTeamName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  followingTeamsContainer: {
    marginBottom: 24,
  },
  followingTeamsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  followingTeamCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  followingTeamName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  signOutButton: {
    margin: 16,
    backgroundColor: '#f44336',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  changePasswordButton: {
    margin: 16,
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  changePasswordText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    color: '#3498db',
    fontSize: 16,
  },
  instructionContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  instruction: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  selectionStatus: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  teamItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  mainTeamItem: {
    backgroundColor: '#e8f4ff',
    borderWidth: 2,
    borderColor: '#3498db',
  },
  followingTeamItem: {
    backgroundColor: '#f0f9eb',
    borderWidth: 1,
    borderColor: '#67c23a',
  },
  badge: {
    backgroundColor: '#3498db',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  followingBadge: {
    backgroundColor: '#67c23a',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: '#b3b3b3',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;