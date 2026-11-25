import { mergeResolvers } from '@graphql-tools/merge'

import adminResolver from './admin'
import colormapResolver from './colormap'
import projectResolver from './project'
import nlpFeedbackResolver from './nlpFeedback'
import nlpSearchStatusResolver from './nlpSearchStatus'
import regionResolver from './region'
import retrievalResolver from './retrieval'
import userResolver from './user'

const resolvers = [
  adminResolver,
  colormapResolver,
  projectResolver,
  regionResolver,
  nlpFeedbackResolver,
  nlpSearchStatusResolver,
  retrievalResolver,
  userResolver
]

export default mergeResolvers(resolvers)
