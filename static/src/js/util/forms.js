import * as Yup from 'yup'

/**
 * Returns the validation object for a given set of fields. The validation properties
 * are added to the schema object recursively
 * @param {Array} fields The field config
 * @param {Object} schema The previous definitions
 */
export const buildValidationSchema = (fields, schema = {}) => {
  const validation = schema

  fields.forEach((field) => {
    if (!validation[field.validation]) {
      if (field.validation) validation[field.name] = field.validation

      if (field.fields && field.fields.length > 0) {
        validation[field.name] = Yup.object().shape(buildValidationSchema(field.fields))
      }
    }
  })

  return validation
}


/**
 * Build an object containing Yup validation for each of the fields
 * @param {Array} fields The field config
 * @param {Object} initalState Current state values
 */
export const getValidationSchema = fields => Yup.object().shape(buildValidationSchema(fields))


/**
 * Returns the initalValues object for a given set of fields. The initalValues properties
 * are added to the schema object recursively
 * @param {Array} fields The field config
 * @param {Object} initalState Current state values
 * @param {Object} values The previous definitions
 */
export const buildInitialValues = (fields, initalState, values = {}) => {
  const initialValues = values
  fields.forEach((field) => {
    if (!initialValues[field.name]) {
      if (field.value) initialValues[field.name] = field.value
    }

    if (field.fields && field.fields.length > 0) {
      initialValues[field.name] = buildInitialValues(field.fields)
    }
  })

  return initialValues
}


/**
 * Build an object containing initial values for each of the fields by merging the current
 * state and default values set in the config
 * @param {Array} fields The field config
 * @param {Object} initalState Current state values
 */
// eslint-disable-next-line max-len
export const getIntitalValues = (fields, initalState) => buildInitialValues(fields, initalState)
