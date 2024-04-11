import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import logo from "../assets/rubix.png";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Room() {
  const [room, setRoom] = useState(null);
  const [username, setUsername] = useState("");
  const navigation = useNavigation();

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  useEffect(() => {
    loadUsername();
  }, []);

  const loadUsername = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    } catch (error) {
      console.error("Error loading username from local storage:", error);
    }
  };

  const enterRoom = async () => {
    if (!room.trim()) {
      Alert.alert("Invalid room");
      return;
    }

    try {
      await AsyncStorage.setItem("room", room);
      setRoom(null);
      navigation.navigate("Question");
    } catch (e) {
      Alert.alert(e);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View>
          <Text style={styles.titleText}>QuizBiz 📚</Text>
        </View>
        <View style={styles.contentContainer}>
          <Image source={logo} style={styles.image} />
        </View>
        <Text style={styles.welcome}>Welcome {username}!</Text>
        <TextInput
          style={styles.input}
          value={room}
          onChangeText={(text) => setRoom(text)}
          placeholder="ROOM PIN"
        />
        <Pressable onPress={enterRoom} style={styles.button}>
          <Text style={styles.text}>LETS GO!</Text>
        </Pressable>
        <Button title="Back" onPress={() => navigation.navigate("Login")}></Button>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "azure",
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333333",
  },
  prompt: {
    paddingVertical: 20,
    fontSize: 20,
  },
  input: {
    width: "80%",
    height: 60,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10, // Reduced padding to 10 (adjust as needed)
    marginBottom: 20,
    textAlign: "center",
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
  },
  textInput: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "black",
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    marginBottom: 20,
  },
  welcome: {
    fontSize: 16,
    paddingBottom: 20,
  },
});
