import { mergeResolvers } from '@graphql-tools/merge'

import adminResolver from './admin'
import colormapResolver from './colormap'
import projectResolver from './project'
import userResolver from './user'

const resolvers = [
  adminResolver,
  projectResolver,
  userResolver,
  colormapResolver,
  projectResolver
]

export default mergeResolvers(resolvers)
