import { ApolloServer } from '@apollo/server'

import getLoaders from '../../../utils/getLoaders'
import resolvers from '../../index'
import typeDefs from '../../../types'

/**
 * Sets up the Apollo Server with the provided database client
 * @param {Object} params The parameters for setting up the server
 * @param {Object} params.databaseClient The database client to use
 * @param {Object} params.sqs The SQS client to use
 * @returns {Object} The context value and Apollo Server instance
 */
const setupServer = ({
  databaseClient,
  sqs
}) => {
  const contextValue = {
    databaseClient,
    earthdataEnvironment: 'prod',
    edlToken: 'token',
    loaders: getLoaders({ databaseClient }),
    sqs,
    user: {
      id: 42,
      urs_id: 'testuser'
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
