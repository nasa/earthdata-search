import { getFieldElementValue } from './getFieldElementValue'

export const getNameValuePairsForResample = (xmlDocument) => {
  const resampleFields = ['RESAMPLE']

  const resampleFieldValues = {}

  resampleFields.forEach((fieldName) => {
    const valueField = getFieldElementValue(xmlDocument, `${fieldName}/*[contains(local-name(),'value')]`)
    const dimensionField = getFieldElementValue(xmlDocument, `${fieldName}/*[contains(local-name(),'dimension')]`)

    resampleFieldValues[fieldName] = `${dimensionField}:${valueField}`
  })

  return resampleFieldValues
}
