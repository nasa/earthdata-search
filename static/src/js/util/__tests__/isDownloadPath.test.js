import { isDownloadPath } from '../isDownloadPath'

describe('isDownloadPath', () => {
  describe('when passed a download path with a retrieval id', () => {
    test('returns true', () => {
      expect(isDownloadPath('/downloads/1234')).toBeTruthy()
    })
  })

  describe('when no retrieval ID is provided', () => {
    test('returns false', () => {
      expect(isDownloadPath('/downloads')).toEqual(false)
    })
  })

  describe('when the downloads path is not provided', () => {
    test('returns false', () => {
      expect(isDownloadPath('/search')).toEqual(false)
    })
  })
})
