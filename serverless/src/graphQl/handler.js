import { ApolloServer } from '@apollo/server'
import { startServerAndCreateLambdaHandler, handlers } from '@as-integrations/aws-lambda'

const typeDefs = `#graphql
  type Query {
    hello: String
  }
`

const resolvers = {
  Query: {
    hello: () => 'world'
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true
})

// This final export is important!
export const graphqlHandler = async (event, context, callback) => {
  // Console.log('event.version:', event.version) // Should be "2.0"
  const handler = startServerAndCreateLambdaHandler(
    server,
    handlers.createAPIGatewayProxyEventRequestHandler()
  )

  return handler(event, context, callback)
}

export default graphqlHandler
