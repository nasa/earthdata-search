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
