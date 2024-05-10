export function isPresent(value, name) {
  let msg = "";
  if (value === "") {
    msg += name + " is a required field.\n";
  }
  return msg;
}

export function isNumeric(value, name) {
  let msg = "";
  if (isNaN(value)) {
    msg += name + " must be a valid number.\n";
  }
  return msg;
}

export function isWithinRange(value, name, min, max) {
  let msg = "";
  let number = parseFloat(value);
  if (number < min || number > max) {
    msg += name + " must be between " + min + " and " + max + ".\n";
  }
  return msg;
}

const VALID_WORKOUTS = ["Bench Press", "Back Squat", "Deadlift"];
export function isValidWorkoutName(value, name) {
  let msg = "";
  if (!VALID_WORKOUTS.includes(value)) {
    msg += name + " must be one of: " + VALID_WORKOUTS.join(", ") + ".\n";
  }
  return msg;
}
