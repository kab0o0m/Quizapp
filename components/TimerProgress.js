import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Progress from "react-native-progress";

const TimerProgress = ({ durationInSeconds , onComplete  }) => {
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    let remainingTime = durationInSeconds;
    const interval = 1000; // Update progress every second

    const timer = setInterval(() => {
      remainingTime -= 1;
      const newProgress = remainingTime / durationInSeconds;

      if (remainingTime <= 0) {
        clearInterval(timer);
        setProgress(0);
        onComplete(); // Trigger completion callback
      } else {
        setProgress(newProgress);
      }
    }, interval);

    return () => clearInterval(timer); // Clean up timer on unmount
  }, []);

  const formattedTime = Math.ceil(progress * durationInSeconds);

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{formattedTime} seconds remaining</Text>
      <Progress.Bar
        progress={progress}
        width={200}
        height={20}
        color="#58CC03"
        borderColor="#D3D3D3"
        borderRadius={10}
        unfilledColor="#F5F5F5"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 20,
  },
  timerText: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default TimerProgress;
