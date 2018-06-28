/**
 * @param {any[]} arr 
 * @param {Function} cb
 * @return {any[]}
 */
function filter(arr, cb) {
    const result = [];
  
    for (let index in arr) {
      const el = arr[index];
      
      cb(el, index, arr) ? result.push(el) : null;
    }
  
    return result;
  }