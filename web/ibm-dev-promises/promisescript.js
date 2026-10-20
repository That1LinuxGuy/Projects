//Creating a promise method. The promise will get resolved when timer times out after 6 seconds.
let myPromise1 = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve("Promise resolved")
    },6000)})

// Second promise called after Promise1
function myPromise2() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Promise 2 resolved");
        }, 3000);
    });
}

//Console log before calling the promise
console.log("Before calling promise");

//Call the promise and wait for it to be resolved and then print a message.
myPromise1.then((successMessage) => {
    console.log("From Callback " + successMessage);
    return myPromise2();
}).then((successMessage) => {
    console.log("From Callback " + successMessage);
});

//Console log after calling the promise
  console.log("After calling promise");

