import moment from 'moment'

import { formatDate } from '../formatDate'

describe('formatDate', () => {
  describe('when input is a valid datetime and is not the start or end of the day', () => {
    test('returns the datetime with no changes when format is YYYY-MM-DD HH:mm:ss', () => {
      const dateString = '2019-06-13 13:02:01'

      expect(formatDate(dateString, 'start').format('YYYY-MM-DD HH:mm:ss')).toBe('2019-06-13 13:02:01')
      expect(formatDate(dateString, 'end').format('YYYY-MM-DD HH:mm:ss')).toBe('2019-06-13 13:02:01')
    })

    test('returns the datetime with no changes when format is YYYY-MM-DDTHH:mm:ss.SSSZ', () => {
      const dateString = '2019-06-13T13:02:01.213Z'

      expect(formatDate(dateString, 'start').format('YYYY-MM-DD HH:mm:ss')).toBe('2019-06-13 13:02:01')
      expect(formatDate(dateString, 'end').format('YYYY-MM-DD HH:mm:ss')).toBe('2019-06-13 13:02:01')
    })
  })

  describe('when input is an invalid datetime', () => {
    test('returns it as an invalid moment', () => {
      const dateString = '2019-06-1 13:02:01'

      const formattedDate = formatDate(dateString, 'start')

      expect(moment.isMoment(formattedDate)).toBeTruthy()
      expect(formattedDate.isValid()).toBeFalsy()
    })
  })

  describe('when the input is in YYYY format and timeOfDay is start', () => {
    test('returns first day of the year with 00:00:00 as the time', () => {
      const dateString = '2019'

      expect(formatDate(dateString, 'start').format('YYYY-MM-DD HH:mm:ss')).toBe('2019-01-01 00:00:00')
    })
  })

  describe('when the input is in YYYY format and timeOfDay is end', () => {
    test('returns last day of the year with 23:59:59 as the time', () => {
      const dateString = '2019'

      expect(formatDate(dateString, 'end').format('YYYY-MM-DD HH:mm:ss')).toBe('2019-12-31 23:59:59')
    })
  })

  describe('when the input is in YYYY-MM format and start is the timeOfDay', () => {
    test('returns 2019-07-01 00:00:00 as start of day datetime', () => {
      const dateString = '2019-07'

      expect(formatDate(dateString, 'start').format('YYYY-MM-DD HH:mm:ss')).toBe('2019-07-01 00:00:00')
    })

    describe('when the input is in YYYY-MM format and end is the timeOfDay', () => {
      test('returns last day of month when datetime is end', () => {
        const dateString = '2019-07'

        expect(formatDate(dateString, 'end').format('YYYY-MM-DD HH:mm:ss')).toBe('2019-07-31 23:59:59')
      })
    })

    describe('when the input is in YYYY-MM-DD format and start is the timeOfDay', () => {
      test('returns 2019-07-01 00:00:00 as start of day datetime', () => {
        const dateString = '2019-07-26'

        expect(formatDate(dateString, 'start').format('YYYY-MM-DD HH:mm:ss')).toBe('2019-07-26 00:00:00')
      })
    })

    describe('when the input is in YYYY-MM-DD format and end is the timeOfDay', () => {
      test('returns the end of the day', () => {
        const dateString = '2019-07-26'

        expect(formatDate(dateString, 'end').format('YYYY-MM-DD HH:mm:ss')).toBe('2019-07-26 23:59:59')
      })
    })
  })
})
