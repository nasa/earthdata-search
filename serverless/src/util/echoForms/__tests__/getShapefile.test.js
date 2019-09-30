import {
  echoFormXml,
  echoFormXmlWithShapefile,
  echoFormXmlWithShapefileFalse
} from './mocks'
import { getShapefile } from '../getShapefile'

describe('util#getShapefile', () => {
  test('correctly sets the shapefileParam', () => {
    const file = { mock: 'shapefile' }
    const shapefileParam = getShapefile(echoFormXmlWithShapefile, file)

    expect(shapefileParam).toEqual({
      BoundingShape: '{"mock":"shapefile"}'
    })
  })

  test('correctly sets the shapefileParam when shapefile is not selected in the form', () => {
    const file = 'mock shapefile'
    const shapefileParam = getShapefile(echoFormXmlWithShapefileFalse, file)

    expect(shapefileParam).toBeNull()
  })

  test('correctly sets the shapefileParam when a shapefile is not provided', () => {
    const shapefileParam = getShapefile(echoFormXmlWithShapefile, undefined)

    expect(shapefileParam).toBeNull()
  })

  test('correctly sets the shapefileParam when the form does not support shapefiles', () => {
    const file = 'mock shapefile'
    const shapefileParam = getShapefile(echoFormXml, file)

    expect(shapefileParam).toBeNull()
  })
})
