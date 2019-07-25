import { loadedEchoFormXml } from './mocks'
import { getNameValuePairsForProjections } from '../getNameValuePairsForProjections'

describe('util#getNameValuePairsForProjections', () => {
  test('correctly discovers the correct fields from the provided xml', () => {
    const projectPairs = getNameValuePairsForProjections(loadedEchoFormXml)

    expect(projectPairs).toEqual({
      PROJECTION_PARAMETERS: 'Sphere:45,FE:54'
    })
  })
})
