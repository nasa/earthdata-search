import { XMLValidator } from 'fast-xml-parser'
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
    console.log(`Found savedAccessConfig of type ${savedAccessConfig.type}`)

    if (method.type === savedAccessConfig.type) {
      if (['download'].includes(method.type)) {
        selectedAccessMethod = methodName

        return
      }

      if (method.id === savedAccessConfig.id) {
        if (['Harmony', 'OPeNDAP'].includes(method.type)) {
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

          return
        }

        if (['ESI', 'ECHO ORDERS'].includes(method.type)) {
          const { formDigest: savedFormDigest } = savedAccessConfig
          const { formDigest: methodFormDigest } = method

          // Ensure the saved EchoForm is the same form as the current EchoForm
          if (savedFormDigest === methodFormDigest) {
            selectedAccessMethod = methodName

            // Pull out values from the saved access method that would not have changed
            const {
              form = '',
              model = '',
              rawModel = '',
              formDigest
            } = savedAccessConfig

            // Parse the savedAccessConfig values and if it is not valid XML, don't use it
            if (
              XMLValidator.validate(form) === true
              && XMLValidator.validate(model) === true
              && XMLValidator.validate(rawModel) === true
            ) {
              // Only override values that the user configured
              accessMethods[methodName] = {
                ...methods[methodName],
                form,
                model,
                rawModel,
                formDigest
              }
            } else {
              console.log('There was a problem parsing the savedAccessConfig values, using the default form instead.')
            }
          }
        }
      }
    }
  })

  return {
    methods: accessMethods,
    selectedAccessMethod
  }
}
