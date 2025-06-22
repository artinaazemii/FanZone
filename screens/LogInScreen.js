import React, { useState } from 'react';
import {
  View, Text, TextInput, Alert,
  TouchableOpacity, Image, Platform, Modal, StyleSheet
} from 'react-native';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const LoginScreen = ({ navigation }) => {
 
  const isDark = true;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

      if (!user.emailVerified) {
        Alert.alert("Email Not Verified", "Please verify your email before logging in.");
        await auth.signOut();
        return;
      }

      const displayName = user.displayName || 'Football Fan';
      Alert.alert("Welcome", `Welcome ${displayName}!`);

    } catch (error) {
      console.error("Login error:", error.message);
      Alert.alert("Login Failed", "Invalid password or email");
    }
  };

  const forgetPassword = () => {
    if (Platform.OS === 'ios') {
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
        email
      );
    } else {
      setResetModalVisible(true);
    }
  };

  const themeStyles = getStyles(isDark);

  return (
    <View style={themeStyles.container}>
      <Image source={require('../assets/logo.png')} style={themeStyles.logo} />

      <Text style={themeStyles.title}>Login</Text>
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
      <TouchableOpacity style={themeStyles.loginButton} onPress={handleLogin}>
        <Text style={themeStyles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <Text onPress={() => navigation.navigate('Signup')} style={themeStyles.link}>
        Don't have an account? Sign up
      </Text>

      <TouchableOpacity onPress={forgetPassword} style={themeStyles.forgetPasswordContainer}>
        <Text style={themeStyles.link}>Forgot Password?</Text>
      </TouchableOpacity>

      {Platform.OS !== 'ios' && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={resetModalVisible}
          onRequestClose={() => setResetModalVisible(false)}
        >
          <View style={themeStyles.modalOverlay}>
            <View style={themeStyles.modalContainer}>
              <Text style={themeStyles.modalTitle}>Reset Password</Text>
              <Text style={{color: "#fff"}}>Please enter your email address:</Text>
              <TextInput
                style={themeStyles.modalInput}
                value={resetEmail}
                onChangeText={setResetEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Email"
                placeholderTextColor="#aaa"
              />
              <View style={themeStyles.modalButtonsContainer}>
                <TouchableOpacity
                  style={themeStyles.modalButton}
                  onPress={() => {
                    setResetModalVisible(false);
                    setResetEmail('');
                  }}
                >
                  <Text style={themeStyles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={themeStyles.modalButton}
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
                  <Text style={themeStyles.modalButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const getStyles = (isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
      backgroundColor: '#121212',
    },
    logo: {
      width: 120,
      height: 120,
      alignSelf: 'center',
      marginBottom: 20,
      resizeMode: 'contain',
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
      padding: 12,
      marginBottom: 15,
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
    forgetPasswordContainer: {
      marginTop: 10,
      alignItems: 'center',
    },
    loginButton: {
      backgroundColor: '#185fcf',
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 10,
    },
    loginButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: '80%',
      backgroundColor: '#181f2a',
      borderRadius: 8,
      padding: 20,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 15,
      textAlign: 'center',
      color: '#fff',
    },
    modalInput: {
      borderWidth: 1,
      padding: 10,
      marginBottom: 15,
      borderRadius: 5,
      borderColor: '#555',
      backgroundColor: '#222b3a',
      color: '#fff',
    },
    modalButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    modalButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: '#185fcf',
      borderRadius: 5,
    },
    modalButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });

export default LoginScreen;
