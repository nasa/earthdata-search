import { ApolloServer } from '@apollo/server'

import getLoaders from '../../../utils/getLoaders'
import resolvers from '../../index'
import typeDefs from '../../../types'

/**
 * Sets up the Apollo Server with the provided database client
 * @param {Object} params The parameters for setting up the server
 * @param {Object} params.databaseClient The database client to use
 * @returns {Object} The context value and Apollo Server instance
 */
const setupServer = ({
  databaseClient
}) => {
  const contextValue = {
    databaseClient,
    loaders: getLoaders({ databaseClient }),
    bearerToken: 'token',
    user: {
      ursId: 'testuser'
    }
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers
  })

  return {
    contextValue,
    server
  }
}

export default setupServer
