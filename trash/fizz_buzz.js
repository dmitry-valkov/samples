// Write a program that prints the numbers from 1 to 100. 
// But for multiples of three print “Fizz” instead of the number
// and for the multiples of five print “Buzz”.
// For numbers which are multiples of both three and five print “FizzBuzz”.

const CONSTANTS = {
    FIZZ: 'Fizz',
    BUZZ: 'Fizz',
    FIZZ_BUZZ: 'FizzBuzz',
}

// Mostly stupid variant
function gameFizzBuzz(count) {
    for (let i = 1; i <= count; i++) {
      if ((i % 5 === 0) && (i % 3 === 0)) {
        console.log(CONSTANTS.FIZZ_BUZZ);
      } else if (i % 5 === 0) {
        console.log(CONSTANTS.BUZZ);
      } else if (i % 3 === 0) {
        console.log(CONSTANTS.FIZZ);
      } else {
        console.log(i);
      }
    }
  }
  
  gameFizzBuzz(100);

  // Wow, stupid separation!
  function isFizzBuzzNum(num) {
    return (num % 15 === 0);
  }
  
  function isFizz(num) {
    return (num % 3 === 0);
  }
  
  function isBuzz(num) {
    return (num % 5 === 0);
  }
  
  function gameFizzBuzz(count) {
    for (let i = 1; i <= count; i++) {
      if (isFizzBuzzNum(i)) {
        console.log(CONSTANTS.FIZZ_BUZZ);
      } else if (isBuzz(i)) {
        console.log('Buzz');
      } else if (isFizz(i)) {
        console.log('Fizz');
      } else {
        console.log(i);
      }
    }
  }
  
  gameFizzBuzz(100);