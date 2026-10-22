import React from 'react'
import JSZip from 'jszip'

import { eventEmitter } from '../../events/events'

import { shapefileEventTypes } from '../../constants/eventTypes'

import ShapefileDropzone from '../../components/Dropzone/ShapefileDropzone'

import addShapefile from '../../util/addShapefile'

import useEdscStore from '../../zustand/useEdscStore'
import { setOpenModalFunction } from '../../zustand/selectors/ui'

// Files added by OS archive tools that should not affect the directory structure check
const isIgnoredZipEntry = (path) => path.startsWith('__MACOSX/') || path.split('/').pop() === '.DS_Store'

/**
 * If every file in the zip lives under a single common directory (e.g. `HAS_Polygon/*`),
 * returns a new zip Blob with those files moved to the root of the archive. Otherwise
 * returns null, signaling the original file can be used as is.
 * @param {File} file The zip file to inspect
 */
const flattenZipFile = async (file) => {
  const contents = await JSZip.loadAsync(file)

  const entries = Object.values(contents.files)
    .filter((entry) => !entry.dir && !isIgnoredZipEntry(entry.name))

  if (entries.length === 0) return null

  // Find the directory prefix shared by all files, e.g. `HAS_Polygon/` or `outer/inner/`
  const directorySegments = entries.map(({ name }) => name.split('/').slice(0, -1))
  const commonSegments = []

  directorySegments[0].every((segment, index) => {
    const isShared = directorySegments.every((segments) => segments[index] === segment)

    if (isShared) commonSegments.push(segment)

    return isShared
  })

  if (commonSegments.length === 0) return null

  const prefix = `${commonSegments.join('/')}/`

  console.log(`Flattening zip file "${file.name}": moving files from "${prefix}" to the root of the archive`)

  const newZip = new JSZip()

  await Promise.all(entries.map(async (entry) => {
    const data = await entry.async('arraybuffer')

    newZip.file(entry.name.slice(prefix.length), data, { date: entry.date })
  }))

  return newZip.generateAsync({
    type: 'blob',
    mimeType: 'application/zip',
    compression: 'DEFLATE'
  })
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
  previewTemplate: '<div>', // Remove the dropzone preview
  // If a zip file's contents are all nested under a single directory, move them to the
  // root of the zip before uploading
  transformFile: (file, done) => {
    // If the file is not a zip, we don't need to flatten it
    if (!file.name.toLowerCase().endsWith('.zip')) {
      done(file)

      return
    }

    flattenZipFile(file)
      .then((flattenedFile) => done(flattenedFile || file))
      // If the zip can't be read, upload the original and let the server report the error
      .catch(() => done(file))
  }
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
        async (file, resp, dropzoneEl) => {
          const { name, size } = file
          const fileSize = dropzoneEl.filesize(size).replace(/<{1}[^<>]{1,}>{1}/g, '')

          dropzoneEl.removeFile(file)

          await addShapefile({
            file: resp,
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
