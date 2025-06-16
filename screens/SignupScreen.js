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
import { doc, setDoc } from 'firebase/firestore'; // ← shtuar për Firestore

const SignupScreen = ({ navigation }) => {
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
      // Hapi 1: Krijo përdoruesin
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Hapi 2: Përditëso emrin në profil
      await updateProfile(user, { displayName: `${firstName} ${lastName}` });

      // Hapi 3: Krijo dokumentin në Firestore për këtë përdorues
      await setDoc(doc(db, 'users', user.uid), {
        displayName: `${firstName} ${lastName}`,
        mainTeam: null,
        followingTeams: [],
      });

      // Hapi 4: Dërgo email verifikimi
      await sendEmailVerification(user);

      // Hapi 5: Paralajmëro përdoruesin dhe dil nga llogaria
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
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text onPress={() => navigation.navigate('Login')} style={styles.link}>
        Already have an account? Log in
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5
  },
  link: {
    marginTop: 10,
    color: 'blue',
    textAlign: 'center'
  },
  signupButton: {
    backgroundColor: '#007aff',
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
