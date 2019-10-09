import { fetchGiovanniHandoffUrl } from '../giovanni'

describe('handoffs#giovanni', () => {
  test('returns the default root and collection shortname when no subsetting is provided', () => {
    const collectionMetadata = {
      short_name: 'earthdata_search',
      tags: {
        'edsc.extra.handoff.giovanni': {}
      }
    }

    const response = fetchGiovanniHandoffUrl(collectionMetadata)

    expect(response).toEqual({
      title: 'Giovanni',
      href: 'https://giovanni.gsfc.nasa.gov/giovanni/#service=TmAvMp&dataKeyword=earthdata_search'
    })
  })

  test('returns the default root and collection shortname when no subsetting is active', () => {
    const collectionMetadata = {
      short_name: 'earthdata_search',
      tags: {
        'edsc.extra.handoff.giovanni': {}
      }
    }

    const collectionSearch = {}

    const response = fetchGiovanniHandoffUrl(collectionMetadata, collectionSearch)

    expect(response).toEqual({
      title: 'Giovanni',
      href: 'https://giovanni.gsfc.nasa.gov/giovanni/#service=TmAvMp&dataKeyword=earthdata_search'
    })
  })

  test('does not append temporal values when only start date is provided', () => {
    const collectionMetadata = {
      short_name: 'earthdata_search',
      tags: {
        'edsc.extra.handoff.giovanni': {}
      }
    }

    const collectionSearch = {
      temporal: {
        startDate: '1984-07-02 05:23:00'
      }
    }

    const response = fetchGiovanniHandoffUrl(collectionMetadata, collectionSearch)

    expect(response).toEqual({
      title: 'Giovanni',
      href: 'https://giovanni.gsfc.nasa.gov/giovanni/#service=TmAvMp&dataKeyword=earthdata_search'
    })
  })

  test('does not append temporal values when only end date is provided', () => {
    const collectionMetadata = {
      short_name: 'earthdata_search',
      tags: {
        'edsc.extra.handoff.giovanni': {}
      }
    }

    const collectionSearch = {
      temporal: {
        endDate: '1984-07-02 05:23:00'
      }
    }

    const response = fetchGiovanniHandoffUrl(collectionMetadata, collectionSearch)

    expect(response).toEqual({
      title: 'Giovanni',
      href: 'https://giovanni.gsfc.nasa.gov/giovanni/#service=TmAvMp&dataKeyword=earthdata_search'
    })
  })

  test('appends temporal values when start and end date are provided', () => {
    const collectionMetadata = {
      short_name: 'earthdata_search',
      tags: {
        'edsc.extra.handoff.giovanni': {}
      }
    }

    const collectionSearch = {
      temporal: {
        startDate: '1984-07-02 05:23:00',
        endDate: '1984-07-02 10:43:00'
      }
    }

    const response = fetchGiovanniHandoffUrl(collectionMetadata, collectionSearch)

    expect(response).toEqual({
      title: 'Giovanni',
      href: 'https://giovanni.gsfc.nasa.gov/giovanni/#service=TmAvMp&dataKeyword=earthdata_search&starttime=1984-07-02T05%3A23%3A00.000Z&endtime=1984-07-02T10%3A43%3A00.000Z'
    })
  })

  test('appends spatial values when a bounding box is provided', () => {
    const collectionMetadata = {
      short_name: 'earthdata_search',
      tags: {
        'edsc.extra.handoff.giovanni': {}
      }
    }

    const collectionSearch = {
      spatial: {
        boundingBox: '-90.32766723632812,41.63677044970652,-82.2337646484375,48.34205200181264'
      }
    }

    const response = fetchGiovanniHandoffUrl(collectionMetadata, collectionSearch)

    expect(response).toEqual({
      title: 'Giovanni',
      href: 'https://giovanni.gsfc.nasa.gov/giovanni/#service=TmAvMp&dataKeyword=earthdata_search&bbox=-90.32766723632812%2C41.63677044970652%2C-82.2337646484375%2C48.34205200181264'
    })
  })

  test('does not append spatial when a non bounding box subsetting is used', () => {
    const collectionMetadata = {
      short_name: 'earthdata_search',
      tags: {
        'edsc.extra.handoff.giovanni': {}
      }
    }

    const collectionSearch = {
      spatial: {
        point: '-84.5859375,43.17774089365865'
      }
    }

    const response = fetchGiovanniHandoffUrl(collectionMetadata, collectionSearch)

    expect(response).toEqual({
      title: 'Giovanni',
      href: 'https://giovanni.gsfc.nasa.gov/giovanni/#service=TmAvMp&dataKeyword=earthdata_search'
    })
  })

  test('appends temporal and spatial values when both are provided', () => {
    const collectionMetadata = {
      short_name: 'earthdata_search',
      tags: {
        'edsc.extra.handoff.giovanni': {}
      }
    }

    const collectionSearch = {
      spatial: {
        boundingBox: '-90.32766723632812,41.63677044970652,-82.2337646484375,48.34205200181264'
      },
      temporal: {
        startDate: '1984-07-02 05:23:00',
        endDate: '1984-07-02 10:43:00'
      }
    }

    const response = fetchGiovanniHandoffUrl(collectionMetadata, collectionSearch)

    expect(response).toEqual({
      title: 'Giovanni',
      href: 'https://giovanni.gsfc.nasa.gov/giovanni/#service=TmAvMp&dataKeyword=earthdata_search&starttime=1984-07-02T05%3A23%3A00.000Z&endtime=1984-07-02T10%3A43%3A00.000Z&bbox=-90.32766723632812%2C41.63677044970652%2C-82.2337646484375%2C48.34205200181264'
    })
  })
})
