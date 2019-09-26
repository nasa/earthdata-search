import { loadedEchoFormXml } from './mocks'
import { getNameValuePairsForResample } from '../getNameValuePairsForResample'

describe('util#getNameValuePairsForResample', () => {
  test('correctly discovers the correct fields from the provided xml', () => {
    const projectPairs = getNameValuePairsForResample(loadedEchoFormXml)

    expect(projectPairs).toEqual({
      RESAMPLE: 'PERCENT:100'
    })
  })
})
