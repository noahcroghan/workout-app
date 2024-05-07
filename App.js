import { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  Alert,
  ScrollView,
  TextInput,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SQLite from "expo-sqlite";
import * as Validator from "./Validator.js";

// const db = SQLite.openDatabase("workout.db");

// Dummy Data
// In this instance, reps is a TOTAL amount
const workouts = [
  {
    date: "2024-01-01",
    name: "Bench",
    type: "Upper Body",
    sets: 3,
    reps: 15,
    weight: 100,
  },
  {
    date: "2024-01-02",
    name: "Squat",
    type: "Lower Body",
    sets: 4,
    reps: 20,
    weight: 150,
  },
  {
    date: "2024-01-03",
    name: "Deadlift",
    type: "Lower Body",
    sets: 4,
    reps: 12,
    weight: 200,
  },
  {
    date: "2024-01-04",
    name: "Push Press",
    type: "Upper Body",
    sets: 3,
    reps: 15,
    weight: 85,
  },
  {
    date: "2024-01-05",
    name: "Deadlift",
    type: "Lower Body",
    sets: 3,
    reps: 12,
    weight: 175,
  },
  {
    date: "2024-01-06",
    name: "Squat",
    type: "Lower Body",
    sets: 3,
    reps: 15,
    weight: 125,
  },
  {
    date: "2024-01-07",
    name: "Push Press",
    type: "Upper Body",
    sets: 4,
    reps: 20,
    weight: 100,
  },
  {
    date: "2024-01-08",
    name: "Bench",
    type: "Upper Body",
    sets: 2,
    reps: 30,
    weight: 150,
  },
  {
    date: "2024-01-09",
    name: "Squat",
    type: "Lower Body",
    sets: 2,
    reps: 25,
    weight: 125,
  },
  {
    date: "2024-01-10",
    name: "Deadlift",
    type: "Lower Body",
    sets: 3,
    reps: 10,
    weight: 200,
  },
  {
    date: "2024-01-11",
    name: "Push Press",
    type: "Upper Body",
    sets: 3,
    reps: 20,
    weight: 100,
  },
  {
    date: "2024-01-12",
    name: "Bench",
    type: "Upper Body",
    sets: 4,
    reps: 15,
    weight: 150,
  },
];

const calculateOneRepMax = (reps, weight, type) => {
  if (type === "Upper Body") {
    return weight * reps * 0.033 + weight;
  } else {
    return weight * reps * 0.0333 + weight * 1.0975;
  }
};

function WorkoutLog() {
  // const [workouts, setWorkouts] = useState(null);

  // useEffect(() => {

  // })

  // if (workouts === null || workouts.length === 0) {
  //   return null;
  // }

  return (
    <View style={styles.logContainer}>
      <Text style={styles.logHeading}>Log</Text>
      <ScrollView>
        {workouts.map(({ date, name, type, sets, reps, weight }) => (
          <Text style={styles.logText} key={date}>
            {date}&nbsp;&nbsp;&nbsp;&nbsp;{name}&nbsp;&nbsp;&nbsp;&nbsp;
            {/*{type} {sets} {reps}*/}{" "}
            {calculateOneRepMax(reps, weight, type).toFixed("0")}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

function WorkoutsScreen({ navigation }) {
  return (
    <View style={styles.main}>
      <View style={styles.buttonContainer}>
        <Button
          title="New Workout"
          color="#f00"
          onPress={() => {
            navigation.navigate("New Workout");
          }}
        />
      </View>
      <View style={styles.logContainer}>
        <WorkoutLog />
      </View>
    </View>
  );
}

function NewWorkoutScreen({ navigation }) {
  const [oneRepMax, setOneRepMax] = useState(0);
  const [setsDesired, setSetsDesired] = useState(0);
  const [type, setType] = useState("");
  const [lift, setLift] = useState("");
  const workout = useRef({});

  const isValid = () => {
    let success = true;

    let errorMessage = "";
    errorMessage += Validator.isPresent(oneRepMax, "One Rep Max");
    errorMessage += Validator.isNumeric(oneRepMax, "One Rep Max");

    errorMessage += Validator.isPresent(setsDesired, "Sets Desired");
    errorMessage += Validator.isNumeric(setsDesired, "Sets Desired");

    errorMessage += Validator.isPresent(lift, "Lift Name");
    errorMessage += Validator.isValidWorkoutName(lift, "Lift Name");

    if (errorMessage != "") {
      success = false;
      Alert.alert("Entry Error", errorMessage);
    }
    console.log(success);
    return success;
  };

  const generateWorkout = (oneRepMax, setsDesired) => {
    if (isValid) {
      navigation.navigate("Current Workout", {
        oneRepMax: oneRepMax,
        setsDesired: setsDesired,
        lift: lift,
      });
    }
  };

  return (
    <View style={styles.main}>
      <View>
        <TextInput
          style={styles.input}
          placeholder="One Rep Max in Pounds"
          onChangeText={setOneRepMax}
        />
        <TextInput
          style={styles.input}
          placeholder="Sets Desired"
          onChangeText={setSetsDesired}
        />
        <TextInput
          style={styles.input}
          placeholder="Lift Name"
          onChangeText={setLift}
        />
      </View>

      <View style={{ marginTop: 15 }}>
        <Button
          title="Generate Workout"
          color="#f00"
          onPress={() => {
            generateWorkout(oneRepMax, setsDesired);
          }}
        />
      </View>
    </View>
  );
}

function CurrentWorkoutScreen({ route, navigation }) {
  const { oneRepMax, setsDesired, lift } = route.params;
  let imageSource = "";
  if (lift === "Squat") {
    imageSource = require("./assets/squat.jpg");
  } else if (lift === "Bench") {
    imageSource = require("./assets/bench.jpg");
  } else if (lift === "Deadlift") {
    imageSource = require("./assets/deadlift.jpg");
  } else if (lift === "Push Press") {
    imageSource = require("./assets/pushpress.jpg");
  }
  return (
    <View style={styles.main}>
      <Image source={imageSource} />
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#f00" },
          headerTintColor: "#fff",
        }}
      >
        <Stack.Screen name="Workouts" component={WorkoutsScreen} />
        <Stack.Screen
          name="New Workout"
          component={NewWorkoutScreen}
          options={{ title: "Create New Workout" }}
        />
        <Stack.Screen name="Current Workout" component={CurrentWorkoutScreen} />
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
  buttonContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  logContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  logHeading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  logText: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    width: 200,
  },
});
