import projections from '../../map/projections'

import { decodeDeprecatedMapParam } from '../deprecatedEncoders'

import * as deployedEnvironment from '../../../../../../sharedUtils/deployedEnvironment'

beforeEach(() => {
  jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
})

describe('url#decodeUrlParams', () => {
  test('decodes map correctly', () => {
    const expectedResult = {
      base: {
        blueMarble: false,
        trueColor: true,
        landWaterMap: false
      },
      latitude: 0,
      longitude: 0,
      overlays: {
        referenceFeatures: true,
        coastlines: false,
        referenceLabels: true
      },
      projection: projections.arctic,
      zoom: 2
    }
    expect(decodeDeprecatedMapParam('0!0!2!0!1!0,2')).toEqual(expectedResult)
  })
})
