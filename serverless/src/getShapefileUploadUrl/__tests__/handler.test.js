import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import getShapefileUploadUrl from '../handler'
import * as getApplicationConfig from '../../../../sharedUtils/config'

vi.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: vi.fn()
}))

const OLD_ENV = process.env

const mockUuid = '00000000-0000-4000-8000-000000000000'

const buildEvent = (params) => ({
  httpMethod: 'POST',
  body: JSON.stringify({ params })
})

beforeEach(() => {
  process.env = { ...OLD_ENV }
  delete process.env.NODE_ENV

  process.env.SHAPEFILE_UPLOAD_BUCKET_NAME = 'test-shapefile-bucket'

  vi.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
    defaultResponseHeaders: { 'Content-Type': 'application/json' }
  }))

  vi.spyOn(crypto, 'randomUUID').mockReturnValue(mockUuid)

  getSignedUrl.mockResolvedValue('https://test-shapefile-bucket.s3.amazonaws.com/presigned-url')
})

afterEach(() => {
  process.env = OLD_ENV
})

describe('getShapefileUploadUrl', () => {
  test('returns a presigned URL for uploading the file', async () => {
    const context = {}

    const result = await getShapefileUploadUrl(buildEvent({
      contentType: 'application/zip',
      filename: 'shapes.zip'
    }), context)

    expect(context.callbackWaitsForEmptyEventLoop).toBe(false)

    expect(getSignedUrl).toHaveBeenCalledTimes(1)

    const [, command, options] = getSignedUrl.mock.calls[0]

    expect(command).toBeInstanceOf(PutObjectCommand)
    expect(command.input).toEqual({
      Bucket: 'test-shapefile-bucket',
      ContentType: 'application/zip',
      Key: `${mockUuid}/shapes.zip`
    })

    expect(options).toEqual({ expiresIn: 300 })

    expect(result).toEqual({
      isBase64Encoded: false,
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        expiresIn: 300,
        key: `${mockUuid}/shapes.zip`,
        url: 'https://test-shapefile-bucket.s3.amazonaws.com/presigned-url'
      })
    })
  })

  test('defaults the content type when one is not provided', async () => {
    const result = await getShapefileUploadUrl(buildEvent({ filename: 'shapes.zip' }), {})

    const [, command] = getSignedUrl.mock.calls[0]

    expect(command.input.ContentType).toEqual('application/octet-stream')

    expect(result.statusCode).toEqual(200)
  })

  test('defaults the bucket name when one is not configured', async () => {
    delete process.env.SHAPEFILE_UPLOAD_BUCKET_NAME

    await getShapefileUploadUrl(buildEvent({ filename: 'shapes.zip' }), {})

    const [, command] = getSignedUrl.mock.calls[0]

    expect(command.input.Bucket).toEqual('earthdata-search-dev-shapefile-uploads')
  })

  describe('when sanitizing the filename', () => {
    test.each([
      ['removes unix path segments', '../../etc/shapes.zip', 'shapes.zip'],
      ['removes windows path segments', 'C:\\Users\\test\\shapes.zip', 'shapes.zip'],
      ['replaces spaces and unsafe characters', 'my shapes (1)&<>.zip', 'my_shapes__1____.zip'],
      ['keeps letters, numbers, dots, underscores and dashes', 'My_Shapes-2024.v1.zip', 'My_Shapes-2024.v1.zip']
    ])('%s', async (_description, filename, expectedFilename) => {
      const result = await getShapefileUploadUrl(buildEvent({ filename }), {})

      const [, command] = getSignedUrl.mock.calls[0]

      expect(command.input.Key).toEqual(`${mockUuid}/${expectedFilename}`)
      expect(JSON.parse(result.body).key).toEqual(`${mockUuid}/${expectedFilename}`)
    })
  })

  describe('when a filename is not provided', () => {
    test.each([
      ['the filename is missing', { params: { contentType: 'application/zip' } }],
      ['the params are missing', {}],
      ['the body is missing', null]
    ])('returns a 400 when %s', async (_description, body) => {
      const result = await getShapefileUploadUrl({
        httpMethod: 'POST',
        body: body ? JSON.stringify(body) : null
      }, {})

      expect(getSignedUrl).not.toHaveBeenCalled()

      expect(result).toEqual({
        isBase64Encoded: false,
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ errors: ['A filename is required.'] })
      })
    })
  })

  test('returns an error response when the body is not valid JSON', async () => {
    const result = await getShapefileUploadUrl({
      httpMethod: 'POST',
      body: '{ not json'
    }, {})

    expect(getSignedUrl).not.toHaveBeenCalled()

    expect(result.statusCode).toEqual(500)
    expect(result.headers).toEqual({ 'Content-Type': 'application/json' })
  })

  test('returns an error response when the URL cannot be signed', async () => {
    getSignedUrl.mockRejectedValue(new Error('Signing failed'))

    const result = await getShapefileUploadUrl(buildEvent({ filename: 'shapes.zip' }), {})

    expect(result).toEqual({
      isBase64Encoded: false,
      headers: { 'Content-Type': 'application/json' },
      statusCode: 500,
      body: JSON.stringify({
        statusCode: 500,
        errors: ['Error: Signing failed']
      })
    })
  })
})
