import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

import { getClientId } from '../../../../sharedUtils/getClientId'
import { getEarthdataConfig, getEnvironmentConfig } from '../../../../sharedUtils/config'

import { apolloClientNames } from '../constants/apolloClientNames'

let client = null
let previousEdlToken = null

const { apiHost } = getEnvironmentConfig()

/**
 * Returns an ApolloClient instance with the given auth token. Caches the client instance
 * and only creates a new one if the auth token changes.
 * This is useful for using the ApolloClient outside a React component, such as in
 * Zustand functions.
 * @param {Object} params
 * @param {String} params.earthdataEnvironment The Earthdata environment (e.g., "prod", "uat", "sit")
 * @param {String} params.edlToken User's EDL token
 */
const getApolloClient = ({
  earthdataEnvironment,
  edlToken
}) => {
  const { cmrHost, graphQlHost } = getEarthdataConfig(earthdataEnvironment)

  // If the client has already been created with the same edlToken, return it
  // The edlToken will change when the cookie has been loaded, so we need to create a new client
  // when the token changes.
  if (client && previousEdlToken === edlToken) return client

  // Save the edlToken to check if it changes next time
  previousEdlToken = edlToken

  // Create a new InMemoryCache instance
  const cache = new InMemoryCache({
    // These type policies ensure that Apollo Client can correctly identify and cache
    // various types of objects based on their unique identifiers. This is necessary when the
    // default 'id' field is not present or when a different field should be used as the identifier.
    typePolicies: {
      Project: {
        keyFields: ['obfuscatedId']
      }
    }
  })

  // Create the authLink with the provided edlToken
  const edlTokenAuthLink = setContext((_, { headers }) => {
    const authHeader = {}
    if (edlToken) {
      authHeader.Authorization = `Bearer ${edlToken}`
    }

    return {
      headers: {
        ...headers,
        ...authHeader,
        'Client-Id': getClientId().client,
        'Earthdata-ENV': earthdataEnvironment
      }
    }
  })

  // Create the authLink with the provided edlToken
  const cmrTokenAuthLink = setContext((_, { headers }) => {
    const authHeader = {}
    if (edlToken) {
      authHeader.Authorization = `Bearer ${edlToken}`
    }

    return {
      headers: {
        ...headers,
        ...authHeader,
        'Client-Id': getClientId().client
      }
    }
  })

  // Create the HTTP link for the EDSC GraphQL API
  const edscLink = createHttpLink({
    uri: `${apiHost}/graphql`
  })

  // Create the HTTP link for the CMR GraphQL API
  const cmrGraphqlLink = createHttpLink({
    uri: `${graphQlHost}/api`
  })

  // Create the HTTP link for the CMR Ordering API
  const cmrOrderingLink = createHttpLink({
    uri: `${cmrHost}/ordering/api`
  })

  const cmrLinks = ApolloLink.split(
    // If the clientName is 'cmrOrdering', use the cmrOrderingLink
    (operation) => operation.getContext().clientName === apolloClientNames.CMR_ORDERING,
    cmrTokenAuthLink.concat(cmrOrderingLink),
    // Default to the cmrGraphqlLink
    cmrTokenAuthLink.concat(cmrGraphqlLink)
  )

  // Create a new ApolloClient instance
  client = new ApolloClient({
    cache,
    link: ApolloLink.split(
      // If the clientName is 'cmrOrdering' or 'cmrGraphql', use the cmrLinks to determine the endpoint
      (operation) => operation.getContext().clientName === apolloClientNames.CMR_ORDERING
        || operation.getContext().clientName === apolloClientNames.CMR_GRAPHQL,
      cmrLinks,
      // Default to the edscLink
      edlTokenAuthLink.concat(edscLink)
    )
  })

  return client
}

export default getApolloClient
