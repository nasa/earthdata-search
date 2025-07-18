import { SET_DATA_QUALITY_SUMMARIES } from '../../constants/actionTypes'
import { setDataQualitySummaries } from '../dataQualitySummaries'

describe('setDataQualitySummaries', () => {
  test('should create an action to update the data quality summaries state', () => {
    const payload = 'mock-data-quality-summaries'
    const expectedAction = {
      type: SET_DATA_QUALITY_SUMMARIES,
      payload
    }
    expect(setDataQualitySummaries(payload)).toEqual(expectedAction)
  })
})
