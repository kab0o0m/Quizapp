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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import logo from "../assets/puzzle.png";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function Login() {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const createProfile = async () => {
    // Validate input fields
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Invalid username, email, or password!");
      return;
    }

    try {
      // Store username in AsyncStorage (if needed)
      const data = { name: username, email: email, password: password };
      // Make POST request to backend
      const response = await axios.post("http://10.0.2.2:8080/register", data);

      console.log("Registration successful:", response.data);
      setUsername("");
      setEmail("");
      setPassword("");
      navigation.navigate("Login"); // Navigate to the next screen upon successful registration
    } catch (error) {
      // Handle API request errors
      console.error("Registration error:", error);
      Alert.alert("Registration failed. Please try again.");
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
          value={username}
          onChangeText={(text) => setUsername(text)}
          placeholder="NICKNAME"
        />
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholder="EMAIL"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholder="PASSWORD"
        />
        <Pressable onPress={createProfile} style={styles.button}>
          <Text style={styles.text}>Create Profile</Text>
        </Pressable>
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
    backgroundColor: "#6985F3",
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333333",
    fontFamily: "Montserrat-SemiBold",
  },
  prompt: {
    paddingVertical: 20,
    fontSize: 20,
  },
  input: {
    width: "80%",
    height: 60,
    borderWidth: 1,
    borderColor: "#FFF",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Montserrat-Bold",
    fontSize: 20,
    backgroundColor: "#FFF",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 90,
    backgroundColor: "#58CC03",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 5,
    borderRadius: 10,
    width: "80%",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
    fontFamily: "Montserrat-SemiBold",
  },
  textInput: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "black",
  },
  image: {
    width: 350,
    height: 350,
    resizeMode: "contain",
  },
  red: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "red",
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 90,
    backgroundColor: "#6985F3",
    width: "80%",
    marginTop: 10,
  },
  backText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "#2E2D2D",
  },
});
