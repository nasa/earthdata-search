import { buildEcho } from '../buildEcho'

import * as getApplicationConfig from '../../../../../../../sharedUtils/config'

beforeEach(() => {
  jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
    disableOrdering: 'false'
  }))
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('buildEcho', () => {
  test('returns an echo orders access method and indexes are incremented correctly', () => {
    const collectionMetadata = {
      services: {
        items: [
          {
            type: 'ECHO ORDERS',
            url: {
              urlValue: 'https://example.com'
            },
            maxItemsPerOrder: 2000,
            orderOptions: {
              items: [
                {
                  conceptId: 'OO10000-EDSC',
                  revisionId: 1,
                  name: 'mock form',
                  form: 'mock form'
                },
                {
                  conceptId: 'OO30000-EDSC',
                  revisionId: 1,
                  name: 'mock form',
                  form: 'mock form'
                }
              ]
            }
          }
        ]
      }
    }

    const { services } = collectionMetadata
    const serviceItem0 = services.items[0]

    const accessMethods = buildEcho(serviceItem0)

    expect(accessMethods).toEqual([
      {
        form: 'mock form',
        formDigest: 'bW9jayBmb3Jt',
        optionDefinition: {
          conceptId: 'OO10000-EDSC',
          revisionId: 1,
          name: 'mock form'
        },
        type: 'ECHO ORDERS',
        maxItemsPerOrder: 2000,
        url: 'https://example.com'
      },
      {
        form: 'mock form',
        formDigest: 'bW9jayBmb3Jt',
        optionDefinition: {
          conceptId: 'OO30000-EDSC',
          revisionId: 1,
          name: 'mock form'
        },
        type: 'ECHO ORDERS',
        maxItemsPerOrder: 2000,
        url: 'https://example.com'
      }
    ])
  })

  describe('when ordering is disabled', () => {
    test('returns an empty object', () => {
      jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
        disableOrdering: 'true'
      }))

      const collectionMetadata = {
        services: {
          items: [{
            type: 'ECHO ORDERS',
            url: {
              urlValue: 'https://example.com'
            },
            maxItemsPerOrder: 2000,
            orderOptions: {
              items: [
                {
                  conceptId: 'OO10000-EDSC',
                  revisionId: 1,
                  name: 'mock form',
                  form: 'mock form'
                }
              ]
            }
          }]
        }
      }

      const { services } = collectionMetadata
      const serviceItem = services.items[0]

      const accessMethodsList = buildEcho(serviceItem)

      expect(accessMethodsList).toEqual([])
    })
  })
})
