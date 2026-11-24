import { isEmpty } from 'lodash-es'

/**
 * Return the provided access methods with the savedAccessConfig inserted if available.
 * @param {object} methods Access methods for a collection
 * @param {object} savedAccessConfig The saved access configuration for the collection
 * @returns {object} The updated access methods, and the selectedAccessMethod
 */
export const insertSavedAccessConfig = (methods, savedAccessConfig) => {
  if (isEmpty(savedAccessConfig) || isEmpty(methods)) return { methods }

  const accessMethods = methods

  let selectedAccessMethod

  // Iterate through all the access methods
  Object.keys(methods).forEach((methodName) => {
    const method = methods[methodName]

    // Update the accessMethod that matches the savedAccessConfig
    if (method.type === savedAccessConfig.type) {
      if (['download'].includes(method.type)) {
        selectedAccessMethod = methodName

        return
      }

      if (['Harmony'].includes(method.type)) {
        selectedAccessMethod = methodName

        // Pull out values from the saved access method that would not have changed
        const {
          selectedOutputFormat,
          selectedOutputProjection,
          selectedVariables
        } = savedAccessConfig

        accessMethods[methodName] = {
          ...methods[methodName],
          selectedOutputFormat,
          selectedOutputProjection,
          selectedVariables
        }
      }
    }
  })

  return {
    methods: accessMethods,
    selectedAccessMethod
  }
}
