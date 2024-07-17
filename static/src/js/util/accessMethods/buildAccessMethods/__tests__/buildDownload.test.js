import { buildDownload } from '../buildDownload'

describe('buildDownload', () => {
  test('returns a download access method', () => {
    const collectionMetadata = {
      granules: {
        items: [{
          online_access_flag: true
        }]
      }
    }
    const isOpenSearch = false

    const {
      granules
    } = collectionMetadata

    const method = buildDownload(granules, isOpenSearch)

    expect(method).toEqual({
      download: {
        isValid: true,
        type: 'download'
      }
    })
  })

  test('returns a download access method for open search', () => {
    const collectionMetadata = {}
    const isOpenSearch = true

    const {
      granules = {}
    } = collectionMetadata

    const method = buildDownload(granules, isOpenSearch)

    expect(method).toEqual({
      download: {
        isValid: true,
        type: 'download'
      }
    })
  })
})
