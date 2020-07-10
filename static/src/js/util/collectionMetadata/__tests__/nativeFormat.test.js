import { buildNativeFormat } from '../nativeFormat'

describe('nativeFormat', () => {
  test('returns an empty array when no format exists', () => {
    const json = {}

    expect(buildNativeFormat(json)).toEqual([])
  })

  test('returns an array of the native data formats', () => {
    const json = {
      archiveAndDistributionInformation: {
        fileDistributionInformation: [
          {
            formatType: 'Native',
            fees: '0',
            format: 'PDF'
          }
        ]
      }
    }

    expect(buildNativeFormat(json)).toEqual(['PDF'])
  })

  test('removes duplicate formats', () => {
    const json = {
      archiveAndDistributionInformation: {
        fileDistributionInformation: [
          {
            formatType: 'Native',
            fees: '0',
            format: 'PDF'
          },
          {
            formatType: 'Native',
            fees: '0',
            format: 'Powerpoint'
          },
          {
            formatType: 'Native',
            fees: '0',
            format: 'PDF'
          }
        ]
      }
    }

    expect(buildNativeFormat(json)).toEqual(['PDF', 'Powerpoint'])
  })

  test('removes "Not Provided" formats', () => {
    const json = {
      archiveAndDistributionInformation: {
        fileDistributionInformation: [
          {
            formatType: 'Native',
            fees: '0',
            format: 'Not provided'
          }
        ]
      }
    }

    expect(buildNativeFormat(json)).toEqual([])
  })

  test('only returns formats if the FormatType is defined', () => {
    const json = {
      archiveAndDistributionInformation: {
        fileDistributionInformation: [
          {
            fees: '0',
            format: 'PDF'
          }
        ]
      }
    }

    expect(buildNativeFormat(json)).toEqual([])
  })
})
