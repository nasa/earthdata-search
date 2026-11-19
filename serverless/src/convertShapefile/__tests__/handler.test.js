import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { dirname } from 'node:path'

import JSZip from 'jszip'
import { mockClient } from 'aws-sdk-client-mock'
import {
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'
import { ogr2ogr } from 'ogr2ogr'

import convertShapefile from '../handler'
import * as getApplicationConfig from '../../../../sharedUtils/config'

vi.mock('ogr2ogr', () => ({
  ogr2ogr: vi.fn()
}))

const s3ClientMock = mockClient(S3Client)

const OLD_ENV = process.env

const geojson = {
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Point',
      coordinates: [-77, 38]
    }
  }]
}

const buildEvent = (queryStringParameters) => ({
  httpMethod: 'GET',
  queryStringParameters
})

// Builds the contents of a zip file containing the given paths, using the path as the file contents
const createZipFile = async (paths) => {
  const zip = new JSZip()

  paths.forEach((path) => {
    if (path.endsWith('/')) {
      zip.folder(path)
    } else {
      zip.file(path, `contents of ${path}`)
    }
  })

  return zip.generateAsync({ type: 'uint8array' })
}

const getZipContents = async (fileContents) => {
  const zip = await JSZip.loadAsync(fileContents)

  const entries = Object.values(zip.files).filter((entry) => !entry.dir)

  return Object.fromEntries(await Promise.all(
    entries.map(async (entry) => [entry.name, await entry.async('string')])
  ))
}

// Runs the handler with the given S3 file and resolves with the contents of the file
// that was written to disk and passed to ogr2ogr
const getConvertedFileContents = async (s3Key, fileContents) => {
  s3ClientMock.on(GetObjectCommand).resolves({
    Body: {
      transformToByteArray: async () => fileContents
    }
  })

  s3ClientMock.on(DeleteObjectCommand).resolves({})

  let convertedFileContents
  ogr2ogr.mockImplementation(async (filePath) => {
    convertedFileContents = await readFile(filePath)

    return { data: geojson }
  })

  const result = await convertShapefile(buildEvent({ s3Key }), {})

  expect(result.statusCode).toEqual(200)

  return convertedFileContents
}

beforeEach(() => {
  s3ClientMock.reset()

  process.env = { ...OLD_ENV }
  delete process.env.NODE_ENV

  process.env.SHAPEFILE_UPLOAD_BUCKET_NAME = 'test-shapefile-bucket'

  vi.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
    defaultResponseHeaders: { 'Content-Type': 'application/json' }
  }))
})

afterEach(() => {
  process.env = OLD_ENV
})

