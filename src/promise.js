/**
 * 
 * @param {Function} fn
 * status 三种状态 pending, fulfilled, rejected
 */
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

function Promise(fn) {
  const self = this
  this.status = PENDING
  this.value = null
  this.reason = null
  this.onFulfilledCallbacks = []
  this.onRejectedCallbacks = []
  function resolve(value) {
    if (self.status === PENDING) {
      self.value = value
      self.status = FULFILLED
      self.onFulfilledCallbacks.forEach(cb => cb(self.value))
    }
  }
  function reject(reason) {
    if (self.status === PENDING) {
      self.reason = reason
      self.status = REJECTED
      self.onRejectedCallbacks.forEach(cb => cb(self.reason))
    }
  }

  try {
    fn(resolve, reject)
  } catch(err) {
    reject(err)
  }
}

Promise.prototype.then = function (onFulfilled, onRejected) {
  const self = this
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled :  function (data) {return data}
  onRejected = typeof onRejected === 'function' ? onRejected : function (err) {throw err}
  
  if (self.status === FULFILLED) {
    return new Promise((resolve, reject) => {
      try {
        const p = onFulfilled(self.value)
        if (p instanceof Promise) {
          p.then(resolve, reject)
        } else {
          resolve(p)
        }
      } catch(err) {
        reject(err)
      }
    })
  }
  if (self.status === REJECTED) {
    return new Promise((resolve, reject) => {
      try {
        const p = onRejected(self.reason)
        if (p instanceof Promise) {
          p.then(resolve, reject)
        } else {
          resolve(p)
        }
      } catch(err) {
        reject(err)
      }
    })
  }
  if (self.status === PENDING) {
    return new Promise((resolve, reject) => {
      self.onFulfilledCallbacks.push(() => {
        const p = onFulfilled(self.value)
        if (p instanceof Promise) {
          p.then(resolve, reject)
        } else {
          resolve(p)
        }
      })
      self.onRejectedCallbacks.push(() => {
        const p = onRejected(self.reason)
        if (p instanceof Promise) {
          p.then(resolve, reject)
        } else {
          resolve(p)
        }
      })
    })
  }
}

Promise.prototype.catch = function(fn) {
  return this.then(null, fn)
}

export default Promise