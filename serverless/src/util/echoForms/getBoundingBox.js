import xpath from 'xpath'

import { DOMParser } from 'xmldom'
import { namespaces } from './namespaces'

/**
 * Get bounding box information from the provided XML Document
 * @param {String} xmlDocument ECHO Form xml as a string
 */
export const getBoundingBox = (xmlDocument) => {
  const doc = new DOMParser().parseFromString(xmlDocument)

  const boundingBoxes = []

  xpath.useNamespaces(namespaces)('//*[contains(name(),\'boundingbox\')]', doc).forEach((boxElement) => {
    const box = {}

    Object.values(boxElement.childNodes).forEach((boxElement) => {
      if (boxElement.firstChild) {
        const firstChildValue = boxElement.firstChild.nodeValue
        if (boxElement && firstChildValue && boxElement.localName !== 'display') {
          box[boxElement.localName] = firstChildValue
        }
      }
    })

    // Check that the bounding box has enough values to be considered a bounding box
    if (Object.keys(box).length >= 4) {
      // Ensure the bounding box is in the correct order
      boundingBoxes.push(
        ['ullon', 'lrlat', 'lrlon', 'ullat'].map((key) => box[key]).join(',')
      )
    }
  })

  return {
    BBOX: boundingBoxes[0]
  }
}
