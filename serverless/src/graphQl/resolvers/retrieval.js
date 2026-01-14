import camelcaseKeys from 'camelcase-keys'
import snakecaseKeys from 'snakecase-keys'
import { SendMessageBatchCommand } from '@aws-sdk/client-sqs'

import { obfuscateId } from '../../util/obfuscation/obfuscateId'
import { fetchGranuleLinks } from '../../util/fetchGranuleLinks'
import { removeSpatialFromAccessMethod } from '../../util/removeSpatialFromAccessMethod'
import { generateRetrievalPayloads } from '../../util/generateRetrievalPayloads'
import { getQueueUrl, QUEUE_NAMES } from '../../util/getQueueUrl'
import { ACCESS_METHOD_TYPES } from '../../../../sharedConstants/accessMethodTypes'

import buildPaginatedResult from '../utils/buildPaginatedResult'

export default {
  Query: {
    retrieval: async (parent, args, context) => {
      const { databaseClient, user } = context

      const { id: userId } = user

      const { obfuscatedId } = args

      const retrieval = await databaseClient.getRetrievalByObfuscatedId(obfuscatedId, userId)

      return camelcaseKeys(
        retrieval,
        { deep: true }
      )
    },

    retrievalCollection: async (parent, args, context) => {
      const { databaseClient, user } = context

      const { id: userId } = user

      const { obfuscatedId } = args

      const retrievalCollection = await databaseClient.getRetrievalCollectionByObfuscatedId(
        obfuscatedId,
        userId
      )

      return camelcaseKeys(
        retrievalCollection,
        { deep: true }
      )
    },

    historyRetrievals: async (parent, args, context) => {
      const { databaseClient, user } = context
      const { id: userId } = user
      const { limit = 20, offset = 0 } = args

      const data = await databaseClient.getHistoryRetrievals({
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
        historyRetrievals: camelcaseKeys(
          result.data,
          { deep: true }
        ),
        pageInfo: result.pageInfo,
        count: result.count
      }
    },

    retrieveGranuleLinks: async (parent, args, context) => {
      const {
        databaseClient,
        earthdataEnvironment,
        edlToken,
        user
      } = context

      const { id: userId } = user

      const {
        obfuscatedRetrievalCollectionId,
        cursor,
        linkTypes,
        pageNum = 1,
        flattenLinks = false,
        requestId
      } = args

      const {
        cursor: newCursor,
        done,
        links
      } = await fetchGranuleLinks({
        cursor,
        databaseClient,
        earthdataEnvironment,
        flattenLinks,
        edlToken,
        linkTypes: linkTypes.join(','),
        obfuscatedRetrievalCollectionId,
        pageNum,
        requestId,
        userId
      })

      return {
        cursor: newCursor,
        done,
        links
      }
    }
  },
  Mutation: {
    createRetrieval: async (parent, args, context) => {
      const {
        databaseClient,
        edlToken,
        sqs,
        user
      } = context

      const { id: userId } = user

      const {
        collections,
        environment,
        jsondata
      } = args

      try {
        // Create a transaction
        await databaseClient.startTransaction()

        // Create the retrieval
        const retrieval = await databaseClient.createRetrieval({
          environment,
          jsondata,
          token: edlToken,
          userId: user.id
        })

        // Loop over the collections to create retrievalCollections
        await collections.forEachAsync(async (collection) => {
          const {
            id,
            accessMethod,
            collectionMetadata,
            granuleCount = 0,
            granuleLinkCount = 0,
            granuleParams
          } = collection

          // Snake case the granule params for sending to CMR
          const snakeGranuleParams = snakecaseKeys(granuleParams)

          // Create the retrievalCollection
          const newRetrievalCollection = await databaseClient.createRetrievalCollection({
            accessMethod,
            collectionId: id,
            collectionMetadata,
            granuleCount,
            granuleLinkCount,
            granuleParams: snakeGranuleParams,
            retrievalId: retrieval.id
          })

          // Save Access Configuration
          const existingAccessConfig = await databaseClient.getAccessConfiguration({
            collectionId: id,
            userId
          })

          const accessMethodWithoutSpatial = removeSpatialFromAccessMethod(accessMethod)

          if (existingAccessConfig.length) {
            await databaseClient.updateAccessConfiguration({
              accessMethod: accessMethodWithoutSpatial
            }, {
              collectionId: id,
              userId
            })
          } else {
            await databaseClient.saveAccessConfiguration({
              accessMethod: accessMethodWithoutSpatial,
              collectionId: id,
              userId
            })
          }

          // The relevant tag data is merged into the access method in the UI, this
          // allows us to pull out the type of service and the url that the data will
          // need to be submitted to
          const { type } = accessMethod

          if ([
            ACCESS_METHOD_TYPES.ESI,
            ACCESS_METHOD_TYPES.ECHO_ORDERS,
            ACCESS_METHOD_TYPES.HARMONY,
            ACCESS_METHOD_TYPES.SWODLR
          ].includes(type)) {
          // The insert above returns an array but we've only added a single row
          // so we will always take the first result
            const [retrievalCollection] = newRetrievalCollection

            const { id: retrievalCollectionId } = retrievalCollection

            // Provide the inserted row to the generateOrder payload to construct
            // the payloads we need to submit the users' order
            const orderPayloads = await generateRetrievalPayloads(retrievalCollection, accessMethod)

            let queueUrl

            if (type === ACCESS_METHOD_TYPES.ESI) {
              // Submits to Catalog Rest and is often referred to as a
              // service order -- this is presenting in EDSC as the 'Customize' access method
              queueUrl = getQueueUrl(QUEUE_NAMES.CatalogRestOrderQueue)
            } else if (type === ACCESS_METHOD_TYPES.ECHO_ORDERS) {
              // Submits to cmr-ordering and is often referred to as an
              // echo order -- this is presenting in EDSC as the 'Stage For Delivery' access method
              queueUrl = getQueueUrl(QUEUE_NAMES.CmrOrderingOrderQueue)
            } else if (type === ACCESS_METHOD_TYPES.HARMONY) {
              // Submits to Harmony
              queueUrl = getQueueUrl(QUEUE_NAMES.HarmonyOrderQueue)
            } else if (type === ACCESS_METHOD_TYPES.SWODLR) {
              queueUrl = getQueueUrl(QUEUE_NAMES.SwodlrOrderQueue)
            }

            // Initialize the array we'll send to sqs
            let sqsEntries = []

            await orderPayloads.forEachAsync(async (orderPayload) => {
            // Avoid having to deal with paging again, pull out the page
            // number from the order payload
              const { page_num: pageNum } = orderPayload
              // Some CMR access-control calls downstream can take quite a long time
              // if you give it too many granules at once, so lets delay each
              // sqs entry by ORDER_DELAY_SECONDS value for each page. i.e. page 1
              // will not wait, page 2 will wait ORDER_DELAY_SECONDS, page 3 will wait
              // ORDER_DELAY_SECONDS times 2, etc.
              const delay = (pageNum - 1) * parseInt(process.env.ORDER_DELAY_SECONDS, 10)

              // Save the order to the database
              const newOrderRecord = await databaseClient.createRetrievalOrder({
                orderPayload,
                retrievalCollectionId,
                type
              })

              // Push the orders into an array that will be bulk pushed to SQS
              sqsEntries.push({
                Id: `${retrievalCollectionId}-${pageNum}`,
                MessageBody: JSON.stringify({
                  accessToken: edlToken,
                  id: newOrderRecord.id
                }),
                // Wait a few seconds before picking up the SQS job to ensure the database transaction
                // has been committed. Here we add the ORDER_DELAY_SECONDS as well.
                DelaySeconds: 3 + delay
              })

              if (process.env.SKIP_SQS !== 'true') {
                // MessageBatch only accepts batch sizes of 10 messages, so we'll
                // chunk potentially larger request into acceptable chunks
                if (pageNum % 10 === 0 || pageNum === orderPayloads.length) {
                  // Send all of the order messages to sqs as a single batch
                  const command = new SendMessageBatchCommand({
                    QueueUrl: queueUrl,
                    Entries: sqsEntries
                  })
                  await sqs.send(command)
                  sqsEntries = []
                }
              }
            })
          }
        })

        // Commit the database transaction
        await databaseClient.commitTransaction()

        // Return retrieval
        return camelcaseKeys(retrieval, { deep: true })
      } catch (error) {
        // Rollback the database transaction
        await databaseClient.rollbackTransaction()

        // Log the error
        const errorMessage = 'Failed to create retrieval'
        console.log(errorMessage, error)

        throw new Error(errorMessage)
      }
    },

    deleteRetrieval: async (parent, args, context) => {
      const { databaseClient, user } = context
      const { id: userId } = user
      const { obfuscatedId } = args

      const numRowsDeleted = await databaseClient.deleteRetrieval({
        obfuscatedId,
        userId
      })

      return numRowsDeleted === 1
    }
  },
  Retrieval: {
    retrievalCollections: async (parent, args, context) => {
      const { loaders } = context

      // Use the retrievalCollections dataloader to fetch the retrieval collections for the retrieval
      // using the id from the parent AdminRetrieval
      const loaderData = await loaders.retrievalCollections.load(parent.id)

      return camelcaseKeys(loaderData, {
        deep: true,
        // Prevent camelcasing of JSON fields
        stopPaths: ['accessMethod', 'collectionMetadata']
      })
    },
    user: async (parent, args, context) => {
      const { loaders } = context

      // Use the users dataloader to fetch the user for the retrieval using the userId
      // from the parent Retrieval
      const loaderData = await loaders.users.load(parent.userId)

      return camelcaseKeys(loaderData, { deep: true })
    },
    obfuscatedId: async (parent) => {
      const { id } = parent

      return obfuscateId(id)
    }
  },
  HistoryRetrieval: {
    obfuscatedId: async (parent) => {
      const { id } = parent

      return obfuscateId(id)
    }
  },
  RetrievalCollection: {
    links: async (parent) => {
      const { collectionMetadata = {} } = parent

      const {
        title,
        relatedUrls = []
      } = collectionMetadata

      // Metadata links will be any RelatedURLs with the URLContentType of CollectionURL or DataCenterURL
      const metadataLinks = relatedUrls.filter(
        (link = {}) => link.urls[0]?.urlContentType === 'CollectionURL'
          || link.urls[0]?.urlContentType === 'DataCenterURL'
      )

      if (metadataLinks.length === 0) return null

      // Prevent redundant links
      const uniqueMetadataLinks = metadataLinks.filter(
        (thing, index, self) => index === self.findIndex(
          (link) => link.urls[0].url === thing.urls[0].url
        )
      )

      return {
        title,
        links: uniqueMetadataLinks.map((link) => ({
          url: link.urls[0].url,
          type: link.urls[0].type
        }))
      }
    },
    obfuscatedId: async (parent) => {
      const { id } = parent

      return obfuscateId(id)
    },
    retrievalOrders: async (parent, args, context) => {
      const { loaders } = context

      // Dataloaders cache the data, so clear the cache to ensure up to date data is returned
      loaders.retrievalOrders.clear(parent.id)

      // Use the retrievalOrders dataloader to fetch the retrieval orders for the collection
      // using the id from the parent AdminRetrievalCollection
      const loaderData = await loaders.retrievalOrders.load(parent.id)

      return camelcaseKeys(loaderData, {
        deep: true,
        // Prevent camelcasing of JSON fields
        stopPaths: ['granuleParams', 'orderInformation']
      })
    }
  }
}
