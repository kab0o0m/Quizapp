import React, { useEffect, useState } from "react";
import { TextInput, View, StyleSheet, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { apiClient } from "../lib/axios";
import * as SecureStore from "expo-secure-store";

const Waiting = ({ route }) => {
  const [roomId, setRoomId] = useState(route.params.roomId || "");
  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState([]);
  const navigation = useNavigation();

  const getParticipants = async () => {
    try {
      const { data } = await apiClient.get(`rooms/${roomId}/participants`, {
        headers: {
          Authorization: `Bearer ${SecureStore.getItem("token")}`,
        },
      });

      setParticipants(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isConnected) {
      const stomp = Stomp.over(() => new SockJS(`http://192.168.1.64:8080/ws`));

      stomp.connect({ Authorization: `Bearer ${SecureStore.getItem("token")}` }, () => {
        setStompClient(stomp);
        setIsConnected(true);

        stomp.subscribe(`/topic/room/${roomId}`, (response) => {
          const newUser = JSON.parse(response.body);
          setParticipants((prevParticipants) => [...prevParticipants, newUser]);
        });

        stomp.subscribe(`/topic/room/${roomId}/start`, (response) => {
          navigation.navigate(`Question`, {
            roomId: roomId,
            questionId: 0,
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
    getParticipants();
    setIsConnected(true);
  });

  return (
    <View style={styles.container}>
      <Text style={styles.roomIdText}>Room {roomId}</Text>
      <View style={styles.messageContainer}>
        <Text style={styles.message}>Please wait for participants to join...</Text>
      </View>
      <View style={styles.participantsContainer}>
        {participants.map((el, index) => (
          <View key={index} style={styles.participantContainer}>
            <Text style={styles.participantText}>{el?.user?.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#6985F3",
  },
  roomIdText: {
    fontSize: 30,
    fontWeight: "bold",
    marginVertical: 50,
    color: "#FFF",
    fontFamily: "Montserrat",
  },
  message: {
    fontSize: 18,
    marginVertical: 30,
    fontFamily: "Montserrat",
    color: "#FFF",
  },
  participantsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  participantContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    marginRight: 10,
  },
  participantText: {
    fontSize: 20,
    color: "#333333",
    fontFamily: "Montserrat-SemiBold",
  },
});

export default Waiting;
