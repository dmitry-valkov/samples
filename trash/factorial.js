import { getRange } from './helpers';

/**
 * @param {number} num
 * @return {number}
 */
function factorial(num) {
    let result = 1;

    if (num > 0) {
        result = getRange(num)
            .reduce((acc, current) => acc * current, 1);
    }

    return result;
}

factorial(6)