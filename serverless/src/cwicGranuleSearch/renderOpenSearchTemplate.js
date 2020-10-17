/**
 * Replaces all valid keys from the users request within the granule url template provided by OpenSearch
 * @param {String} template - An OpenSearch string template representing the URL to retreive granules with.
 * @param {Object} params - The parameters from the users request to supply to the template.
 * @return {String} A formatted URL with the users request parameters inserted
 */
export const renderOpenSearchTemplate = (template, params) => {
  // Ampersands in the URL throw off OpenSearch
  let renderedTemplate = template.replace(/&amp;/g, '&')

  const {
    pageNum,
    pageSize = 20,
    boundingBox,
    point,
    temporal
  } = params

  renderedTemplate = renderedTemplate.replace(/{count\??}/, pageSize)

  if (pageNum) {
    const startIndex = (((pageNum - 1) * pageSize) + 1)
    renderedTemplate = renderedTemplate.replace(/{startIndex\??}/, startIndex)
  }

  if (boundingBox) {
    renderedTemplate = renderedTemplate.replace(/{geo:box}/, boundingBox)
  }

  if (point) {
    // OpenSearch doesn't support point search so to add that functionality to
    // to our app we use the point and make a tiny bounding box around the point
    const [lon, lat] = point.split(',')

    const epsilon = 0.001

    const boundingBoxFromPoint = [
      lon - epsilon,
      lat - epsilon,
      lon + epsilon,
      lat + epsilon
    ].join(',')

    renderedTemplate = renderedTemplate.replace(/{geo:box}/, boundingBoxFromPoint)
  }

  if (temporal) {
    const [timeStart, timeEnd] = temporal.split(',')

    renderedTemplate = renderedTemplate.replace(/{time:start}/, timeStart.replace(/\.\d{3}Z$/, 'Z'))
    renderedTemplate = renderedTemplate.replace(/{time:end}/, timeEnd.replace(/\.\d{3}Z$/, 'Z'))
  }

  // Remove any empty params from the template
  return renderedTemplate.replace(/[?&][^=]*=\{[^}]*\}/g, '')
}
