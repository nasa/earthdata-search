import { mergeResolvers } from '@graphql-tools/merge'

import adminResolver from './admin'
import projectResolver from './project'
import userResolver from './user'

const resolvers = [
  adminResolver,
  projectResolver,
  userResolver
]

export default mergeResolvers(resolvers)
