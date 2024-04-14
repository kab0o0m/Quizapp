import React, { useEffect, useState } from 'react';
import { TextInput, View, StyleSheet, Text, Button } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { apiClient } from '../lib/axios';
import * as SecureStore from 'expo-secure-store';

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
                    Authorization: `Bearer ${SecureStore.getItem('token')}`
                }
            });

            setParticipants(data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (isConnected) {
            const stomp = Stomp.over(() => new SockJS(`http://192.168.9.124:8080/ws`));

            stomp.connect({ Authorization: `Bearer ${SecureStore.getItem('token')}` }, () => {
                setStompClient(stomp);
                setIsConnected(true);

                stomp.subscribe(`/topic/room/${roomId}`, (response) => {
                    const newUser = JSON.parse(response.body);
                    setParticipants(prevParticipants => [...prevParticipants, newUser]);
                });

                stomp.subscribe(`/topic/room/${roomId}/start`, (response) => {
                    navigation.navigate(`Question`, {
                        roomId: roomId,
                        questionId: 0
                    });
                })
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
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.roomIdText}>Room ID: {roomId}</Text>
            <View>
                {
                    participants.map((el, index) => (
                        <View key={index}>
                            <Text>{index + 1}. {el?.user?.name}</Text>
                        </View>
                    ))
                }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        height: 40,
        width: 200,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    roomIdText: {
        fontSize: 18,
        marginBottom: 10,
    },
});

export default Waiting;
