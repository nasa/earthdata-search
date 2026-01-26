import * as getClientId from '../../../../../../sharedUtils/getClientId'
import * as aggregatedOrderStatus from '../../../../../../sharedUtils/orderStatus'
import buildEddLink from '../buildEddLink'

vi.spyOn(getClientId, 'getClientId').mockImplementation(() => ({
  client: 'eed-edsc-dev-serverless-client'
}))

describe('buildEddLink', () => {
  describe('when the order is Harmony and is still running or has no files', () => {
    test('returns null', () => {
      // Build the request object
      const retrievalCollectionId = 1
      const edlToken = 'edlToken'
      const earthdataEnvironment = 'prod'
      const collectionMetadata = {
        conceptId: 'conceptId',
        shortName: 'shortName',
        versionId: 'versionId'
      }
      const retrievalOrders = [{
        type: 'harmony'
      }]

      const downloadUrls = []
      const linkType = 'data'

      // Mock the order status
      vi.spyOn(aggregatedOrderStatus, 'aggregatedOrderStatus').mockImplementation(() => 'creating')

      // Build the EDD link
      const response = buildEddLink({
        collectionMetadata,
        downloadUrls,
        earthdataEnvironment,
        edlToken,
        linkType,
        retrievalCollectionId,
        retrievalOrders
      })

      // Ensure the response is null
      expect(response).toBeNull()
    })
  })

  describe('when the order is Harmony and is complete and has files', () => {
    test('returns the EDD link', () => {
      // Build the request object
      const retrievalCollectionId = 1
      const edlToken = 'edlToken'
      const earthdataEnvironment = 'prod'
      const collectionMetadata = {
        conceptId: 'conceptId',
        shortName: 'shortName',
        versionId: 'versionId'
      }
      const retrievalOrders = [{
        type: 'harmony'
      }]
      const downloadUrls = ['http://example.com']
      const linkType = 'data'

      // Mock the order status
      vi.spyOn(aggregatedOrderStatus, 'aggregatedOrderStatus').mockImplementation(() => 'complete')

      // Build the EDD link
      const response = buildEddLink({
        collectionMetadata,
        downloadUrls,
        earthdataEnvironment,
        edlToken,
        linkType,
        retrievalCollectionId,
        retrievalOrders
      })

      // Ensure the response is the EDD link
      expect(response).toBe('earthdata-download://startDownload?getLinks=http%3A%2F%2Flocalhost%3A3000%2Fgranule_links%3Fid%3D1%26flattenLinks%3Dtrue%26linkTypes%3Ddata%26ee%3Dprod&downloadId=shortName_versionId&clientId=eed-edsc-dev-serverless-client&token=Bearer edlToken&authUrl=http%3A%2F%2Flocalhost%3A3000%2Flogin%3Fee%3Dprod%26eddRedirect%3Dearthdata-download%253A%252F%252FauthCallback&eulaRedirectUrl=http%3A%2F%2Flocalhost%3A8080%2Fauth_callback%3FeddRedirect%3Dearthdata-download%253A%252F%252FeulaCallback')
    })
  })

  describe('when the order is download', () => {
    test('returns the EDD link', () => {
      // Build the request object
      const retrievalCollectionId = 1
      const edlToken = 'edlToken'
      const earthdataEnvironment = 'prod'
      const collectionMetadata = {
        conceptId: 'conceptId',
        shortName: 'shortName',
        versionId: 'versionId'
      }
      const retrievalOrders = [{
        type: 'download'
      }]
      const downloadUrls = ['http://example.com']
      const linkType = 'data'

      // Mock the order status
      vi.spyOn(aggregatedOrderStatus, 'aggregatedOrderStatus').mockImplementation(() => 'complete')

      // Build the EDD link
      const response = buildEddLink({
        collectionMetadata,
        downloadUrls,
        earthdataEnvironment,
        edlToken,
        linkType,
        retrievalCollectionId,
        retrievalOrders
      })

      // Ensure the response is the EDD link
      expect(response).toBe('earthdata-download://startDownload?getLinks=http%3A%2F%2Flocalhost%3A3000%2Fgranule_links%3Fid%3D1%26flattenLinks%3Dtrue%26linkTypes%3Ddata%26ee%3Dprod&downloadId=shortName_versionId&clientId=eed-edsc-dev-serverless-client&token=Bearer edlToken&authUrl=http%3A%2F%2Flocalhost%3A3000%2Flogin%3Fee%3Dprod%26eddRedirect%3Dearthdata-download%253A%252F%252FauthCallback&eulaRedirectUrl=http%3A%2F%2Flocalhost%3A8080%2Fauth_callback%3FeddRedirect%3Dearthdata-download%253A%252F%252FeulaCallback')
    })
  })
})
