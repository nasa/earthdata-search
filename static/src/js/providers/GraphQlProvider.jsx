import React, { useMemo } from 'react'
import { ApolloProvider } from '@apollo/client'

import PropTypes from 'prop-types'

import getApolloClient from './getApolloClient'

import useEdscStore from '../zustand/useEdscStore'
import { getEdlToken } from '../zustand/selectors/user'
import { getEarthdataEnvironment } from '../zustand/selectors/earthdataEnvironment'

/**
 * GraphQL Provider component that sets up ApolloClient
 * @param {Object} props Component properties
 * @param {React.ReactNode} props.children The child components to be rendered within the provider
 * @returns {React.ReactNode} The ApolloProvider component with the configured client
*/
const GraphQlProvider = ({ children }) => {
  const earthdataEnvironment = useEdscStore(getEarthdataEnvironment)
  const edlToken = useEdscStore(getEdlToken)

  const client = useMemo(
    () => {
      let earthdataEnvironmentToUse = earthdataEnvironment

      // If ee is in the URL, use that value for `earthdataEnvironment`
      if (window.location.search) {
        const urlParams = new URLSearchParams(window.location.search)
        earthdataEnvironmentToUse = urlParams.get('ee') || earthdataEnvironment
      }

      return getApolloClient({
        earthdataEnvironment: earthdataEnvironmentToUse,
        edlToken
      })
    },
    [
      earthdataEnvironment,
      edlToken,
      window.location.search
    ]
  )

  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  )
}

GraphQlProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export default GraphQlProvider
