import ShapefileRequest from '../util/request/shapefileRequest'
import { UPDATE_SHAPEFILE } from '../constants/actionTypes'

export const updateShapefile = payload => ({
  type: UPDATE_SHAPEFILE,
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
    }, (error) => {
      dispatch(updateShapefile({
        shapefileId: undefined,
        shapefileName: undefined,
        shapefileSize: undefined
      }))

      throw new Error('Request failed', error)
    })
    .catch((e) => {
      console.log('Promise Rejected', e)
    })

  return response
}

export default saveShapefile
