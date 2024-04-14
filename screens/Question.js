import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { apiClient } from "../lib/axios";

export default function RoomDetail({ route }) {
  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [question, setQuestion] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    if (!isConnected) {
      const stomp = Stomp.over(() => new SockJS(`http://10.0.2.2:8080/ws`));

      stomp.connect({ Authorization: `Bearer ${SecureStore.getItem("token")}` }, () => {
        setStompClient(stomp);
        setIsConnected(true);

        stomp.subscribe(`/topic/room/${route.params.roomId}/question`, (response) => {
          const questionId = JSON.parse(response.body);
          console.log(questionId);
          navigation.navigate(`Question`, { roomId: route.params.roomId, questionId: questionId });
        });

        stomp.subscribe(`/topic/room/${route.params.roomId}/mark-question`, (response) => {
          console.log("test");
          handleAnswerQuestion(-1);
        });

        stomp.subscribe(`/topic/room/${route.params.roomId}/end`, (response) => {
          navigation.navigate(`Room`, {
            roomId: route.params.roomId,
            questionId: route.params.questionId,
          });
        });
      });

      return () => {
        if (stompClient) {
          stompClient.disconnect();
        }
      };
    }
  }, [isConnected]);

  useEffect(() => {
    setIsConnected(true);
    getQuestions();
  }, [route.params.questionId]);

  const getQuestions = async () => {
    try {
      const { data } = await apiClient.get(
        `/rooms/${route.params.roomId}/question/${route.params.questionId}`,
        {
          headers: {
            Authorization: `Bearer ${SecureStore.getItem("token")}`,
          },
        }
      );

      setQuestion(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnswerQuestion = async (choiceId) => {
    try {
      console.log(choiceId);
      const answer = {
        userChoice: choiceId,
        roomId: route.params.roomId,
        questionId: route.params.questionId,
      };

      await apiClient.post("/user-attempt", answer, {
        headers: {
          Authorization: `Bearer ${SecureStore.getItem("token")}`,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ROOM: {route.params.roomId}</Text>
      <Text style={styles.questionText}>{question?.questionText}?</Text>
      <View style={styles.choicesContainer}>
        {question?.choices?.map((choice, index) => (
          <TouchableOpacity
            key={index}
            style={styles.choice}
            onPress={() => handleAnswerQuestion(choice?.id)}>
            <Text style={styles.choiceText}>{choice.choiceText}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6985F3",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 200,
    marginBottom: 50,
    fontFamily: "Montserrat",
    color: "#FFF",
  },
  questionText: {
    fontSize: 18,
    marginBottom: 20,
    fontFamily: "Montserrat",
    color: "#FFF",
  },
  choicesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 150,
  },
  choice: {
    backgroundColor: "#EAEAEA",
    paddingVertical: 120,
    paddingHorizontal: 75,
    marginBottom: 20,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: "2%",
  },
  choiceText: {
    fontSize: 18,
    color: "#333333",
    fontFamily: "Montserrat-Bold",
  },
});
