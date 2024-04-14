import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import logo from '../assets/puzzle.png';
import { apiClient } from '../lib/axios';
import * as SecureStore from 'expo-secure-store';

export default function Login() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const login = async () => {
    try {
      console.log(userData);
      const { data } = await apiClient.post('/login', userData);
      await SecureStore.setItemAsync('token', data?.token);
      await SecureStore.setItemAsync('email', data?.email);
      await SecureStore.setItemAsync('username', data?.username);
      navigation.navigate('Room');
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password'); // Provide user feedback
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss(); // Dismiss the keyboard
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.contentContainer}>
          <Image source={logo} style={styles.image} />
        </View>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setUserData({ ...userData, email: text })}
          placeholder="EMAIL"
        />
        <TextInput
          style={styles.input}
          onChangeText={(text) => setUserData({ ...userData, password: text })}
          placeholder="PASSWORD"
          secureTextEntry={true} // Hide password input
        />
        <Pressable onPress={login} style={styles.button}>
          <Text style={styles.text}>LOGIN</Text>
        </Pressable>
        {error ? <Text style={styles.red}>{error}</Text> : null}
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6985F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 60,
    borderWidth: 1,
    borderColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    backgroundColor: '#FFF',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 90,
    backgroundColor: '#58CC03',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 5,
    borderRadius: 10,
    width: '80%',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
    fontFamily: 'Montserrat-SemiBold',
  },
  red: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'red',
    marginBottom: 10,
  },
  backButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 90,
    backgroundColor: '#6985F3',
    width: '80%',
    marginTop: 10,
  },
  backText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: '#2E2D2D',
  },
  image: {
    width: 350,
    height: 350,
    resizeMode: 'contain',
  },
});
