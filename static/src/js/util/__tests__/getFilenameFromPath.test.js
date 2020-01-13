import { getFilenameFromPath } from '../getFilenameFromPath'

describe('#getFilenameFromPath', () => {
  describe('when passed no path', () => {
    test('should return an empty string', () => {
      const result = getFilenameFromPath()
      expect(result).toEqual('')
    })
  })

  describe('when passed an empty string', () => {
    test('should return an empty string', () => {
      const result = getFilenameFromPath('')
      expect(result).toEqual('')
    })
  })

  describe('when passed an valid filepath', () => {
    test('should return the filepath', () => {
      const result = getFilenameFromPath('http://www.testing.com/this/file.txt')
      expect(result).toEqual('file.txt')
    })
  })
})
