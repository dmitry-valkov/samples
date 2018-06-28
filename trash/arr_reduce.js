/**
 * @param {any[]} arr 
 * @param {Function} cb 
 * @param {any} acc
 * @return {any}
 */
function reduce(arr, cb, acc) {
    let result = acc;

    for (let index in arr) {
        const el = arr[index];

        result = cb(result, el, index, arr);
    }

    return result;
}

reduce([1, 2, 3], (acc, curr) => acc + curr, 777);