import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

import { getClientId } from '../../../../sharedUtils/getClientId'
import { getEnvironmentConfig } from '../../../../sharedUtils/config'

let client = null
let previousAuthToken = null

const { apiHost } = getEnvironmentConfig()

/**
 * Returns an ApolloClient instance with the given auth token. Caches the client instance
 * and only creates a new one if the auth token changes.
 * This is useful for using the ApolloClient outside a React component, such as in
 * Redux actions.
 * @param {String} authToken User's auth token
 */
const getApolloClient = (authToken) => {
  // If the client has already been created with the same authToken, return it
  // The authToken will change when the cookie has been loaded, so we need to create a new client
  // when the token changes.
  if (client && previousAuthToken === authToken) return client

  // Save the authToken to check if it changes next time
  previousAuthToken = authToken

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

  // Set the endpoint for the GraphQL API
  const httpLink = createHttpLink({
    uri: `${apiHost}/graphql`
  })

  // Create the authLink with the provided authToken
  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      'Client-Id': getClientId().client,
      Authorization: `Bearer ${authToken}`
    }
  }))

  // Create a new ApolloClient instance
  client = new ApolloClient({
    cache,
    link: ApolloLink.from([authLink, httpLink])
  })

  return client
}

export default getApolloClient
