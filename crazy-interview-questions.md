1) Will there be a memory leak in this (one of the most ugly I think) JavaScript code? What will be output in the console?

```js
!function() {
  for (var i = 0; i < 1_000_000; i++)) {
    arguments[i] = (
      new Promise((resolve, reject) => {
        setTimeout(() => {
          if (i % 2 === 0) {
            console.log('Resolved: ', i % 2);
          } else {
            console.log('Rejected: ', i)
          }
        }, 100);
      }).then(() => console.log('Done'));
  }
}();
```

- Yes, a memory leak is possible because a large number of Promise objects are created without properly releasing their memory after they are resolved or rejected.
- The console will output "Resolved: 0" for even values of i and "Rejected: i" for odd values of i, but in an unsystematic way because all setTimeout() calls are asynchronous.
- To avoid the memory leak, the Promise objects need to be properly released from memory after they are resolved or rejected, for example, by setting the reference to the Promise object to null after its completion.
