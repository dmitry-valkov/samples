/**
 * @param {number} num
 * @return {number[]}
 */
export function getRange(num) {
    return [...new Array(num).keys()].map((n) => n + 1);
}