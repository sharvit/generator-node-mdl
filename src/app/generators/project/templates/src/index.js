/**
 * Return the passed argument as is.
 * @param  {String} [input='No args passed!'] input argument to return.
 * @return {String} return the recived import.
 */
export default (input = 'No args passed!') => input;

/**
 * Check if a numeric value is an even number.
 * @param  {Number}  number a number to check.
 * @return {Boolean}        boolean indication whether the given number is even.
 * @throws {TypeError}      throw error when the argument is not a number.
 */
export const isEven = number => {
  if (isNaN(number)) {
    throw new TypeError('The first argument must be a number');
  }
  return number % 2 === 0;
};

/**
 * Check if a numeric value is an odd number.
 * @param  {Number}  number a number to check.
 * @return {Boolean}        boolean indication whether the given number is odd.
 * @throws {TypeError}      throw error when the argument is not a number.
 */
export const isOdd = number => !isEven(number);
