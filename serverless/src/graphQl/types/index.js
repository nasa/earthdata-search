import { mergeTypeDefs } from '@graphql-tools/merge'

import admin from './admin.graphql'

export default mergeTypeDefs(
  [
    admin
  ]
)
