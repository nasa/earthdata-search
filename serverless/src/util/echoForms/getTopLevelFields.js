import { getFieldElementValue } from './getFieldElementValue'

export const getTopLevelFields = (xmlDocument) => {
  const topLevelFields = [
    'BBOX',
    'CLIENT',
    'END',
    'FORMAT',
    'INCLUDE_META',
    'INTERPOLATION',
    'META',
    'NATIVE_PROJECTION',
    'OUTPUT_GRID',
    'PROJECTION',
    'REQUEST_MODE',
    'START',
    'SUBAGENT_ID'
  ]

  const populatedFields = {}

  topLevelFields.forEach((field) => {
    const xmlElement = getFieldElementValue(xmlDocument, field)

    if (xmlElement.length) {
      populatedFields[field] = xmlElement
    }
  })

  return populatedFields
}
