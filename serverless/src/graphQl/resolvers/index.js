import { mergeResolvers } from '@graphql-tools/merge'

import adminResolver from './admin'
import colormapResolver from './colormap'
import projectResolver from './project'
import userResolver from './user'

const resolvers = [
  adminResolver,
  colormapResolver,
  projectResolver,
  userResolver
]

export default mergeResolvers(resolvers)
