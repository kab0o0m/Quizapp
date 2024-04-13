import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  Pressable,
  TouchableOpacity,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function Question() {
  const [isQuiz, setIsQuiz] = useState(false);
  const [question, setQuestion] = useState("What sports do you like to play?");
  const [room, setRoom] = useState("");
  const [answers, setAnswers] = useState(["Basketball", "Soccer", "Cricket", "Volleyball"]);

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

  const submitAnswer = async (answer) => {
    //Submit answer to backend or check whether correct then submit score to backend
    console.log("Submitted ", answer);
    setIsQuiz(false);
  };

  return (
    <View style={styles.container}>
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
      {!isQuiz ? (
        <View style={styles.content}>
          <View style={styles.middleContent}>
            <Text style={styles.wait}>Please wait for your teacher to start the question...</Text>
          </View>
        </View>
      ) : (
        <View style={styles.questionContent}>
          <View style={styles.middleContent}>
            <Text style={styles.wait}>{question}</Text>
          </View>

          <FlatList
            data={answers}
            numColumns={2}
            contentContainerStyle={styles.answerContainer}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.answerButton} onPress={submitAnswer(item)}>
                <Text style={styles.answerText}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30,
    width: "100%",
  },
  backButton: {
    fontSize: 24,
    marginRight: 10,
  },
  roomText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  wait: {
    fontSize: 20,
    padding: 10,
    textAlign: "center",
  },
  question: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  answerContainer: {
    paddingHorizontal: 10, // Horizontal padding to create space between columns
    paddingTop: 10, // Top padding to create space between rows
  },
  answerButton: {
    width: "40%", // Width of each answer box (adjust based on desired spacing)
    aspectRatio: 2, // Maintain aspect ratio (adjust as needed for desired height)
    backgroundColor: "midnightblue",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 20, // Vertical spacing between answer boxes
    marginHorizontal: "5%", // Horizontal spacing between answer boxes
  },
  answerText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  roomName: {
    color: "#58CC03", // Example color
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },
  questionContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
    marginTop: 100,
  },
  middleContent: {
    flex: 1,
    justifyContent: "center",
  },
});
