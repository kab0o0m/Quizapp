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
import TimerProgress from "../components/TimerProgress";

export default function Question() {
  const [isQuiz, setIsQuiz] = useState(false);
  const [question, setQuestion] = useState("What sports do you like to play?");
  const [room, setRoom] = useState("");
  const [answers, setAnswers] = useState(["Basketball", "Soccer", "Cricket", "Volleyball"]);
  const [textStatus, setTextStatus] = useState(
    "Please wait for your teacher to start the question..."
  );

  const navigation = useNavigation();

  // Load room
  useEffect(() => {
    loadRoom();
  }, []);

  // Extract status of room, question and answers from backend
  // TODO

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
    setTextStatus("Please wait for the next question...");
  };

  const handleTimerComplete = () => {
    setIsQuiz(false);
    console.log("Times up");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable>
          <Text style={styles.backButton} onPress={back}>
            {"< Back"}
          </Text>
        </Pressable>
        <Text style={styles.roomText}>
          Room <Text style={styles.roomName}>{room}</Text>
        </Text>
      </View>
      {!isQuiz ? (
        <View style={styles.content}>
          <View style={styles.middleContent}>
            <Text style={styles.wait}>{textStatus}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.questionContent}>
          <TimerProgress durationInSeconds={15} onComplete={handleTimerComplete} />
          <View style={styles.middleContent}>
            <Text style={styles.wait}>{question}</Text>
          </View>

          <FlatList
            data={answers}
            numColumns={2}
            contentContainerStyle={styles.answerContainer}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.answerButton} onPress={() => submitAnswer(item)}>
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
    fontSize: 16,
    marginRight: 10,
    marginTop: 10,
  },
  roomText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    fontFamily: "Montserrat-Bold",
  },
  wait: {
    fontSize: 20,
    padding: 10,
    textAlign: "center",
    fontFamily: "Montserrat-Bold",
  },
  question: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  answerContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  answerButton: {
    width: "40%",
    aspectRatio: 2,
    backgroundColor: "midnightblue",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 20,
    marginHorizontal: "5%",
  },
  answerText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    fontFamily: "Montserrat-Bold",
  },
  roomName: {
    color: "#58CC03",
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
