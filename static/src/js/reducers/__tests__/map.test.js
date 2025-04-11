import mapReducer from '../map'
import { UPDATE_MAP, RESTORE_FROM_URL } from '../../constants/actionTypes'
import projectionCodes from '../../constants/projectionCodes'

const initialState = {
  base: {
    worldImagery: true,
    trueColor: false,
    landWaterMap: false
  },
  latitude: 0,
  longitude: 0,
  overlays: {
    bordersRoads: true,
    coastlines: false,
    placeLabels: true
  },
  projection: projectionCodes.geographic,
  rotation: 0,
  zoom: 3
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(mapReducer(undefined, action)).toEqual(initialState)
  })
})

describe('UPDATE_MAP', () => {
  test('returns the correct state', () => {
    const payload = {
      base: {
        worldImagery: true,
        trueColor: false,
        landWaterMap: false
      },
      latitude: 0,
      longitude: 0,
      overlays: {
        bordersRoads: true,
        coastlines: false,
        placeLabels: true
      },
      projection: projectionCodes.geographic,
      rotation: 0,
      zoom: 2
    }
    const action = {
      type: UPDATE_MAP,
      payload
    }

    const expectedState = payload

    expect(mapReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('RESTORE_FROM_URL', () => {
  test('returns the correct state', () => {
    const map = {
      base: {
        worldImagery: true,
        trueColor: false,
        landWaterMap: false
      },
      latitude: 0,
      longitude: 0,
      overlays: {
        bordersRoads: true,
        coastlines: false,
        placeLabels: true
      },
      projection: projectionCodes.geographic,
      rotation: 0,
      zoom: 2
    }

    const initial = {
      ...initialState,
      base: {
        worldImagery: false,
        trueColor: false,
        landWaterMap: true
      }
    }

    const action = {
      type: RESTORE_FROM_URL,
      payload: {
        map
      }
    }

    const expectedState = map

    expect(mapReducer(initial, action)).toEqual(expectedState)
  })
})
