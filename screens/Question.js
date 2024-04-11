import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Question() {
  const [isQuiz, setIsQuiz] = useState(false);

  useEffect(() => {
    //Check status of quiz from backend
  });

  return (
    <View>
      {!isQuiz && <Text>Please wait for your teacher to start the quiz..</Text>}
      {isQuiz && <View></View>}
    </View>
  );
}
