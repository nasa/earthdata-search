import { buildNativeFormat } from '../nativeFormat'

describe('nativeFormat', () => {
  test('returns an empty array when no format exists', () => {
    const ummJson = {}

    expect(buildNativeFormat(ummJson)).toEqual([])
  })

  test('returns an array of the native data formats', () => {
    const ummJson = {
      ArchiveAndDistributionInformation: {
        FileDistributionInformation: [
          {
            FormatType: 'Native',
            Fees: '0',
            Format: 'PDF'
          }
        ]
      }
    }

    expect(buildNativeFormat(ummJson)).toEqual(['PDF'])
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

  test('removes "Not Provided" formats', () => {
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

    expect(buildNativeFormat(ummJson)).toEqual([])
  })

  test('only returns formats if the FormatType is defined', () => {
    const ummJson = {
      ArchiveAndDistributionInformation: {
        FileDistributionInformation: [
          {
            Fees: '0',
            Format: 'PDF'
          }
        ]
      }
    }

    expect(buildNativeFormat(ummJson)).toEqual([])
  })
})
