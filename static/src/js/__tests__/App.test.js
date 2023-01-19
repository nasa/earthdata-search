import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import nock from 'nock'
import Helmet from 'react-helmet'

import * as AppConfig from '../../../../sharedUtils/config'
import App from '../App'

// Mock react-leaflet because it causes errors
jest.mock('react-leaflet', () => ({
  createLayerComponent: jest.fn().mockImplementation(() => {}),
  createControlComponent: jest.fn().mockImplementation(() => {})
}))

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  nock(/cmr/)
    .post(/collections/)
    .reply(200, {
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
    }, {
      'cmr-hits': '1'
    })

  const props = {}

  const enzymeWrapper = shallow(<App {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(AppConfig, 'getApplicationConfig').mockImplementation(() => ({ env: 'dev' }))
  jest.spyOn(AppConfig, 'getEnvironmentConfig').mockImplementation(() => ({ edscHost: 'https://search.earthdata.nasa.gov' }))
})

describe('App component', () => {
  test('sets the correct default title', () => {
    const { enzymeWrapper } = setup()
    const helmet = enzymeWrapper.find(Helmet)
    expect(helmet.props().defaultTitle).toEqual('Earthdata Search')
  })

  test('sets the correct title template', () => {
    const { enzymeWrapper } = setup()
    const helmet = enzymeWrapper.find(Helmet)
    expect(helmet.props().titleTemplate).toEqual('[DEV] %s | Earthdata Search')
  })

  test('sets the correct meta description', () => {
    const { enzymeWrapper } = setup()
    const helmet = enzymeWrapper.find(Helmet)
    expect(helmet.childAt(0).props().name).toEqual('description')
    expect(helmet.childAt(0).props().content).toEqual('Search, discover, visualize, refine, and access NASA Earth Observation data in your browser with Earthdata Search')
  })

  test('sets the correct meta og:type', () => {
    const { enzymeWrapper } = setup()
    const helmet = enzymeWrapper.find(Helmet)
    expect(helmet.childAt(1).props().property).toEqual('og:type')
    expect(helmet.childAt(1).props().content).toEqual('website')
  })

  test('sets the correct meta og:title', () => {
    const { enzymeWrapper } = setup()
    const helmet = enzymeWrapper.find(Helmet)
    expect(helmet.childAt(2).props().property).toEqual('og:title')
    expect(helmet.childAt(2).props().content).toEqual('Earthdata Search')
  })

  test('sets the correct meta og:description', () => {
    const { enzymeWrapper } = setup()
    const helmet = enzymeWrapper.find(Helmet)
    expect(helmet.childAt(3).props().property).toEqual('og:description')
    expect(helmet.childAt(3).props().content).toEqual('Search, discover, visualize, refine, and access NASA Earth Observation data in your browser with Earthdata Search')
  })

  test('sets the correct meta og:url', () => {
    const { enzymeWrapper } = setup()
    const helmet = enzymeWrapper.find(Helmet)
    expect(helmet.childAt(4).props().property).toEqual('og:url')
    expect(helmet.childAt(4).props().content).toEqual('https://search.earthdata.nasa.gov/search')
  })

  test('sets the correct meta og:image', () => {
    const { enzymeWrapper } = setup()
    const helmet = enzymeWrapper.find(Helmet)
    expect(helmet.childAt(5).props().property).toEqual('og:image')
    expect(helmet.childAt(5).props().content).toEqual('test-file-stub')
  })

  test('sets the correct meta theme-color', () => {
    const { enzymeWrapper } = setup()
    const helmet = enzymeWrapper.find(Helmet)
    expect(helmet.childAt(6).props().name).toEqual('theme-color')
    expect(helmet.childAt(6).props().content).toEqual('#191a1b')
  })

  test('sets the correct meta canonical url', () => {
    const { enzymeWrapper } = setup()
    const helmet = enzymeWrapper.find(Helmet)
    expect(helmet.childAt(7).props().rel).toEqual('canonical')
    expect(helmet.childAt(7).props().href).toEqual('https://search.earthdata.nasa.gov/search')
  })
})
