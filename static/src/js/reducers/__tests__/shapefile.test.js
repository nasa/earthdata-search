import shapefileReducer from '../shapefile'
import {
  UPDATE_SHAPEFILE,
  LOADING_SHAPEFILE,
  ERRORED_SHAPEFILE,
  RESTORE_FROM_URL
} from '../../constants/actionTypes'

const initialState = {
  isLoading: false,
  isLoaded: false,
  isErrored: false,
  shapefileId: undefined,
  shapefileName: undefined,
  shapefileSize: undefined
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(shapefileReducer(undefined, action)).toEqual(initialState)
  })
})

describe('UPDATE_SHAPEFILE', () => {
  test('returns the correct state', () => {

    const payload = {
      shapefileName: 'test-name'
    }

    const action = {
      type: UPDATE_SHAPEFILE,
      payload
    }

    const expectedState = {
      ...initialState,
      isErrored: false,
      isLoaded: true,
      isLoading: false,
      shapefileName: 'test-name'
    }

    expect(shapefileReducer(undefined, action)).toEqual(expectedState)
  })
})


describe('LOADING_SHAPEFILE', () => {
  test('returns the correct state', () => {

    const payload = {
      name: 'test-name'
    }

    const action = {
      type: LOADING_SHAPEFILE,
      payload
    }

    const expectedState = {
      ...initialState,
      isErrored: false,
      isLoaded: false,
      isLoading: true,
      shapefileName: 'test-name'
    }

    expect(shapefileReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('ERRORED_SHAPEFILE', () => {
  test('returns the correct state', () => {

    const payload = {
      type: 'test-error-type'
    }

    const action = {
      type: ERRORED_SHAPEFILE,
      payload
    }

    const expectedState = {
      ...initialState,
      isLoaded: true,
      isLoading: false,
      isErrored: {
        type: 'test-error-type'
      }
    }

    expect(shapefileReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('RESTORE_FROM_URL', () => {
  test('returns the correct state', () => {

    const payload = {
      shapefile: {
        shapefileId: 'test-id'
      }
    }

    const action = {
      type: RESTORE_FROM_URL,
      payload
    }

    const expectedState = {
      ...initialState,
      shapefileId: 'test-id'
    }

    expect(shapefileReducer(undefined, action)).toEqual(expectedState)
  })
})
