import 'array-foreach-async'
import request from 'request-promise'
import { getEarthdataConfig, getClientId } from '../../../sharedUtils/config'

export const migrateUsers = async (oldDbConnection, newDbConnection, cmrTokens) => {
  const oldUsers = await oldDbConnection('users')
    .select([
      'id',
      'site_preferences',
      'echo_id',
      'echo_profile',
      'echo_preferences',
      'urs_profile',
      'created_at',
      'updated_at'
    ])
    .orderBy('id')

  const {
    sit: sitCmrToken,
    uat: uatCmrToken,
    prod: prodCmrToken
  } = cmrTokens

  await oldUsers.forEachAsync(async (oldAccessConfigration) => {
    const {
      id,
      site_preferences: sitePreferences = '{}',
      echo_id: echoId,
      echo_profile: echoProfile = '{}',
      echo_preferences: echoPreferences = '{}',
      urs_profile: ursProfile = '{}',
      created_at: createdAt,
      updated_at: updatedAt
    } = oldAccessConfigration


    const { user: echoUserProfile = {} } = JSON.parse(echoProfile || '{}') || {}
    const { preferences: parsedEchoPreferences = {} } = JSON.parse(echoPreferences || '{}') || {}

    try {
      const { uid: ursId } = JSON.parse(ursProfile || '{}') || {}
      if (ursId) {
        console.log(`User has URS ID of ${ursId} (and ID of ${id})`)

        let ursEnvironment
        try {
          const { echoRestRoot } = getEarthdataConfig('sit')
          const echoRestPreferencesUrl = `${echoRestRoot}/users/${echoId}.json`

          await request.get({
            uri: echoRestPreferencesUrl,
            headers: {
              'Client-Id': getClientId().lambda,
              'Echo-Token': sitCmrToken
            },
            json: true,
            resolveWithFullResponse: true
          })

          ursEnvironment = 'sit'
        } catch (e) {
          console.log(`(${e.statusCode}) ${echoId} not found on SIT, trying UAT`)

          try {
            const { echoRestRoot } = getEarthdataConfig('uat')
            const echoRestPreferencesUrl = `${echoRestRoot}/users/${echoId}.json`

            await request.get({
              uri: echoRestPreferencesUrl,
              headers: {
                'Client-Id': getClientId().lambda,
                'Echo-Token': uatCmrToken
              },
              json: true,
              resolveWithFullResponse: true
            })

            ursEnvironment = 'uat'
          } catch (e) {
            console.log(`(${e.statusCode}) ${echoId} not found on UAT, trying PROD`)

            try {
              const { echoRestRoot } = getEarthdataConfig('prod')
              const echoRestPreferencesUrl = `${echoRestRoot}/users/${echoId}.json`

              await request.get({
                uri: echoRestPreferencesUrl,
                headers: {
                  'Client-Id': getClientId().lambda,
                  'Echo-Token': prodCmrToken
                },
                json: true,
                resolveWithFullResponse: true
              })

              ursEnvironment = 'prod'
            } catch (e) {
              console.log(`(${e.statusCode}) ${echoId} not found on PROD :shrug-emoji:`)

              throw e
            }
          }
        }

        await newDbConnection('users').insert({
          id,
          site_preferences: JSON.parse(sitePreferences || '{}') || {},
          echo_id: echoId,
          echo_profile: echoUserProfile,
          echo_preferences: parsedEchoPreferences,
          urs_id: ursId,
          urs_profile: JSON.parse(ursProfile || '{}') || {},
          environment: ursEnvironment,
          created_at: createdAt,
          updated_at: updatedAt
        })

        console.log(`Successfully inserted user record with ID ${id}`)
      } else {
        console.log(`No URS ID for ${id}`)
      }
    } catch (e) {
      console.log(e.message)
    }
  })
}
