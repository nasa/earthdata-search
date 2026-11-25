import { ApolloServer } from '@apollo/server'
import {
  ApolloServerPluginLandingPageLocalDefault
} from '@apollo/server/plugin/landingPage/default'
import { handlers, startServerAndCreateLambdaHandler } from '@as-integrations/aws-lambda'
import { makeExecutableSchema } from '@graphql-tools/schema'

import buildPermissions from './permissions'
import resolvers from './resolvers'
import typeDefs from './types'
import getContext from './utils/getContext'

const apolloPlugins = [
  ApolloServerPluginLandingPageLocalDefault({
    embed: false,
    footer: false
  })
]

const schema = buildPermissions(
  makeExecutableSchema({
    typeDefs,
    resolvers
  })
)

const server = new ApolloServer({
  schema,
  plugins: apolloPlugins
})

export default startServerAndCreateLambdaHandler(
  server,
  handlers.createAPIGatewayProxyEventRequestHandler(),
  {
    context: getContext,
    middleware: [
      () => async (result) => {
        const { headers } = result
        // eslint-disable-next-line no-param-reassign
        result.headers = {
          ...headers,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': [
            'Accept',
            'Authorization',
            'Client-Id',
            'Content-Type',
            'X-Request-Id'
          ].join(', ')
        }
      }
    ]
  }
)
