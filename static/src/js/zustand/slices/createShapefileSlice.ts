import { ImmerStateCreator, ShapefileSlice } from '../types'

import ShapefileRequest from '../../util/request/shapefileRequest'

import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'

export const initialState = {
  isErrored: false,
  isLoaded: false,
  isLoading: false,
  file: undefined,
  selectedFeatures: undefined,
  shapefileId: undefined,
  shapefileName: undefined,
  shapefileSize: undefined
}

const createShapefileSlice: ImmerStateCreator<ShapefileSlice> = (set, get) => ({
  shapefile: {
    ...initialState,

    clearShapefile: () => {
      set((state) => {
        state.shapefile = {
          ...state.shapefile,
          ...initialState
        }
      })
    },

    fetchShapefile: async (shapefileId) => {
      const zustandState = get()

      zustandState.shapefile.setLoading()

      const earthdataEnvironment = getEarthdataEnvironment(zustandState)

      const requestObject = new ShapefileRequest(earthdataEnvironment)

      requestObject.fetch(shapefileId)
        .then((responseObject) => {
          get().shapefile.updateShapefile(responseObject.data)
        })
        .catch((error) => {
          get().errors.handleError({
            error,
            action: 'fetchShapefile',
            resource: 'shapefile',
            requestObject
          })
        })
    },

    saveShapefile: async (data) => {
      const {
        filename: shapefileName,
        size: shapefileSize,
        file
      } = data

      const zustandState = get()

      zustandState.shapefile.updateShapefile({
        file,
        shapefileName,
        shapefileSize
      })

      const earthdataEnvironment = getEarthdataEnvironment(zustandState)

      const requestObject = new ShapefileRequest(earthdataEnvironment)

      requestObject.save(data)
        .then((responseObject) => {
          const { shapefile_id: shapefileId } = responseObject.data

          get().shapefile.updateShapefile({ shapefileId })
        })
        .catch((error) => {
          get().errors.handleError({
            error,
            action: 'saveShapefile',
            resource: 'shapefile',
            requestObject
          })
        })
    },

    setLoading: (shapefileName) => {
      set((state) => {
        state.shapefile = {
          ...state.shapefile,
          isErrored: false,
          isLoaded: false,
          isLoading: true,
          shapefileName
        }
      })
    },

    setErrored: (message) => {
      set((state) => {
        state.shapefile.isErrored = {
          message
        }

        state.shapefile.isLoaded = true
        state.shapefile.isLoading = false
        state.shapefile.shapefileId = undefined
        state.shapefile.shapefileSize = undefined
      })
    },

    updateShapefile: (data) => {
      set((state) => {
        state.shapefile = {
          ...state.shapefile,
          isErrored: false,
          isLoaded: true,
          isLoading: false,
          ...data
        }
      })
    }
  }
})

export default createShapefileSlice
