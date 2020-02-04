import { buildNativeFormat } from '../nativeFormat'

describe('nativeFormat', () => {
  test('returns an empty array when no format exists', () => {
    const ummJson = {}

    expect(buildNativeFormat(ummJson)).toEqual([])
  })

  test('returns an array of the native formats', () => {
    const ummJson = {
      ArchiveAndDistributionInformation: {
        FileDistributionInformation: [
          {
            FormatType: 'Native',
            Fees: '0',
            Format: 'Not provided'
          }
        ]
      }
    }

    expect(buildNativeFormat(ummJson)).toEqual(['Not provided'])
  })

  test('removes duplicate formats', () => {
    const ummJson = {
      ArchiveAndDistributionInformation: {
        FileDistributionInformation: [
          {
            FormatType: 'Native',
            Fees: '0',
            Format: 'PDF'
          },
          {
            FormatType: 'Native',
            Fees: '0',
            Format: 'Powerpoint'
          },
          {
            FormatType: 'Native',
            Fees: '0',
            Format: 'PDF'
          }
        ]
      }
    }

    expect(buildNativeFormat(ummJson)).toEqual(['PDF', 'Powerpoint'])
  })
})
