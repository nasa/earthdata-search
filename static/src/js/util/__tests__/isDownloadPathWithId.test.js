import { isDownloadPathWithId } from '../isDownloadPathWithId'

describe('isDownloadPathWithId', () => {
  describe('when passed a download path with a retrieval id', () => {
    test('returns true', () => {
      expect(isDownloadPathWithId('/downloads/1234')).toBeTruthy()
    })
  })

  describe('when no retrieval ID is provided', () => {
    test('returns false', () => {
      expect(isDownloadPathWithId('/downloads')).toEqual(false)
    })
  })

  describe('when the downloads path is not provided', () => {
    test('returns false', () => {
      expect(isDownloadPathWithId('/search')).toEqual(false)
    })
  })
})
