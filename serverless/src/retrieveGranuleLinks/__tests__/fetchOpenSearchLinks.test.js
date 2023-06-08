import nock from 'nock'

import { fetchOpenSearchLinks } from '../fetchOpenSearchLinks'

import { osdd } from './mocks'

describe('fetchOpenSearchLinks', () => {
  test('returns a list of links from CMR', async () => {
    nock(/example/)
      .get(/osdd/)
      .reply(200, osdd)

    nock(/fedeo/)
      .get(/opensearch/)
      .reply(200, `
        <feed>
          <opensearch:totalResults>5</opensearch:totalResults>
          <entry>
            <link href="https://example.com/granule1.zip" rel="enclosure" />
            <link href="https://example.com" rel="alternate" />
            <link href="https://example.com/browse1.png" rel="browse" />
          </entry>
          <entry>
            <link href="https://example.com/granule2.zip" rel="enclosure" />
            <link href="https://example.com" rel="alternate" />
            <link href="https://example.com/browse2.png" rel="browse" />
          </entry>
          <entry>
            <link href="https://example.com/granule3.zip" rel="enclosure" />
            <link href="https://example.com" rel="alternate" />
            <link href="https://example.com/browse3.png" rel="browse" />
          </entry>
        </feed>
      `)

    const result = await fetchOpenSearchLinks({
      collectionId: 'C10000005-EDSC',
      collectionMetadata: {
        links: [
          {
            href: 'http://example.com/mock-osdd',
            rel: 'http://example.com/search#'
          }
        ]
      },
      granuleParams: {
        concept_id: [],
        echo_collection_id: 'C10000005-EDSC',
        exclude: {},
        options: {},
        page_num: 1,
        page_size: 20,
        temporal: '2023-03-26T15:05:48.871Z,2023-03-27T10:48:39.230Z',
        two_d_coordinate_system: {}
      },
      pageNum: 1
    })

    expect(result).toEqual({
      links: {
        browse: [
          'https://example.com/browse1.png',
          'https://example.com/browse2.png',
          'https://example.com/browse3.png'
        ],
        download: [
          'https://example.com/granule1.zip',
          'https://example.com/granule2.zip',
          'https://example.com/granule3.zip'
        ]
      }
    })
  })
})
