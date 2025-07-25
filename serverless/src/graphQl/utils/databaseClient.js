import { getApplicationConfig } from '../../../../sharedUtils/config'
import { getDbConnection } from '../../util/database/getDbConnection'

const { env } = getApplicationConfig()

/**
 * Class that generates a client and handles database operations
 */
export default class DatabaseClient {
  constructor() {
    this.dbConnection = null
  }

  /**
   * Establishes a connection to the database
   * @returns {Promise<knex>} A promise that resolves to the database connection
   */
  async getDbConnection() {
    if (!this.dbConnection) {
      try {
        this.dbConnection = await getDbConnection()
      } catch {
        const errorMessage = 'Failed to connect to the database'
        console.log(errorMessage)
        throw new Error(errorMessage)
      }
    }

    return this.dbConnection
  }

  /**
   * Retrieves a user by their ID
   * @param {number} userId The ID of the user to retrieve
   * @returns {Promise<Object>} A promise that resolves to the user object
   */
  async getUserById(userId) {
    try {
      const db = await this.getDbConnection()

      return await db('users')
        .select('users.*')
        .where({ 'users.id': userId })
        .first()
    } catch {
      const errorMessage = 'Failed to retrieve user by ID'
      console.log(errorMessage)
      throw new Error(errorMessage)
    }
  }

  /**
   * Retrieves preferences for all users
   * @returns {Promise<Array>} A promise that resolves to an array of user preferences
   */
  async getSitePreferences() {
    try {
      const db = await this.getDbConnection()

      return await db('users')
        .select('users.site_preferences')
        .where({ 'users.environment': env })
    } catch {
      const errorMessage = 'Failed to retrieve site preferences'
      console.log(errorMessage)
      throw new Error(errorMessage)
    }
  }
}
