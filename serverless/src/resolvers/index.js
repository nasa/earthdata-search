import { mergeResolvers } from '@graphql-tools/merge'

import exampleResolver from './example'

const resolvers = [
  exampleResolver
]

export default mergeResolvers(resolvers)
