import { buildEsi } from '../buildEsi'

import * as getApplicationConfig from '../../../../../../../sharedUtils/config'

beforeEach(() => {
  vi.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
    disableOrdering: 'false'
  }))
})

describe('buildEsi', () => {
  test('returns an esi access method', () => {
    const collectionMetadata = {
      services: {
        items: [{
          type: 'ESI',
          url: {
            urlValue: 'https://example.com'
          },
          orderOptions: {
            items: [{
              conceptId: 'OO10000-EDSC',
              revisionId: 1,
              name: 'mock form',
              form: 'mock form'
            }]
          }
        }]
      }
    }

    const { services } = collectionMetadata
    const serviceItem = services.items[0]

    const accessMethodsList = buildEsi(serviceItem)

    expect(accessMethodsList.length).toEqual(1)

    expect(accessMethodsList).toEqual([
      {
        form: 'mock form',
        formDigest: 'b7036eff8a2e3abec0f9f0e36a7f3ee9',
        optionDefinition: {
          conceptId: 'OO10000-EDSC',
          revisionId: 1,
          name: 'mock form'
        },
        type: 'ESI',
        url: 'https://example.com'
      }
    ])
  })

  test('returns esi access methods correctly', () => {
    const collectionMetadata = {
      services: {
        items: [
          {
            type: 'ESI',
            url: {
              urlValue: 'https://example.com'
            },
            maxItemsPerOrder: 2000,
            orderOptions: {
              items: [
                {
                  conceptId: 'OO20000-EDSC',
                  revisionId: 1,
                  name: 'mock form',
                  form: 'mock form'
                },
                {
                  conceptId: 'OO30000-EDSC',
                  revisionId: 2,
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

    const accessMethodsList = buildEsi(serviceItem0)

    expect(accessMethodsList.length).toEqual(2)

    expect(accessMethodsList).toEqual(
      [
        {
          form: 'mock form',
          formDigest: 'b7036eff8a2e3abec0f9f0e36a7f3ee9',
          optionDefinition: {
            conceptId: 'OO20000-EDSC',
            revisionId: 1,
            name: 'mock form'
          },
          type: 'ESI',
          maxItemsPerOrder: 2000,
          url: 'https://example.com'
        },
        {
          form: 'mock form',
          formDigest: 'b7036eff8a2e3abec0f9f0e36a7f3ee9',
          optionDefinition: {
            conceptId: 'OO30000-EDSC',
            revisionId: 2,
            name: 'mock form'
          },
          type: 'ESI',
          maxItemsPerOrder: 2000,
          url: 'https://example.com'
        }
      ]
    )
  })

  describe('when ordering is disabled', () => {
    test('returns an empty object', () => {
      vi.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
        disableOrdering: 'true'
      }))

      const collectionMetadata = {
        services: {
          items: [{
            type: 'ESI',
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

      const accessMethodsList = buildEsi(serviceItem)

      expect(accessMethodsList.length).toEqual(0)

      expect(accessMethodsList).toEqual([])
    })
  })
})
