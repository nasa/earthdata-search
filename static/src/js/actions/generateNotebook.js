import { GENERATE_NOTEBOOK_FINISHED, GENERATE_NOTEBOOK_STARTED } from '../constants/actionTypes'
import GenerateNotebookRequest from '../util/request/generateNotebookRequest'

import useEdscStore from '../zustand/useEdscStore'
import { getEarthdataEnvironment } from '../zustand/selectors/earthdataEnvironment'
import { getEdlToken } from '../zustand/selectors/user'

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
export const generateNotebook = (params) => (dispatch) => {
  const { granuleId } = params
  dispatch(onGenerateNotebookStarted(granuleId))

  const zustandState = useEdscStore.getState()
  const edlToken = getEdlToken(zustandState)
  const earthdataEnvironment = getEarthdataEnvironment(zustandState)

  const generateNotebookRequestObject = new GenerateNotebookRequest(edlToken, earthdataEnvironment)

  const response = generateNotebookRequestObject.generateNotebook(JSON.stringify(params))
    .then((responseObject) => {
      const { data } = responseObject

      const { downloadUrl } = data

      // Create a hyperlink to the download url
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

      zustandState.errors.handleError({
        error,
        action: 'generateNotebook',
        generateNotebookRequestObject
      })
    })

  return response
}
