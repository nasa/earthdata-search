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
    this.transaction = null
  }

  /**
   * Establishes a connection to the database
   * @returns {Promise<knex>} A promise that resolves to the database connection
   */
  async getDbConnection() {
    // If a transaction is active, return it
    if (this.transaction) return this.transaction

    if (!this.dbConnection) {
      try {
        this.dbConnection = await getDbConnection()
      } catch (error) {
        const errorMessage = 'Failed to connect to the database'
        console.log(errorMessage, error)
        throw new Error(errorMessage)
      }
    }

    return this.dbConnection
  }

  /**
   * Starts a new database transaction
   */
  async startTransaction() {
    const db = await this.getDbConnection()

    this.transaction = await db.transaction()
  }

  /**
   * Commits the current database transaction
   */
  async commitTransaction() {
    if (this.transaction) {
      await this.transaction.commit()
      this.transaction = null
    }
  }

  /**
   * Rolls back the current database transaction
   */
  async rollbackTransaction() {
    if (this.transaction) {
      await this.transaction.rollback()
      this.transaction = null
    }
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
    } catch (error) {
      const errorMessage = 'Failed to execute paginated query'
      console.log(errorMessage, error)
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
    } catch (error) {
      const errorMessage = 'Failed to create project'
      console.log(errorMessage, error)
      throw new Error(errorMessage)
    }
  }

  /**
   * Creates a new retrieval
   * @param {Object} params - Parameters object
   * @param {string} params.environment - The environment for the retrieval
   * @param {Object} params.jsondata - The JSON data for the retrieval
   * @param {string} params.token - The token associated with the retrieval
   * @param {string} params.userId - The ID of the user creating the retrieval
   * @returns {Promise<Object>} A promise that resolves to the created retrieval object
   */
  async createRetrieval({
    environment,
    jsondata,
    token,
    userId
  }) {
    try {
      const db = await this.getDbConnection()

      const [retrieval] = await db('retrievals')
        .returning([
          'id',
          'user_id',
          'environment',
          'jsondata',
          'updated_at',
          'created_at'
        ])
        .insert({
          user_id: userId,
          environment,
          token,
          jsondata
        })

      return retrieval
    } catch (error) {
      const errorMessage = 'Failed to create retrieval'
      console.log(errorMessage, error)
      throw new Error(errorMessage)
    }
  }

  /**
   * Creates a new retrieval collection
   * @param {Object} params - Parameters object
   * @param {string} params.accessMethod - The access method for the retrieval collection
   * @param {string} params.collectionId - The ID of the collection
   * @param {Object} params.collectionMetadata - Metadata for the collection
   * @param {number} params.granuleCount - The count of granules
   * @param {number} params.granuleLinkCount - The count of granule links
   * @param {Object} params.granuleParams - Parameters for the granules
   * @param {string} params.retrievalId - The ID of the retrieval
   * @returns {Promise<Object>} A promise that resolves to the created retrieval collection object
   */
  async createRetrievalCollection({
    accessMethod,
    collectionId,
    collectionMetadata,
    granuleCount,
    granuleLinkCount,
    granuleParams,
    retrievalId
  }) {
    try {
      const db = await this.getDbConnection()

      const retrievalCollection = await db('retrieval_collections')
        .returning([
          'id',
          'access_method',
          'collection_id',
          'collection_metadata',
          'granule_params',
          'granule_count',
          'granule_link_count'
        ])
        .insert({
          access_method: accessMethod,
          collection_id: collectionId,
          collection_metadata: collectionMetadata,
          granule_count: granuleCount,
          granule_link_count: granuleLinkCount,
          granule_params: granuleParams,
          retrieval_id: retrievalId
        })

      return retrievalCollection
    } catch (error) {
      const errorMessage = 'Failed to create retrieval collection'
      console.log(errorMessage, error)
      throw new Error(errorMessage)
    }
  }

  /**
   * Creates a new retrieval order
   * @param {Object} params - Parameters object
   * @param {Object} params.orderPayload - The payload for the order
   * @param {string} params.retrievalCollectionId - The ID of the retrieval collection
   * @param {string} params.type - The type of the retrieval order
   * @returns {Promise<Object>} A promise that resolves to the created retrieval order object
   */
  async createRetrievalOrder({
    orderPayload,
    retrievalCollectionId,
    type
  }) {
    try {
      const db = await this.getDbConnection()

      const [retrievalOrder] = await db('retrieval_orders')
        .returning([
          'id'
        ])
        .insert({
          granule_params: orderPayload,
          retrieval_collection_id: retrievalCollectionId,
          type
        })

      return retrievalOrder
    } catch (error) {
      const errorMessage = 'Failed to create retrieval order'
      console.log(errorMessage, error)
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
    } catch (error) {
      const errorMessage = 'Failed to delete project'
      console.log(errorMessage, error)
      throw new Error(errorMessage)
    }
  }

  /**
   * Retrieves access configuration for a given collection and user
   * @param {Object} params - Parameters object
   * @param {string} params.collectionId - The ID of the collection
   * @param {string} params.userId - The ID of the user
   * @returns {Promise<Array>} A promise that resolves to an array of access configurations
   */
  async getAccessConfiguration({
    collectionId,
    userId
  }) {
    try {
      const db = await this.getDbConnection()

      const configs = await db('access_configurations')
        .select(
          'id',
          'collection_id',
          'access_method'
        )
        .where({
          collection_id: collectionId,
          user_id: userId
        })

      return configs
    } catch (error) {
      const errorMessage = 'Failed to retrieve access configuration'
      console.log(errorMessage, error)
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
    } catch (error) {
      const errorMessage = 'Failed to retrieve site preferences'
      console.log(errorMessage, error)
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
          'id',
          'name',
          'path',
          'user_id',
          'created_at',
          'updated_at'
        )
        .where({
          id: deobfuscateId(parseInt(obfuscatedId, 10))
        })
        .first()
    } catch (error) {
      const errorMessage = 'Failed to retrieve project by ID'
      console.log(errorMessage, error)
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
    } catch (error) {
      const errorMessage = 'Failed to retrieve user projects'
      console.log(errorMessage, error)
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
    } catch (error) {
      const errorMessage = 'Failed to retrieve user retrievals'
      console.log(errorMessage, error)
      throw new Error(errorMessage)
    }
  }

  /**
   * Retrieves a retrieval by its obfuscated ID
   * @param {string} obfuscatedId The ID of the retrieval to retrieve
   * @param {number} [userId] The ID of the user (optional)
   * @returns {Promise<Object>} A promise that resolves to the retrieval object
   */
  async getRetrievalByObfuscatedId(obfuscatedId, userId) {
    try {
      const db = await this.getDbConnection()

      const where = {
        id: deobfuscateId(parseInt(obfuscatedId, 10))
      }

      if (userId) {
        where.user_id = userId
      }

      return await db('retrievals')
        .select(
          'id',
          'user_id',
          'jsondata',
          'environment',
          'created_at',
          'updated_at'
        )
        .where(where)
        .first()
    } catch (error) {
      const errorMessage = 'Failed to retrieve retrieval by ID'
      console.log(errorMessage, error)
      throw new Error(errorMessage)
    }
  }

  /**
   * Retrieves a retrieval collection by its obfuscated ID
   * @param {string} obfuscatedId The obfuscated ID of the retrieval collection
   * @param {number} userId The ID of the user
   * @returns {Promise<Object>} A promise that resolves to the retrieval collection object
   */
  async getRetrievalCollectionByObfuscatedId(obfuscatedId, userId) {
    try {
      const db = await this.getDbConnection()

      return await db('retrieval_collections')
        .select(
          'retrieval_collections.id',
          'retrieval_collections.retrieval_id',
          'retrieval_collections.access_method',
          'retrieval_collections.collection_id',
          'retrieval_collections.collection_metadata',
          'retrieval_collections.granule_params',
          'retrieval_collections.granule_count',
          'retrieval_collections.granule_link_count',
          'retrieval_collections.updated_at',
          'retrieval_orders.id AS retrieval_order_id',
          'retrieval_orders.type',
          'retrieval_orders.order_number',
          'retrieval_orders.order_information',
          'retrieval_orders.state',
          'retrieval_orders.error',
          'retrieval_orders.updated_at as retrieval_order_updated_at'
        )
        .leftJoin('retrieval_orders', { 'retrieval_collections.id': 'retrieval_orders.retrieval_collection_id' })
        .join('retrievals', { 'retrieval_collections.retrieval_id': 'retrievals.id' })
        .join('users', { 'retrievals.user_id': 'users.id' })
        .where({
          'retrieval_collections.id': deobfuscateId(parseInt(obfuscatedId, 10)),
          'users.id': userId
        })
        .first()
    } catch (error) {
      const errorMessage = 'Failed to retrieve retrieval collection by ID'
      console.log(errorMessage, error)
      throw new Error(errorMessage)
    }
  }

  /**
   * Retrieves retrieval collections for granule links
   * @param {number} retrievalCollectionId - The ID of the retrieval collection
   * @param {number} userId - The ID of the user
   * @returns {Promise<Array>} A promise that resolves to an array of retrieval collections
   */
  async getRetrievalCollectionsForGranuleLinks(retrievalCollectionId, userId) {
    try {
      const db = await this.getDbConnection()

      const rows = await db('retrieval_collections')
        .select(
          'retrieval_collections.access_method',
          'retrieval_collections.collection_id',
          'retrieval_collections.collection_metadata',
          'retrieval_collections.granule_params',
          'retrieval_orders.order_information'
        )
        .join('retrievals', { 'retrieval_collections.retrieval_id': 'retrievals.id' })
        .leftJoin('retrieval_orders', { 'retrieval_orders.retrieval_collection_id': 'retrieval_collections.id' })
        .join('users', { 'retrievals.user_id': 'users.id' })
        .where({
          'retrieval_collections.id': retrievalCollectionId,
          'users.id': userId
        })

      return rows
    } catch (error) {
      const errorMessage = 'Failed to retrieve retrieval collections for granule links'
      console.log(errorMessage, error)
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
    } catch (error) {
      const errorMessage = 'Failed to retrieve retrieval collections by ID'
      console.log(errorMessage, error)
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
    } catch (error) {
      const errorMessage = 'Failed to retrieve retrieval orders by ID'
      console.log(errorMessage, error)
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
    } catch (error) {
      const errorMessage = 'Failed to retrieve user by ID'
      console.log(errorMessage, error)
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
    } catch (error) {
      const errorMessage = 'Failed to retrieve user using where object'
      console.log(errorMessage, error)
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
    } catch (error) {
      const errorMessage = 'Failed to retrieve users by ID'
      console.log(errorMessage, error)
      throw new Error(errorMessage)
    }
  }

  /**
   * Updates a project
   * @param {Object} params - Parameters object
   * @param {string} params.obfuscatedId - The obfuscated ID of the project to update
   * @param {string} params.name - The new name for the project
   * @param {string} params.path - The new path for the project
   * @param {number} [params.userId] - The ID of the user who owns the project
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

      let query = db('projects')
        .where({
          id: deobfuscateId(obfuscatedId)
        })

      if (userId) {
        query = query.where({ user_id: userId })
      }

      query = query.update({
        name,
        path,
        updated_at: new Date()
      })
        .returning('*')

      const [project] = await query

      return project
    } catch (error) {
      const errorMessage = 'Failed to update project'
      console.log(errorMessage, error)
      throw new Error(errorMessage)
    }
  }

  /**
   * Saves a new access configuration
   * @param {Object} params - Parameters object
   * @param {string} params.accessMethod - The access method
   * @param {string} params.collectionId - The ID of the collection
   * @param {string} params.userId - The ID of the user
   * @returns {Promise<Object>} A promise that resolves to the saved access configuration
   */
  async saveAccessConfiguration({
    accessMethod,
    collectionId,
    userId
  }) {
    try {
      const db = await this.getDbConnection()

      const accessConfiguration = await db('access_configurations')
        .insert({
          access_method: accessMethod,
          collection_id: collectionId,
          user_id: userId,
          created_at: new Date(),
          updated_at: new Date()
        })

      return accessConfiguration
    } catch (error) {
      const errorMessage = 'Failed to save access configuration'
      console.log(errorMessage, error)
      throw new Error(errorMessage)
    }
  }

  /**
   * Updates an existing access configuration
   * @param {Object} params - Parameters object
   * @param {string} params.accessMethod - The access method
   * @param {Object} identifiers - Identifiers object
   * @param {string} identifiers.collectionId - The ID of the collection
   * @param {string} identifiers.userId - The ID of the user
   * @returns {Promise<number>} A promise that resolves to the number of rows updated
   */
  async updateAccessConfiguration({
    accessMethod
  }, {
    collectionId,
    userId
  }) {
    try {
      const db = await this.getDbConnection()

      const result = await db('access_configurations')
        .where({
          collection_id: collectionId,
          user_id: userId
        })
        .update({
          access_method: accessMethod,
          updated_at: new Date()
        })

      return result
    } catch (error) {
      const errorMessage = 'Failed to update access configuration'
      console.log(errorMessage, error)
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
    } catch (error) {
      const errorMessage = 'Failed to update site preferences'
      console.log(errorMessage, error)
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
          'product',
          'jsondata'
        )
        .whereIn('product', products)

      // Return list of colormaps for all of the request products
      return colormaps
    } catch {
      const errorMessage = 'Failed to retrieve colormaps by products'
      console.log(errorMessage)
      throw new Error(errorMessage)
    }
  }

  /**
   * Retrieves admin retrievals metrics
   * @param {Object} params - Parameters for the query
   * @param {string} [params.startDate] - Start date for the metrics query
   * @param {string} [params.endDate] - End date for the metrics query
   * @returns {Promise<Object>} A promise that resolves to the retrievals metrics
   */
  async getRetrievalsMetricsByAccessType({ startDate, endDate }) {
    try {
      // Retrieve a connection to the database
      const db = await this.getDbConnection()

      // `jsonExtract` parses fields in `jsonb` columns
      // https://knexjs.org/guide/query-builder.html#jsonextract
      // Fetch metrics on `retrieval_collections`
      const retrievalMetricsByAccessType = await db('retrieval_collections')
        .jsonExtract('access_method', '$.type', 'access_method_type')
        .count('* as total_times_access_method_used')
        .select(db.raw('ROUND(AVG(retrieval_collections.granule_count)) AS average_granule_count'))
        .select(db.raw('ROUND(AVG(retrieval_collections.granule_link_count)) AS average_granule_link_count'))
        .select(db.raw('SUM(retrieval_collections.granule_count) AS total_granules_retrieved'))
        .select(db.raw('MAX(retrieval_collections.granule_link_count) AS max_granule_link_count'))
        .select(db.raw('MIN(retrieval_collections.granule_link_count) AS min_granule_link_count'))
        .modify((queryBuilder) => {
          if (startDate) {
            queryBuilder.where('retrieval_collections.created_at', '>=', startDate)
          }
        })
        .modify((queryBuilder) => {
          if (endDate) {
            queryBuilder.where('retrieval_collections.created_at', '<', endDate)
          }
        })
        .groupBy('access_method_type')
        .orderBy('total_times_access_method_used')

      return {
        retrievalMetricsByAccessType
      }
    } catch (error) {
      const errorMessage = 'Failed to retrieve admin retrievals metrics by access type'
      console.log(errorMessage, error)
      throw new Error(errorMessage)
    }
  }

  /**
   * Retrieves Multi Collection Retrieval Metrics
   * @param {Object} params - Parameters for the query
   * @param {string} [params.startDate] - Start date for the metrics query
   * @param {string} [params.endDate] - End date for the metrics query
   * @returns {Promise<Object>} A promise that resolves to the retrievals metrics
   */
  async getMultiCollectionMetrics({ startDate, endDate }) {
    try {
      // Retrieve a connection to the database
      const db = await this.getDbConnection()

      // Fetch the list of `retrievals` which contained > 1 collections
      const multiCollectionResponse = await db('retrieval_collections')
        .select('retrieval_collections.retrieval_id as retrieval_id')
        .modify((queryBuilder) => {
          if (startDate) {
            queryBuilder.where('retrieval_collections.created_at', '>=', startDate)
          }
        })
        .modify((queryBuilder) => {
          if (endDate) {
            queryBuilder.where('retrieval_collections.created_at', '<', endDate)
          }
        })
        .count('* as collection_count')
        .join('retrievals', { 'retrieval_collections.retrieval_id': 'retrievals.id' })
        .groupBy('retrieval_id')
        .havingRaw('COUNT(*) > ?', [1])

      return {
        multiCollectionResponse
      }
    } catch (error) {
      const errorMessage = 'Failed to retrieve multi collection retrievals metrics'
      console.log(errorMessage, error)
      throw new Error(errorMessage)
    }
  }
}
