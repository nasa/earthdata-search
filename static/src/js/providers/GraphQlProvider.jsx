import React, { useMemo } from 'react'
import { ApolloProvider } from '@apollo/client'

import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import getApolloClient from './getApolloClient'

/**
 * GraphQL Provider component that sets up ApolloClient
 * @param {Object} props Component properties
 * @param {string} props.authToken The authentication token to be used in requests
 * @param {React.ReactNode} props.children The child components to be rendered within the provider
 * @returns {React.ReactNode} The ApolloProvider component with the configured client
*/
export const GraphQlProvider = ({ authToken, children }) => {
  const client = useMemo(
    () => getApolloClient(authToken),
    [authToken]
  )

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
