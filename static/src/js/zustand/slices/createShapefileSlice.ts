import { ImmerStateCreator, ShapefileSlice } from '../types'

import ShapefileRequest from '../../util/request/shapefileRequest'

// @ts-expect-error Types are not defined for this module
import actions from '../../actions'

// @ts-expect-error Types are not defined for this module
import configureStore from '../../store/configureStore'
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
      const {
        dispatch: reduxDispatch
      } = configureStore()

      get().shapefile.setLoading()

      const earthdataEnvironment = getEarthdataEnvironment(get())

      const requestObject = new ShapefileRequest(earthdataEnvironment)

      requestObject.fetch(shapefileId)
        .then((responseObject) => {
          get().shapefile.updateShapefile(responseObject.data)
        })
        .catch((error) => {
          reduxDispatch(actions.handleError({
            error,
            action: 'fetchShapefile',
            resource: 'shapefile',
            requestObject
          }))
        })
    },

    saveShapefile: async (data) => {
      const {
        filename: shapefileName,
        size: shapefileSize,
        file
      } = data

      get().shapefile.updateShapefile({
        file,
        shapefileName,
        shapefileSize
      })

      const {
        dispatch: reduxDispatch
      } = configureStore()

      const earthdataEnvironment = getEarthdataEnvironment(get())

      const requestObject = new ShapefileRequest(earthdataEnvironment)

      requestObject.save(data)
        .then((responseObject) => {
          const { shapefile_id: shapefileId } = responseObject.data

          get().shapefile.updateShapefile({ shapefileId })
        })
        .catch((error) => {
          reduxDispatch(actions.handleError({
            error,
            action: 'saveShapefile',
            resource: 'shapefile',
            requestObject
          }))
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
