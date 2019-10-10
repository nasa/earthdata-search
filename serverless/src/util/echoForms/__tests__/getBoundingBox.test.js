import { echoFormXml } from './mocks'
import { getBoundingBox } from '../getBoundingBox'

describe('util#getBoundingBox', () => {
  test('correctly discovers the correct fields from the provided xml', () => {
    const boundingBox = getBoundingBox(echoFormXml)

    expect(boundingBox).toEqual({
      BBOX: '-180,-90,180,90'
    })
  })
})
