import {
  mkdtemp,
  rm,
  writeFile
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, join } from 'node:path'

import { DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import JSZip from 'jszip'
import { ogr2ogr } from 'ogr2ogr'

import { getApplicationConfig } from '../../../sharedUtils/config'
import { getS3Client } from '../util/getS3Client'
import { parseError } from '../../../sharedUtils/parseError'

// AWS S3 adapter
let s3

// Files added by OS archive tools that should not affect the directory structure check
const isIgnoredZipEntry = (path) => path.startsWith('__MACOSX/') || path.split('/').pop() === '.DS_Store'

/**
 * If every file in the zip lives under a single common directory (e.g. `HAS_Polygon/*`),
 * returns a new zip Buffer with those files moved to the root of the archive. Otherwise
 * returns null, signaling the original file can be used as is.
 * @param {Uint8Array} fileContents The contents of the zip file to inspect
 * @param {String} filename The name of the zip file, used for logging
 */
const flattenZipFile = async (fileContents, filename) => {
  const contents = await JSZip.loadAsync(fileContents)

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

  console.log(`Flattening zip file "${filename}": moving files from "${prefix}" to the root of the archive`)

  const newZip = new JSZip()

  await Promise.all(entries.map(async (entry) => {
    const data = await entry.async('nodebuffer')

    newZip.file(entry.name.slice(prefix.length), data, { date: entry.date })
  }))

  return newZip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE'
  })
}

/**
 * Returns the contents of the root KML document in a KMZ file. A KMZ is a zip containing one
 * KML document (usually `doc.kml`) and optionally files it references, such as images. The
 * Lambda layer's GDAL only includes the KML driver, which can't read KMZ files directly.
 * Returns null if the KMZ doesn't contain a KML document.
 * @param {Uint8Array} fileContents The contents of the KMZ file
 */
const extractKmlFromKmz = async (fileContents) => {
  const contents = await JSZip.loadAsync(fileContents)

  const kmlEntries = Object.values(contents.files)
    .filter((entry) => (
      !entry.dir
      && !isIgnoredZipEntry(entry.name)
      && entry.name.toLowerCase().endsWith('.kml')
    ))

  // Prefer `doc.kml` per the KMZ convention, otherwise use the first KML document in the archive
  const rootEntry = kmlEntries.find(({ name }) => name.split('/').pop().toLowerCase() === 'doc.kml')
    || kmlEntries[0]

  if (!rootEntry) return null

  return rootEntry.async('nodebuffer')
}

/**
 * Converts a shapefile that was uploaded to S3 into GeoJSON
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const convertShapefile = async (event, context) => {
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  if (s3 == null) {
    s3 = getS3Client()
  }

  const { defaultResponseHeaders } = getApplicationConfig()

  const {
    SHAPEFILE_UPLOAD_BUCKET_NAME: bucketName = 'earthdata-search-dev-shapefile-upload'
  } = process.env

  let workingDirectory

  try {
    const { queryStringParameters } = event

    // Default the queryStringParameters because when none are provided the key is null
    const { s3Key } = queryStringParameters || {}

    if (!s3Key) {
      return {
        isBase64Encoded: false,
        statusCode: 400,
        headers: defaultResponseHeaders,
        body: JSON.stringify({ errors: ['An s3Key is required.'] })
      }
    }

    const response = await s3.send(new GetObjectCommand({
      Bucket: bucketName,
      Key: s3Key
    }))

    // Write the file to a unique temporary directory. The original file extension
    // is preserved so ogr2ogr can choose the correct input driver (e.g. `.zip` => `/vsizip/`)
    workingDirectory = await mkdtemp(join(tmpdir(), 'convertShapefile-'))
    const filename = basename(s3Key)
    let filePath = join(workingDirectory, filename)

    let fileContents = await response.Body.transformToByteArray()

    // Extract the KML document from KMZ files so it can be read by the KML driver
    if (filename.toLowerCase().endsWith('.kmz')) {
      try {
        const kmlContents = await extractKmlFromKmz(fileContents)

        if (kmlContents) {
          fileContents = kmlContents
          filePath = filePath.replace(/\.kmz$/i, '.kml')
        }
      } catch (zipError) {
        // If the kmz can't be read, convert the original and let ogr2ogr report the error
        parseError(zipError, { logPrefix: `Unable to read kmz file '${filename}':` })
      }
    }

    // If a zip file's contents are all nested under a single directory, move them to the
    // root of the zip so ogr2ogr can find the shapefile
    if (filename.toLowerCase().endsWith('.zip')) {
      try {
        fileContents = await flattenZipFile(fileContents, filename) || fileContents
      } catch (zipError) {
        // If the zip can't be read, convert the original and let ogr2ogr report the error
        parseError(zipError, { logPrefix: `Unable to read zip file '${filename}':` })
      }
    }

    await writeFile(filePath, fileContents)

    const { data } = await ogr2ogr(filePath, {
      // Reproject to WGS84 so the client always receives longitude/latitude coordinates
      options: ['-t_srs', 'EPSG:4326']
    })

    if (!data) {
      return {
        isBase64Encoded: false,
        statusCode: 422,
        headers: defaultResponseHeaders,
        body: JSON.stringify({ errors: [`Unable to convert '${filename}' to GeoJSON.`] })
      }
    }

    // The uploaded file is no longer needed once it has been converted. A failure here
    // shouldn't prevent the client from receiving the converted GeoJSON
    try {
      await s3.send(new DeleteObjectCommand({
        Bucket: bucketName,
        Key: s3Key
      }))
    } catch (deleteError) {
      parseError(deleteError, { logPrefix: `Failed to delete '${s3Key}' from S3:` })
    }

    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: defaultResponseHeaders,
      body: JSON.stringify(data)
    }
  } catch (error) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(error)
    }
  } finally {
    // Lambda reuses `/tmp` across warm invocations, so clean up after each conversion
    if (workingDirectory) {
      await rm(workingDirectory, {
        force: true,
        recursive: true
      })
    }
  }
}

export default convertShapefile
