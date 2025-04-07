import React from 'react';
import { TouchableOpacity, Image, StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebaseConfig';

const ProfileIcon = ({ size = 40, onPress }) => {
  const navigation = useNavigation();
  const user = auth.currentUser;

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate('Profile');
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      {user?.photoURL ? (
        <Image 
          source={{ uri: user.photoURL }} 
          style={[styles.avatar, { width: size, height: size }]} 
        />
      ) : (
        <View style={[styles.defaultAvatar, { width: size, height: size }]}>
          <Text style={styles.defaultAvatarText}>
            {user?.displayName?.charAt(0) || user?.email?.charAt(0) || '?'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatar: {
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  defaultAvatar: {
    borderRadius: 20,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  defaultAvatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default ProfileIcon;
