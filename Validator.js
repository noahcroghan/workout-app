const LINE_END = "\n\n";

/**
 * Checks if a value is present and returns an error message if it is not.
 *
 * @param {any} value - The value to check.
 * @param {string} name - The name of the value for the error message.
 * @return {string} An empty string if the value is present, otherwise an error message.
 */
export function isPresent(value, name) {
  let msg = "";
  if (!value) {
    msg += name + " is a required field." + LINE_END;
  }
  return msg;
}

/**
 * Checks if a value is a valid number and returns an error message if it is not.
 *
 * @param {any} value - The value to check.
 * @param {string} name - The name of the value for the error message.
 * @return {string} An empty string if the value is a valid number, otherwise an error message.
 */
export function isNumeric(value, name) {
  let msg = "";
  if (isNaN(value)) {
    msg += name + " must be a valid number." + LINE_END;
  }
  return msg;
}

/**
 * Checks if a given value is within a specified range and returns an error message if it is not.
 *
 * @param {any} value - The value to check.
 * @param {string} name - The name of the value for the error message.
 * @param {number} min - The minimum value of the range.
 * @param {number} max - The maximum value of the range.
 * @return {string} An empty string if the value is within the range, otherwise an error message.
 */
export function isWithinRange(value, name, min, max) {
  let msg = "";
  let number = parseFloat(value);
  if (number < min || number > max) {
    msg += name + " must be between " + min + " and " + max + "." + LINE_END;
  }
  return msg;
}
