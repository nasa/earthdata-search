import { getFieldElementValue } from './getFieldElementValue'

/**
 * Get the key / value pairs for all top level fields from the provided XML Document
 * @param {String} xmlDocument ECHO Form xml as a string
 */
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

    if (xmlElement && xmlElement.length) {
      populatedFields[field] = xmlElement
    }
  })

  return populatedFields
}
