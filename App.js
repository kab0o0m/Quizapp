import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GetStarted from "./screens/Getstarted";
import Login from "./screens/Login";
import Room from "./screens/Room";
import Question from "./screens/Question";
import TotalScore from "./screens/Totalscore";
import Register from "./screens/Register";
import { useFonts } from "expo-font";
import { useState } from "react";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [fontsLoaded, fontError] = useFonts({
    Montserrat: require("./assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-SemiBold": require("./assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-Bold": require("./assets/fonts/Montserrat-Bold.ttf"),
  });

  // Check if fonts are loaded
  if (fontsLoaded && isLoading) {
    setIsLoading(false);
  }

  return (
    <NavigationContainer>
      {isLoading ? (
        // Render a loading indicator here if needed
        <></>
      ) : (
        <Stack.Navigator initialRouteName="GetStarted">
          <Stack.Screen name="GetStarted" component={GetStarted} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
          <Stack.Screen name="Room" component={Room} options={{ headerShown: false }} />
          <Stack.Screen name="Question" component={Question} options={{ headerShown: false }} />
          <Stack.Screen name="TotalScore" component={TotalScore} options={{ headerShown: false }} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
