import 'array-foreach-async'
import { parse } from 'qs'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'

export const migrateRetrievals = async (oldDbConnection, newDbConnection) => {
  const oldRetrievals = await oldDbConnection('retrievals')
    .select([
      'id',
      'user_id',
      'jsondata',
      'token',
      'environment',
      'created_at',
      'updated_at'
    ])
    .orderBy('id')

  await oldRetrievals.forEachAsync(async (oldRetrieval) => {
    const {
      id,
      user_id: userId,
      jsondata,
      token,
      environment,
      created_at: createdAt,
      updated_at: updatedAt
    } = oldRetrieval

    const { query, source } = JSON.parse(jsondata)
    const {
      portal,
      shapefile_id: shapefileId,
      cmr_env: cmrEnvironment = cmrEnv()
    } = parse(query)

    const migratedJsonData = {
      source: `?${source}`
    }

    if (portal !== undefined) {
      const [firstPortal] = portal

      migratedJsonData.portal_id = firstPortal
    }

    if (shapefileId !== undefined) {
      migratedJsonData.shapefile_id = shapefileId
    }

    try {
      await newDbConnection('retrievals').insert({
        id,
        user_id: userId,
        jsondata: migratedJsonData,
        token: (token || 'invalid_token'),
        environment: (environment || cmrEnvironment),
        created_at: createdAt,
        updated_at: updatedAt
      })

      console.log(`Successfully inserted retrieval record with ID ${id}`)
    } catch (e) {
      console.log(e.message)
    }
  })
}
