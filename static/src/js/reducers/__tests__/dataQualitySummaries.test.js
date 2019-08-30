import dataQualitySummariesReducer from '../dataQualitySummaries'
import { SET_DATA_QUALITY_SUMMARIES } from '../../constants/actionTypes'

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }
    const initialState = {}

    expect(dataQualitySummariesReducer(undefined, action)).toEqual(initialState)
  })
})

describe('SET_DATA_QUALITY_SUMMARIES', () => {
  test('returns the correct state', () => {
    const action = {
      type: SET_DATA_QUALITY_SUMMARIES,
      payload: {
        catalogItemId: 'C10000001-EDSC',
        dataQualitySummaries: [{
          id: '1234-ABCD-5678-EFGH-91011',
          name: 'EDSC',
          provider_id: 'EDSC-TEST',
          summary: 'data quality summary',
          updated_at: '2011-01-31T20:42:08Z'
        }]
      }
    }

    const expectedState = {
      'C10000001-EDSC': [{
        id: '1234-ABCD-5678-EFGH-91011',
        name: 'EDSC',
        provider_id: 'EDSC-TEST',
        summary: 'data quality summary',
        updated_at: '2011-01-31T20:42:08Z'
      }]
    }

    expect(dataQualitySummariesReducer(undefined, action)).toEqual(expectedState)
  })
})
