const { mbr } = require('../mbr')

describe('mbr', () => {
  test('returns the mbr for point spatial', () => {
    const point = '-77, 34'

    const result = {
      swLat: 33.99999999,
      swLng: -77.00000001,
      neLat: 34.00000001,
      neLng: -76.99999999
    }

    expect(mbr({ point })).toEqual(result)
  })

  test('returns the mbr for circle spatial', () => {
    const circle = '-77, 34, 20000'

    const result = {
      swLat: 33.8203369445857,
      swLng: -77.21671280212378,
      neLat: 34.1796630554143,
      neLng: -76.78328719787622
    }

    expect(mbr({ circle })).toEqual(result)
  })

  test('returns the mbr for boundingBox spatial', () => {
    const boundingBox = '0,5,10,15'

    const result = {
      swLat: 5,
      swLng: 0,
      neLat: 15,
      neLng: 10
    }

    expect(mbr({ boundingBox })).toEqual(result)
  })

  test('returns the mbr for polygon spatial', () => {
    const polygon = '-29.8125,39.86484,-23.0625,-19.74405,15.75,20.745,-29.8125,39.86484'

    const result = {
      swLat: -19.744049999999977,
      swLng: -29.81249999999999,
      neLat: 39.864840000000015,
      neLng: 15.749999999999988
    }

    expect(mbr({ polygon })).toEqual(result)
  })
})
