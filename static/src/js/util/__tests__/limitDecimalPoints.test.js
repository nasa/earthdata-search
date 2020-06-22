import { limitDecimalPoints, limitLatLngDecimalPoints } from '../limitDecimalPoints'

describe('limitDecimalPoints', () => {
  test('limits points to 5 decimal places', () => {
    const latLng = ['12.123456789', '34.123456789']
    const expectedResult = [12.12346, 34.12346]

    expect(limitDecimalPoints(latLng)).toEqual(expectedResult)
  })
})

describe('limitLatLngDecimalPoints', () => {
  test('limits array of points to 5 decimal places', () => {
    const latLngs = ['12.123456789,34.123456789', '56.123456789,78.123456789']
    const expectedResult = ['12.12346,34.12346', '56.12346,78.12346']

    expect(limitLatLngDecimalPoints(latLngs)).toEqual(expectedResult)
  })
})
