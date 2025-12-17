// eslint-disable-next-line import/no-extraneous-dependencies
import { isEqual } from 'lodash'

/**
 * The default form data sent with collection search requests
 */
export const defaultCollectionFormData = {
  has_granules_or_cwic: 'true',
  include_facets: 'v2',
  include_granule_counts: 'true',
  include_has_granules: 'true',
  include_tags: 'edsc.*,opensearch.granule.osdd',
  page_num: '1',
  page_size: '20',
  'sort_key[]': ['has_granules_or_cwic', '-score', '-create-data-date']
}

/**
 * Converts the form data in a request to an object
 * @param {object} request The request object containing the form data
 * @returns {object} An object representing the form data
 */
export const getFormDataObject = async (request) => {
  const formData = await new Request(request.url(), {
    method: request.method(),
    headers: request.headers(),
    body: request.postData()
  }).formData()

  const formDataObject = {}

  formData.forEach((value, key) => {
    if (Object.prototype.hasOwnProperty.call(formDataObject, key)) {
      // If the key already exists, convert the value to an array and push the new value
      if (!Array.isArray(formDataObject[key])) {
        formDataObject[key] = [formDataObject[key]]
      }

      formDataObject[key].push(value)
    } else {
      // Otherwise, just set the value
      formDataObject[key] = value
    }
  })

  return formDataObject
}

/**
 * Checks whether the form data in a request matches the expected form data
 * @param {object} request The request object containing the form data
 * @param {object} expectedFormData The expected form data to match against
 * @returns {boolean} True if the form data matches, false otherwise
 */
export const matchesFormData = async (request, expectedFormData) => {
  const formDataObject = await getFormDataObject(request)

  // This is useful for finding formData when mocking a request
  console.log('matchesFormData -- actual formData:', formDataObject)

  return isEqual(formDataObject, expectedFormData)
}
