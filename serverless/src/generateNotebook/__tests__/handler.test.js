import nock from 'nock'

import * as getEarthdataConfig from '../../../../sharedUtils/config'

import * as determineEarthdataEnvironment from '../../util/determineEarthdataEnvironment'
import * as getAccessTokenFromJwtToken from '../../util/urs/getAccessTokenFromJwtToken'
import * as getJwtToken from '../../util/getJwtToken'
import * as getS3Client from '../../../../static/src/js/util/getS3Client'

import generateNotebook from '../handler'

const OLD_ENV = process.env

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn().mockResolvedValue('https://mock-signed-url.com')
}))

const mockS3Send = jest.fn()
const mockS3Client = { send: mockS3Send }

beforeEach(() => {
  jest.spyOn(getJwtToken, 'getJwtToken').mockImplementation(() => 'mockJwt')
  jest.spyOn(getAccessTokenFromJwtToken, 'getAccessTokenFromJwtToken').mockImplementation(() => ({ access_token: 'mockAccessToken' }))

  jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
    graphQlHost: 'http://graphql.example.com'
  }))

  mockS3Send.mockResolvedValue({ $metadata: { httpStatusCode: 200 } })
  jest.spyOn(getS3Client, 'getS3Client').mockReturnValue(mockS3Client)

  process.env = { ...OLD_ENV }
  delete process.env.NODE_ENV

  process.env.GENERATE_NOTEBOOKS_BUCKET_NAME = 'MOCK_GENERATE_NOTEBOOK_BUCKET'
})

afterEach(() => {
  jest.clearAllMocks()
  mockS3Send.mockReset()
})

