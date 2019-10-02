import { findProvider } from '../findProvider'

describe('findProvider', () => {
  test('correctly returns a provider if found', () => {
    expect(findProvider({
      providers: [
        {
          provider: {
            id: 'abcd-1234-efgh-5678',
            organization_name: 'EDSC-TEST',
            provider_id: 'EDSC-TEST'
          }
        }, {
          provider: {
            id: 'abcd-1234-efgh-5678',
            organization_name: 'NON-EDSC-TEST',
            provider_id: 'NON-EDSC-TEST'
          }
        }
      ]
    }, 'EDSC-TEST')).toEqual({
      provider: {
        id: 'abcd-1234-efgh-5678',
        organization_name: 'EDSC-TEST',
        provider_id: 'EDSC-TEST'
      }
    })
  })

  test('returns nothing correctly when a provider is not found', () => {
    expect(findProvider({
      providers: [
        {
          provider: {
            id: 'abcd-1234-efgh-5678',
            organization_name: 'EDSC-TEST',
            provider_id: 'EDSC-TEST'
          }
        }, {
          provider: {
            id: 'abcd-1234-efgh-5678',
            organization_name: 'NON-EDSC-TEST',
            provider_id: 'NON-EDSC-TEST'
          }
        }
      ]
    }, 'EDSC-TEST-NOPE')).toEqual(undefined)
  })
})
