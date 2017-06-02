'use strict';

var Promise = require('bluebird');

var promise = new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve('Hello');
  }, 1000);
});

promise
.then(function (output) {
  console.log('Promise resolved with value: ', output);
  return Promise.resolve('World');
})
.then(function (output) {
  console.log('Made it to the second then block, with value: ', output);
})
.catch(function (err) {
  // Handle Error
  console.log('Promise  error: ', err);
})
.finally(function () {
  process.exit();
});
