import { getProviders } from '../providers'

describe('getProviders selector', () => {
  test('returns the providers', () => {
    const state = {
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
    }

    expect(getProviders(state)).toEqual([
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
    ])
  })

  test('returns an empty array when there are no providers', () => {
    const state = {}

    expect(getProviders(state)).toEqual([])
  })
})
