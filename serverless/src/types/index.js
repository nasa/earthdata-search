import { mergeTypeDefs } from '@graphql-tools/merge'

import example from './example.graphql'

export default mergeTypeDefs(
  [
    example
  ]
  // {
  //   all: true
  // }
)
