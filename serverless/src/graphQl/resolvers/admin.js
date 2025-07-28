import formatAdminPreferencesMetrics from '../utils/formatAdminPreferencesMetrics'

/**
 * GraphQL resolver for admin preferences metrics
 */
export default {
  Query: {
    adminPreferencesMetrics: async (source, args, context) => {
      const { databaseClient } = context

      return formatAdminPreferencesMetrics(await databaseClient.getSitePreferences())
    }
  }
}
