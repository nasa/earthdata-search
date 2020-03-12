import { computeKeywordMappings } from '../computeKeywordMappings'
import { mockKeywordMappings, variablesResponse } from './mocks'

describe('computeKeywordMappings', () => {
  test('correctly returns mapped keywords', () => {
    const { items } = variablesResponse
    const forms = computeKeywordMappings(items)

    expect(forms).toEqual(mockKeywordMappings)
  })

  test('correctly returns mapped keywords when no science keywords exist', () => {
    const emptyKeywordResponse = [
      {
        meta: {
          'revision-id': 6,
          deleted: false,
          format: 'application/vnd.nasa.cmr.umm+json',
          'provider-id': 'E2E_18_4',
          'user-id': 'mmorahan',
          'native-id': 'uvg_Dust_Score_A',
          'concept-id': 'V1200279034-E2E_18_4',
          'revision-date': '2018-10-02T19:28:03Z',
          'concept-type': 'variable'
        },
        umm: {
          VariableType: 'SCIENCE_VARIABLE',
          DataType: 'float32',
          Offset: 0,
          Scale: 1,
          Characteristics: {
            IndexRanges: {
              LatRange: [
                0,
                0
              ],
              LonRange: [
                0,
                0
              ]
            }
          },
          FillValues: [
            {
              Value: -9999,
              Type: 'ANCILLARY_FILLVALUE'
            }
          ],
          Sets: [
            {
              Name: 'Data_Fields',
              Type: 'Ascending',
              Size: 76,
              Index: 2
            }
          ],
          Dimensions: [
            {
              Name: 'DustTest',
              Size: 9,
              Type: 'OTHER'
            }
          ],
          Definition: ' 32-bit DustTest (9) Fraction of obs with each floating dust test triggered. [0.0, 1.0] point Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
          Name: 'Dust_Score_A',
          AcquisitionSourceName: 'Not Provided',
          Units: 'level',
          LongName: 'Dust_Score_A'
        }
      }
    ]

    const forms = computeKeywordMappings(emptyKeywordResponse)

    expect(forms).toEqual({})
  })
})
