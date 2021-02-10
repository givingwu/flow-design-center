/**
 * @template T
 * @param {T} obj - A generic parameter that need be copied
 * @return {T}
 */
export function deepCopy(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime())
  }

  if (obj instanceof Array) {
    return obj.reduce((arr, item, i) => {
      arr[i] = deepCopy(item)
      return arr
    }, [])
  }

  if (obj instanceof Object) {
    return Object.keys(obj).reduce((newObj, key) => {
      newObj[key] = deepCopy(obj[key])
      return newObj
    }, {})
  }
}

/**
 * 循环深复制对象
 * @param {Object} obj a target object
 * @param  {Array<{}>} args an array of source object
 * @example
 *  var a = { a: 'a', b: 'a'}
 *  var b = { a: 'b', b: 'b'}
 *  deepMerge({}, a, b) // {a: "b", b: "b"}
 *  deepMerge({}, b, a) // {a: "a", b: "a"}
 */
export function deepMerge(obj, ...args) {
  for (let i = 0, l = args.length; i < l; i++) {
    const o = args[i]
    const ks = Object.keys(o)

    for (let j = 0, k = ks.length; j < k; j++) {
      const k = ks[j]

      if (typeof k === 'object') {
        obj[k] = deepCopy(o[k])
      } else {
        obj[k] = o[k]
      }
    }
  }

  return obj
}

/**
 * flatten
 * @param {[]} arr
 * @returns {[]}
 */
export function flatten(arr) {
  return arr.reduce((all, curr) => {
    if (Array.isArray(curr)) {
      return [...all, ...flatten(curr)]
    } else {
      return [...all, curr]
    }
  }, [])
}

/**
 * @template T
 * @param {T} value
 * @return {boolean}
 */
export function isObservable(value) {
  return hasOwn(value, '__ob__') && value.__ob__ && value.__ob__.dep.id
}

export const hasOwn = (obj = {}, key) => {
  return obj && Object.prototype.hasOwnProperty.call(obj, key)
}
