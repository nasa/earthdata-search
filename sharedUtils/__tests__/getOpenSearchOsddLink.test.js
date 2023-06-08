import { getOpenSearchOsddLink } from '../getOpenSearchOsddLink'

describe('getOpenSearchOsddLink', () => {
  test('returns undefined if no links exist', () => {
    expect(getOpenSearchOsddLink({})).toBe(undefined)
  })

  test('returns undefined if no link exists', () => {
    const links = [
      {
        length: '0.0KB',
        rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
        hreflang: 'en-US',
        href: 'https://esatellus.service-now.com/csp?id=esa_simple_request'
      },
      {
        length: '0.0KB',
        rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
        hreflang: 'en-US',
        href: 'https://eoportal.org/web/eoportal/fedeo?parentIdentifier=EOP:ESA:EARTH-ONLINE&uid=CryoSat.products'
      },
      {
        length: '0.0KB',
        rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
        hreflang: 'en-US',
        href: 'https://fedeo.esa.int/opensearch/request/?httpAccept=application/vnd.iso.19139-2%2Bxml&parentIdentifier=EOP:ESA:EARTH-ONLINE&uid=CryoSat.products&recordSchema=iso19139-2'
      }
    ]

    expect(getOpenSearchOsddLink(links)).toBe(undefined)
  })

  test('returns the OSDD link from the links', () => {
    const links = [
      {
        length: '0.0KB',
        rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
        hreflang: 'en-US',
        href: 'https://esatellus.service-now.com/csp?id=esa_simple_request'
      },
      {
        length: '0.0KB',
        rel: 'http://esipfed.org/ns/fedsearch/1.1/search#',
        hreflang: 'en-US',
        href: 'https://fedeo.esa.int/opensearch/description.xml?parentIdentifier=EOP:ESA:EARTH-ONLINE:CryoSat.products'
      },
      {
        length: '0.0KB',
        rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
        hreflang: 'en-US',
        href: 'https://eoportal.org/web/eoportal/fedeo?parentIdentifier=EOP:ESA:EARTH-ONLINE&uid=CryoSat.products'
      },
      {
        length: '0.0KB',
        rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
        hreflang: 'en-US',
        href: 'https://fedeo.esa.int/opensearch/request/?httpAccept=application/vnd.iso.19139-2%2Bxml&parentIdentifier=EOP:ESA:EARTH-ONLINE&uid=CryoSat.products&recordSchema=iso19139-2'
      }
    ]

    expect(getOpenSearchOsddLink({ links })).toEqual('https://fedeo.esa.int/opensearch/description.xml?parentIdentifier=EOP:ESA:EARTH-ONLINE:CryoSat.products')
  })

  test('returns the OSDD link from the relatedUrls with urlContentType', () => {
    const relatedUrls = [
      {
        description: 'tag_key: opensearch.granule.osdd',
        urlContentType: 'DistributionURL',
        type: 'GET CAPABILITIES',
        subtype: 'OpenSearch',
        url: 'https://fedeo.ceos.org/opensearch/description.xml?parentIdentifier=urn:ogc:def:EOP:VITO:VGT_S10',
        getData: {
          format: 'Not provided',
          mimeType: 'application/opensearchdescription+xml',
          size: 0,
          unit: 'KB'
        }
      },
      {
        description: 'DescribedBy',
        urlContentType: 'DistributionURL',
        type: 'GET DATA',
        url: 'https://fedeo-client.ceos.org?parentIdentifier=EOP:VITO:TERRASCOPE&uid=urn:ogc:def:EOP:VITO:VGT_S10',
        getData: {
          format: 'Not provided',
          mimeType: 'text/html',
          size: 0,
          unit: 'KB'
        }
      },
      {
        description: 'DescribedBy',
        urlContentType: 'DistributionURL',
        type: 'GET DATA',
        url: 'https://fedeo.ceos.org/opensearch/request/?httpAccept=application/vnd.iso.19139-2%2Bxml&parentIdentifier=EOP:VITO:TERRASCOPE&uid=urn:ogc:def:EOP:VITO:VGT_S10&recordSchema=iso19139-2',
        getData: {
          format: 'Not provided',
          mimeType: 'application/x-vnd.iso.19139-2+xml',
          size: 0,
          unit: 'KB'
        }
      }
    ]

    expect(getOpenSearchOsddLink({ relatedUrls })).toEqual('https://fedeo.ceos.org/opensearch/description.xml?parentIdentifier=urn:ogc:def:EOP:VITO:VGT_S10')
  })

  test('returns the OSDD link from the relatedUrls with contentType', () => {
    const relatedUrls = [
      {
        contentType: 'CollectionURL',
        label: 'Collection URL',
        urls: []
      },
      {
        contentType: 'DistributionURL',
        label: 'Distribution URL',
        urls: [
          {
            description: 'tag_key: opensearch.granule.osdd',
            urlContentType: 'DistributionURL',
            type: 'GET CAPABILITIES',
            subtype: 'OpenSearch',
            url: 'https://fedeo.ceos.org/opensearch/description.xml?parentIdentifier=urn:ogc:def:EOP:VITO:VGT_S10',
            getData: {
              format: 'Not provided',
              mimeType: 'application/opensearchdescription+xml',
              size: 0,
              unit: 'KB'
            }
          },
          {
            description: 'DescribedBy',
            urlContentType: 'DistributionURL',
            type: 'GET DATA',
            url: 'https://fedeo-client.ceos.org?parentIdentifier=EOP:VITO:TERRASCOPE&uid=urn:ogc:def:EOP:VITO:VGT_S10',
            getData: {
              format: 'Not provided',
              mimeType: 'text/html',
              size: 0,
              unit: 'KB'
            },
            subtype: ''
          },
          {
            description: 'DescribedBy',
            urlContentType: 'DistributionURL',
            type: 'GET DATA',
            url: 'https://fedeo.ceos.org/opensearch/request/?httpAccept=application/vnd.iso.19139-2%2Bxml&parentIdentifier=EOP:VITO:TERRASCOPE&uid=urn:ogc:def:EOP:VITO:VGT_S10&recordSchema=iso19139-2',
            getData: {
              format: 'Not provided',
              mimeType: 'application/x-vnd.iso.19139-2+xml',
              size: 0,
              unit: 'KB'
            },
            subtype: ''
          }
        ]
      },
      {
        contentType: 'PublicationURL',
        label: 'Publication URL',
        urls: []
      },
      {
        contentType: 'VisualizationURL',
        label: 'Visualization URL',
        urls: []
      },
      {
        contentType: 'HighlightedURL',
        label: 'Highlighted URL',
        urls: []
      }
    ]

    expect(getOpenSearchOsddLink({ relatedUrls })).toEqual('https://fedeo.ceos.org/opensearch/description.xml?parentIdentifier=urn:ogc:def:EOP:VITO:VGT_S10')
  })

  test('returns the OSDD link from the tags', () => {
    const tags = {
      'opensearch.granule.osdd': {
        data: 'https://fedeo.esa.int/opensearch/description.xml?parentIdentifier=EOP:ESA:EARTH-ONLINE:CryoSat.products'
      }
    }

    expect(getOpenSearchOsddLink({ tags })).toEqual('https://fedeo.esa.int/opensearch/description.xml?parentIdentifier=EOP:ESA:EARTH-ONLINE:CryoSat.products')
  })
})
