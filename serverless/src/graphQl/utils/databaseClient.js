import { getApplicationConfig } from '../../../../sharedUtils/config'
import { getDbConnection } from '../../util/database/getDbConnection'
import { deobfuscateId } from '../../util/obfuscation/deobfuscateId'

const { env } = getApplicationConfig()

/**
 * Class that generates a client and handles database operations
 * @class
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
   * Retrieves retrieval collections by their IDs
   * @param {number[]} retrievalIds The IDs of the retrieval collections to retrieve
   * @returns {Promise<Object>} A promise that resolves to the array of retrieval collection objects
   */
  async getRetrievalCollectionsByRetrievalId(retrievalIds) {
    try {
      const db = await this.getDbConnection()

      const result = await db('retrieval_collections')
        .select(
          'retrieval_collections.id',
          'retrieval_collections.retrieval_id',
          'retrieval_collections.access_method',
          'retrieval_collections.collection_id',
          'retrieval_collections.collection_metadata',
          'retrieval_collections.granule_count',
          'retrieval_collections.created_at',
          'retrieval_collections.updated_at',
          'retrieval_collections.granule_link_count'
        )
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
        .select(
          'retrieval_orders.id',
          'retrieval_orders.retrieval_collection_id',
          'retrieval_orders.type',
          'retrieval_orders.state',
          'retrieval_orders.order_information',
          'retrieval_orders.order_number'
        )
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
   * Retrieves a project by its obfuscated ID
   * @param {number} obfuscatedId The ID of the project to retrieve
   * @returns {Promise<Object>} A promise that resolves to the project object
   */
  async getProjectByObfuscatedId(obfuscatedId) {
    try {
      const db = await this.getDbConnection()

      return await db('projects')
        .select(
          'projects.id',
          'projects.name',
          'projects.path',
          'projects.user_id',
          'projects.created_at',
          'projects.updated_at'
        )
        .where({
          'projects.id': deobfuscateId(parseInt(obfuscatedId, 10))
        })
        .first()
    } catch {
      const errorMessage = 'Failed to retrieve project by ID'
      console.log(errorMessage)
      throw new Error(errorMessage)
    }
  }

  /**
   * Retrieves projects based on the provided filters
   * @param {Object} params The filters to apply
   * @returns {Promise<Array>} A promise that resolves to an array of project objects
   */
  async getProjects({
    limit,
    obfuscatedId,
    offset,
    sortKey,
    ursId
  }) {
    const sortKeyParams = {
      '-created_at': ['projects.created_at', 'desc'],
      '+created_at': ['projects.created_at', 'asc'],
      '-urs_id': ['users.urs_id', 'desc'],
      '+urs_id': ['users.urs_id', 'asc']
    }

    try {
      const db = await this.getDbConnection()

      let query = db('projects')
        .select(
          'projects.id',
          'projects.name',
          'projects.path',
          'projects.created_at',
          'projects.updated_at',
          'users.id as user_id',
          'users.urs_id as urs_id'
        )
        .select(db.raw('count(*) OVER() as total'))
        .join('users', { 'projects.user_id': 'users.id' })

      if (sortKey) {
        query = query.orderBy(...sortKeyParams[sortKey])
      } else {
        query = query.orderBy('id', 'desc')
      }

      if (ursId) {
        query = query.where({ 'users.urs_id': ursId })
      }

      if (obfuscatedId) {
        query = query.where('projects.id', '=', deobfuscateId(parseInt(obfuscatedId, 10)))
      }

      if (limit) {
        query = query.limit(limit)
      }

      if (offset) {
        query = query.offset(offset)
      }

      return await query
    } catch {
      const errorMessage = 'Failed to retrieve user projects'
      console.log(errorMessage)
      throw new Error(errorMessage)
    }
  }

  /**
   * Retrieves a retrieval by its obfuscated ID
   * @param {number} obfuscatedId The ID of the retrieval to retrieve
   * @returns {Promise<Object>} A promise that resolves to the retrieval object
   */
  async getRetrievalByObfuscatedId(obfuscatedId) {
    try {
      const db = await this.getDbConnection()

      return await db('retrievals')
        .select(
          'retrievals.id',
          'retrievals.user_id',
          'retrievals.jsondata',
          'retrievals.environment',
          'retrievals.created_at',
          'retrievals.updated_at'
        )
        .where({
          'retrievals.id': deobfuscateId(parseInt(obfuscatedId, 10))
        })
        .first()
    } catch {
      const errorMessage = 'Failed to retrieve retrieval by ID'
      console.log(errorMessage)
      throw new Error(errorMessage)
    }
  }

  /**
   * Retrieves retrievals based on the provided filters
   * @param {Object} params The filters to apply
   * @returns {Promise<Array>} A promise that resolves to an array of retrieval objects
   */
  async getRetrievals({
    limit,
    obfuscatedId,
    offset,
    retrievalCollectionId,
    sortKey,
    ursId
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
          'retrievals.id',
          'retrievals.jsondata',
          'retrievals.environment',
          'retrievals.created_at',
          'retrievals.updated_at',
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
          .where({ 'retrieval_collections.id': retrievalCollectionId })
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

      return await query
    } catch {
      const errorMessage = 'Failed to retrieve user retrievals'
      console.log(errorMessage)
      throw new Error(errorMessage)
    }
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
        .select(
          'users.id',
          'users.urs_id'
        )
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
        .select(
          'users.id',
          'users.urs_id'
        )
        .whereIn('users.id', userIds)
    } catch {
      const errorMessage = 'Failed to retrieve users by ID'
      console.log(errorMessage)
      throw new Error(errorMessage)
    }
  }
}
