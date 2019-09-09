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
      dispatch(handleError(error, 'data quality summaries'))

      console.error('Failed to fetch data quailty summaries', error)
    })

  return response
}

export default fetchDataQualitySummaries
