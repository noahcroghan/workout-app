import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  Image,
  Linking,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import * as SQLite from "expo-sqlite";
import * as Validator from "./Validator.js";

const Stack = createNativeStackNavigator();

function NewWorkoutScreen({ route }) {
  const { oneRepMax, setsDesired, lift } = route.params;
  let imgSrc = null;
  let imgLink = "";

  const images = {
    "Bench Press": {
      src: require("./assets/bench.jpg"),
      link: "https://www.strongerbyscience.com/how-to-bench/",
    },
    "Back Squat": {
      src: require("./assets/squat.jpg"),
      link: "https://www.strongerbyscience.com/how-to-squat/",
    },
    Deadlift: {
      src: require("./assets/deadlift.jpg"),
      link: "https://www.strongerbyscience.com/how-to-deadlift/",
    },
  };

  if (images[lift]) {
    imgSrc = images[lift].src;
    imgLink = images[lift].link;
  }

  return (
    <View style={styles.main}>
      <TouchableOpacity onPress={() => Linking.openURL(imgLink)}>
        <Image style={styles.image} source={imgSrc} />
      </TouchableOpacity>
      <Text style={styles.heading}>{lift} Workout</Text>
      <Text>Max: {oneRepMax}</Text>
      <Text>Sets: {setsDesired}</Text>
      {/* TODO: Render a table or similar which tells the user
      what workout to do, make finish workout save the workout to DB */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Finish Workout</Text>
      </TouchableOpacity>
    </View>
  );
}

function WorkoutLog({ priorWorkouts }) {
  return (
    <View style={styles.workoutLogSection}>
      <Text style={styles.heading}>Workout Log</Text>
      {/* Date will be the primary key of the database */}
      {priorWorkouts.map((item) => (
        <Text key={item.date}>
          {item.date}&nbsp;&nbsp;&nbsp;&nbsp;
          {item.oneRepMax}&nbsp;&nbsp;&nbsp;&nbsp;
          {item.setsDesired}&nbsp;&nbsp;&nbsp;&nbsp;
          {item.lift}
        </Text>
      ))}
    </View>
  );
}

function HomeScreen({ navigation }) {
  const [oneRepMax, setOneRepMax] = useState(0);
  const [setsDesired, setSetsDesired] = useState(0);
  const [lift, setLift] = useState("");
  const [priorWorkouts, setPriorWorkouts] = useState([
    {
      oneRepMax: 250,
      setsDesired: 4,
      lift: "Bench Press",
      date: "2022-01-01",
    },
    {
      oneRepMax: 300,
      setsDesired: 5,
      lift: "Deadlift",
      date: "2022-01-02",
    },
    {
      oneRepMax: 200,
      setsDesired: 3,
      lift: "Back Squat",
      date: "2022-01-03",
    },
  ]);

  // useEffect(() => {
  //   setPriorWorkouts();
  // }, priorWorkouts);

  const generateWorkout = (oneRepMax, setsDesired, lift) => {
    const isValid = () => {
      let success = true;
      let errorMessage = "";

      errorMessage += Validator.isPresent(oneRepMax, "One Rep Max");
      errorMessage += Validator.isNumeric(oneRepMax, "One Rep Max");
      errorMessage += Validator.isWithinRange(
        oneRepMax,
        "One Rep Max",
        1,
        1500
      );

      errorMessage += Validator.isPresent(setsDesired, "Number of sets");
      errorMessage += Validator.isNumeric(setsDesired, "Number of sets");
      errorMessage += Validator.isWithinRange(
        setsDesired,
        "Number of sets",
        1,
        10
      );

      errorMessage += Validator.isPresent(lift, "Lift Name");
      errorMessage += Validator.isValidWorkoutName(lift, "Lift Name");

      if (errorMessage != "") {
        success = false;
        Alert.alert("Entry Error", errorMessage);
        console.log("Entry Error", errorMessage);
      }

      return success;
    };

    if (isValid()) {
      console.log(oneRepMax, setsDesired, lift);
      navigation.navigate("New Workout", {
        oneRepMax: oneRepMax,
        setsDesired: setsDesired,
        lift: lift,
      });
    }
  };

  return (
    <View style={styles.main}>
      <View style={styles.newWorkoutSection}>
        <TextInput
          style={styles.input}
          placeholder="One Rep Max in Pounds"
          onChangeText={setOneRepMax}
          inputMode={"numeric"}
        />
        <TextInput
          style={styles.input}
          placeholder="Number of sets to do"
          onChangeText={setSetsDesired}
          inputMode={"numeric"}
        />
        {/* Would be easier with a dropdown/picker/select element but requires separate library */}
        <TextInput
          style={styles.input}
          placeholder="Lift Name"
          onChangeText={setLift}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => generateWorkout(oneRepMax, setsDesired, lift)}
        >
          <Text style={styles.buttonText}>New Workout</Text>
        </TouchableOpacity>
      </View>
      {priorWorkouts ? <WorkoutLog priorWorkouts={priorWorkouts} /> : null}
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="New Workout" component={NewWorkoutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  newWorkoutSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  workoutLogSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#f00",
    margin: 10,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#777",
    width: 175,
    marginBottom: 2,
  },
  image: {
    width: 360,
    height: 202.5,
    margin: 20,
  },
});
