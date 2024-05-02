import { useState, useEffect } from "react";
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

// const db = SQLite.openDatabase("workout.db");

function WorkoutLog() {
  // const [workouts, setWorkouts] = useState(null);

  // useEffect(() => {

  // })

  // if (workouts === null || workouts.length === 0) {
  //   return null;
  // }

  // Dummy Data
  const workouts = [
    { date: "2024-01-01", name: "Bench" },
    { date: "2024-01-02", name: "Squat" },
    { date: "2024-01-03", name: "Deadlift" },
  ];

  return (
    <View style={styles.logContainer}>
      <Text style={styles.logHeading}>Log</Text>
      <ScrollView>
        {workouts.map(({ date, name }) => (
          <Text key={date}>
            {name} {date}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

function WorkoutsScreen({ navigation }) {
  return (
    <View style={styles.main}>
      <Button
        style={styles.button}
        title="New Workout"
        color="#f00"
        onPress={() => {
          navigation.navigate("New Workout");
        }}
      />
      <WorkoutLog />
    </View>
  );
}

function NewWorkoutScreen({ navigation }) {
  const [maxWeight, setMaxWeight] = useState(0);
  const [setsDesired, setSetsDesired] = useState(0);
  const [workout, setWorkout] = useState({});

  const generateWorkout = (maxWeight, setsDesired) => {
    if (!maxWeight || !setsDesired) {
      Alert.alert("Please enter a max weight and sets desired");
      return;
    } else if (isNaN(maxWeight) || isNaN(setsDesired)) {
      Alert.alert("Max weight and sets desired must be valid numbers");
      return;
    } else if (maxWeight <= 0 || setsDesired <= 0) {
      Alert.alert("Max weight and sets desired must be greater than 0");
      return;
    } else {
      setWorkout({
        id: Date.now(),
        name: `Workout-${Date.now()}`,
      });
      console.log(workout);
      navigation.navigate("Current Workout", { workout });
    }
  };

  return (
    <View style={styles.main}>
      <TextInput
        style={styles.input}
        placeholder="Max Weight"
        onChangeText={setMaxWeight}
      />
      <TextInput
        style={styles.input}
        placeholder="Sets Desired"
        onChangeText={setSetsDesired}
      />
      <Button
        title="Generate Workout"
        color="#f00"
        onPress={() => {
          generateWorkout(maxWeight, setsDesired);
        }}
      />
    </View>
  );
}

function CurrentWorkoutScreen({ navigation }) {
  return <View style={styles.main}></View>;
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
  logHeading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    borderBottomWidth: 1,
  },
});
