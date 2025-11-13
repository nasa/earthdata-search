import setupServer from './__mocks__/setupServer'
import GET_USER from '../../../../../static/src/js/operations/queries/getUser'
import UPDATE_PREFERENCES from '../../../../../static/src/js/operations/mutations/updatePreferences'

describe('User resolver', () => {
  describe('Query', () => {
    describe('user', () => {
      test('returns the user from the context', async () => {
        const { contextValue, server } = setupServer({
          databaseClient: {}
        })

        const response = await server.executeOperation({
          query: GET_USER
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(data).toEqual({
          user: {
            id: 42,
            sitePreferences: null,
            ursId: 'testuser',
            ursProfile: null
          }
        })
      })
    })
  })

  describe('Mutation', () => {
    describe('updatePreferences', () => {
      test('updates the user site preferences and returns the updated user', async () => {
        const databaseClient = {
          updateSitePreferences: jest.fn().mockResolvedValue({
            id: 42,
            site_preferences: {
              collectionSort: '-score',
              granuleSort: 'default',
              panelState: 'default',
              collectionListView: 'default',
              granuleListView: 'default',
              mapView: {
                zoom: 2,
                latitude: 0,
                longitude: 0
              }
            },
            urs_id: 'testuser'
          })
        }

        const { contextValue, server } = setupServer({
          databaseClient
        })

        const response = await server.executeOperation({
          query: UPDATE_PREFERENCES,
          variables: {
            preferences: {
              collectionSort: '-score',
              granuleSort: 'default',
              panelState: 'default',
              collectionListView: 'default',
              granuleListView: 'default',
              mapView: {
                zoom: 2,
                latitude: 0,
                longitude: 0
              }
            }
          }
        }, {
          contextValue
        })

        const { data, errors } = response.body.singleResult

        expect(errors).toBeUndefined()

        expect(databaseClient.updateSitePreferences).toHaveBeenCalledTimes(1)
        expect(databaseClient.updateSitePreferences).toHaveBeenCalledWith({
          userId: 42,
          sitePreferences: {
            collectionSort: '-score',
            granuleSort: 'default',
            panelState: 'default',
            collectionListView: 'default',
            granuleListView: 'default',
            mapView: {
              zoom: 2,
              latitude: 0,
              longitude: 0
            }
          }
        })

        expect(data).toEqual({
          updatePreferences: {
            id: 42,
            sitePreferences: {
              collectionSort: '-score',
              granuleSort: 'default',
              panelState: 'default',
              collectionListView: 'default',
              granuleListView: 'default',
              mapView: {
                zoom: 2,
                latitude: 0,
                longitude: 0
              }
            },
            ursId: 'testuser',
            ursProfile: null
          }
        })
      })

      describe('when invalid preferences are provided', () => {
        test('throws an error', async () => {
          const { contextValue, server } = setupServer({
            databaseClient: {}
          })

          const response = await server.executeOperation({
            query: UPDATE_PREFERENCES,
            variables: {
              preferences: {
                invalidPreference: true
              }
            }
          }, {
            contextValue
          })

          const { data, errors } = response.body.singleResult

          expect(data).toEqual({ updatePreferences: null })

          expect(errors[0].message).toBe('Invalid preferences: [{"keyword":"additionalProperties","dataPath":"","schemaPath":"#/additionalProperties","params":{"additionalProperty":"invalidPreference"},"message":"should NOT have additional properties"}]')
        })
      })
    })
  })
})
