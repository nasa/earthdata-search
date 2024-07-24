import { buildEsiEcho } from '../buildEsiEcho'

import * as getApplicationConfig from '../../../../../../../sharedUtils/config'

beforeEach(() => {
  jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
    disableOrdering: 'false'
  }))
})

afterEach(() => {
  jest.clearAllMocks()
})

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

    const { services } = collectionMetadata
    const serviceItem = services.items[0]

    const params = {
      esiIndex: 0,
      echoIndex: 0
    }

    const {
      accessMethods: methods,
      esiIndex: newEsiIndex,
      echoIndex: newEchoIndex
    } = buildEsiEcho(serviceItem, params)

    expect(newEsiIndex).toEqual(1)
    expect(newEchoIndex).toEqual(0)

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
            },
            {
              conceptId: 'OO30000-EDSC',
              name: 'mock form',
              form: 'mock form'
            }]
          }
        },
        {
          type: 'ESI',
          url: {
            urlValue: 'https://example.com'
          },
          maxItemsPerOrder: 2000,
          orderOptions: {
            items: [{
              conceptId: 'OO20000-EDSC',
              name: 'mock form',
              form: 'mock form'
            }]
          }
        }]
      }
    }

    const { services } = collectionMetadata
    const serviceItem0 = services.items[0]
    const serviceItem1 = services.items[1]

    const params = {
      esiIndex: 0,
      echoIndex: 0
    }

    const {
      accessMethods: echoMethods,
      esiIndex: newEsiIndex,
      echoIndex: newEchoIndex
    } = buildEsiEcho(serviceItem0, params)

    params.esiIndex = newEsiIndex
    params.echoIndex = newEchoIndex

    const {
      accessMethods: esiMethods,
      esiIndex: finalEsiIndex,
      echoIndex: finalEchoIndex
    } = buildEsiEcho(serviceItem1, params)

    expect(finalEchoIndex).toEqual(2)
    expect(finalEsiIndex).toEqual(1)

    expect(echoMethods).toEqual({
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
      },
      echoOrder1: {
        form: 'mock form',
        formDigest: '75f9480053e9ba083665951820d17ae5c2139d92',
        optionDefinition: {
          conceptId: 'OO30000-EDSC',
          name: 'mock form'
        },
        type: 'ECHO ORDERS',
        maxItemsPerOrder: 2000,
        url: 'https://example.com'
      }
    })

    expect(esiMethods).toEqual({
      esi0: {
        form: 'mock form',
        formDigest: '75f9480053e9ba083665951820d17ae5c2139d92',
        optionDefinition: {
          conceptId: 'OO20000-EDSC',
          name: 'mock form'
        },
        type: 'ESI',
        maxItemsPerOrder: 2000,
        url: 'https://example.com'
      }
    })
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

      const params = {
        esiIndex: 0,
        echoIndex: 0
      }

      const {
        accessMethods: methods,
        esiIndex: newEsiIndex,
        echoIndex: newEchoIndex
      } = buildEsiEcho(serviceItem, params)

      expect(newEsiIndex).toEqual(0)
      expect(newEchoIndex).toEqual(0)

      expect(methods).toEqual({})
    })
  })
})
