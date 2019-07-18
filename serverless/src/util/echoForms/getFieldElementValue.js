import xpath from 'xpath'
import { DOMParser } from 'xmldom'
import { namespaces } from './namespaces'

export const getFieldElementValue = (xmlDocument, fieldName, dataType = 'ecs') => {
  const doc = new DOMParser().parseFromString(xmlDocument)

  return xpath.useNamespaces(namespaces)(`string(//${dataType}:${fieldName})`, doc)
}
