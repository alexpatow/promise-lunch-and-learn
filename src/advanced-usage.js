'use strict';

var Promise = require('bluebird');

var array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var arrayOfPromises = [];

function asyncCode(value) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve('promised: ' + value + ' at time: ' + new Date());
    }, 1000 * value);
  });
}

arrayOfPromises = [
  asyncCode(1),
  asyncCode(2),
  asyncCode(3),
  asyncCode(4),
  asyncCode(5),
  asyncCode(6),
  asyncCode(7),
  asyncCode(8),
  asyncCode(9),
  asyncCode(10)
];

// Managing multiple promises

Promise.race(arrayOfPromises)
.then(function (output) {
  console.log('Promise.race resolved with value: ', output);
})
.catch(function (err) {
  // Handle Error
  console.log('Promise.race error: ', err);
});

Promise.all(arrayOfPromises)
.then(function (output) {
  console.log('Promise.all resolved with value: ', output);
})
.catch(function (err) {
  // Handle Error
  console.log('Promise.all error: ', err);
});


// Functional Programming

Promise.map(array, function (value, index, length) {
  return asyncCode(value);
})
.then(function (output) {
  console.log('Promise.map resolved with value: ', output);
})
.catch(function (err) {
  // Handle Error
  console.log('Promise.map error: ', err);
});

Promise.each(array, function (value, index, length) {
  return asyncCode(value);
})
.then(function (output) {
  console.log('Promise.each resolved with value: ', output);
})
.catch(function (err) {
  // Handle Error
  console.log('Promise.each error: ', err);
});
