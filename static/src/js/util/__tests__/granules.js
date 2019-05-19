import { createEcho10MetadataUrls } from '../granules'

describe('createEcho10MetadataUrls', () => {
  describe('when provided a granule id', () => {
    test('returns the an object of metadata urls', () => {
      const data = createEcho10MetadataUrls('G1613627299-LANCEMODIS')
      const expectedData = {
        atom: {
          href: 'https://cmr.earthdata.nasa.gov/search/concepts/G1613627299-LANCEMODIS.atom',
          title: 'ATOM'
        },
        echo10: {
          href: 'https://cmr.earthdata.nasa.gov/search/concepts/G1613627299-LANCEMODIS.echo10',
          title: 'ECHO 10'
        },
        iso19115: {
          href: 'https://cmr.earthdata.nasa.gov/search/concepts/G1613627299-LANCEMODIS.iso19115',
          title: 'ISO 19115'
        },
        native: {
          href: 'https://cmr.earthdata.nasa.gov/search/concepts/G1613627299-LANCEMODIS',
          title: 'Native'
        },
        umm_json: {
          href: 'https://cmr.earthdata.nasa.gov/search/concepts/G1613627299-LANCEMODIS.umm_json',
          title: 'UMM-G'
        }
      }

      expect(data).toEqual(expectedData)
    })
  })
})
