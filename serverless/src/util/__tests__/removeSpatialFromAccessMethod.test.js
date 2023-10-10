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
    const value = {
      type: 'download',
      isValid: true
    }

    const result = removeSpatialFromAccessMethod(value)

    expect(result).toEqual(value)
  })

  test('does not remove spatial when model and rawModel do not exist', () => {
    const value = {
      type: 'ESI'
    }

    const result = removeSpatialFromAccessMethod(value)

    expect(result).toEqual(value)
  })
})
