import Ajv from 'ajv'
import camelcaseKeys from 'camelcase-keys'

import schema from '../../../../schemas/sitePreferencesSchema.json'

export default {
  Query: {
    user: async (parent, args, context) => {
      const { user } = context

      return camelcaseKeys(
        user,
        { deep: true }
      )
    }
  },
  Mutation: {
    updatePreferences: async (parent, args, context) => {
      const { databaseClient, user } = context

      const { preferences } = args

      // Validate preferences against schema
      const ajv = new Ajv()
      const validate = ajv.compile(schema)
      const valid = validate(preferences)

      if (!valid) {
        throw new Error(`Invalid preferences: ${JSON.stringify(validate.errors)}`)
      }

      const updatedUser = await databaseClient.updateSitePreferences({
        userId: user.id,
        sitePreferences: preferences
      })

      return camelcaseKeys(
        updatedUser,
        { deep: true }
      )
    }
  }
}
