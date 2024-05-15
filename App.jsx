import { useState, useEffect, useRef } from "react";
import {
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
import { Dropdown } from "react-native-element-dropdown";
import { styles } from "./Styles.js";
import * as SQLite from "expo-sqlite";
import * as Validator from "./Validator.js";

const db = SQLite.openDatabase("lifts.db");

// IDEA: Light and Dark Mode Styles
// IDEA: Full Android, iOS, Web compatibility
// IDEA: If iOS/Android, save to SQLite, if web, save to local storage
// TODO: Rewrite with Expo SDK 51 (currently 50)
// TODO: Move other things to separate files, change file structure

function discardWorkout() {
  // TODO: Make screen warn about leaving screen without saving
  // This should be a React component...
  // https://reactnavigation.org/docs/header-buttons
}

function NewWorkoutScreen({ route, navigation }) {
  const insertIntoDB = (oneRepMax, setsDesired, repsCompleted, lift) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "INSERT INTO lifts (date, oneRepMax, setsDesired, repsCompleted, lift) VALUES (julianday('now'), ?, ?, ?, ?)",
          [oneRepMax, setsDesired, repsCompleted, lift]
        );
      },
      (error) => console.log("Error: Insert into lifts\n" + error),
      () => console.log("Success: Insert into lifts")
    );
  };

  const { workoutReps, workoutWeights, lift, oneRepMax, setsDesired } =
    route.params;

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

  const imgSrc = images[lift].src;
  const imgLink = images[lift].link;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => Linking.openURL(imgLink)}>
        <Image style={styles.image} source={imgSrc} />
      </TouchableOpacity>
      <Text style={styles.heading}>{lift} Workout</Text>
      <Text style={styles.bodyText}>Current One Rep Max: {oneRepMax} lbs</Text>
      {workoutWeights.map((item, itemIndex) => (
        <Text style={styles.bodyText} key={itemIndex}>
          Set {itemIndex + 1}: {workoutReps[itemIndex]} reps of {item} lbs
        </Text>
      ))}
      <TouchableOpacity
        onPress={() => {
          // Calculate total reps
          let totalReps = 0;
          for (let i = 0; i < workoutReps.length; i++) {
            totalReps += workoutReps[i];
          }

          // Save to database
          insertIntoDB(oneRepMax, setsDesired, totalReps, lift);

          navigation.navigate("Home");
        }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Finish Workout</Text>
      </TouchableOpacity>
    </View>
  );
}

