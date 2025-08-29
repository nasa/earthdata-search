import nock from 'nock'
import { waitFor } from '@testing-library/react'

import useEdscStore from '../../useEdscStore'
import { initialState } from '../createShapefileSlice'

import ShapefileRequest from '../../../util/request/shapefileRequest'

// @ts-expect-error Types are not defined for this module
import configureStore from '../../../store/configureStore'

// @ts-expect-error Types are not defined for this module
import actions from '../../../actions'

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
        configureStore.mockReturnValue({
          getState: () => ({
            earthdataEnvironment: 'prod'
          })
        })

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
        const handleErrorMock = jest.spyOn(actions, 'handleError')

        const mockDispatch = jest.fn()
        configureStore.mockReturnValue({
          dispatch: mockDispatch,
          getState: () => ({
            earthdataEnvironment: 'prod'
          })
        })

        nock(/localhost/)
          .get(/shapefiles/)
          .reply(500, {
            message: 'Error fetching shapefile'
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

        await waitFor(() => {
          expect(mockDispatch).toHaveBeenCalledTimes(1)
        })

        expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function))

        expect(window.dataLayer.push).toHaveBeenCalledTimes(1)
        expect(window.dataLayer.push).toHaveBeenCalledWith({
          event: 'timing',
          timingEventCategory: 'ajax',
          timingEventValue: expect.any(Number),
          timingEventVar: 'http://localhost:3000/shapefiles/12345'
        })

        expect(handleErrorMock).toHaveBeenCalledTimes(1)
        expect(handleErrorMock).toHaveBeenCalledWith({
          error: expect.any(Error),
          action: 'fetchShapefile',
          resource: 'shapefile',
          requestObject: expect.any(ShapefileRequest)
        })
      })
    })
  })

  describe('saveShapefile', () => {
    describe('when the shapefile is saved successfully', () => {
      test('saves the shapefile', async () => {
        configureStore.mockReturnValue({
          getState: () => ({
            earthdataEnvironment: 'prod'
          })
        })

        nock(/localhost/)
          .post(/shapefiles/)
          .reply(200, {
            shapefile_id: '12345'
          })

        const zustandState = useEdscStore.getState()
        const { shapefile } = zustandState
        const { saveShapefile } = shapefile

        await saveShapefile({
          authToken: 'mockAuthToken',
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
        const handleErrorMock = jest.spyOn(actions, 'handleError')

        const mockDispatch = jest.fn()
        configureStore.mockReturnValue({
          dispatch: mockDispatch,
          getState: () => ({
            earthdataEnvironment: 'prod'
          })
        })

        nock(/localhost/)
          .post(/shapefiles/)
          .reply(500, {
            message: 'Error saving shapefile'
          })

        const zustandState = useEdscStore.getState()
        const { shapefile } = zustandState
        const { saveShapefile } = shapefile

        await saveShapefile({
          authToken: 'mockAuthToken',
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

        await waitFor(() => {
          expect(mockDispatch).toHaveBeenCalledTimes(1)
        })

        expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function))

        expect(window.dataLayer.push).toHaveBeenCalledTimes(1)
        expect(window.dataLayer.push).toHaveBeenCalledWith({
          event: 'timing',
          timingEventCategory: 'ajax',
          timingEventValue: expect.any(Number),
          timingEventVar: 'http://localhost:3000/shapefiles'
        })

        expect(handleErrorMock).toHaveBeenCalledTimes(1)
        expect(handleErrorMock).toHaveBeenCalledWith({
          error: expect.any(Error),
          action: 'saveShapefile',
          resource: 'shapefile',
          requestObject: expect.any(ShapefileRequest)
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

  describe('NLP spatial data integration', () => {
    test('accepts NLP spatial data with edscId in feature properties', () => {
      const nlpSpatialData: ShapefileFile = {
        name: 'NLP Extracted Spatial Area',
        type: 'FeatureCollection' as const,
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [-120, 40],
                [-120, 50],
                [-110, 50],
                [-110, 40],
                [-120, 40]
              ]]
            },
            properties: {
              source: 'nlp',
              query: 'wildfire california',
              edscId: '0'
            }
          }
        ]
      }

      const zustandState = useEdscStore.getState()
      const { shapefile } = zustandState
      const { updateShapefile } = shapefile

      updateShapefile({
        file: nlpSpatialData,
        shapefileName: 'NLP Spatial Area',
        selectedFeatures: ['0']
      })

      const updatedState = useEdscStore.getState()
      const { shapefile: updatedShapefile } = updatedState

      expect(updatedShapefile.file).toEqual(nlpSpatialData)
      expect(updatedShapefile.isLoaded).toBe(true)
      expect(updatedShapefile.selectedFeatures).toEqual(['0'])
      expect(updatedShapefile.shapefileName).toBe('NLP Spatial Area')
      expect(updatedShapefile.file?.features[0].properties?.edscId).toBe('0')
      expect(updatedShapefile.file?.features[0].properties?.source).toBe('nlp')
    })
  })
})
