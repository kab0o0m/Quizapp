import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, Alert, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function Question() {
  const [isQuiz, setIsQuiz] = useState(false);
  const [question, setQuestion] = useState(null);
  const [room, setRoom] = useState(null);

  const navigation = useNavigation();

  // Load room
  useEffect(() => {
    loadRoom();
  }, []);

  // Extract status of room, question and answers from backend
  // TODO
  useEffect(() => {});

  const loadRoom = async () => {
    try {
      currentRoom = await AsyncStorage.getItem("room");
      setRoom(currentRoom);
    } catch (err) {
      Alert.alert(err);
    }
  };

  const back = () => {
    Alert.alert("Are you sure you want to exit room?", "", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => {
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {!isQuiz ? (
        <View style={styles.content}>
          <View style={styles.header}>
            <Pressable>
              <Text style={styles.backButton} onPress={back}>
                {"<"}
              </Text>
            </Pressable>
            <Text style={styles.roomText}>
              Room <Text style={styles.roomName}>{room}</Text>
            </Text>
          </View>
          <View style={styles.middleContent}>
            <Text style={styles.wait}>Please wait for your teacher to start the quiz...</Text>
          </View>
        </View>
      ) : (
        <View>
          <Text>{question}</Text>
          <View></View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "azure",
    alignItems: "center",
    justifyContent: "space-around",
    padding: 20,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },
  roomText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  middleContent: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    width: "100%",
  },
  backButton: {
    fontSize: 24,
    marginRight: 10,
  },
  roomName: {
    color: "#58CC03", // Example color
  },
  wait: {
    fontSize: 20,
    padding: 1,
    textAlign: "center",
  },
});
