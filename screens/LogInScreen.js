import React, { useState } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, Alert,
  TouchableOpacity, Image, Platform, Modal
} from 'react-native';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 
  // States for Android password reset modal
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both fields.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if email is verified
      if (!user.emailVerified) {
        Alert.alert("Email Not Verified", "Please verify your email before logging in.");
        await auth.signOut(); // Log the user out if email is not verified
        return;
      }
     
      // Display a welcome message with the user's display name.
      // (Display name was set during sign up by updateProfile.)
      const displayName = user.displayName || 'Football Fan';
      Alert.alert("Welcome", `Welcome ${displayName}!`);

      // Navigate to the main app screen after successful login
      navigation.replace('Main');
    } catch (error) {
      console.error("Login error:", error.message);
      Alert.alert("Login Failed", "Invalid password or email");
    }
  };

  const forgetPassword = () => {
    if (Platform.OS === 'ios') {
      // Use Alert.prompt on iOS
      Alert.prompt(
        "Reset Password",
        "Please enter your email address for password reset",
        (text) => {
          if (!text) {
            Alert.alert("Error", "Email is required for password reset");
            return;
          }
          sendPasswordResetEmail(auth, text)
            .then(() => {
              Alert.alert("Success", "Password reset email sent! Please check your inbox.");
            })
            .catch((error) => {
              console.error("Reset error:", error.message);
              Alert.alert("Error", "Invalid password or email");
            });
        },
        "plain-text",
        email // default value, if available
      );
    } else {
      // For Android, show a custom modal to input email
      setResetModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo at the top */}
      <Image source={require('../assets/logo.png')} style={styles.logo} />

      <Text style={styles.title}>Login</Text>
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
      <Button title="Login" onPress={handleLogin} />

      {/* "Don't have an account?" Text */}
      <Text onPress={() => navigation.navigate('Signup')} style={styles.link}>
        Don't have an account? Sign up
      </Text>

      {/* "Forget Password?" Touchable */}
      <TouchableOpacity onPress={forgetPassword} style={styles.forgetPasswordContainer}>
        <Text style={styles.link}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Android Reset Password Modal */}
      {Platform.OS !== 'ios' && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={resetModalVisible}
          onRequestClose={() => setResetModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Reset Password</Text>
              <Text>Please enter your email address:</Text>
              <TextInput
                style={styles.modalInput}
                value={resetEmail}
                onChangeText={setResetEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Email"
              />
              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    setResetModalVisible(false);
                    setResetEmail('');
                  }}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    if (!resetEmail) {
                      Alert.alert("Error", "Email is required for password reset");
                      return;
                    }
                    sendPasswordResetEmail(auth, resetEmail)
                      .then(() => {
                        Alert.alert("Success", "Password reset email sent! Please check your inbox.");
                        setResetModalVisible(false);
                        setResetEmail('');
                      })
                      .catch((error) => {
                        console.error("Reset error:", error.message);
                        Alert.alert("Error", "Invalid password or email");
                      });
                  }}
                >
                  <Text style={styles.modalButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
    resizeMode: 'contain'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 15,
    borderRadius: 5,
    borderColor: '#ccc'
  },
  link: {
    marginTop: 10,
    color: 'blue',
    textAlign: 'center'
  },
  forgetPasswordContainer: {
    marginTop: 10,
    alignItems: 'center'
  },
  // Modal styles for Android
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    elevation: 5
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },
  modalInput: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    borderColor: '#ccc'
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#3498db',
    borderRadius: 5
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});

export default LoginScreen;