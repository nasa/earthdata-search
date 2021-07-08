import { isDownloadable } from '../isDownloadable'

describe('isDownloadable', () => {
  describe('when an emptry array is provided', () => {
    test('returns false', () => {
      const downloadable = isDownloadable([])

      expect(downloadable).toBeFalsy()
    })
  })

  describe('when the keys are snake cased', () => {
    describe('when no granules are accessible online', () => {
      test('returns false', () => {
        const downloadable = isDownloadable([{
          online_access_flag: false
        }, {
          online_access_flag: false
        }])

        expect(downloadable).toBeFalsy()
      })
    })

    describe('when some granules are accessible online', () => {
      test('returns false', () => {
        const downloadable = isDownloadable([{
          online_access_flag: false
        }, {
          online_access_flag: true
        }])

        expect(downloadable).toBeTruthy()
      })
    })
  })

  describe('when the keys are camel cased', () => {
    describe('when no granules are accessible online', () => {
      test('returns false', () => {
        const downloadable = isDownloadable([{
          onlineAccessFlag: false
        }, {
          onlineAccessFlag: false
        }])

        expect(downloadable).toBeFalsy()
      })
    })

    describe('when some granules are accessible online', () => {
      test('returns false', () => {
        const downloadable = isDownloadable([{
          onlineAccessFlag: false
        }, {
          onlineAccessFlag: true
        }])

        expect(downloadable).toBeTruthy()
      })
    })
  })
})