// TODO: Make every item pressable, make delete from log
function WorkoutLog({ priorWorkouts, onPressItem }) {
  if (priorWorkouts === null || priorWorkouts.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Workout Log</Text>
      <ScrollView>
        {/* Make this look better */}
        {priorWorkouts.map((workout) => (
          <TouchableOpacity
            key={workout.date}
            onPress={() => onPressItem(workout.date)}
          >
            <Text style={styles.logText}>
              {workout.date} 1RM: {workout.oneRepMax} Sets:{" "}
              {workout.setsDesired} Total Reps: {workout.repsCompleted}{" "}
              {workout.lift}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function HomeScreen({ navigation }) {
  const [oneRepMax, setOneRepMax] = useState(0);
  const [setsDesired, setSetsDesired] = useState(0);
  const [lift, setLift] = useState(null);
  const [priorWorkouts, setPriorWorkouts] = useState(null);
  const textInputRef = useRef(null); // Only used to clear text input

  // Updates on component mount and when the user returns focus to home screen
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            "SELECT date, oneRepMax, setsDesired, repsCompleted, lift FROM lifts ORDER BY datetime(date) DESC",
            [],
            (_, { rows: { _array } }) => setPriorWorkouts(_array)
          );
          // tx.executeSql("SELECT * FROM lifts", [], (_, { rows }) =>
          // console.log(JSON.stringify(rows))
          // );
        },
        (error) => console.log("Error: Select from lifts table\n" + error),
        () => console.log("Success: Select from lifts table")
      );
    });

    return unsubscribe;
  }, [navigation]);

  const generateWorkout = (oneRepMax, setsDesired, lift) => {
    const isValidEntry = () => {
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

      errorMessage += Validator.isPresent(setsDesired, "Number of Sets");
      errorMessage += Validator.isNumeric(setsDesired, "Number of Sets");
      errorMessage += Validator.isWithinRange(
        setsDesired,
        "Number of Sets",
        1,
        5
      );

      errorMessage += Validator.isPresent(lift, "Lift Type");

      if (errorMessage != "") {
        success = false;
        Alert.alert("Entry Error", errorMessage);
      }

      return success;
    };

    if (isValidEntry()) {
      const percentages = [0.65, 0.75, 0.85, 0.9, 0.95];
      const reps = [5, 5, 3, 3, 1];
      let workoutWeights = [];
      let workoutReps = [];

      for (let i = 0; i < setsDesired; i++) {
        workoutWeights.push(Math.round((oneRepMax * percentages[i]) / 5) * 5); // Round to the nearest multiple of 5
        workoutReps.push(reps[i]);
      }

      navigation.navigate("New Workout", {
        lift: lift,
        oneRepMax: oneRepMax,
        workoutWeights: workoutWeights,
        workoutReps: workoutReps,
        setsDesired: setsDesired,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholderTextColor={"#888"}
          placeholder="One Rep Max in Pounds"
          onChangeText={setOneRepMax}
          inputMode={"numeric"}
          returnKeyType={"done"}
          ref={textInputRef}
        />
        <TextInput
          style={styles.input}
          placeholderTextColor={"#888"}
          placeholder="Number of Sets to Do"
          onChangeText={setSetsDesired}
          inputMode={"numeric"}
          returnKeyType={"done"}
          ref={textInputRef}
        />
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.dropdownPlaceholderStyle}
          selectedTextStyle={styles.dropdownSelectedTextStyle}
          data={[
            { label: "Bench Press", value: "Bench Press" },
            { label: "Back Squat", value: "Back Squat" },
            { label: "Deadlift", value: "Deadlift" },
          ]}
          labelField="label"
          valueField="value"
          onChange={(item) => {
            setLift(item.value);
          }}
          placeholder="Select Lift"
          value={lift}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            generateWorkout(oneRepMax, setsDesired, lift);
            // TODO: Not all inputs are cleared
            textInputRef.current.clear();
          }}
        >
          <Text style={styles.buttonText}>New Workout</Text>
        </TouchableOpacity>
      </View>
      <WorkoutLog
        priorWorkouts={priorWorkouts}
        onPressItem={(date) => {
          Alert.alert("Delete", "Are you sure you want to delete this item?", [
            { text: "Cancel", style: "cancel" },
            {
              text: "OK",
              onPress: () => {
                console.log(date);
                db.transaction(
                  (tx) => {
                    tx.executeSql(
                      "DELETE FROM lifts WHERE date = ?",
                      [date],
                      () => {
                        // Update state with the new lifts after deletion
                        setPriorWorkouts((oldPriorWorkouts) =>
                          oldPriorWorkouts.filter((item) => item.date !== date)
                        );
                      }
                    );
                  },
                  (error) => console.log("Error: Delete from lifts\n" + error),
                  () => console.log("Success: Delete from lifts")
                );
              },
            },
          ]);
        }}
      />
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    db.transaction(
      (tx) => {
        // tx.executeSql("DROP TABLE lifts");
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS lifts (date real primary key not null, oneRepMax integer, setsDesired integer, repsCompleted integer, lift text)"
        );
      },
      (error) => console.log("Error: Create table\n" + error),
      () => console.log("Success: Lifts table was created (or already existed)")
    );
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="New Workout"
          component={NewWorkoutScreen}
          options={{
            headerLeft: discardWorkout,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
