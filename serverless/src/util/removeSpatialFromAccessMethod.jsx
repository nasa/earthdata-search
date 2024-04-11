import xpath from 'xpath'
import { DOMParser, XMLSerializer } from '@xmldom/xmldom'
import { namespaces } from './echoForms/namespaces'

/**
 * Update a given spatial field with the give value
 * @param {Object} parsedXml Parsed XML document
 * @param {String} fieldName Name of spatial field to update
 * @param {String} value New spatial value
 */
const updateSpatial = (parsedXml, fieldName, value) => {
  const path = `//*[local-name() = "${fieldName}"]`
  xpath.useNamespaces(namespaces)(path, parsedXml).forEach((foundElement) => {
    const element = foundElement

    const { firstChild = {} } = element
    const { data } = firstChild

    if (data != null) element.firstChild.data = value
  })
}

/**
 * Updates an echoforms model or rawModel with default spatial values
 * @param {Object} parsedXml Parsed XML document
 */
const updateModel = (parsedXml) => {
  xpath.useNamespaces(namespaces)('//*[local-name() = "spatial_subset_flag"]', parsedXml)
    .forEach((foundElement) => {
      const element = foundElement

      const { firstChild = {} } = element
      const { data: subsetFlag = 'false ' } = firstChild

      if (subsetFlag === 'true') {
        element.firstChild.data = 'false'

        updateSpatial(element, 'ullat', '90')
        updateSpatial(element, 'ullon', '-180')
        updateSpatial(element, 'lrlat', '-90')
        updateSpatial(element, 'lrlon', '180')
      }
    })
}

/**
 * Resets the spatial values in the echoforms model and rawModel in an access method
 * @param {Object} accessMethod A retrieval access method
 */
export const removeSpatialFromAccessMethod = (accessMethod) => {
  const { model, rawModel } = accessMethod

  if (!model || !rawModel) return accessMethod

  const modelDoc = new DOMParser().parseFromString(model)
  const rawModelDoc = new DOMParser().parseFromString(rawModel)

  updateModel(modelDoc)
  updateModel(rawModelDoc)

  return {
    ...accessMethod,
    model: new XMLSerializer().serializeToString(modelDoc),
    rawModel: new XMLSerializer().serializeToString(rawModelDoc)
  }
}
