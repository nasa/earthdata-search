import React from 'react'

import { eventEmitter } from '../../events/events'

import { shapefileEventTypes } from '../../constants/eventTypes'

import ShapefileDropzone from '../../components/Dropzone/ShapefileDropzone'

import addShapefile from '../../util/addShapefile'

import useEdscStore from '../../zustand/useEdscStore'
import { setOpenModalFunction } from '../../zustand/selectors/ui'

import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

const { apiHost } = getEnvironmentConfig()

const dropzoneOptions = {
  // This gets overridden with a presigned S3 URL
  url: 'http://localhost:3001/shapefile_upload_url',
  method: 'PUT',
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
  const setOpenModal = useEdscStore(setOpenModalFunction)

  return (
    <ShapefileDropzone
      dropzoneOptions={dropzoneOptions}
      eventScope="shapefile"
      onSending={
        (file, xhr) => {
          const { send: originalSend } = xhr
          xhr.setRequestHeader('Content-Type', file.type)
          // eslint-disable-next-line no-param-reassign
          xhr.send = function send() {
            originalSend.call(xhr, file)
          }

          // Remove existing spatial from the store
          removeSpatialFilter()

          const { name } = file

          onShapefileLoading(name)

          // Ensure the shapefile is closed
          setOpenModal(null)
        }
      }
      onSuccess={
        async (file, resp, dropzoneEl) => {
          const { s3Key } = file

          const response = await fetch(`${apiHost}/convert_shapefile?s3Key=${encodeURIComponent(s3Key)}`)
          const data = await response.json()

          const { name, size } = file
          const fileSize = dropzoneEl.filesize(size).replace(/<{1}[^<>]{1,}>{1}/g, '')

          dropzoneEl.removeFile(file)

          await addShapefile({
            file: data,
            filename: name,
            size: fileSize
          })
        }
      }
      onError={
        (file, error) => {
          if (error.startsWith('Server responded with')) {
            onShapefileErrored('Error uploading file')

            return
          }

          let shapefileError = ''

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

          onShapefileErrored(shapefileError)
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
