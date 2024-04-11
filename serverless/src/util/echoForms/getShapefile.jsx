import xpath from 'xpath'
import { DOMParser } from '@xmldom/xmldom'
import { namespaces } from './namespaces'

/**
 * Get shapefile information from the provided XML Document
 * @param {String} xmlDocument ECHO Form xml as a string
 * @param {String} shapefile Shapefile contents
 */
export const getShapefile = (xmlDocument, shapefile) => {
  if (!shapefile) return null

  const doc = new DOMParser().parseFromString(xmlDocument)

  let useShapefile = false

  xpath.useNamespaces(namespaces)('//*[contains(name(),\'spatial_subset_shapefile_flag\')]', doc).forEach((spatialSubsetShapefileFlag) => {
    if (spatialSubsetShapefileFlag.firstChild.nodeValue === 'true') useShapefile = true
  })

  if (useShapefile) {
    return {
      BoundingShape: JSON.stringify(shapefile)
    }
  }

  return null
}
