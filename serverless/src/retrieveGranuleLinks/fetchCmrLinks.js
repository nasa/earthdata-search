import axios from 'axios'
import camelcaseKeys from 'camelcase-keys'

import { prepareGranuleAccessParams } from '../../../sharedUtils/prepareGranuleAccessParams'
import { getApplicationConfig, getEarthdataConfig } from '../../../sharedUtils/config'
import { getDownloadUrls } from '../../../sharedUtils/getDownloadUrls'
import { getS3Urls } from '../../../sharedUtils/getS3Urls'
import { getBrowseUrls } from '../../../sharedUtils/getBrowseUrls'

const granulesGraphQlQuery = `
  query GetGranuleLinks( $params: GranulesInput ) {
    granules( params: $params) {
      cursor
      items {
        links
      }
    }
  }`

export const fetchCmrLinks = async ({
  collectionId,
  cursor,
  earthdataEnvironment,
  granuleParams,
  linkTypes,
  requestId,
  token
}) => {
  const { granuleLinksPageSize } = getApplicationConfig()
  const { graphQlHost } = getEarthdataConfig(earthdataEnvironment)

  const graphQlUrl = `${graphQlHost}/api`

  const preparedGranuleParams = camelcaseKeys(prepareGranuleAccessParams(granuleParams))

  const variables = {
    ...preparedGranuleParams,
    limit: parseInt(granuleLinksPageSize, 10),
    linkTypes: linkTypes.split(','),
    collectionConceptId: collectionId,
    cursor
  }

  const response = await axios({
    url: graphQlUrl,
    method: 'post',
    data: {
      query: granulesGraphQlQuery,
      variables
    },
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Request-Id': requestId
    }
  })

  const { data } = response
  const { data: granulesData, errors } = data

  if (errors && errors.length > 0) {
    throw new Error(JSON.stringify(errors))
  }

  const { granules } = granulesData
  const { cursor: responseCursor, items } = granules

  // Fetch the download links from the granule metadata
  const granuleBrowseLinks = getBrowseUrls([...items])
  const granuleDownloadLinks = getDownloadUrls([...items])
  const granuleS3Links = getS3Urls([...items])

  return {
    cursor: responseCursor,
    links: {
      browse: granuleBrowseLinks,
      download: granuleDownloadLinks,
      s3: granuleS3Links
    }
  }
}
