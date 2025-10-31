import { ImmerStateCreator, ShapefileSlice } from '../types'

import ShapefileRequest from '../../util/request/shapefileRequest'

import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'
import { getEdlToken } from '../selectors/user'

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

      const edlToken = getEdlToken(zustandState)
      const earthdataEnvironment = getEarthdataEnvironment(zustandState)

      const requestObject = new ShapefileRequest(edlToken, earthdataEnvironment)

      requestObject.fetch(shapefileId)
        .then((responseObject) => {
          get().shapefile.updateShapefile(responseObject.data)
        })
        .catch((error) => {
          zustandState.errors.handleError({
            error: error as Error,
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

      const edlToken = getEdlToken(zustandState)
      const earthdataEnvironment = getEarthdataEnvironment(zustandState)

      const requestObject = new ShapefileRequest(edlToken, earthdataEnvironment)

      requestObject.save({
        ...data,
        earthdataEnvironment,
        edlToken
      })
        .then((responseObject) => {
          const { shapefile_id: shapefileId } = responseObject.data

          get().shapefile.updateShapefile({ shapefileId })
        })
        .catch((error) => {
          zustandState.errors.handleError({
            error: error as Error,
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
