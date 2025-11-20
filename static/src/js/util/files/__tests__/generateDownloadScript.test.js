import { generateDownloadScript } from '../generateDownloadScript'

import * as getEarthdataConfig from '../../../../../../sharedUtils/config'

describe('generateDownloadScript', () => {
  beforeEach(() => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
      edlHost: 'http://edl.example.com',
      csdaHost: 'http://csda.example.com'
    }))
  })

  describe('when no collection metadata is present', () => {
    test('authentication URL is edl', () => {
      const script = generateDownloadScript({
        earthdataEnvironment: 'prod',
        granuleLinks: [
          'https://granule-link-one.hdf',
          'https://granule-link-two.hdf'
        ],
        retrievalCollection: {
          collectionMetadata: {}
        },
        username: 'test-user'
      })

      expect(script).toContain('Username (test-user):')
      expect(script).toContain('username:-test-user')

      expect(script).toContain('edl.example.com')

      expect(script).toContain('granule-link-one.hdf')
      expect(script).toContain('granule-link-two.hdf')
    })
  })

  describe('when collection metadata does not indicate CSDA at all', () => {
    test('authentication URL is edl', () => {
      const script = generateDownloadScript({
        earthdataEnvironment: 'prod',
        granuleLinks: [
          'https://granule-link-one.hdf',
          'https://granule-link-two.hdf'
        ],
        retrievalCollection: {
          collectionMetadata: {}
        },
        username: 'test-user'
      })

      expect(script).toContain('Username (test-user):')
      expect(script).toContain('username:-test-user')

      expect(script).toContain('edl.example.com')

      expect(script).toContain('granule-link-one.hdf')
      expect(script).toContain('granule-link-two.hdf')
    })
  })

  describe('when collection is not CSDA', () => {
    test('authentication URL is edl', () => {
      const script = generateDownloadScript({
        earthdataEnvironment: 'prod',
        granuleLinks: [
          'https://granule-link-one.hdf',
          'https://granule-link-two.hdf'
        ],
        retrievalCollection: {
          collectionMetadata: {
            isCSDA: false
          }
        },
        username: 'test-user'
      })

      expect(script).toContain('Username (test-user):')
      expect(script).toContain('username:-test-user')

      expect(script).toContain('edl.example.com')

      expect(script).toContain('granule-link-one.hdf')
      expect(script).toContain('granule-link-two.hdf')
    })
  })

  describe('when collection is CSDA', () => {
    test('authentication URL is csda', () => {
      const script = generateDownloadScript({
        earthdataEnvironment: 'prod',
        granuleLinks: [
          'https://granule-link-one.hdf',
          'https://granule-link-two.hdf'
        ],
        retrievalCollection: {
          collectionMetadata: {
            isCSDA: true
          }
        },
        username: 'test-user'
      })

      expect(script).toContain('Username (test-user):')
      expect(script).toContain('username:-test-user')

      expect(script).toContain('csda.example.com')

      expect(script).toContain('granule-link-one.hdf')
      expect(script).toContain('granule-link-two.hdf')
    })
  })
})
