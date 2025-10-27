import camelcaseKeys from 'camelcase-keys'
import buildPaginatedResult from '../utils/buildPaginatedResult'
import { obfuscateId } from '../../util/obfuscation/obfuscateId'

export default {
  Query: {
    project: async (parent, args, context) => {
      const { databaseClient, user = {} } = context
      const { id: currentUserId } = user
      const { obfuscatedId } = args
      console.log('🚀 ~ file: project.js:11 ~ obfuscatedId:', obfuscatedId)

      let project = await databaseClient.getProjectByObfuscatedId(obfuscatedId)

      const { user_id: projectUserId } = project || {}

      // If the project's user does not match the current user, create a new project
      // for the current user with the same name and path
      if (project && projectUserId !== currentUserId) {
        const { name, path } = project

        project = await databaseClient.createProject({
          name,
          path,
          userId: currentUserId
        })
      }

      return camelcaseKeys(
        project,
        { deep: true }
      )
    },

    projects: async (parent, args, context) => {
      const { databaseClient, user } = context
      const { id: userId } = user
      const { limit = 20, offset = 0 } = args

      const data = await databaseClient.getProjects({
        ...args,
        userId,
        limit,
        offset
      })

      const result = buildPaginatedResult({
        data,
        limit,
        offset
      })

      return {
        projects: camelcaseKeys(result.data, { deep: true }),
        pageInfo: result.pageInfo,
        count: result.count
      }
    }
  },
  Mutation: {
    createProject: async (parent, args, context) => {
      const { databaseClient, user } = context
      const { id: userId } = user
      const { name, path } = args

      const project = await databaseClient.createProject({
        name,
        path,
        userId
      })

      return camelcaseKeys(
        project,
        { deep: true }
      )
    },

    deleteProject: async (parent, args, context) => {
      const { databaseClient, user } = context
      const { id: userId } = user
      const { obfuscatedId } = args

      const numRowsDeleted = await databaseClient.deleteProject({
        obfuscatedId,
        userId
      })

      return numRowsDeleted === 1
    },

    updateProject: async (parent, args, context) => {
      const { databaseClient, user } = context
      const { id: userId } = user

      const { obfuscatedId, name, path } = args

      const project = await databaseClient.updateProject({
        obfuscatedId,
        name,
        path,
        userId
      })

      return camelcaseKeys(
        project,
        { deep: true }
      )
    }
  },
  Project: {
    obfuscatedId: async (parent) => {
      const { id } = parent
      console.log('🚀 ~ file: project.js:113 ~ id:', id)

      return obfuscateId(id)
    },

    user: async (parent, args, context) => {
      const { loaders } = context

      // Use the users dataloader to fetch the user for the project using the userId
      // from the parent Project
      const loaderData = await loaders.users.load(parent.userId)

      return camelcaseKeys(loaderData, { deep: true })
    }
  }
}
