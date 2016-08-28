/**
 * @param {number} [length=1]
 * @return {number[]||[]}
 **/
function fiboArraySimple(length = 1) {
  const result = [];

  for (let i = 1; i <= length; i++) {
    if (i === 1 || i === 2) {
      result.push(1);
    } else {
      const arrIndex = i - 1;
      const newElement = result[arrIndex - 1] + result[arrIndex - 2];

      result.push(newElement);
    }
  }

  return result;
}
