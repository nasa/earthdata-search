import { GENERATE_NOTEBOOK_FINISHED, GENERATE_NOTEBOOK_STARTED } from '../constants/actionTypes'
import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'
import GenerateNotebookRequest from '../util/request/generateNotebookRequest'
import { handleError } from './errors'

export const onGenerateNotebookStarted = (payload) => ({
  type: GENERATE_NOTEBOOK_STARTED,
  payload
})

export const onGenerateNotebookFinished = (payload) => ({
  type: GENERATE_NOTEBOOK_FINISHED,
  payload
})

/**
 * Fetch the collection search export in the given format
 * @param {String} format Format for the export (JSON, CSV)
 */
export const generateNotebook = (params) => (dispatch, getState) => {
  const { granuleId } = params
  dispatch(onGenerateNotebookStarted(granuleId))

  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const {
    authToken
  } = state

  const generateNotebookRequestObject = new GenerateNotebookRequest(authToken, earthdataEnvironment)

  const response = generateNotebookRequestObject.generateNotebook(params)
    .then((responseObject) => {
      const { headers, data } = responseObject

      const { downloadUrl } = data

      // Create a blob with the text data from the export
      // const blob = new Blob([JSON.stringify(data)])

      // const url = window.URL.createObjectURL(blob)

      // Create a hyperlink to the blob and give it a filename
      const link = document.createElement('a')
      link.href = downloadUrl
      link.setAttribute('download', '')

      // Add the link to the page
      document.body.appendChild(link)

      // Click on the link to download the export file to the user's computer
      link.click()

      // Remove the link from the page
      link.parentNode.removeChild(link)

      dispatch(onGenerateNotebookFinished(granuleId))
    })
    .catch((error) => {
      dispatch(onGenerateNotebookFinished(granuleId))

      dispatch(handleError({
        error,
        action: 'generateNotebook',
        generateNotebookRequestObject
      }))
    })

  return response
}
