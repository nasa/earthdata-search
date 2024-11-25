import { isLinkBrowse } from '../isLinkBrowse'

describe('isLinkBrowse', () => {
  describe('when the link is not a browse link', () => {
    test('returns false', () => {
      const link = {
        rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
        href: 'https://example.com/data'
      }

      const response = isLinkBrowse(link)

      expect(response).toBeFalsy()
    })
  })

  describe('when the link is an s3 browse link', () => {
    test('returns false', () => {
      const link = {
        rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#',
        href: 's3://bucket/key'
      }

      const response = isLinkBrowse(link)

      expect(response).toBeFalsy()
    })
  })

  describe('when the link is a https browse link', () => {
    test('returns true', () => {
      const link = {
        rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#',
        href: 'https://example.com/browse.jpg'
      }

      const response = isLinkBrowse(link)

      expect(response).toBeTruthy()
    })
  })
})
