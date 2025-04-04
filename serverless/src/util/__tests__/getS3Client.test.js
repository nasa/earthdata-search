import { getS3Client } from '../getS3Client'

describe('getS3Client', () => {
  test('returns a new S3 client', async () => {
    const result = getS3Client()

    expect(result.config).toEqual(expect.objectContaining({
      endpoint: undefined,
      serviceId: 'S3'
    }))
  })

  describe('when in development mode', () => {
    test('returns a new S3Client', async () => {
      process.env.NODE_ENV = 'development'

      const result = getS3Client()

      expect(result.config).toEqual(expect.objectContaining({
        forcePathStyle: true
      }))

      const credentials = await result.config.credentials()
      expect(credentials).toEqual(expect.objectContaining({
        accessKeyId: 'S3RVER',
        secretAccessKey: 'S3RVER'
      }))

      const endpoint = await result.config.endpoint()
      expect(endpoint).toEqual({
        hostname: 'localhost',
        port: 4569,
        protocol: 'http:',
        path: '/',
        query: undefined
      })
    })
  })
})
