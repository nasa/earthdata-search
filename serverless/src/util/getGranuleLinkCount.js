import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { getEarthdataConfig } from '../../../sharedUtils/config'

export const getGranuleLinkCount = async (
  collConceptId,
  environment,
  token
) => {
  console.log('🚀 ~ file: getGranuleLinkCount.js:5 ~ getGranuleLinkCount ~ collConceptId:', collConceptId)
  const earthdataEnvironment = environment
  const { graphQlHost } = getEarthdataConfig(earthdataEnvironment)

  const granulesGraphQlQuery = `
  query GranuleLinkCount (
    $params: GranulesInput
  ) {
    granules (
      params: $params
    ) {
      count
      items {
        links
      }
    }
  }`

  const variables = {
    params: {
      collectionConceptId: collConceptId
    }
  }

  const graphQlUrl = `${graphQlHost}/api`

  const response = await axios({
    url: graphQlUrl,
    method: 'post',
    data: {
      query: granulesGraphQlQuery,
      variables
    }
    // ,
    // headers: {
    //   Authorization: `Bearer ${token}`,
    //   'X-Request-Id': requestId
    // }
  })

  const { data } = response
  console.log('🚀 ~ file: getGranuleLinkCount.js:55 ~ data:', data)

  const { data: granulesData, errors } = data
  console.log('🚀 ~ file: getGranuleLinkCount.js:58 ~ granulesData:', granulesData)

  if (errors && errors.length > 0) {
    console.log(JSON.stringify(errors))
    throw new Error(JSON.stringify(errors))
  }

  const { granules } = granulesData
  const { items } = granules
  // todo this shouldn't be possible unless we don't have access to the collection because of acls
  if (items.length < 1) {
    return 0
  }
  // Get the number of granules in the first collection
  const firstGranule = items[0]
  console.log('🚀 ~ file: getGranuleLinkCount.js:41 ~ getGranuleLinkCount ~ granulesData:', JSON.stringify(firstGranule))
  const { links = [] } = firstGranule
  console.log('🚀 The number of links in the first granule', links.length)
  return links.length
}

export default getGranuleLinkCount
