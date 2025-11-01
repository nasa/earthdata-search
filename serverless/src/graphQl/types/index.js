import { mergeTypeDefs } from '@graphql-tools/merge'
import { DateTimeTypeDefinition, JSONDefinition } from 'graphql-scalars'

import admin from './admin.graphql'
import colormap from './colormap.graphql'
import pageInfo from './pageInfo.graphql'
import project from './project.graphql'
import user from './user.graphql'

const scalarTypeDefs = [
  DateTimeTypeDefinition,
  JSONDefinition
]

export default mergeTypeDefs(
  [
    ...scalarTypeDefs,
    admin,
    colormap,
    pageInfo,
    project,
    user
  ]
)
