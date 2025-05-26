// ProfileIcon.js
import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const ProfileIcon = ({ size = 40, onPress }) => {
  const navigation = useNavigation();
  // keep local copy of photoURL
  const [photoURL, setPhotoURL] = useState(auth.currentUser?.photoURL);

  useEffect(() => {
    // subscribe to any changes (including updateProfile)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setPhotoURL(user?.photoURL);
    });
    return unsubscribe;
  }, []);

  const handlePress = () => {
    if (onPress) return onPress();
    navigation.navigate('Profile');
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      {photoURL ? (
        <Image
          source={{ uri: photoURL }}
          style={[
            styles.avatar,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        />
      ) : (
        <View
          style={[
            styles.defaultAvatar,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          <Text style={styles.defaultAvatarText}>
            {auth.currentUser?.displayName?.charAt(0) ||
              auth.currentUser?.email?.charAt(0) ||
              '?'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { marginRight: 12 },
  avatar: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  defaultAvatar: {
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  defaultAvatarText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProfileIcon;