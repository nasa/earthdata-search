import { buildDirectDistributionInformation } from '../buildDirectDistributionInformation'

describe('buildDirectDistributionInformation', () => {
  test('returns DirectDistributionInformation', () => {
    const json = {
      directDistributionInformation: {
        mock: 'data'
      }
    }

    expect(buildDirectDistributionInformation(json)).toEqual({
      mock: 'data'
    })
  })

  test('returns an empty object if DirectDistributionInformation does not exist', () => {
    expect(buildDirectDistributionInformation({})).toEqual({})
  })
})
