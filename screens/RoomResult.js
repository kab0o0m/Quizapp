import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { apiClient } from '../lib/axios';

const RoomResult = ({ route }) => {
    const [participants, setParticipants] = useState([]);
    const navigation = useNavigation();

    const getParticipants = async () => {
        try {
            const { data } = await apiClient.get(`rooms/${route.params.id}/participants`, {
                headers: {
                    Authorization: `Bearer ${await SecureStore.getItemAsync("token")}`
                }
            });

            setParticipants(data.sort((a, b) => b.score - a.score));
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getParticipants();
    }, []);

    return (
        <View>
            <Text>Room: {route.params.id}</Text>
            <Text>Participants: </Text>
            <View>
                {
                    participants.map((el, index) => (
                        <View key={index}>
                            <Text>{index + 1}. {el?.user?.name}</Text>
                            <Text>score: {el.score}</Text>
                        </View>
                    ))
                }
            </View>
            <View onPress={() => navigation.navigate("Home")}>Home</View>
        </View>
    );
}

export default RoomResult;
