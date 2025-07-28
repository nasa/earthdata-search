import { mergeResolvers } from '@graphql-tools/merge'

import adminResolver from './admin'

const resolvers = [
  adminResolver
]

export default mergeResolvers(resolvers)
