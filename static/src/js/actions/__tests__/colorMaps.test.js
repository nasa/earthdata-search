import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import actions from '..'

import {
  SET_COLOR_MAPS_LOADED,
  SET_COLOR_MAPS_LOADING,
  ERRORED_COLOR_MAPS,
  ADD_ERROR
} from '../../constants/actionTypes'

import {
  setColorMapsErrored,
  setColorMapsLoaded,
  setColorMapsLoading,
  getColorMap
} from '../colorMaps'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

describe('setColorMapsErrored', () => {
  test('should create an action to update metadata.colormaps with an errored entry', () => {
    const payload = { mock: 'payload' }
    const expectedAction = {
      type: ERRORED_COLOR_MAPS,
      payload
    }
    expect(setColorMapsErrored(payload)).toEqual(expectedAction)
  })
})

describe('setColorMapsLoaded', () => {
  test('should create an action to update metadata.colormaps with a loaded entry', () => {
    const payload = { mock: 'payload' }
    const expectedAction = {
      type: SET_COLOR_MAPS_LOADED,
      payload
    }
    expect(setColorMapsLoaded(payload)).toEqual(expectedAction)
  })
})

describe('setColorMapsLoading', () => {
  test('should create an action to update metadata.colormaps with a loading entry', () => {
    const payload = { mock: 'payload' }
    const expectedAction = {
      type: SET_COLOR_MAPS_LOADING,
      payload
    }
    expect(setColorMapsLoading(payload)).toEqual(expectedAction)
  })
})

describe('getColorMaps with error', () => {
  test('should call all the SET_COLOR_MAPS_LOADING and ERRORED_COLOR_MAPS actions when there is an error', async () => {
    const handleErrorMock = jest.spyOn(actions, 'handleError')

    nock(/localhost/)
      .get(/colormaps\/AIRS_Prata_SO2_Index_Day/)
      .reply(500)

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const store = mockStore({})
    const product = 'AIRS_Prata_SO2_Index_Day'

    const consoleMock = jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn())

    await store.dispatch(getColorMap({ product })).then(() => {
      const storeActions = store.getActions()

      expect(storeActions[0]).toEqual({
        type: SET_COLOR_MAPS_LOADING,
        payload: { product }
      })

      expect(storeActions[1]).toEqual({
        type: ERRORED_COLOR_MAPS,
        payload: { product }
      })

      expect(storeActions[2]).toEqual({
        type: ADD_ERROR,
        payload: expect.objectContaining({
          title: 'Error retrieving colormaps',
          message: 'Unknown Error'
        })
      })

      expect(handleErrorMock).toHaveBeenCalledTimes(1)
      expect(handleErrorMock).toBeCalledWith(expect.objectContaining({
        action: 'getColorMap',
        resource: 'colormaps'
      }))

      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })
})

describe('getColorMaps without errors', () => {
  test('should call all the SET_COLOR_MAPS_LOADING and SET_COLOR_MAPS_LOADED actions when there is not an error', async () => {
    const store = mockStore()
    const product = 'AMSR2_Cloud_Liquid_Water_Day'

    nock(/localhost/)
      .get(/colormaps\/AMSR2_Cloud_Liquid_Water_Day/)
      .reply(200, {
        scale: {}
      })

    await store.dispatch(getColorMap({ product }))

    const storeActions = store.getActions()

    expect(storeActions[0]).toEqual({
      type: SET_COLOR_MAPS_LOADING,
      payload: { product }
    })

    expect(storeActions[1]).toEqual({
      type: SET_COLOR_MAPS_LOADED,
      payload: { product, colorMapData: { scale: {} } }
    })
  })
})
