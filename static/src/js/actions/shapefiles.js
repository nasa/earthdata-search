import ShapefileRequest from '../util/request/shapefileRequest'
import {
  CLEAR_SHAPEFILE,
  ERRORED_SHAPEFILE,
  LOADING_SHAPEFILE,
  UPDATE_SHAPEFILE
} from '../constants/actionTypes'

import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'
import { handleError } from './errors'

export const clearShapefile = () => ({
  type: CLEAR_SHAPEFILE
})

export const updateShapefile = (payload) => ({
  type: UPDATE_SHAPEFILE,
  payload
})

export const shapefileLoading = (payload) => ({
  type: LOADING_SHAPEFILE,
  payload
})

export const shapefileErrored = (payload) => ({
  type: ERRORED_SHAPEFILE,
  payload
})

/**
 *  Sends a shapefile to be saved in the database
 * @param {Object} data The file to be saved, the filename and size of the file
 */
export const saveShapefile = (data) => (dispatch, getState) => {
  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const requestObject = new ShapefileRequest(earthdataEnvironment)

  const {
    filename: shapefileName,
    size: shapefileSize,
    file
  } = data

  dispatch(updateShapefile({ file, shapefileName, shapefileSize }))

  const response = requestObject.save(data)
    .then((response) => {
      const { shapefile_id: shapefileId } = response.data

      dispatch(updateShapefile({ shapefileId }))
    })
    .catch((error) => {
      dispatch(updateShapefile({
        shapefileId: undefined,
        shapefileName: undefined,
        shapefileSize: undefined
      }))

      dispatch(handleError({
        error,
        action: 'saveShapefile',
        resource: 'shapefile',
        requestObject
      }))
    })

  return response
}

/**
 * Retrieves a shapefile from lambda
 * @param {String} shapefileId Shapefile ID to retrieve
 */
export const fetchShapefile = (shapefileId) => (dispatch, getState) => {
  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const requestObject = new ShapefileRequest(earthdataEnvironment)

  const response = requestObject.fetch(shapefileId)
    .then((response) => {
      dispatch(updateShapefile(response.data))
    })
    .catch((error) => {
      dispatch(handleError({
        error,
        action: 'fetchShapefile',
        resource: 'shapefile',
        requestObject
      }))
    })

  return response
}

export default saveShapefile
