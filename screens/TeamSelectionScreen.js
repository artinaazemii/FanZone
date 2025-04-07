import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebaseConfig';
import { doc, setDoc, getFirestore } from 'firebase/firestore';

// Sample football teams data - you would fetch this from an API or Firebase
const FOOTBALL_TEAMS = [
  { id: '1', name: 'Manchester United', logo: 'https://via.placeholder.com/50' },
  { id: '2', name: 'Barcelona', logo: 'https://via.placeholder.com/50' },
  { id: '3', name: 'Real Madrid', logo: 'https://via.placeholder.com/50' },
  { id: '4', name: 'Bayern Munich', logo: 'https://via.placeholder.com/50' },
  { id: '5', name: 'Liverpool', logo: 'https://via.placeholder.com/50' },
  { id: '6', name: 'Chelsea', logo: 'https://via.placeholder.com/50' },
  { id: '7', name: 'Juventus', logo: 'https://via.placeholder.com/50' },
  { id: '8', name: 'PSG', logo: 'https://via.placeholder.com/50' },
  { id: '9', name: 'Manchester City', logo: 'https://via.placeholder.com/50' },
  { id: '10', name: 'Arsenal', logo: 'https://via.placeholder.com/50' },
];

const db = getFirestore();

const TeamSelectionScreen = () => {
  const [mainTeam, setMainTeam] = useState(null);
  const [followingTeams, setFollowingTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false); // New state to track save completion
  const navigation = useNavigation();
  const currentUser = auth.currentUser;

  const handleTeamSelect = (team) => {
    if (mainTeam && mainTeam.id === team.id) {
      // Deselect main team
      setMainTeam(null);
      return;
    }

    if (followingTeams.some(t => t.id === team.id)) {
      // Deselect following team
      setFollowingTeams(followingTeams.filter(t => t.id !== team.id));
      return;
    }

    if (!mainTeam) {
      // Select main team
      setMainTeam(team);
    } else if (followingTeams.length < 3) {
      // Select following team
      setFollowingTeams([...followingTeams, team]);
    } else {
      Alert.alert('Selection Limit', 'You can only select three teams to follow');
    }
  };

  const getTeamStatus = (team) => {
    if (mainTeam && mainTeam.id === team.id) return 'main';
    if (followingTeams.some(t => t.id === team.id)) return 'following';
    return 'none';
  };

  const saveTeamSelections = async () => {
    if (!mainTeam) {
      Alert.alert('Selection Required', 'Please select your main team');
      return;
    }

    if (followingTeams.length < 3) {
      Alert.alert('Selection Required', 'Please select three teams to follow');
      return;
    }

    setLoading(true);

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      
      await setDoc(userRef, {
        mainTeam: {
          id: mainTeam.id,
          name: mainTeam.name,
          logo: mainTeam.logo
        },
        followingTeams: followingTeams.map(team => ({
          id: team.id,
          name: team.name,
          logo: team.logo
        })),
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setIsSaved(true); // Mark as saved
    } catch (error) {
      console.error('Error saving team selections:', error);
      Alert.alert('Error', 'Failed to save your team selections. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger navigation when `isSaved` changes
  useEffect(() => {
    if (isSaved) {
      navigation.navigate('MainApp');
    }
  }, [isSaved]); // Trigger navigation when isSaved changes

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Teams</Text>
      
      <View style={styles.instructionContainer}>
        <Text style={styles.instruction}>
          Select 1 main team and 3 teams to follow
        </Text>
        <Text style={styles.selectionStatus}>
          Main team: {mainTeam ? mainTeam.name : 'Not selected'}
        </Text>
        <Text style={styles.selectionStatus}>
          Following teams: {followingTeams.length}/3 selected
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
          (!mainTeam || followingTeams.length < 3) && styles.disabledButton
        ]}
        onPress={saveTeamSelections}
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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
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
  teamLogo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  teamName: {
    fontSize: 16,
    flex: 1,
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

export default TeamSelectionScreen;
