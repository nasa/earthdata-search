import shapefileReducer from '../shapefile'
import {
  CLEAR_SHAPEFILE,
  UPDATE_SHAPEFILE,
  LOADING_SHAPEFILE,
  ERRORED_SHAPEFILE,
  RESTORE_FROM_URL,
  CLEAR_FILTERS
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

describe('CLEAR_SHAPEFILE', () => {
  test('returns the correct state', () => {
    const state = {
      isLoading: false,
      isLoaded: true,
      isErrored: false,
      shapefileId: 'some-id',
      shapefileName: 'some-name',
      shapefileSize: 'some-size'
    }

    const action = {
      type: CLEAR_SHAPEFILE
    }

    const expectedState = {
      ...initialState
    }

    expect(shapefileReducer(state, action)).toEqual(expectedState)
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

describe('CLEAR_FILTERS', () => {
  test('returns the correct state', () => {
    const action = { type: CLEAR_FILTERS }

    expect(shapefileReducer(undefined, action)).toEqual(initialState)
  })
})
