import { getApplicationConfig } from '../../../../sharedUtils/config'
import { getDbConnection } from '../../util/database/getDbConnection'
import { deobfuscateId } from '../../util/obfuscation/deobfuscateId'

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
   * Retrieves users by their IDs
   * @param {number[]} userIds The IDs of the users to retrieve
   * @returns {Promise<Object>} A promise that resolves to the array of user objects
   */
  async getUsersById(userIds) {
    try {
      const db = await this.getDbConnection()

      return await db('users')
        .select('users.*')
        .whereIn('users.id', userIds)
    } catch {
      const errorMessage = 'Failed to retrieve users by ID'
      console.log(errorMessage)
      throw new Error(errorMessage)
    }
  }

  /**
   * Retrieves retrieval collections by their IDs
   * @param {number[]} retrievalIds The IDs of the retrieval collections to retrieve
   * @returns {Promise<Object>} A promise that resolves to the array of retrieval collection objects
   */
  async getRetrievalCollectionsByRetrievalId(retrievalIds) {
    try {
      const db = await this.getDbConnection()

      const result = await db('retrieval_collections')
        .select('retrieval_collections.*')
        .whereIn('retrieval_collections.retrieval_id', retrievalIds)

      return result
    } catch {
      const errorMessage = 'Failed to retrieve retrieval collections by ID'
      console.log(errorMessage)
      throw new Error(errorMessage)
    }
  }

  /**
   * Retrieves retrieval orders by their IDs
   * @param {number[]} retrievalCollectionIds The IDs of the retrieval orders to retrieve
   * @returns {Promise<Object>} A promise that resolves to the array of retrieval collection objects
   */
  async getRetrievalOrdersByRetrievalCollectionId(retrievalCollectionIds) {
    try {
      const db = await this.getDbConnection()

      const result = await db('retrieval_orders')
        .select('retrieval_orders.*')
        .whereIn('retrieval_orders.retrieval_collection_id', retrievalCollectionIds)

      return result
    } catch {
      const errorMessage = 'Failed to retrieve retrieval orders by ID'
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

  /**
   * Retrieves a retrieval by its ID
   * @param {number} id The ID of the retrieval to retrieve
   * @returns {Promise<Object>} A promise that resolves to the retrieval object
   */
  async getRetrievalById(id) {
    try {
      const db = await this.getDbConnection()

      return await db('retrievals')
        .select(
          'retrievals.*'
        )
        .where({
          'retrievals.id': deobfuscateId(parseInt(id, 10))
        })
        .first()
    } catch (e) {
      const errorMessage = 'Failed to retrieve retrieval by ID'
      console.log(e)
      throw new Error(errorMessage)
    }
  }

  /**
   * Retrieves retrievals based on the provided filters
   * @param {Object} params The filters to apply
   * @returns {Promise<Array>} A promise that resolves to an array of retrieval objects
   */
  async getRetrievals({
    ursId,
    retrievalCollectionId,
    obfuscatedId,
    sortKey,
    limit,
    offset
  }) {
    const sortKeyParams = {
      '-created_at': ['retrievals.created_at', 'desc'],
      '+created_at': ['retrievals.created_at', 'asc'],
      '-urs_id': ['users.urs_id', 'desc'],
      '+urs_id': ['users.urs_id', 'asc']
    }

    try {
      const db = await this.getDbConnection()

      let query = db('retrievals')
        .select(
          'retrievals.*',
          'users.id as user_id',
          'users.urs_id as urs_id'

        )
        .select(db.raw('count(*) OVER() as total'))
        .join('users', { 'retrievals.user_id': 'users.id' })

      if (sortKey) {
        query = query.orderBy(...sortKeyParams[sortKey])
      } else {
        query = query.orderBy('id', 'desc')
      }

      if (ursId) {
        query = query.where({ 'users.urs_id': ursId })
      }

      if (retrievalCollectionId) {
        query = query
          .leftJoin('retrieval_collections', { 'retrievals.id': 'retrieval_collections.retrieval_id' })
          .where({ 'retrieval_collections.id': parseInt(retrievalCollectionId, 10) })
      }

      if (obfuscatedId) {
        query = query.where('retrievals.id', '=', deobfuscateId(parseInt(obfuscatedId, 10)))
      }

      if (limit) {
        query = query.limit(limit)
      }

      if (offset) {
        query = query.offset(offset)
      }

      return query
    } catch {
      const errorMessage = 'Failed to retrieve user retrievals'
      console.log(errorMessage)
      throw new Error(errorMessage)
    }
  }
}
