import React from 'react'
import { Provider } from 'react-redux'
import Enzyme, { mount } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { StaticRouter } from 'react-router'
import Helmet from 'react-helmet'

import { retrievalStatusProps } from './mocks'

import { Well } from '../../Well/Well'
import { RelatedCollection } from '../../RelatedCollection/RelatedCollection'
import { OrderStatus } from '../OrderStatus'

import configureStore from '../../../store/configureStore'
import PortalLinkContainer from '../../../containers/PortalLinkContainer/PortalLinkContainer'

import * as config from '../../../../../../sharedUtils/config'

const store = configureStore()

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(config, 'getEnvironmentConfig').mockImplementation(() => ({ edscHost: 'https://search.earthdata.nasa.gov' }))
})

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = retrievalStatusProps

  const enzymeWrapper = mount(
    <Provider store={store}>
      <StaticRouter>
        <OrderStatus {...props} />
      </StaticRouter>
    </Provider>
  )

  return {
    enzymeWrapper,
    props
  }
}

describe('OrderStatus component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()
    const orderStatus = enzymeWrapper.find(OrderStatus)
    expect(orderStatus).toBeDefined()
  })

  test('renders the correct Helmet meta information', () => {
    setup()
    const helmet = Helmet.peek()
    expect(helmet.title).toEqual('Download Status')
    expect(helmet.metaTags[0].name).toEqual('title')
    expect(helmet.metaTags[0].content).toEqual('Download Status')
    expect(helmet.metaTags[1].name).toEqual('robots')
    expect(helmet.metaTags[1].content).toEqual('noindex, nofollow')
    expect(helmet.linkTags[0].rel).toEqual('canonical')
    expect(helmet.linkTags[0].href).toEqual('https://search.earthdata.nasa.gov/downloads')
  })

  test('calls onFetchRetrieval when mounted', () => {
    const { props } = setup()
    expect(props.onFetchRetrieval).toHaveBeenCalledTimes(1)
    expect(props.onFetchRetrieval).toHaveBeenCalledWith('7', 'testToken')
  })

  describe('introduction', () => {
    beforeEach(() => {
      jest.spyOn(config, 'getEnvironmentConfig').mockImplementation(() => ({ edscHost: 'http://localhost' }))
      jest.spyOn(config, 'getApplicationConfig').mockImplementation(() => ({
        defaultPortal: 'edsc',
        env: 'prod'
      }))
    })

    test('displays the correct text', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find(Well.Introduction).text()).toEqual('This page will automatically update as your orders are processed. The Download Status page can be accessed later by visiting http://localhost/downloads/7 or the Download Status and History page.')
    })

    test('download status link has correct href', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find(Well.Introduction).find('a').at(0).props().href).toEqual('http://localhost/downloads/7')
    })

    test('download status link has correct href when earthdataEnvironment is different than the deployed environment', () => {
      jest.spyOn(config, 'getApplicationConfig').mockImplementation(() => ({
        defaultPortal: 'edsc',
        env: 'uat'
      }))

      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find(Well.Introduction).find('a').at(0).props().href).toEqual('http://localhost/downloads/7?ee=prod')
    })

    test('status link has correct href', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find(Well.Introduction)
        .find(PortalLinkContainer).at(0).props().to).toEqual({
        pathname: '/downloads',
        search: ''
      })
    })

    test('status link has correct href when earthdataEnvironment is different than the deployed environment', () => {
      jest.spyOn(config, 'getApplicationConfig').mockImplementation(() => ({
        defaultPortal: 'edsc',
        env: 'uat'
      }))

      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find(Well.Introduction)
        .find(PortalLinkContainer).at(0).props().to).toEqual({
        pathname: '/downloads',
        search: '?ee=prod'
      })
    })
  })

  describe('data links', () => {
    test('renders data links in a list', () => {
      const { enzymeWrapper } = setup()
      const orderStatus = enzymeWrapper.find(OrderStatus)
      expect(orderStatus.find('.order-status__collection-links-item').length).toEqual(1)
      expect(orderStatus.find('.order-status__collection-link').at(0).props().href).toEqual('http://linkurl.com/test')
    })
  })

  describe('related collection links', () => {
    test('renders related collections', () => {
      const { enzymeWrapper } = setup()
      const orderStatus = enzymeWrapper.find(OrderStatus)
      expect(orderStatus.find(RelatedCollection).length).toEqual(3)
    })
  })

  describe('footer links', () => {
    test('calls onChangePath when the search link is clicked', () => {
      const { enzymeWrapper, props } = setup()
      const orderStatus = enzymeWrapper.find(OrderStatus)
      const backToSearchLink = orderStatus.find('.order-status__footer-link-list').find(PortalLinkContainer).at(0)
      backToSearchLink.find('a').simulate('click')
      expect(props.onChangePath).toHaveBeenCalledTimes(1)
      expect(props.onChangePath).toHaveBeenCalledWith('/search?test=source_link')
    })
  })
})
