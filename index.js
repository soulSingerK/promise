import Promise from './src/promise'

new Promise((resolve, reject) => {
  resolve(1)
}).then(res => {
  console.log(res)
  return res
}).then(res => {
  console.log(res)
})

console.log(2)