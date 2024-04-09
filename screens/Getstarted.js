import { View, Image, Text, Pressable, StyleSheet } from "react-native";
import logo from "../assets/rubix.png";
import { useNavigation } from "@react-navigation/native";

export default function GetStarted() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>QuizBiz 📚</Text>
      </View>

      <View style={styles.contentContainer}>
        <Image source={logo} style={styles.image} />
        <Text style={styles.descriptionText}>Fun and effective way to learn!</Text>
      </View>

      <Pressable
        onPress={() => {
          navigation.navigate("Login");
        }}
        style={styles.button}>
        <Text style={styles.text}>GET STARTED</Text>
      </Pressable>
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
  titleContainer: {
    marginTop: 40,
    marginBottom: 20,
  },
  titleText: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333333",
    fontFamily: "Cochin",
  },
  contentContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333333",
    fontFamily: "Cochin",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 90,
    backgroundColor: "#58CC03",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 5,
    borderRadius: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
