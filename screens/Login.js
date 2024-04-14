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
import { apiClient } from "../lib/axios";

export default function Login() {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    //Post username to backend
    if (!username.trim()) {
      Alert.alert("Invalid username");
      return;
    }
    // Add in add profile in backend here
    try {
      console.log("test");
      data = { email: username, password: password };
      const response = await axios.post("http://10.0.2.2:8080/login", data);
      const response = await apiClient.post("/login", data);

      console.log("Login successful:", response.data);
      const dataString = JSON.stringify(response.data);

      await AsyncStorage.setItem("user", dataString);

      setUsername("");
      setPassword("");
      navigation.navigate("Room");
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("Enter correct email and password!");
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
          placeholder="EMAIL"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholder="PASSWORD"
        />
        <Pressable onPress={login} style={styles.button}>
          <Text style={styles.text}>LOGIN</Text>
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
    marginBottom: 20,
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
