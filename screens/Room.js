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
import logo from "../assets/puzzle.png";
import { Stomp } from "@stomp/stompjs";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SockJS from "sockjs-client";

export default function Room() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const [token, setToken] = useState("");
  const [roomId, setRoomId] = useState(null);

  const navigation = useNavigation();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isConnected) {
      const stomp = Stomp.over(() => new SockJS(`http://192.168.9.124:8080/ws`));

      stomp.connect(
        {
          Authorization: `Bearer ${token}`,
        },
        () => {
          setStompClient(stomp);
          setIsConnected(true);

          /*  stomp.subscribe(`/topic/room/${roomId}`, (response) => {
             const newMessage = JSON.parse(response.body);
             console.log(newMessage);
           }); */
        }
      );

      return () => {
        if (stompClient) {
          stompClient.disconnect();
        }
      };
    }
  }, [isConnected]);

  useEffect(() => {
    loadUsername();
  }, []);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  console.log(roomId);

  const loadUsername = async () => {
    try {
      const dataString = await AsyncStorage.getItem("user");
      let storedData = {};
      if (dataString) {
        storedData = JSON.parse(dataString);
        console.log("Stored data", storedData);
        setUsername(storedData.username);
        setPassword(storedData.password);
        setToken(storedData.token);
      }

      setIsConnected(true);
    } catch (error) {
      console.error("Error loading user from local storage:", error);
    }
  };

  const handleJoinRoom = async () => {
    console.log("test")
    if (stompClient) {
      stompClient.send(`/app/room/${roomId}/join`, {}, JSON.stringify({ roomId: roomId }));
    }
  };

  console.log(roomId);

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.contentContainer}>
          <Image source={logo} style={styles.image} />
        </View>
        <Text style={styles.welcome}>Welcome {username}!</Text>
        <TextInput
          style={styles.input}
          onChangeText={roomId => setRoomId(roomId)}
          placeholder="ROOM PIN"
          keyboardType="numeric"
        />
        <Pressable onPress={handleJoinRoom} style={styles.button}>
          <Text style={styles.text}>LETS GO!</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
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
    color: "#FFF",
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
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10, // Reduced padding to 10 (adjust as needed)
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Montserrat-Bold",
    backgroundColor: "#FFF",
    fontSize: 20,
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
    fontFamily: "Montserrat-SemiBold",
  },
  image: {
    width: 350,
    height: 350,
    resizeMode: "contain",
    marginBottom: 20,
  },
  welcome: {
    fontSize: 25,
    paddingBottom: 20,
    fontFamily: "Montserrat-SemiBold",
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
