import { configToCmrQuery } from '../configToCmrQuery'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('configToCmrQuery', () => {
  test('correctly ignores unsupported', () => {
    const response = configToCmrQuery({
      dayNightFlag: 'DAY'
    })

    expect(response).toEqual({})
  })

  test('correctly translates a simple query', () => {
    const response = configToCmrQuery({
      shortName: 'EDSC-TEST'
    })

    expect(response).toEqual({
      condition: {
        short_name: 'EDSC-TEST'
      }
    })
  })

  test('correctly translates a query requiring an \'or\'', () => {
    const response = configToCmrQuery({
      shortName: [
        'EDSC-TEST',
        'EDSC-TEST-2'
      ]
    })

    expect(response).toEqual({
      condition: {
        or: [
          { short_name: 'EDSC-TEST' },
          { short_name: 'EDSC-TEST-2' }
        ]
      }
    })
  })

  test('correctly translates a query requiring an \'and\'', () => {
    const response = configToCmrQuery({
      shortName: 'EDSC-TEST',
      dataCenterId: 'EDSC'
    })

    expect(response).toEqual({
      condition: {
        and: [
          { short_name: 'EDSC-TEST' },
          { provider: 'EDSC' }
        ]
      }
    })
  })

  test('correctly translates a query requiring an \'and\' as well as an \'or\'', () => {
    const response = configToCmrQuery({
      shortName: [
        'EDSC-TEST',
        'EDSC-TEST-2'
      ],
      dataCenterId: 'EDSC'
    })

    expect(response).toEqual({
      condition: {
        and: [
          {
            or: [
              { short_name: 'EDSC-TEST' },
              { short_name: 'EDSC-TEST-2' }
            ]
          },
          { provider: 'EDSC' }
        ]
      }
    })
  })
})
