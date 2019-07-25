import { echoFormXml } from './mocks'
import { getSwitchFields } from '../getSwitchFields'

describe('util#getSwitchFields', () => {
  test('correctly discovers the correct fields from the provided xml', () => {
    const topLevelFields = getSwitchFields(echoFormXml)

    expect(topLevelFields).toEqual({
      INCLUDE_META: 'N'
    })
  })
})
