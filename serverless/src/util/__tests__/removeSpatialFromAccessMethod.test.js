import { removeSpatialFromAccessMethod } from '../removeSpatialFromAccessMethod'
import { accessMethod, accessMethodResetSpatial } from './mocks'

describe('util#removeSpatialFromAccessMethod', () => {
  test('removes the bounding box from the model and rawModel', () => {
    const result = removeSpatialFromAccessMethod(accessMethod)

    expect(result).toEqual(accessMethodResetSpatial)
  })

  test('does not remove the bounding box when it was not selected', () => {
    const result = removeSpatialFromAccessMethod(accessMethodResetSpatial)

    expect(result).toEqual(accessMethodResetSpatial)
  })

  test('does not remove spatial from non-ESI access methods', () => {
    const accessMethod = {
      type: 'download',
      isValid: true
    }

    const result = removeSpatialFromAccessMethod(accessMethod)

    expect(result).toEqual(accessMethod)
  })

  test('does not remove spatial when model and rawModel do not exist', () => {
    const accessMethod = {
      type: 'ESI'
    }

    const result = removeSpatialFromAccessMethod(accessMethod)

    expect(result).toEqual(accessMethod)
  })
})
