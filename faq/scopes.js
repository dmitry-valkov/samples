var obj = {
    name: 'Bob',
    hello: function (name) {
        console.log(`${this.name} say hello ${name}`); // this reference to obj
    }
}

obj.hello('Bill'); // Bob say hello Bill