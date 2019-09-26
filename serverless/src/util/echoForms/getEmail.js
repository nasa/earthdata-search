import { getFieldElementValue } from './getFieldElementValue'

/**
 * Get the email address from the provided XML Document
 * @param {String} xmlDocument ECHO Form xml as a string
 */
export const getEmail = (xmlDocument) => {
  const xmlElement = getFieldElementValue(xmlDocument, 'email')

  if (xmlElement.length) {
    return {
      EMAIL: xmlElement
    }
  }

  return {}
}
