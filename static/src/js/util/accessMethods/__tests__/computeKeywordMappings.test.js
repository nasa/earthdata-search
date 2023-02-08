import { computeKeywordMappings } from '../computeKeywordMappings'
import { mockKeywordMappings, variablesResponse } from './mocks'

describe('computeKeywordMappings', () => {
  test('correctly returns mapped keywords', () => {
    const { items } = variablesResponse
    const keywordMappings = computeKeywordMappings(items)

    expect(keywordMappings).toEqual(mockKeywordMappings)
  })

  test('correctly returns mapped keywords when no science keywords exist', () => {
    const emptyKeywordResponse = [
      {
        conceptId: 'V1200279034-E2E_18_4',
        variableType: 'SCIENCE_VARIABLE',
        dataType: 'float32',
        offset: 0,
        scale: 1,
        characteristics: {
          indexRanges: {
            latRange: [
              0,
              0
            ],
            lonRange: [
              0,
              0
            ]
          }
        },
        fillValues: [
          {
            value: -9999,
            type: 'ANCILLARY_FILLVALUE'
          }
        ],
        sets: [
          {
            name: 'Data_Fields',
            type: 'Ascending',
            size: 76,
            index: 2
          }
        ],
        dimensions: [
          {
            name: 'DustTest',
            size: 9,
            type: 'OTHER'
          }
        ],
        definition: ' 32-bit DustTest (9) Fraction of obs with each floating dust test triggered. [0.0, 1.0] point Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
        name: 'Dust_Score_A',
        acquisitionSourceName: 'Not Provided',
        units: 'level',
        longName: 'Dust_Score_A'
      }
    ]

    const keywordMappings = computeKeywordMappings(emptyKeywordResponse)

    expect(keywordMappings).toEqual([])
  })
})
