import DataQualitySummaryRequest from '../util/request/dataQualitySummaryRequest'

import { SET_DATA_QUALITY_SUMMARIES } from '../constants/actionTypes'
import { handleError } from './errors'

export const setDataQualitySummaries = dqsData => ({
  type: SET_DATA_QUALITY_SUMMARIES,
  payload: dqsData
})

/**
 * Fetch data quality summaries from echo rest
 */
export const fetchDataQualitySummaries = catalogItemId => (dispatch, getState) => {
  const { authToken } = getState()

  // If the user is not logged in, don't fetch data quality summaries
  if (authToken === '') return null

  const requestObject = new DataQualitySummaryRequest(authToken)

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
