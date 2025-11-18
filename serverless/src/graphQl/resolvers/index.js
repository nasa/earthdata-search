import { mergeResolvers } from '@graphql-tools/merge'

import adminResolver from './admin'
import colormapResolver from './colormap'
import projectResolver from './project'
import retrievalResolver from './retrieval'
import userResolver from './user'

const resolvers = [
  adminResolver,
  colormapResolver,
  projectResolver,
  retrievalResolver,
  userResolver
]

export default mergeResolvers(resolvers)
