import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image
} from 'react-native';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const SignupScreen = ({ navigation }) => {
  // Always dark mode
  const isDark = true;
  const themeStyles = getStyles(isDark);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSignup = async () => {
    if (!email || !password || !firstName || !lastName) {
      Alert.alert("Error", "Please enter your first name, last name, email, and password.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: `${firstName} ${lastName}` });

      await setDoc(doc(db, 'users', user.uid), {
        displayName: `${firstName} ${lastName}`,
        mainTeam: null,
        followingTeams: [],
      });

      await sendEmailVerification(user);

      Alert.alert(
        "Verify Your Email",
        "A verification email has been sent. Please check your inbox before logging in."
      );

      await signOut(auth);
      navigation.replace('Login');

    } catch (error) {
      console.error("Signup error:", error.message);
      Alert.alert("Signup Failed", error.message);
    }
  };

  return (
    <View style={themeStyles.container}>
      <Image source={require('../assets/logo.png')} style={themeStyles.logo} />
      <Text style={themeStyles.title}>Sign Up</Text>

      <TextInput
        style={themeStyles.input}
        placeholder="First Name"
        placeholderTextColor="#aaa"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={themeStyles.input}
        placeholder="Last Name"
        placeholderTextColor="#aaa"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={themeStyles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={themeStyles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={themeStyles.signupButton} onPress={handleSignup}>
        <Text style={themeStyles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text onPress={() => navigation.navigate('Login')} style={themeStyles.link}>
        Already have an account? Log in
      </Text>
    </View>
  );
};

const getStyles = (isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#121212',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: '#fff',
    },
    input: {
      borderWidth: 1,
      padding: 10,
      marginBottom: 10,
      borderRadius: 5,
      borderColor: '#555',
      backgroundColor: '#222b3a',
      color: '#fff',
    },
    link: {
      marginTop: 10,
      color: '#5eb5ff',
      textAlign: 'center',
    },
    signupButton: {
      backgroundColor: '#185fcf',
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 10,
    },
    signupButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    logo: {
      width: 120,
      height: 120,
      alignSelf: 'center',
      marginBottom: 20,
      resizeMode: 'contain',
    },
  });

export default SignupScreen;
