import React from 'react'

import { eventEmitter } from '../../events/events'
import { shapefileEventTypes } from '../../constants/eventTypes'

import ShapefileDropzone from '../../components/Dropzone/ShapefileDropzone'

import useEdscStore from '../../zustand/useEdscStore'
import { setOpenModalFunction } from '../../zustand/selectors/ui'

// Add an edscId to each feature in the shapefile
const addEdscIdsToShapefile = (file) => {
  const fileWithIds = file
  const { features } = file

  const newFeatures = features.map((feature, index) => ({
    ...feature,
    properties: {
      ...feature.properties,
      edscId: `${index}`
    }
  }))

  fileWithIds.features = newFeatures

  return fileWithIds
}

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
    onSaveShapefile,
    removeSpatialFilter
  } = useEdscStore((state) => ({
    onShapefileErrored: state.shapefile.setErrored,
    onShapefileLoading: state.shapefile.setLoading,
    onSaveShapefile: state.shapefile.saveShapefile,
    removeSpatialFilter: state.query.removeSpatialFilter
  }))
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

          // Ensure the shapefile is closed
          setOpenModal(null)
        }
      }
      onSuccess={
        (file, resp, dropzoneEl) => {
          const { name, size } = file
          const fileSize = dropzoneEl.filesize(size).replace(/<{1}[^<>]{1,}>{1}/g, '')

          dropzoneEl.removeFile(file)

          // Update the name to the original name (ogre puts a hash into this name field)
          const updatedResponse = resp
          updatedResponse.name = name

          const fileWithIds = addEdscIdsToShapefile(updatedResponse)

          eventEmitter.emit(shapefileEventTypes.ADDSHAPEFILE, file, fileWithIds)

          onSaveShapefile({
            file: fileWithIds,
            filename: name,
            size: fileSize
          })
        }
      }
      onError={
        (file) => {
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
