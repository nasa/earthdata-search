import React, { useMemo } from 'react'
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  createHttpLink,
  InMemoryCache
} from '@apollo/client'

import { setContext } from '@apollo/client/link/context'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { getClientId } from '../../../../sharedUtils/getClientId'
import { getEnvironmentConfig } from '../../../../sharedUtils/config'

/**
 * GraphQL Provider component that sets up ApolloClient
 * @param {Object} props Component properties
 * @param {string} props.authToken The authentication token to be used in requests
 * @param {React.ReactNode} props.children The child components to be rendered within the provider
 * @returns {React.ReactNode} The ApolloProvider component with the configured client
*/
const GraphQlProvider = ({ authToken, children }) => {
  const cache = new InMemoryCache()

  const { apiHost } = getEnvironmentConfig()

  const httpLink = createHttpLink({
    uri: `${apiHost}/graphql`
  })

  const client = useMemo(() => {
    const authLink = setContext((_, { headers }) => ({
      headers: {
        ...headers,
        'Client-Id': getClientId().client,
        Authorization: `Bearer ${authToken}`
      }
    }))

    return new ApolloClient({
      cache,
      link: ApolloLink.from([authLink, httpLink])
    })
  }, [authToken])

  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  )
}

GraphQlProvider.propTypes = {
  authToken: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

/**
 * Connects the GraphQlProvider to the Redux store to access the authToken
 * @returns {React.ComponentType} The connected GraphQlProvider component
 */
const ConnectedGraphQlProvider = connect(
  (state) => ({
    authToken: state.authToken
  }),
  null
)(GraphQlProvider)

export default ConnectedGraphQlProvider
