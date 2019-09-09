import ShapefileRequest from '../util/request/shapefileRequest'
import { ERRORED_SHAPEFILE, UPDATE_SHAPEFILE } from '../constants/actionTypes'
import { handleError } from './errors'

export const updateShapefile = payload => ({
  type: UPDATE_SHAPEFILE,
  payload
})

export const shapefileErrored = payload => ({
  type: ERRORED_SHAPEFILE,
  payload
})

/**
 *  Sends a shapefile to be saved in the database
 * @param {Object} data The file to be saved, the filename and size of the file
 */
export const saveShapefile = data => (dispatch) => {
  const requestObject = new ShapefileRequest()

  const {
    filename: shapefileName,
    size: shapefileSize
  } = data

  dispatch(updateShapefile({ shapefileName, shapefileSize }))

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

      dispatch(handleError(error, 'shapefile'))

      console.error('Promise Rejected', error)
    })

  return response
}

export default saveShapefile
