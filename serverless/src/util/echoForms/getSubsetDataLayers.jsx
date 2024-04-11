import xpath from 'xpath'
import { DOMParser } from '@xmldom/xmldom'
import { namespaces } from './namespaces'

/**
 * Get subsetting parameters from the provided XML Document
 * @param {String} xmlDocument ECHO Form xml as a string
 */
export const getSubsetDataLayers = (xmlDocument) => {
  const doc = new DOMParser().parseFromString(xmlDocument)

  const objects = xpath.useNamespaces(namespaces)('//ecs:SUBSET_DATA_LAYERS/*[ecs:subtreeSelected=\'true\' and ecs:subtreeSelected=\'true\']/@value', doc)
  const fields = xpath.useNamespaces(namespaces)('//ecs:SUBSET_DATA_LAYERS/descendant::*[ecs:itemSelected=\'true\' and ecs:subtreeSelected=\'true\']/@value', doc)
  const bands = xpath.useNamespaces(namespaces)('//ecs:SUBSET_DATA_LAYERS/descendant::*[ecs:itemSelected =\'true\']/*[ecs:value > 0]', doc)
    .map((band) => {
      const valueText = band.data
      const ecsValue = xpath.useNamespaces(namespaces)('ecs:value', band)

      return `${valueText}[${ecsValue.data}]`
    })
  const treeStyleBands = xpath.useNamespaces(namespaces)('//ecs:SUBSET_DATA_LAYERS[@style=\'tree\']/descendant::*/text()', doc)

  const allValues = [
    ...objects,
    ...fields,
    ...bands,
    ...treeStyleBands
  ].map((bandType) => {
    if (bandType) {
      return bandType.nodeValue
    }

    return null
  })

  return {
    SUBSET_DATA_LAYERS: allValues.join(',')
  }
}
