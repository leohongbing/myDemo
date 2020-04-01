// console.log('1');
//
// setTimeout(function() {
//   console.log('2');
//   process.nextTick(function() {
//     console.log('3');
//   })
//   new Promise(function(resolve) {
//     console.log('4');
//     resolve();
//   }).then(function() {
//     console.log('5')
//   })
// })
// process.nextTick(function() {
//   console.log('6');
// })
// new Promise(function(resolve) {
//   console.log('7');
//   resolve();
// }).then(function() {
//   console.log('8')
// })
//
// setTimeout(function() {
//   console.log('9');
//   process.nextTick(function() {
//     console.log('10');
//   })
//   new Promise(function(resolve) {
//     console.log('11');
//     resolve();
//   }).then(function() {
//     console.log('12')
//   })
// })



console.log(1)

setTimeout(() => {
  console.log(2)
  new Promise(resolve => {
    console.log(4)
    resolve()
  }).then(() => {
    console.log(5)
  })
  process.nextTick(() => {
    console.log(3)
  })
})

new Promise(resolve => {
  console.log(7)
  resolve()
}).then(() => {
  console.log(8)
})

process.nextTick(() => {
  console.log(6)
})
