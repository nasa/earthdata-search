import { findFieldElement } from './findFieldElement'

export const getNameValuePairsForProjections = (xmlDocument) => {
  const projectionFields = ['PROJECTION_PARAMETERS']

  const projectionFieldValues = {}

  // TODO: Complete appropriate filtering
  projectionFields.forEach((field) => {
    const xmlField = findFieldElement(xmlDocument, field)

    if (xmlField) {
      const projectionValues = []

      xmlField.forEach((xmlElement) => {
        if (xmlElement.childNodes && Object.values(xmlElement.childNodes)) {
          Object.values(xmlElement.childNodes).forEach((leafNode) => {
            if (leafNode.childNodes && Object.values(leafNode.childNodes)) {
              Object.values(leafNode.childNodes).forEach((values) => {
                if (values && values.firstChild) {
                  projectionValues.push(`${values.localName}:${values.firstChild.nodeValue}`)
                }
              })
            }
          })
        }
      })

      projectionFieldValues[field] = projectionValues.join(',')
    }
  })

  return projectionFieldValues
}
