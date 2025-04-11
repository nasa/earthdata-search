import projectionCodes from '../../../constants/projectionCodes'

import { decodeDeprecatedMapParam } from '../deprecatedEncoders'

import * as deployedEnvironment from '../../../../../../sharedUtils/deployedEnvironment'

beforeEach(() => {
  jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
})

describe('url#decodeUrlParams', () => {
  test('decodes map correctly', () => {
    const expectedResult = {
      base: {
        worldImagery: false,
        trueColor: true,
        landWaterMap: false
      },
      latitude: 0,
      longitude: 0,
      overlays: {
        bordersRoads: true,
        coastlines: false,
        placeLabels: true
      },
      projection: projectionCodes.arctic,
      zoom: 2
    }
    expect(decodeDeprecatedMapParam('0!0!2!0!1!0,2')).toEqual(expectedResult)
  })
})
