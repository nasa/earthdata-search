import { getFieldElementValue } from './getFieldElementValue'

/**
 * Get resampling parameters from the provided XML Document
 * @param {String} xmlDocument ECHO Form xml as a string
 */
export const getNameValuePairsForResample = (xmlDocument) => {
  const resampleFields = ['RESAMPLE']

  const resampleFieldValues = {}

  resampleFields.forEach((fieldName) => {
    const valueField = getFieldElementValue(xmlDocument, `${fieldName}/*[contains(local-name(),'value')]`)
    const dimensionField = getFieldElementValue(xmlDocument, `${fieldName}/*[contains(local-name(),'dimension')]`)

    if (dimensionField && valueField) {
      resampleFieldValues[fieldName] = `${dimensionField}:${valueField}`
    }
  })

  return resampleFieldValues
}
