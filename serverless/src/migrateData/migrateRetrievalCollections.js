import 'array-foreach-async'
import { keyBy } from 'lodash'
import { pageAllCmrResults } from '../util/cmr/pageAllCmrResults'
import { migrateAccesMethod } from './migrateAccessMethod'
import { determineCollectionEnvironment } from './determineCollectionEnvironment'
import { tagName } from '../../../sharedUtils/tags'
import { getUmmCollectionVersionHeader } from '../../../sharedUtils/ummVersionHeader'

export const migrateRetrievalCollections = async (oldDbConnection, newDbConnection, cmrTokens) => {
  const oldRetrievalCollections = await oldDbConnection('retrieval_collections')
    .select([
      'id',
      'retrieval_id',
      'access_method',
      'collection_id',
      'collection_metadata',
      'granule_params',
      'granule_count',
      'created_at',
      'updated_at'
    ])
    .where('id', '>', 2994)
    .orderBy('id')

  const collectionIds = await oldDbConnection('retrieval_collections')
    .select(['collection_id'])

  const collectionsByEnv = {}

  await ['sit', 'uat', 'prod'].forEachAsync(async (env) => {
    console.log(`Getting collections from ${env}...`)

    const collections = await pageAllCmrResults({
      cmrToken: cmrTokens[env],
      cmrEnvironment: env,
      path: 'search/collections.json',
      queryParams: {
        concept_id: collectionIds.map(id => id.collection_id),
        include_tags: tagName('*')
      },
      additionalHeaders: {
        Accept: getUmmCollectionVersionHeader()
      }
    })

    collectionsByEnv[env] = keyBy(collections, collection => collection.id)
  })

  await oldRetrievalCollections.forEachAsync(async (oldRetrievalCollection) => {
    const {
      id,
      retrieval_id: retrievalId,
      access_method: accessMethod,
      collection_id: collectionId,
      granule_params: granuleParams,
      granule_count: granuleCount,
      created_at: createdAt,
      updated_at: updatedAt
    } = oldRetrievalCollection

    // This method returns false if nothing was found
    const collectionEnvironmentResponse = determineCollectionEnvironment(
      collectionsByEnv,
      collectionId
    )

    if (collectionEnvironmentResponse !== false) {
      const {
        environment: collectionEnvironment,
        collectionMetadata
      } = collectionEnvironmentResponse

      // Retrieve necessary external data
      const newAccessMethod = await migrateAccesMethod(
        JSON.parse(accessMethod),
        collectionEnvironment,
        collectionMetadata,
        cmrTokens[collectionEnvironment]
      )

      try {
        await newDbConnection('retrieval_collections').insert({
          id,
          retrieval_id: retrievalId,
          access_method: newAccessMethod,
          collection_id: collectionId,
          collection_metadata: collectionMetadata,
          granule_params: JSON.parse(granuleParams),
          granule_count: granuleCount,
          created_at: createdAt,
          updated_at: updatedAt
        })

        console.log(`Successfully inserted retrieval collection record with ID ${id}`)
      } catch (e) {
        console.log(e.message)
      }
    }
  })
}
