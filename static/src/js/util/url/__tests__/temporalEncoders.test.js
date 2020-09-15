import { encodeTemporal, decodeTemporal } from '../temporalEncoders'

describe('temporalEncoders', () => {
  describe('encodeTemporal', () => {
    test('returns undefined when no temporal is provided', () => {
      expect(encodeTemporal()).toEqual(undefined)
    })

    test('returns the correct value when only startDate is provided', () => {
      expect(encodeTemporal({
        startDate: '2002-07-04T00:00:00Z'
      })).toEqual('2002-07-04T00:00:00Z,')
    })

    test('returns the correct value when only endDate is provided', () => {
      expect(encodeTemporal({
        endDate: '2019-05-06T00:00:00Z'
      })).toEqual(',2019-05-06T00:00:00Z')
    })

    test('returns the correct value when both startDate and endDate is provided', () => {
      expect(encodeTemporal({
        startDate: '2002-07-04T00:00:00Z',
        endDate: '2019-05-06T00:00:00Z'
      })).toEqual('2002-07-04T00:00:00Z,2019-05-06T00:00:00Z')
    })

    test('returns the correct value when values are recurring', () => {
      expect(encodeTemporal({
        startDate: '2002-07-04T00:00:00Z',
        endDate: '2019-05-06T00:00:00Z',
        recurringDayStart: '31',
        recurringDayEnd: '58',
        isRecurring: true
      })).toEqual('2002-07-04T00:00:00Z,2019-05-06T00:00:00Z,31,58')
    })
  })

  describe('decodeTemporal', () => {
    test('returns an empty object when no temporal is provided', () => {
      expect(decodeTemporal()).toEqual({})
    })

    test('returns an object containing a startDate when only a startDate is provided', () => {
      expect(decodeTemporal('2002-07-04T00:00:00Z,')).toEqual({
        startDate: '2002-07-04T00:00:00Z',
        endDate: '',
        recurringDayStart: '',
        recurringDayEnd: '',
        isRecurring: false
      })
    })

    test('returns an object containing a endDate when only a endDate is provided', () => {
      expect(decodeTemporal(',2019-05-06T00:00:00Z')).toEqual({
        startDate: '',
        endDate: '2019-05-06T00:00:00Z',
        recurringDayStart: '',
        recurringDayEnd: '',
        isRecurring: false
      })
    })

    test('returns an object containing both startDate and endDate when both are provided', () => {
      expect(decodeTemporal('2002-07-04T00:00:00Z,2019-05-06T00:00:00Z,31,58')).toEqual({
        startDate: '2002-07-04T00:00:00Z',
        endDate: '2019-05-06T00:00:00Z',
        recurringDayStart: '31',
        recurringDayEnd: '58',
        isRecurring: true
      })
    })
  })
})
