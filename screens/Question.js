import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
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
          navigation.navigate(`RoomResult`, {
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
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>User Question</Text>
      <Text>{question?.questionText}?</Text>
      <View>
        {question?.choices?.map((choice, index) => (
          <Text key={index} onPress={() => handleAnswerQuestion(choice?.id)}>
            {choice.choiceText}
          </Text>
        ))}
      </View>
    </View>
  );
}
