import { buildEsiEcho } from '../buildEsiEcho'

describe('buildEsiEcho', () => {
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
              name: 'mock form',
              form: 'mock form'
            }]
          }
        }]
      }
    }
    const disabledOrdering = false

    const { services } = collectionMetadata
    const serviceItem = services.items[0]

    const methods = buildEsiEcho(serviceItem, disabledOrdering)

    expect(methods).toEqual({
      esi0: {
        form: 'mock form',
        formDigest: '75f9480053e9ba083665951820d17ae5c2139d92',
        optionDefinition: {
          conceptId: 'OO10000-EDSC',
          name: 'mock form'
        },
        type: 'ESI',
        url: 'https://example.com'
      }
    })
  })

  test('returns an echo orders access method', () => {
    const collectionMetadata = {
      services: {
        items: [{
          type: 'ECHO ORDERS',
          url: {
            urlValue: 'https://example.com'
          },
          maxItemsPerOrder: 2000,
          orderOptions: {
            items: [{
              conceptId: 'OO10000-EDSC',
              name: 'mock form',
              form: 'mock form'
            }]
          }
        }]
      }
    }

    const { services } = collectionMetadata
    const serviceItem = services.items[0]

    const disabledOrdering = false

    const methods = buildEsiEcho(serviceItem, disabledOrdering)

    expect(methods).toEqual({
      echoOrder0: {
        form: 'mock form',
        formDigest: '75f9480053e9ba083665951820d17ae5c2139d92',
        optionDefinition: {
          conceptId: 'OO10000-EDSC',
          name: 'mock form'
        },
        type: 'ECHO ORDERS',
        maxItemsPerOrder: 2000,
        url: 'https://example.com'
      }
    })
  })

  test('returns empty when ordering disabled', () => {
    const collectionMetadata = {
      services: {
        items: [{
          type: 'ECHO ORDERS',
          url: {
            urlValue: 'https://example.com'
          },
          maxItemsPerOrder: 2000,
          orderOptions: {
            items: [{
              conceptId: 'OO10000-EDSC',
              name: 'mock form',
              form: 'mock form'
            }]
          }
        }]
      }
    }

    const { services } = collectionMetadata
    const serviceItem = services.items[0]

    const disabledOrdering = 'true'

    const methods = buildEsiEcho(serviceItem, disabledOrdering)

    expect(methods).toEqual({})
  })
})
