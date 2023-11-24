import nock from 'nock'

import * as getEarthdataConfig from '../../../../../../sharedUtils/config'
import { getImageUrlFromConcept } from '../getImageUrlFromConcept'

const invalidLinkArray = [{
  rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
  hreflang: 'en-US',
  href: 'https://daac.ornl.gov/daacdata/fife/'
}, {
  rel: 'http://esipfed.org/ns/fedsearch/1.1/documentation#',
  hreflang: 'en-US',
  href: 'https://daac.ornl.gov/FIFE/guides/15_min_strm_flow.html'
}]

const validLinkArray = [{
  rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
  hreflang: 'en-US',
  href: 'https://daac.ornl.gov/daacdata/fife/'
}, {
  rel: 'http://esipfed.org/ns/fedsearch/1.1/documentation#',
  hreflang: 'en-US',
  href: 'https://daac.ornl.gov/FIFE/guides/15_min_strm_flow.html'
}, {
  rel: 'http://esipfed.org/ns/fedsearch/1.1/metadata#',
  hreflang: 'en-US',
  href: 'https://doi.org/10.3334/ORNLDAAC/1'
}, {
  rel: 'http://esipfed.org/ns/fedsearch/1.1/documentation#',
  hreflang: 'en-US',
  href: 'https://daac.ornl.gov/daacdata/fife/document/hydrolgy/15_min_strm_flow.pdf'
}, {
  rel: 'http://esipfed.org/ns/fedsearch/1.1/documentation#',
  hreflang: 'en-US',
  href: 'https://daac.ornl.gov/daacdata/fife/document/hydrolgy/strm_15m.doc'
}, {
  rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#',
  hreflang: 'en-US',
  href: 'https://daac.ornl.gov/graphics/browse/project/square/fife_logo_square.png'
}]

describe('getImageUrlFromConcept', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    delete process.env.NODE_ENV

    process.env.cmrRootUrl = 'http://example.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({
    cmrHost: 'http://example.com'
  }))

  describe('granules', () => {
    test('when a valid link is found', async () => {
      nock(/example/)
        .get(/search\/concepts/)
        .reply(200, {
          id: 'G100000-EDSC',
          links: validLinkArray
        })

      const imageUrl = await getImageUrlFromConcept('G100000-EDSC', 'granules')

      expect(imageUrl).toEqual('https://daac.ornl.gov/graphics/browse/project/square/fife_logo_square.png')
    })

    test('when no valid link is found', async () => {
      nock(/example/)
        .get(/search\/concepts/)
        .reply(200, {
          id: 'G100000-EDSC',
          links: invalidLinkArray
        })

      const imageUrl = await getImageUrlFromConcept('G100000-EDSC', 'granules')

      expect(imageUrl).toEqual(null)
    })

    describe('if the imageSrc has been provided in the request', () => {
      test('Pass that `imageSrc` instead', async () => {
        const imageSrc = 'https://example-image-src.com'
        const imageUrl = await getImageUrlFromConcept('G100000-EDSC', 'granules', false, imageSrc)
        expect(imageUrl).toEqual(imageSrc)
      })
    })
  })

  describe('collections', () => {
    describe('with cascade_concepts is false', () => {
      test('when a valid link is found', async () => {
        nock(/example/)
          .get(/search\/concepts/)
          .reply(200, {
            id: 'C100000-EDSC',
            links: validLinkArray
          })

        const imageUrl = await getImageUrlFromConcept('C100000-EDSC', 'collections')

        expect(imageUrl).toEqual('https://daac.ornl.gov/graphics/browse/project/square/fife_logo_square.png')
      })

      test('when no valid link is found', async () => {
        nock(/example/)
          .get(/search\/concepts/)
          .reply(200, {
            id: 'C100000-EDSC',
            links: invalidLinkArray
          })

        const imageUrl = await getImageUrlFromConcept('C100000-EDSC', 'collection')

        expect(imageUrl).toEqual(null)
      })
    })

    describe('with cascade_concepts is true', () => {
      test('when a valid link is found within granule metadata', async () => {
        nock(/example/)
          .get(/search\/concepts/)
          .reply(200, {
            id: 'C100000-EDSC',
            links: invalidLinkArray
          })

        nock(/example/)
          .get(/search\/granules/)
          .reply(200, {
            feed: {
              entry: [
                {
                  id: 'G100000-EDSC',
                  links: invalidLinkArray
                }, {
                  id: 'G200000-EDSC',
                  links: invalidLinkArray
                }, {
                  id: 'G300000-EDSC',
                  links: validLinkArray
                }
              ]
            }
          })

        const imageUrl = await getImageUrlFromConcept('C100000-EDSC', 'collections', 'true')

        expect(imageUrl).toEqual('https://daac.ornl.gov/graphics/browse/project/square/fife_logo_square.png')
      })

      test('when no valid link is found within granule metadata', async () => {
        nock(/example/)
          .get(/search\/concepts/)
          .reply(200, {
            id: 'C100000-EDSC',
            links: invalidLinkArray
          })

        nock(/example/)
          .get(/search\/granules/)
          .reply(200, {
            feed: {
              entry: [
                {
                  id: 'G100000-EDSC',
                  links: invalidLinkArray
                }, {
                  id: 'G200000-EDSC',
                  links: invalidLinkArray
                }, {
                  id: 'G300000-EDSC',
                  links: invalidLinkArray
                }
              ]
            }
          })

        const imageUrl = await getImageUrlFromConcept('C100000-EDSC', 'collections', 'true')

        expect(imageUrl).toEqual(null)
      })
    })
  })
})
