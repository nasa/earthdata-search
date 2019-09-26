import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { SET_DATA_QUALITY_SUMMARIES } from '../../constants/actionTypes'
import { setDataQualitySummaries, fetchDataQualitySummaries } from '../dataQualitySummaries'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

describe('setDataQualitySummaries', () => {
  test('should create an action to add portal configs', () => {
    const payload = {
      catalogItemId: 'C10000001-EDSC',
      dataQualitySummaries: [{
        id: '1234-ABCD-5678-EFGH-91011',
        name: 'EDSC',
        provider_id: 'EDSC-TEST',
        summary: 'data quality summary',
        updated_at: '2011-01-31T20:42:08Z'
      }]
    }

    const expectedAction = {
      type: SET_DATA_QUALITY_SUMMARIES,
      payload
    }

    expect(setDataQualitySummaries(payload)).toEqual(expectedAction)
  })
})

describe('fetchDataQualitySummaries', () => {
  test('should load the portal config from a file', async () => {
    nock(/localhost/)
      .post(/dqs/)
      .reply(200, [{
        id: '1234-ABCD-5678-EFGH-91011',
        name: 'EDSC',
        provider_id: 'EDSC-TEST',
        summary: 'data quality summary',
        updated_at: '2011-01-31T20:42:08Z'
      }])

    const catalogItemId = 'C10000001-EDSC'

    const payload = {
      catalogItemId: 'C10000001-EDSC',
      dataQualitySummaries: [{
        id: '1234-ABCD-5678-EFGH-91011',
        name: 'EDSC',
        provider_id: 'EDSC-TEST',
        summary: 'data quality summary',
        updated_at: '2011-01-31T20:42:08Z'
      }]
    }

    // mockStore with initialState
    const store = mockStore()

    // call the dispatch
    await store.dispatch(fetchDataQualitySummaries(catalogItemId))

    // Is setDataQualitySummaries called with the right payload
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: SET_DATA_QUALITY_SUMMARIES,
      payload
    })
  })
})
