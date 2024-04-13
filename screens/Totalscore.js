import React, { useEffect, useState } from "react";
import { View } from "react-native";

export default function Totalscore() {
  const [score, setScore] = useState(0);
  const [user, setUser] = useState("");

  useEffect(() => {});

  const retrieveUser = async () => {};

  return (
    <View>
      <Text>Total Score</Text>
      <Text>{score}</Text>
    </View>
  );
}
