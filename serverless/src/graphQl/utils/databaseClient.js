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
   * Generic method to add pagination to any query and return paginated results
   * @param {Object} params - Parameters object
   * @param {Object} params.query - Knex query object
   * @param {number} [params.limit] - Items per page (optional)
   * @param {number} [params.offset] - Current offset (optional)
   * @returns {Promise<Object>} Paginated result with data and pagination info
   */
  async executePaginatedQuery({ query, limit, offset }) {
    const queryToPaginate = query

    try {
      if (limit) {
        queryToPaginate.limit(limit)
      }

      if (offset) {
        queryToPaginate.offset(offset)
      }

      return queryToPaginate
    } catch {
      const errorMessage = 'Failed to execute paginated query'
      console.log(errorMessage)
      throw new Error(errorMessage)
    }
  }

  /**
   * Creates a new project
   * @param {Object} params - Parameters object
   * @param {string} params.name - The name of the project
   * @param {string} params.path - The path of the project
   * @returns {Promise<Object>} A promise that resolves to the created project object
   */
  async createProject({
    name,
    path,
    userId
  }) {
    try {
      const db = await this.getDbConnection()

      const [project] = await db('projects')
        .insert({
          name,
          path,
          user_id: userId
        })
        .returning('*')

      return project
    } catch {
      const errorMessage = 'Failed to create project'
      console.log(errorMessage)
      throw new Error(errorMessage)
    }
  }

  /**
   * Deletes a project
   * @param {Object} params - Parameters object
   * @param {string} params.obfuscatedId - The obfuscated ID of the project to delete
   * @param {string} params.userId - The ID of the user who initiated the deletion
   * @returns {Promise<number>} A promise that resolves to the number of rows deleted
   */
  async deleteProject({ obfuscatedId, userId }) {
    try {
      const db = await this.getDbConnection()

      const result = await db('projects')
        .where({
          user_id: userId,
          id: deobfuscateId(obfuscatedId)
        })
        .del()

      return result
    } catch {
      const errorMessage = 'Failed to delete project'
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
   * @param {number} [params.limit=20] - The maximum number of projects to retrieve
   * @param {number} [params.offset=0] - The number of projects to skip
   * @param {string} [params.sortKey] - The key to sort the projects by
   * @param {string} [params.ursId] - The user's URS ID (EDL username) to filter projects by
   * @param {string} [params.userId] - The user's ID to filter projects by
   * @param {string} [params.obfuscatedId] - The obfuscated ID to filter projects by
   * @returns {Promise<Array>} A promise that resolves to an array of project results
   */
  async getProjects({
    limit = 20,
    offset = 0,
    sortKey,
    ursId,
    userId,
    obfuscatedId
  }) {
    const sortKeyParams = {
      '-created_at': ['projects.created_at', 'desc'],
      created_at: ['projects.created_at', 'asc'],
      '-urs_id': ['users.urs_id', 'desc'],
      urs_id: ['users.urs_id', 'asc']
    }

    try {
      const db = await this.getDbConnection()

      let projectQuery = db('projects')
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
        projectQuery = projectQuery.orderBy(...sortKeyParams[sortKey])
      } else {
        projectQuery = projectQuery.orderBy('projects.id', 'desc')
      }

      if (ursId) {
        projectQuery = projectQuery.where({ 'users.urs_id': ursId })
      }

      if (userId) {
        projectQuery = projectQuery.where({ 'users.id': userId })
      }

      if (obfuscatedId) {
        projectQuery = projectQuery.where('projects.id', '=', deobfuscateId(parseInt(obfuscatedId, 10)))
      }

      return await this.executePaginatedQuery({
        query: projectQuery,
        limit,
        offset
      })
    } catch {
      const errorMessage = 'Failed to retrieve user projects'
      console.log(errorMessage)
      throw new Error(errorMessage)
    }
  }

  /**
   * Retrieves retrievals based on the provided filters
   * @param {Object} params The filters to apply
   * @returns {Promise<Array>} A promise that resolves to an array of retrieval results
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
      created_at: ['retrievals.created_at', 'asc'],
      '-urs_id': ['users.urs_id', 'desc'],
      urs_id: ['users.urs_id', 'asc']
    }
    try {
      const db = await this.getDbConnection()

      let retrievalQuery = db('retrievals')
        .select(
          'retrievals.id',
          'retrievals.user_id',
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
        retrievalQuery = retrievalQuery.orderBy(...sortKeyParams[sortKey])
      } else {
        retrievalQuery = retrievalQuery.orderBy('id', 'desc')
      }

      if (ursId) {
        retrievalQuery = retrievalQuery.where({ 'users.urs_id': ursId })
      }

      if (retrievalCollectionId) {
        retrievalQuery = retrievalQuery
          .leftJoin('retrieval_collections', { 'retrievals.id': 'retrieval_collections.retrieval_id' })
          .where({ 'retrieval_collections.id': retrievalCollectionId })
      }

      if (obfuscatedId) {
        retrievalQuery = retrievalQuery.where('retrievals.id', '=', deobfuscateId(parseInt(obfuscatedId, 10)))
      }

      return await this.executePaginatedQuery({
        query: retrievalQuery,
        limit,
        offset
      })
    } catch {
      const errorMessage = 'Failed to retrieve user retrievals'
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
          'users.site_preferences',
          'users.urs_id',
          'users.urs_profile'
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
   * Retrieves the user by the provided `where` clause
   * @param {Object} where `where` clause to filter the user
   * @returns {Promise<Object>} A promise that resolves to the user object
   */
  async getUserWhere(where) {
    try {
      const db = await this.getDbConnection()

      const result = await db('users')
        .select(
          'users.id',
          'users.site_preferences',
          'users.urs_id',
          'users.urs_profile'
        )
        .where(where)
        .first()

      return result
    } catch {
      const errorMessage = 'Failed to retrieve user using where object'
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

  /**
   * Updates a project
   * @param {Object} params - Parameters object
   * @param {string} params.obfuscatedId - The obfuscated ID of the project to update
   * @param {string} params.name - The new name for the project
   * @param {string} params.path - The new path for the project
   * @param {number} params.userId - The ID of the user who owns the project
   * @returns {Promise<Object>} A promise that resolves to the updated project object
   */
  async updateProject({
    obfuscatedId,
    name,
    path,
    userId
  }) {
    try {
      const db = await this.getDbConnection()

      const [project] = await db('projects')
        .where({
          id: deobfuscateId(obfuscatedId),
          user_id: userId
        })
        .update({
          name,
          path,
          updated_at: new Date()
        })
        .returning('*')

      return project
    } catch {
      const errorMessage = 'Failed to update project'
      console.log(errorMessage)
      throw new Error(errorMessage)
    }
  }

  /**
   * Updates the site preferences for a user
   * @param {Object} params - Parameters object
   * @param {string} params.userId - The user ID to update
   * @param {Object} params.sitePreferences - The site preferences to update
   * @returns {Promise<Array>} A promise that resolves to an array containing the updated user object
   */
  async updateSitePreferences({ userId, sitePreferences }) {
    try {
      const db = await this.getDbConnection()

      const [user] = await db('users')
        .where({ id: userId })
        .update({
          site_preferences: sitePreferences,
          updated_at: new Date()
        })
        .returning([
          'id',
          'site_preferences',
          'urs_id',
          'urs_profile'
        ])

      return user
    } catch {
      const errorMessage = 'Failed to update site preferences'
      console.log(errorMessage)
      throw new Error(errorMessage)
    }
  }

  /**
   * Retrieves colormaps by their product names
   * @param {string[]} products - The product names of the colormaps to retrieve
   * @returns {Promise<Array>} A promise that resolves to an array of colormap objects
   */
  async getColorMapsByProducts(products) {
    try {
      const db = await this.getDbConnection()

      const colormaps = await db('colormaps')
        .select(
          'id',
          'product',
          'url',
          'jsondata',
          'created_at',
          'updated_at'
        )
        .whereIn('product', products)

      // Return list of colormaps for all of the request products
      return colormaps.map((colormap) => ({
        id: colormap.id,
        product: colormap.product,
        url: colormap.url,
        jsonData: colormap.jsondata,
        createdAt: colormap.created_at,
        updatedAt: colormap.updated_at
      }))
    } catch {
      const errorMessage = 'Failed to retrieve colormaps by products'
      console.log(errorMessage)
      throw new Error(errorMessage)
    }
  }
}
