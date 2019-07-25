import { echoFormXml } from './mocks'
import { getTopLevelFields } from '../getTopLevelFields'

describe('util#getTopLevelFields', () => {
  test('correctly discovers the correct fields from the provided xml', () => {
    const topLevelFields = getTopLevelFields(echoFormXml)

    expect(topLevelFields).toEqual({
      CLIENT: 'ESI',
      FORMAT: 'VRT',
      INCLUDE_META: 'false',
      REQUEST_MODE: 'async',
      SUBAGENT_ID: 'GDAL'
    })
  })
})
