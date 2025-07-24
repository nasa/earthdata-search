import formatAdminPreferencesMetrics from '../utils/formatAdminPreferencesMetrics'

/**
 * GraphQL resolver for admin preferences metrics
 */
export default {
  Query: {
    adminPreferencesMetrics: async (source, args, context) => {
      const { databaseClient, requestId } = context

      try {
        // TODO A lot of the logic happening in `formatAdminPreferencesMetrics` could be moved to the database layer
        // Fetch all site preferences and format the results
        return formatAdminPreferencesMetrics(await databaseClient.getSitePreferences())
      } catch (error) {
        const errorWithRequestId = `${requestId} - adminPreferencesMetrics Query - ${error}`
        console.log(errorWithRequestId)

        throw new Error(errorWithRequestId)
      }
    }
  }
}
