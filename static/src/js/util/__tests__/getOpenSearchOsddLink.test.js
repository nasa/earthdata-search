const { getOpenSearchOsddLink } = require('../getOpenSearchLink')

describe('getOpenSearchOsddLink', () => {
  test('returns false if no links exist', () => {
    expect(getOpenSearchOsddLink()).toBeFalsy()
  })

  test('returns false if no link exists', () => {
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

    expect(getOpenSearchOsddLink(links)).toBeFalsy()
  })

  test('returns the OSDD link', () => {
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

    expect(getOpenSearchOsddLink(links)).toEqual('https://fedeo.esa.int/opensearch/description.xml?parentIdentifier=EOP:ESA:EARTH-ONLINE:CryoSat.products')
  })
})
