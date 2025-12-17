import nock from 'nock'
import { waitFor } from '@testing-library/react'

import useEdscStore from '../../useEdscStore'
import { initialState } from '../createShapefileSlice'

import ShapefileRequest from '../../../util/request/shapefileRequest'

import { ShapefileFile } from '../../../types/sharedTypes'

jest.mock('../../../store/configureStore', () => jest.fn())

const mockshapefile: ShapefileFile = {
  name: 'point.geojson',
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          -77.0163,
          38.883
        ]
      },
      properties: {
        edscId: '0'
      }
    }
  ]
}

const shapefileFunctions = {
  setLoading: expect.any(Function),
  setErrored: expect.any(Function),
  updateShapefile: expect.any(Function),
  clearShapefile: expect.any(Function),
  saveShapefile: expect.any(Function),
  fetchShapefile: expect.any(Function)
}

describe('createShapefileSlice', () => {
  test('sets the default state', () => {
    const zustandState = useEdscStore.getState()
    const { shapefile } = zustandState

    expect(shapefile).toEqual({
      ...initialState,
      ...shapefileFunctions
    })
  })

  describe('clearShapefile', () => {
    test('clears the shapefile', () => {
      const zustandInitialState = useEdscStore.getInitialState()
      useEdscStore.setState({
        shapefile: {
          ...zustandInitialState.shapefile,
          isLoaded: true,
          shapefileId: '12345',
          shapefileName: 'Test Shapefile',
          shapefileSize: '1 MB',
          file: mockshapefile
        }
      })

      const zustandState = useEdscStore.getState()
      const { shapefile } = zustandState
      const { clearShapefile } = shapefile
      clearShapefile()

      const updatedState = useEdscStore.getState()
      const { shapefile: updatedShapefile } = updatedState
      expect(updatedShapefile).toEqual({
        ...zustandInitialState.shapefile
      })
    })
  })

  describe('fetchShapefile', () => {
    describe('when the shapefile is fetched successfully', () => {
      test('fetches the shapefile', async () => {
        const zustandInitialState = useEdscStore.getInitialState()
        useEdscStore.setState({
          shapefile: {
            ...zustandInitialState.shapefile,
            shapefileId: '12345'
          }
        })

        nock(/localhost/)
          .get(/shapefiles/)
          .reply(200, {
            file: mockshapefile,
            shapefileName: 'MockShapefile.geojson',
            selectedFeatures: ['0']
          })

        const zustandState = useEdscStore.getState()
        const { shapefile } = zustandState
        const { fetchShapefile } = shapefile

        await fetchShapefile('12345')

        await waitFor(() => {
          const updatedState = useEdscStore.getState()
          const { shapefile: updatedShapefile } = updatedState
          expect(updatedShapefile).toEqual({
            isErrored: false,
            isLoaded: true,
            isLoading: false,
            file: mockshapefile,
            shapefileId: '12345',
            shapefileName: 'MockShapefile.geojson',
            shapefileSize: undefined,
            selectedFeatures: ['0'],
            ...shapefileFunctions
          })
        })

        expect(window.dataLayer.push).toHaveBeenCalledTimes(1)
        expect(window.dataLayer.push).toHaveBeenCalledWith({
          event: 'timing',
          timingEventCategory: 'ajax',
          timingEventValue: expect.any(Number),
          timingEventVar: 'http://localhost:3000/shapefiles/12345'
        })
      })
    })

    describe('when the shapefile fails to fetch', () => {
      test('sets the error state', async () => {
        nock(/localhost/)
          .get(/shapefiles/)
          .reply(500, {
            message: 'Error fetching shapefile'
          })

        nock(/localhost/)
          .post(/error_logger/)
          .reply(200)

        useEdscStore.setState((state) => {
          state.errors.handleError = jest.fn()
        })

        const zustandState = useEdscStore.getState()
        const { shapefile } = zustandState
        const { fetchShapefile } = shapefile

        await fetchShapefile('12345')

        await waitFor(() => {
          const updatedState = useEdscStore.getState()
          const { shapefile: updatedShapefile } = updatedState
          expect(updatedShapefile).toEqual({
            isErrored: false,
            isLoaded: false,
            isLoading: true,
            shapefileId: undefined,
            shapefileName: undefined,
            shapefileSize: undefined,
            ...shapefileFunctions
          })
        })

        const { errors } = useEdscStore.getState()

        await waitFor(() => {
          expect(errors.handleError).toHaveBeenCalledTimes(1)
        })

        expect(errors.handleError).toHaveBeenCalledWith({
          error: expect.any(Error),
          action: 'fetchShapefile',
          resource: 'shapefile',
          requestObject: expect.any(ShapefileRequest)
        })

        expect(window.dataLayer.push).toHaveBeenCalledTimes(1)
        expect(window.dataLayer.push).toHaveBeenCalledWith({
          event: 'timing',
          timingEventCategory: 'ajax',
          timingEventValue: expect.any(Number),
          timingEventVar: 'http://localhost:3000/shapefiles/12345'
        })
      })
    })
  })

  describe('saveShapefile', () => {
    describe('when the shapefile is saved successfully', () => {
      test('saves the shapefile', async () => {
        nock(/localhost/)
          .post(/shapefiles/)
          .reply(200, {
            shapefile_id: '12345'
          })

        const zustandState = useEdscStore.getState()
        const { shapefile } = zustandState
        const { saveShapefile } = shapefile

        await saveShapefile({
          filename: 'Test Shapefile',
          size: '1 MB',
          file: mockshapefile
        })

        await waitFor(() => {
          const updatedState = useEdscStore.getState()
          const { shapefile: updatedShapefile } = updatedState
          expect(updatedShapefile).toEqual({
            isErrored: false,
            isLoaded: true,
            isLoading: false,
            shapefileId: '12345',
            shapefileName: 'Test Shapefile',
            shapefileSize: '1 MB',
            file: mockshapefile,
            ...shapefileFunctions
          })
        })

        expect(window.dataLayer.push).toHaveBeenCalledTimes(1)
        expect(window.dataLayer.push).toHaveBeenCalledWith({
          event: 'timing',
          timingEventCategory: 'ajax',
          timingEventValue: expect.any(Number),
          timingEventVar: 'http://localhost:3000/shapefiles'
        })
      })
    })

    describe('when the shapefile fails to save', () => {
      test('sets the error state', async () => {
        nock(/localhost/)
          .post(/shapefiles/)
          .reply(500, {
            message: 'Error saving shapefile'
          })

        nock(/localhost/)
          .post(/error_logger/)
          .reply(200)

        useEdscStore.setState((state) => {
          state.errors.handleError = jest.fn()
        })

        const zustandState = useEdscStore.getState()
        const { shapefile } = zustandState
        const { saveShapefile } = shapefile

        await saveShapefile({
          filename: 'Test Shapefile',
          size: '1 MB',
          file: mockshapefile
        })

        await waitFor(() => {
          const updatedState = useEdscStore.getState()
          const { shapefile: updatedShapefile } = updatedState
          expect(updatedShapefile).toEqual({
            isErrored: false,
            isLoaded: true,
            isLoading: false,
            shapefileId: undefined,
            shapefileName: 'Test Shapefile',
            shapefileSize: '1 MB',
            file: mockshapefile,
            ...shapefileFunctions
          })
        })

        const { errors } = useEdscStore.getState()

        await waitFor(() => {
          expect(errors.handleError).toHaveBeenCalledTimes(1)
        })

        expect(errors.handleError).toHaveBeenCalledWith({
          error: expect.any(Error),
          action: 'saveShapefile',
          resource: 'shapefile',
          requestObject: expect.any(ShapefileRequest)
        })

        expect(window.dataLayer.push).toHaveBeenCalledTimes(1)
        expect(window.dataLayer.push).toHaveBeenCalledWith({
          event: 'timing',
          timingEventCategory: 'ajax',
          timingEventValue: expect.any(Number),
          timingEventVar: 'http://localhost:3000/shapefiles'
        })
      })
    })
  })

  describe('setLoading', () => {
    test('updates the shapefile', () => {
      const zustandState = useEdscStore.getState()
      const { shapefile } = zustandState
      const { setLoading } = shapefile
      setLoading('Test Shapefile')

      const updatedState = useEdscStore.getState()
      const { shapefile: updatedShapefile } = updatedState
      expect(updatedShapefile).toEqual({
        isErrored: false,
        isLoaded: false,
        isLoading: true,
        shapefileId: undefined,
        shapefileName: 'Test Shapefile',
        shapefileSize: undefined,
        ...shapefileFunctions
      })
    })
  })

  describe('setErrored', () => {
    test('updates openKeywordFacet', () => {
      const zustandState = useEdscStore.getState()
      const { shapefile } = zustandState
      const { setErrored } = shapefile
      setErrored('Test error message')

      const updatedState = useEdscStore.getState()
      const { shapefile: updatedShapefile } = updatedState
      expect(updatedShapefile).toEqual({
        isErrored: {
          message: 'Test error message'
        },
        isLoaded: true,
        isLoading: false,
        shapefileId: undefined,
        shapefileName: undefined,
        shapefileSize: undefined,
        ...shapefileFunctions
      })
    })
  })

  describe('updateShapefile', () => {
    test('updates the shapefile', () => {
      const zustandState = useEdscStore.getState()
      const { shapefile } = zustandState
      const { updateShapefile } = shapefile

      updateShapefile({
        file: mockshapefile,
        shapefileId: '12345',
        shapefileName: 'Test Shapefile',
        shapefileSize: '1 MB'
      })

      const updatedState = useEdscStore.getState()
      const { shapefile: updatedShapefile } = updatedState

      expect(updatedShapefile).toEqual({
        isErrored: false,
        isLoaded: true,
        isLoading: false,
        file: mockshapefile,
        shapefileId: '12345',
        shapefileName: 'Test Shapefile',
        shapefileSize: '1 MB',
        ...shapefileFunctions
      })
    })
  })
})
