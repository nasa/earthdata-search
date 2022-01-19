import DataQualitySummaryRequest from '../util/request/dataQualitySummaryRequest'

import { SET_DATA_QUALITY_SUMMARIES } from '../constants/actionTypes'

import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'
import { handleError } from './errors'

export const setDataQualitySummaries = (dqsData) => ({
  type: SET_DATA_QUALITY_SUMMARIES,
  payload: dqsData
})

/**
 * Fetch data quality summaries from echo rest
 */
export const fetchDataQualitySummaries = (catalogItemId) => (dispatch, getState) => {
  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const { authToken } = state

  // If the user is not logged in, don't fetch data quality summaries
  if (authToken === '') return null

  const requestObject = new DataQualitySummaryRequest(authToken, earthdataEnvironment)

  const response = requestObject.fetch({ catalogItemId })
    .then((response) => {
      const { data } = response

      dispatch(setDataQualitySummaries({
        catalogItemId,
        dataQualitySummaries: data
      }))
    })
    .catch((error) => {
      dispatch(handleError({
        error,
        action: 'fetchDataQualitySummaries',
        resource: 'data quality summaries',
        requestObject
      }))
    })

  return response
}

export default fetchDataQualitySummaries