describe('generateNotebook', () => {
  describe('when successfully generating a notebook', () => {
    test('returns a signed URL', async () => {
      nock(/graphql/)
        .post('/api')
        .reply(200, {
          data: {
            granules: {
              items: [{
                conceptId: 'G1234-MOCK',
                title: 'Mock Granule',
                collection: {
                  conceptId: 'C1234-MOCK',
                  title: 'Mock Collection',
                  shortName: 'Mock Short Name',
                  variables: {
                    items: [{
                      name: 'Mock Variable'
                    }]
                  }
                }
              }]
            }
          }
        })

      const event = {
        body: JSON.stringify({
          boundingBox: '-180, -90, 180, 90',
          referrerUrl: 'http://example.com',
          granuleId: 'G1234-MOCK',
          variableId: 'V1234-MOCK'
        }),
        headers: {}
      }

      const response = await generateNotebook(event)

      expect(response.statusCode).toBe(200)
      expect(response.body).toBe(JSON.stringify({ downloadUrl: 'https://mock-signed-url.com' }))
    })
  })

  describe('when saving to S3 fails', () => {
    test('throws an error when failing to save notebook to S3', async () => {
      nock(/graphql/)
        .post('/api')
        .reply(200, {
          data: {
            granules: {
              items: [{
                conceptId: 'G1234-MOCK',
                title: 'Mock Granule',
                collection: {
                  conceptId: 'C1234-MOCK',
                  title: 'Mock Collection',
                  shortName: 'Mock Short Name',
                  variables: {
                    items: [{
                      name: 'Mock Variable'
                    }]
                  }
                }
              }]
            }
          }
        })

      mockS3Send.mockResolvedValue({ $metadata: { httpStatusCode: 500 } })
      jest.spyOn(getS3Client, 'getS3Client').mockReturnValue(mockS3Client)

      const event = {
        body: JSON.stringify({
          boundingBox: '-180, -90, 180, 90',
          referrerUrl: 'http://example.com',
          granuleId: 'G1234-MOCK',
          variableId: 'V1234-MOCK'
        }),
        headers: {}
      }

      const response = await generateNotebook(event)

      expect(response.statusCode).toBe(500)
      expect(JSON.parse(response.body)).toHaveProperty('errors')
      expect(JSON.parse(response.body).errors[0]).toBe('Error: Failed to save notebook to S3')
    })
  })

  describe('when a bounding box is provided', () => {
    test('generates notebook without bounding box field', async () => {
      nock(/graphql/)
        .post('/api')
        .reply(200, {
          data: {
            granules: {
              items: [{
                conceptId: 'G1234-MOCK',
                title: 'Mock Granule',
                collection: {
                  conceptId: 'C1234-MOCK',
                  title: 'Mock Collection',
                  shortName: 'Mock Short Name',
                  variables: {
                    items: [{
                      name: 'Mock Variable'
                    }]
                  }
                }
              }]
            }
          }
        })

      const event = {
        body: JSON.stringify({
          granuleId: 'G1234-MOCK',
          variableId: 'V1234-MOCK'
        }),
        headers: {}
      }

      await generateNotebook(event)

      // Check that the notebook was generated without bounding box values
      expect(mockS3Send).toHaveBeenCalled()
      const s3PutCall = mockS3Send.mock.calls[0][0]
      const notebookContent = JSON.parse(s3PutCall.input.Body)
      expect(notebookContent).toHaveProperty('cells')
      expect(notebookContent.cells.every((cell) => !(cell.source && cell.source.includes('"minLon"')))).toBeTruthy()
    })
  })

  describe('when JWT token is not present', () => {
    test('returns a signed URL', async () => {
      nock(/graphql/)
        .post('/api')
        .reply(200, {
          data: {
            granules: {
              items: [{
                conceptId: 'G1234-MOCK',
                title: 'Mock Granule',
                collection: {
                  conceptId: 'C1234-MOCK',
                  title: 'Mock Collection',
                  shortName: 'Mock Short Name',
                  variables: {
                    items: [{
                      name: 'Mock Variable'
                    }]
                  }
                }
              }]
            }
          }
        })

      jest.spyOn(getJwtToken, 'getJwtToken').mockReturnValue(null)

      const event = {
        body: JSON.stringify({
          granuleId: 'G1234-MOCK',
          variableId: 'V1234-MOCK'
        }),
        headers: { 'mock-header': 'mock-value' }
      }

      const response = await generateNotebook(event)

      expect(response.statusCode).toBe(200)
      expect(response.body).toBe(JSON.stringify({ downloadUrl: 'https://mock-signed-url.com' }))
    })
  })

  describe('when call to graphql results in 500', () => {
    test('returns an error', async () => {
      nock(/graphql/)
        .post(/api/)
        .reply(500, {
          errors: [
            'Test error message'
          ]
        })

      mockS3Send.mockReset()

      const event = {
        body: JSON.stringify({
          granuleId: 'G1234-MOCK',
          variableId: 'V1234-MOCK'
        }),
        headers: {}
      }

      const response = await generateNotebook(event)

      expect(response.statusCode).toEqual(500)

      const { body } = response
      const parsedBody = JSON.parse(body)
      const { errors } = parsedBody
      const [errorMessage] = errors

      expect(errorMessage).toEqual('Test error message')
    })
  })

  describe('when earthdata environment is UAT', () => {
    test('should render notebook with UAT URLs', async () => {
      jest.spyOn(determineEarthdataEnvironment, 'determineEarthdataEnvironment').mockImplementation(() => 'uat')

      nock(/graphql/)
        .post('/api')
        .reply(200, {
          data: {
            granules: {
              items: [{
                conceptId: 'G1234-MOCK',
                title: 'Mock Granule',
                collection: {
                  conceptId: 'C1234-MOCK',
                  title: 'Mock Collection',
                  shortName: 'Mock Short Name',
                  variables: {
                    items: [{
                      name: 'Mock Variable'
                    }]
                  }
                }
              }]
            }
          }
        })

      const event = {
        body: JSON.stringify({
          granuleId: 'G1234-MOCK',
          variableId: 'V1234-MOCK'
        }),
        headers: {}
      }

      await generateNotebook(event)

      expect(mockS3Send).toHaveBeenCalled()
      const s3PutCall = mockS3Send.mock.calls[0][0]
      const notebookContent = JSON.parse(s3PutCall.input.Body)
      expect(notebookContent).toHaveProperty('cells')

      // Find the second markdown cell
      const markdownCells = notebookContent.cells.filter((cell) => cell.cell_type === 'markdown')

      expect(markdownCells.length).toBeGreaterThan(1)
      const secondMarkdownCell = markdownCells[0]

      // Check if the second markdown cell contains the correct UAT collection link
      const hasUatCollectionLink = secondMarkdownCell.source.some(
        (line) => line.includes('- __Collection__: [Mock Collection](https://search.uat.earthdata.nasa.gov/search/granules?p=C1234-MOCK)')
      )

      expect(hasUatCollectionLink).toBeTruthy()
    })
  })
})
