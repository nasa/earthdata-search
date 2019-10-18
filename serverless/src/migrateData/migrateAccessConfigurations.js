import 'array-foreach-async'
import { keyBy } from 'lodash'

import { migrateAccesMethod } from './migrateAccessMethod'
import { pageAllCmrResults } from '../util/cmr/pageAllCmrResults'
import { determineCollectionEnvironment } from './determineCollectionEnvironment'
import { tagName } from '../../../sharedUtils/tags'
import { getUmmCollectionVersionHeader } from '../../../sharedUtils/ummVersionHeader'

export const migrateAccessConfigurations = async (oldDbConnection, newDbConnection, cmrTokens) => {
  const oldAccessConfigurations = await oldDbConnection('access_configurations')
    .select([
      'id',
      'user_id',
      'dataset_id',
      'service_options',
      'created_at',
      'updated_at'
    ])
    .orderBy('id')

  const collectionIds = await oldDbConnection('access_configurations')
    .select(['dataset_id'])

  const collectionsByEnv = {}

  await ['sit', 'uat', 'prod'].forEachAsync(async (env) => {
    console.log(`Getting collections from ${env}...`)

    const collections = await pageAllCmrResults({
      cmrToken: cmrTokens[env],
      cmrEnvironment: env,
      path: 'search/collections.json',
      queryParams: {
        concept_id: collectionIds.map(id => id.dataset_id),
        include_tags: tagName('*')
      },
      additionalHeaders: {
        Accept: getUmmCollectionVersionHeader()
      }
    })

    collectionsByEnv[env] = keyBy(collections, collection => collection.id)
  })

  await oldAccessConfigurations.forEachAsync(async (oldAccessConfigration) => {
    const {
      id,
      user_id: userId,
      dataset_id: datasetId,
      service_options: serviceOptions,
      created_at: createdAt,
      updated_at: updatedAt
    } = oldAccessConfigration

    const { accessMethod = [] } = JSON.parse(serviceOptions)

    if (accessMethod.length > 0) {
      // EDSC 1.x stored multiple access methods, which is no longer supported and has been
      // cleaned up in the database but we kept the array for backward compatability
      const [firstAccessMethod] = accessMethod

      // This method returns false if nothing was found
      const collectionEnvironmentResponse = determineCollectionEnvironment(
        collectionsByEnv,
        datasetId
      )

      if (collectionEnvironmentResponse !== false) {
        const {
          environment: collectionEnvironment,
          collectionMetadata
        } = collectionEnvironmentResponse

        // Retrieve necessary external data
        const newAccessMethod = await migrateAccesMethod(
          firstAccessMethod,
          collectionEnvironment,
          collectionMetadata,
          cmrTokens[collectionEnvironment]
        )

        try {
          if (newAccessMethod) {
            await newDbConnection('access_configurations').insert({
              id,
              user_id: userId,
              access_method: newAccessMethod,
              collection_id: datasetId,
              created_at: createdAt,
              updated_at: updatedAt
            })

            console.log(`Successfully inserted access_configuration record with ID ${id}`)
          } else {
            console.log(`Unable to insert access_configuration record with ID ${id}`)
          }
        } catch (e) {
          console.log(e)
        }
      }
    }
  })
}
