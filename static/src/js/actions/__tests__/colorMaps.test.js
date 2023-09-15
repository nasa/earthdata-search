import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { SET_COLOR_MAPS_LOADED, SET_COLOR_MAPS_LOADING, ERRORED_COLOR_MAPS } from '../../constants/actionTypes'

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
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({
      status: 404
    }))
  })

  test('should call all the SET_COLOR_MAPS_LOADING and ERRORED_COLOR_MAPS actions when there is an error', async () => {
    const store = mockStore()
    const product = 'AMSR2_Cloud_Liquid_Water_Day'

    await store.dispatch(getColorMap({ product }))

    const storeActions = store.getActions()

    expect(storeActions[0]).toEqual({
      type: SET_COLOR_MAPS_LOADING,
      payload: { product }
    })

    expect(storeActions[1]).toEqual({
      type: ERRORED_COLOR_MAPS,
      payload: { product }
    })
  })
})

describe('getColorMaps without errors', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({
      status: 200,
      json: () => Promise.resolve({ scale: {} })
    }))
  })

  test('should call all the SET_COLOR_MAPS_LOADING and SET_COLOR_MAPS_LOADED actions when there is not an error', async () => {
    const store = mockStore()
    const product = 'AMSR2_Cloud_Liquid_Water_Day'

    await store.dispatch(getColorMap({ product }))

    const storeActions = store.getActions()

    console.log(storeActions)

    expect(storeActions[0]).toEqual({
      type: SET_COLOR_MAPS_LOADING,
      payload: { product }
    })

    expect(storeActions[1]).toEqual({
      type: SET_COLOR_MAPS_LOADED,
      payload: { product, jsondata: { scale: {} } }
    })
  })
})

describe('getColorMaps with errors but thrown in the fetch', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => { throw Error(500) })
  })

  test('should call all the SET_COLOR_MAPS_LOADING and SET_COLOR_MAPS_LOADED actions when there is not an error', async () => {
    const store = mockStore()
    const product = 'AMSR2_Cloud_Liquid_Water_Day'

    await store.dispatch(getColorMap({ product }))

    const storeActions = store.getActions()

    console.log(storeActions)

    expect(storeActions[0]).toEqual({
      type: SET_COLOR_MAPS_LOADING,
      payload: { product }
    })

    expect(storeActions[1]).toEqual({
      type: ERRORED_COLOR_MAPS,
      payload: { product }
    })
  })
})
