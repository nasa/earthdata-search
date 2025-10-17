import { mergeResolvers } from '@graphql-tools/merge'

import adminResolver from './admin'
import projectResolver from './project'

const resolvers = [
  adminResolver,
  projectResolver
]

export default mergeResolvers(resolvers)
