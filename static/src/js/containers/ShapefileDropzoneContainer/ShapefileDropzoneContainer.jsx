import React, {} from 'react'

import { eventEmitter } from '../../events/events'

import { shapefileEventTypes } from '../../constants/eventTypes'
import { MODAL_NAMES } from '../../constants/modalNames'

import ShapefileDropzone from '../../components/Dropzone/ShapefileDropzone'

import addShapefile from '../../util/addShapefile'

import useEdscStore from '../../zustand/useEdscStore'
import { isModalOpen, setOpenModalFunction } from '../../zustand/selectors/ui'

const dropzoneOptions = {
  // Official Ogre web service
  // We likely want to use this, once they fix OPTIONS requests
  // See: https://github.com/wavded/ogre/pull/22
  url: 'https://ogre.adc4gis.com/convert',
  params: {
    targetSrs: 'crs:84'
  },
  headers: {
    'Cache-Control': undefined
  },
  paramName: 'upload',
  createImageThumbnails: false,
  acceptedFiles: '.zip,.kml,.kmz,.json,.geojson,.rss,.georss,.xml',
  parallelUploads: 1,
  uploadMultiple: false,
  previewTemplate: '<div>' // Remove the dropzone preview
}

export const ShapefileDropzoneContainer = () => {
  const {
    onShapefileErrored,
    onShapefileLoading,
    removeSpatialFilter
  } = useEdscStore((state) => ({
    onShapefileErrored: state.shapefile.setErrored,
    onShapefileLoading: state.shapefile.setLoading,
    removeSpatialFilter: state.query.removeSpatialFilter
  }))
  const isOpen = useEdscStore((state) => isModalOpen(state, MODAL_NAMES.SHAPEFILE_UPLOAD))
  const setOpenModal = useEdscStore(setOpenModalFunction)

  return (
    <ShapefileDropzone
      dropzoneOptions={dropzoneOptions}
      eventScope="shapefile"
      onSending={
        (file) => {
          // Remove existing spatial from the store
          removeSpatialFilter()

          const { name } = file

          onShapefileLoading(name)
        }
      }
      onSuccess={
        (file, resp, dropzoneEl) => {
          const { name, size } = file
          const fileSize = dropzoneEl.filesize(size).replace(/<{1}[^<>]{1,}>{1}/g, '')

          dropzoneEl.removeFile(file)

          addShapefile({
            file: resp,
            filename: name,
            size: fileSize
          })

          // Only close the modal if it is currently open
          // This keeps it from closing the TOO_MANY_POINTS modal if that has been opened
          if (isOpen) setOpenModal(null)
        }
      }
      onError={
        (file) => {
          let shapefileError = ''

          if (isOpen) setOpenModal(null)

          if (file.name.match('.*(zip|shp|dbf|shx)$')) {
            shapefileError = 'To use a shapefile, please upload a zip file that includes its .shp, .shx, and .dbf files.'
          } else if (file.name.match('.*(kml|kmz)$')) {
            shapefileError = 'To use a Keyhole Markup Language file, please upload a valid .kml or .kmz file.'
          } else if (file.name.match('.*(json|geojson)$')) {
            shapefileError = 'To use a GeoJSON file, please upload a valid .json or .geojson file.'
          } else if (file.name.match('.*(rss|georss|xml)$')) {
            shapefileError = 'To use a GeoRSS file, please upload a valid .rss, .georss, or .xml file.'
          } else {
            shapefileError = 'Invalid file format.'
          }

          onShapefileErrored({
            message: shapefileError
          })
        }
      }
      onRemovedFile={
        (file, resp) => {
          eventEmitter.emit(shapefileEventTypes.REMOVESHAPEFILE, file, resp)
        }
      }
    />
  )
}

export default ShapefileDropzoneContainer
