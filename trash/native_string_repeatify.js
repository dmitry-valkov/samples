String.prototype.repeatify = function (count) {
    const value = this.valueOf();
    let result = ''

    for (let i = 1; i <= count; i++) {
        result = result + value;
    }

    return result;
};

'b'.repeatify(3);