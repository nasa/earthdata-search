import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import moxios from 'moxios'

import App from '../App'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {}

  const enzymeWrapper = mount(<App {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('App component', () => {
  beforeEach(() => {
    moxios.install()

    jest.clearAllMocks()
  })

  afterEach(() => {
    moxios.uninstall()
  })

  test('should render self', () => {
    moxios.stubRequest(/gov\/search\/collections.*/, {
      status: 200,
      response: {
        feed: {
          updated: '2019-03-27T20:21:14.705Z',
          id: 'https://cmr.sit.earthdata.nasa.gov:443/search/collections.json?has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Corg.ceos.wgiss.cwic.granules.prod&keyword=&options[temporal][limit_to_granules]=true&page_num=1&page_size=20&sort_key=has_granules_or_cwic',
          title: 'ECHO dataset metadata',
          entry: [{
            mockCollectionData: 'goes here',
            id: 'mock-id',
            summary: 'mock summary data'
          }],
          facets: {}
        }
      },
      headers: {
        'cmr-hits': '1'
      }
    })

    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.exists()).toBeTruthy()
  })
})
