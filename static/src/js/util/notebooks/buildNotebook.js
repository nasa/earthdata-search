import Handlebars from 'handlebars'
import moment from 'moment'

import notebookTemplate from './notebookTemplate.ipynb?raw'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

/**
 * Builds a Jupyter Notebook JSON object based on the provided parameters.
 * @param {Object} params
 * @param {Array} params.boundingBox Bounding box coordinates
 * @param {String} params.granuleId Granule identifier
 * @param {Object} params.granules Granules object
 * @param {String} params.referrerUrl Referrer URL
 * @returns
 */
export const buildNotebook = ({
  boundingBox,
  granuleId,
  granules,
  referrerUrl
}) => {
  const { items: granulesItems } = granules
  const {
    collection,
    title: granuleTitle
  } = granulesItems[0]

  const {
    conceptId: collectionId,
    shortName,
    title: collectionTitle,
    variables
  } = collection

  const { items: variableItems } = variables
  const { name: variableName } = variableItems[0]

  let boundingBoxValues
  if (boundingBox) {
    const [minLon, minLat, maxLon, maxLat] = boundingBox.split(',')
    boundingBoxValues = {
      minLon,
      minLat,
      maxLon,
      maxLat
    }
  }

  const { edscHost } = getEnvironmentConfig()

  // Compile the template content using Handlebars
  const template = Handlebars.compile(notebookTemplate)

  // Prepare data for template rendering
  const notebookContext = {
    baseUrl: edscHost,
    boundingBox: boundingBoxValues,
    collectionId,
    collectionTitle,
    generatedTime: moment().utc().format('MMMM DD, YYYY [at] HH:mm:ss [UTC]'),
    granuleId,
    granuleTitle,
    referrerUrl,
    variable: variableName
  }

  // Render the notebook template with the prepared context
  const renderedNotebookString = template(notebookContext)

  // Parse the rendered notebook string back into a JSON object
  const parsedNotebook = JSON.parse(renderedNotebookString)

  const fileName = `${granuleTitle.slice(0, 100)}_${shortName}_sample-notebook.ipynb`

  return {
    notebook: parsedNotebook,
    fileName
  }
}
