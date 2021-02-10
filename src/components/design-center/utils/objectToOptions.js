/**
 * objectToOptions
 * @param {Object<string, string>} object
 */
export const objectToOptions = (object) => {
  return Object.entries(object).reduce((options, [key, value]) => {
    return options.concat({ label: value, value: isNaN(+key) ? key : +key })
  }, [])
}
