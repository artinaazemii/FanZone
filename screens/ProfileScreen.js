import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { auth } from '../firebaseConfig';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { sendPasswordResetEmail } from 'firebase/auth';


const db = getFirestore();

// change password
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

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));

        if (userDoc.exists()) {
          setUserData(userDoc.data());
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
      // Navigation will be handled by your auth state listener in App.js
    } catch (error) {
      console.error('Error signing out:', error);
    }
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
        <Text style={styles.sectionTitle}>My Teams</Text>
        
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

      <TouchableOpacity style={styles.changePasswordButton} onPress={() =>{ changePassword()}}>
        <Text style={styles.changePasswordText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
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
    margin: 12,
    backgroundColor: '#f44336',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  changePasswordText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;