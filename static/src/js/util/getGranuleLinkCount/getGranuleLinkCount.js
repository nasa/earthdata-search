import GraphQlRequest from '../request/graphQlRequest'
// import { getEarthdataEnvironment } from '../../selectors/earthdataEnvironment'

export const getGranuleLinkCount = (collConceptId = 'C1200377661-CMR_ONLY') => {
  const earthdataEnvironment = ''
  const authToken = ''
  const graphQlRequestObject = new GraphQlRequest(authToken, earthdataEnvironment)
  const graphQuery = `
  query GetGranuleLinkCount(
    $collectionConceptId: String!
  ) {
    granules(
      collectionConceptId: $collConceptId
    ) {
     links
    }
  }`
  const response = graphQlRequestObject.search(graphQuery, {
    collConceptId
  })
  console.log('🚀 ~ file: getGranuleLinkCount.js:21 ~ getGranuleLinkCount ~ response:', response)
}

export default getGranuleLinkCount
