import React, {} from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'

import { eventEmitter } from '../../events/events'
import ShapefileDropzone from '../../components/Dropzone/ShapefileDropzone'

export const mapDispatchToProps = (dispatch) => ({
  onRemoveSpatialFilter:
    () => dispatch(actions.removeSpatialFilter()),
  onSaveShapefile:
    (options) => dispatch(actions.saveShapefile(options)),
  onShapefileErrored:
    (options) => dispatch(actions.shapefileErrored(options)),
  onShapefileLoading:
    (file) => dispatch(actions.shapefileLoading(file)),
  onToggleShapefileUploadModal:
    (state) => dispatch(actions.toggleShapefileUploadModal(state)),
  onUpdateShapefile:
    (options) => dispatch(actions.updateShapefile(options))
})

export const mapStateToProps = (state) => ({
  authToken: state.authToken
})

const dropzoneOptions = {
  // Official Ogre web service
  // We likely want to use this, once they fix OPTIONS requests
  // See: https://github.com/wavded/ogre/pull/22
  url: 'https://ogre.adc4gis.com/convert',
  headers: {
    'Cache-Control': undefined
  },
  paramName: 'upload',
  createImageThumbnails: false,
  acceptedFiles: '.zip,.kml,.kmz,.json,.geojson,.rss,.georss,.xml',
  // fallback() { // TODO: Implement a fallback for unsupported browser. May not be an issue with our browser support.
  //   onToggleShapefileUploadModal(true)
  // },
  parallelUploads: 1,
  uploadMultiple: false,
  previewTemplate: '<div>' // remove the dropzone preview
}

export const ShapefileDropzoneContainer = ({
  authToken,
  onRemoveSpatialFilter,
  onShapefileErrored,
  onShapefileLoading,
  onSaveShapefile,
  onToggleShapefileUploadModal
}) => (
  <ShapefileDropzone
    dropzoneOptions={dropzoneOptions}
    eventScope="shapefile"
    onSending={(file) => {
      // Remove existing spatial from the store
      onRemoveSpatialFilter()

      onShapefileLoading(file)
    }}
    onSuccess={(file, resp, dropzoneEl) => {
      const { name, size } = file
      const fileSize = dropzoneEl.filesize(size).replace(/<{1}[^<>]{1,}>{1}/g, '')

      dropzoneEl.removeFile(file)

      eventEmitter.emit('shapefile.success', file, resp)

      onToggleShapefileUploadModal(false)

      onSaveShapefile({
        authToken,
        file: resp,
        filename: name,
        size: fileSize
      })
    }}
    onError={(file) => {
      onToggleShapefileUploadModal(false)

      if (file.name.match('.*shp')) {
        onShapefileErrored({
          type: 'upload_shape'
        })
      }
    }}
    onRemovedFile={(file, resp) => {
      eventEmitter.emit('shapefile.removedfile', file, resp)
    }}
  />
)

ShapefileDropzoneContainer.propTypes = {
  authToken: PropTypes.string.isRequired,
  onShapefileErrored: PropTypes.func.isRequired,
  onShapefileLoading: PropTypes.func.isRequired,
  onSaveShapefile: PropTypes.func.isRequired,
  onRemoveSpatialFilter: PropTypes.func.isRequired,
  onToggleShapefileUploadModal: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ShapefileDropzoneContainer)