describe('convertShapefile', () => {
  test('downloads the file from S3, converts it, deletes it and returns the GeoJSON', async () => {
    s3ClientMock.on(GetObjectCommand).resolves({
      Body: {
        transformToByteArray: async () => new Uint8Array([1, 2, 3])
      }
    })

    s3ClientMock.on(DeleteObjectCommand).resolves({})

    let convertedFilePath
    ogr2ogr.mockImplementation(async (filePath) => {
      convertedFilePath = filePath

      // The file should exist on disk while ogr2ogr runs
      expect(existsSync(filePath)).toBe(true)

      return { data: geojson }
    })

    const result = await convertShapefile(buildEvent({ s3Key: 'abc-123/shapes.zip' }), {})

    expect(s3ClientMock.commandCalls(GetObjectCommand)[0].args[0].input).toEqual({
      Bucket: 'test-shapefile-bucket',
      Key: 'abc-123/shapes.zip'
    })

    expect(ogr2ogr).toHaveBeenCalledTimes(1)
    expect(ogr2ogr).toHaveBeenCalledWith(expect.stringMatching(/shapes\.zip$/), {
      options: ['-t_srs', 'EPSG:4326']
    })

    // The temporary directory should be cleaned up
    expect(existsSync(dirname(convertedFilePath))).toBe(false)

    expect(s3ClientMock.commandCalls(DeleteObjectCommand).length).toEqual(1)
    expect(s3ClientMock.commandCalls(DeleteObjectCommand)[0].args[0].input).toEqual({
      Bucket: 'test-shapefile-bucket',
      Key: 'abc-123/shapes.zip'
    })

    expect(result).toEqual({
      isBase64Encoded: false,
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geojson)
    })
  })

  test('returns the GeoJSON even if deleting the file from S3 fails', async () => {
    s3ClientMock.on(GetObjectCommand).resolves({
      Body: {
        transformToByteArray: async () => new Uint8Array([1, 2, 3])
      }
    })

    s3ClientMock.on(DeleteObjectCommand).rejects(new Error('AccessDenied'))

    ogr2ogr.mockResolvedValue({ data: geojson })

    const result = await convertShapefile(buildEvent({ s3Key: 'abc-123/shapes.zip' }), {})

    expect(s3ClientMock.commandCalls(DeleteObjectCommand).length).toEqual(1)

    expect(result.statusCode).toEqual(200)
    expect(JSON.parse(result.body)).toEqual(geojson)
  })

  test('returns a 400 when no s3Key is provided', async () => {
    const result = await convertShapefile(buildEvent({}), {})

    expect(s3ClientMock.commandCalls(GetObjectCommand).length).toEqual(0)
    expect(ogr2ogr).not.toHaveBeenCalled()

    expect(result.statusCode).toEqual(400)
    expect(JSON.parse(result.body)).toEqual({ errors: ['An s3Key is required.'] })
  })

  test('returns a 400 when no query string parameters are provided', async () => {
    const result = await convertShapefile(buildEvent(null), {})

    expect(s3ClientMock.commandCalls(GetObjectCommand).length).toEqual(0)

    expect(result.statusCode).toEqual(400)
    expect(JSON.parse(result.body)).toEqual({ errors: ['An s3Key is required.'] })
  })

  test('returns a 422 when ogr2ogr does not produce GeoJSON', async () => {
    s3ClientMock.on(GetObjectCommand).resolves({
      Body: {
        transformToByteArray: async () => new Uint8Array([1, 2, 3])
      }
    })

    ogr2ogr.mockResolvedValue({ text: '' })

    const result = await convertShapefile(buildEvent({ s3Key: 'abc-123/shapes.zip' }), {})

    expect(s3ClientMock.commandCalls(DeleteObjectCommand).length).toEqual(0)

    expect(result.statusCode).toEqual(422)
    expect(JSON.parse(result.body)).toEqual({ errors: ["Unable to convert 'shapes.zip' to GeoJSON."] })
  })

  test('returns an error response when S3 fails', async () => {
    s3ClientMock.on(GetObjectCommand).rejects(new Error('NoSuchKey'))

    const result = await convertShapefile(buildEvent({ s3Key: 'abc-123/missing.zip' }), {})

    expect(ogr2ogr).not.toHaveBeenCalled()

    expect(result.statusCode).toEqual(500)
    expect(JSON.parse(result.body)).toEqual({
      statusCode: 500,
      errors: ['Error: NoSuchKey']
    })
  })

  test('returns an error response when ogr2ogr fails', async () => {
    s3ClientMock.on(GetObjectCommand).resolves({
      Body: {
        transformToByteArray: async () => new Uint8Array([1, 2, 3])
      }
    })

    ogr2ogr.mockRejectedValue(new Error('ogr2ogr failed'))

    const result = await convertShapefile(buildEvent({ s3Key: 'abc-123/shapes.zip' }), {})

    expect(s3ClientMock.commandCalls(DeleteObjectCommand).length).toEqual(0)

    expect(result.statusCode).toEqual(500)
    expect(JSON.parse(result.body).errors).toEqual(['Error: ogr2ogr failed'])
  })

  describe('when flattening zip files', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    describe('when the file is not a zip file', () => {
      test('converts the original file', async () => {
        const fileContents = new TextEncoder().encode(JSON.stringify(geojson))

        const result = await getConvertedFileContents('abc-123/shapes.geojson', fileContents)

        expect(result.equals(Buffer.from(fileContents))).toBe(true)
        expect(console.log).toHaveBeenCalledTimes(0)
      })
    })

    describe('when the zip file contents are at the root of the zip', () => {
      test('converts the original file', async () => {
        const fileContents = await createZipFile([
          'HAS_Polygon.shp',
          'HAS_Polygon.shx',
          'HAS_Polygon.dbf'
        ])

        const result = await getConvertedFileContents('abc-123/shapes.zip', fileContents)

        expect(result.equals(Buffer.from(fileContents))).toBe(true)
        expect(console.log).toHaveBeenCalledTimes(0)
      })
    })

    describe('when the zip file contents are in different directories', () => {
      test('converts the original file', async () => {
        const fileContents = await createZipFile([
          'HAS_Polygon/HAS_Polygon.shp',
          'HAS_Polygon/HAS_Polygon.shx',
          'Other/HAS_Polygon.dbf'
        ])

        const result = await getConvertedFileContents('abc-123/shapes.zip', fileContents)

        expect(result.equals(Buffer.from(fileContents))).toBe(true)
        expect(console.log).toHaveBeenCalledTimes(0)
      })
    })

    describe('when the zip file contents are all under a single directory', () => {
      test('converts a new zip file with the contents moved to the root', async () => {
        const fileContents = await createZipFile([
          'HAS_Polygon/',
          'HAS_Polygon/HAS_Polygon.shp',
          'HAS_Polygon/HAS_Polygon.shx',
          'HAS_Polygon/HAS_Polygon.dbf'
        ])

        const result = await getConvertedFileContents('abc-123/HAS_Polygon.zip', fileContents)

        expect(await getZipContents(result)).toEqual({
          'HAS_Polygon.shp': 'contents of HAS_Polygon/HAS_Polygon.shp',
          'HAS_Polygon.shx': 'contents of HAS_Polygon/HAS_Polygon.shx',
          'HAS_Polygon.dbf': 'contents of HAS_Polygon/HAS_Polygon.dbf'
        })

        expect(console.log).toHaveBeenCalledTimes(1)
        expect(console.log).toHaveBeenCalledWith('Flattening zip file "HAS_Polygon.zip": moving files from "HAS_Polygon/" to the root of the archive')
      })
    })

    describe('when the zip file contents are all under nested directories', () => {
      test('removes the common directory prefix and keeps the remaining structure', async () => {
        const fileContents = await createZipFile([
          'outer/inner/HAS_Polygon.shp',
          'outer/inner/HAS_Polygon.shx',
          'outer/inner/extra/HAS_Polygon.dbf'
        ])

        const result = await getConvertedFileContents('abc-123/shapes.zip', fileContents)

        expect(await getZipContents(result)).toEqual({
          'HAS_Polygon.shp': 'contents of outer/inner/HAS_Polygon.shp',
          'HAS_Polygon.shx': 'contents of outer/inner/HAS_Polygon.shx',
          'extra/HAS_Polygon.dbf': 'contents of outer/inner/extra/HAS_Polygon.dbf'
        })

        expect(console.log).toHaveBeenCalledTimes(1)
        expect(console.log).toHaveBeenCalledWith('Flattening zip file "shapes.zip": moving files from "outer/inner/" to the root of the archive')
      })
    })

    describe('when the zip file includes macOS metadata files', () => {
      test('ignores the metadata files and moves the contents to the root', async () => {
        const fileContents = await createZipFile([
          'HAS_Polygon/HAS_Polygon.shp',
          'HAS_Polygon/HAS_Polygon.shx',
          'HAS_Polygon/HAS_Polygon.dbf',
          'HAS_Polygon/.DS_Store',
          '__MACOSX/HAS_Polygon/._HAS_Polygon.shp'
        ])

        const result = await getConvertedFileContents('abc-123/shapes.zip', fileContents)

        expect(await getZipContents(result)).toEqual({
          'HAS_Polygon.shp': 'contents of HAS_Polygon/HAS_Polygon.shp',
          'HAS_Polygon.shx': 'contents of HAS_Polygon/HAS_Polygon.shx',
          'HAS_Polygon.dbf': 'contents of HAS_Polygon/HAS_Polygon.dbf'
        })

        expect(console.log).toHaveBeenCalledTimes(1)
      })
    })

    describe('when the zip file cannot be read', () => {
      test('logs the error and converts the original file', async () => {
        const fileContents = new TextEncoder().encode('not a zip file')

        const result = await getConvertedFileContents('abc-123/shapes.zip', fileContents)

        expect(result.equals(Buffer.from(fileContents))).toBe(true)

        expect(console.log).toHaveBeenCalledTimes(1)
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining("Unable to read zip file 'shapes.zip':"))
      })
    })
  })
})
