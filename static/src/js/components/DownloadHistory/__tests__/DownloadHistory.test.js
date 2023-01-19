import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { Table } from 'react-bootstrap'
import Helmet from 'react-helmet'

import * as deployedEnvironment from '../../../../../../sharedUtils/deployedEnvironment'
import * as AppConfig from '../../../../../../sharedUtils/config'

import Spinner from '../../Spinner/Spinner'
import PortalLinkContainer from '../../../containers/PortalLinkContainer/PortalLinkContainer'
import { DownloadHistory } from '../DownloadHistory'

Enzyme.configure({ adapter: new Adapter() })

function setup(props) {
  const enzymeWrapper = shallow(<DownloadHistory {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

beforeEach(() => {
  jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
  jest.spyOn(AppConfig, 'getEnvironmentConfig').mockImplementation(() => ({ edscHost: 'https://search.earthdata.nasa.gov' }))
})

describe('DownloadHistory component', () => {
  describe('when passed the correct props', () => {
    test('renders a spinner when retrievals are loading', () => {
      const { enzymeWrapper } = setup({
        authToken: 'testToken',
        earthdataEnvironment: 'prod',
        retrievalHistory: [],
        retrievalHistoryLoading: true,
        retrievalHistoryLoaded: false,
        onDeleteRetrieval: jest.fn()
      })

      expect(enzymeWrapper.find(Spinner).length).toBe(1)
    })

    test('renders a message when no retrievals exist', () => {
      const { enzymeWrapper } = setup({
        authToken: 'testToken',
        earthdataEnvironment: 'prod',
        retrievalHistory: [],
        retrievalHistoryLoading: false,
        retrievalHistoryLoaded: true,
        onDeleteRetrieval: jest.fn()
      })

      expect(enzymeWrapper.find(Table).length).toBe(0)
      expect(enzymeWrapper.find(Spinner).length).toBe(0)
      expect(enzymeWrapper.find('p').text()).toBe('No download history to display.')
    })

    test('renders a table when a retrieval exists with one collection that has no title', () => {
      const { enzymeWrapper } = setup({
        authToken: 'testToken',
        earthdataEnvironment: 'prod',
        retrievalHistory: [{
          id: '8069076',
          jsondata: {},
          created_at: '2019-08-25T11:58:14.390Z',
          collections: [{}]
        }],
        retrievalHistoryLoading: false,
        retrievalHistoryLoaded: true,
        onDeleteRetrieval: jest.fn()
      })
      expect(enzymeWrapper.find(Table).length).toBe(1)
      expect(enzymeWrapper.find('tbody tr').length).toBe(1)
      expect(enzymeWrapper.find(PortalLinkContainer).prop('to')).toEqual({ pathname: '/downloads/8069076', search: '' })
      expect(enzymeWrapper.find(PortalLinkContainer).prop('children')).toEqual('1 collection')
    })

    test('renders a table when a retrieval exists with one collection', () => {
      const { enzymeWrapper } = setup({
        authToken: 'testToken',
        earthdataEnvironment: 'prod',
        retrievalHistory: [{
          id: '8069076',
          jsondata: {},
          created_at: '2019-08-25T11:58:14.390Z',
          collections: [{
            title: 'Collection Title'
          }]
        }],
        retrievalHistoryLoading: false,
        retrievalHistoryLoaded: true,
        onDeleteRetrieval: jest.fn()
      })
      expect(enzymeWrapper.find(Table).length).toBe(1)
      expect(enzymeWrapper.find('tbody tr').length).toBe(1)
      expect(enzymeWrapper.find(PortalLinkContainer).prop('to')).toEqual({ pathname: '/downloads/8069076', search: '' })
      expect(enzymeWrapper.find(PortalLinkContainer).prop('children')).toEqual('Collection Title')
    })

    test('renders a table when a retrieval exists with two collections', () => {
      const { enzymeWrapper } = setup({
        authToken: 'testToken',
        earthdataEnvironment: 'prod',
        retrievalHistory: [{
          id: '8069076',
          jsondata: {},
          created_at: '2019-08-25T11:58:14.390Z',
          collections: [{
            title: 'Collection Title'
          }, {
            title: 'Collection Title Two'
          }]
        }],
        retrievalHistoryLoading: false,
        retrievalHistoryLoaded: true,
        onDeleteRetrieval: jest.fn()
      })
      expect(enzymeWrapper.find(Table).length).toBe(1)
      expect(enzymeWrapper.find('tbody tr').length).toBe(1)
      expect(enzymeWrapper.find(PortalLinkContainer).prop('to')).toEqual({ pathname: '/downloads/8069076', search: '' })
      expect(enzymeWrapper.find(PortalLinkContainer).prop('children')).toEqual('Collection Title and 1 other collection')
    })

    test('renders the correct Helmet meta information', () => {
      const { enzymeWrapper } = setup({
        authToken: 'testToken',
        earthdataEnvironment: 'prod',
        retrievalHistory: [{
          id: '8069076',
          jsondata: {},
          created_at: '2019-08-25T11:58:14.390Z',
          collections: [{
            title: 'Collection Title'
          }, {
            title: 'Collection Title Two'
          }]
        }],
        retrievalHistoryLoading: false,
        retrievalHistoryLoaded: true,
        onDeleteRetrieval: jest.fn()
      })

      const helmet = enzymeWrapper.find(Helmet)
      expect(helmet.childAt(0).type()).toEqual('title')
      expect(helmet.childAt(0).text()).toEqual('Download Status & History')
      expect(helmet.childAt(1).props().name).toEqual('title')
      expect(helmet.childAt(1).props().content).toEqual('Download Status & History')
      expect(helmet.childAt(2).props().name).toEqual('robots')
      expect(helmet.childAt(2).props().content).toEqual('noindex, nofollow')
      expect(helmet.childAt(3).props().rel).toEqual('canonical')
      expect(helmet.childAt(3).props().href).toEqual('https://search.earthdata.nasa.gov/downloads')
    })

    test('renders links correctly when portals were used to place an order', () => {
      const { enzymeWrapper } = setup({
        authToken: 'testToken',
        earthdataEnvironment: 'prod',
        retrievalHistory: [{
          id: '8069076',
          jsondata: {
            portal_id: 'test'
          },
          created_at: '2019-08-25T11:58:14.390Z',
          collections: [{
            title: 'Collection Title'
          }]
        }],
        retrievalHistoryLoading: false,
        retrievalHistoryLoaded: true,
        onDeleteRetrieval: jest.fn()
      })

      expect(enzymeWrapper.find(Table).length).toBe(1)
      expect(enzymeWrapper.find('tbody tr').length).toBe(1)
      expect(enzymeWrapper.find(PortalLinkContainer).prop('to')).toEqual({ pathname: '/downloads/8069076', search: '' })
      expect(enzymeWrapper.find(PortalLinkContainer).prop('portalId')).toEqual('test')
      expect(enzymeWrapper.find(PortalLinkContainer).prop('children')).toEqual('Collection Title')
    })

    test('renders links correctly when the earthdataEnvironment doesn\'t match the deployed environment', () => {
      const { enzymeWrapper } = setup({
        authToken: 'testToken',
        earthdataEnvironment: 'uat',
        retrievalHistory: [{
          id: '8069076',
          jsondata: {
            portal_id: 'test'
          },
          created_at: '2019-08-25T11:58:14.390Z',
          collections: [{
            title: 'Collection Title'
          }]
        }],
        retrievalHistoryLoading: false,
        retrievalHistoryLoaded: true,
        onDeleteRetrieval: jest.fn()
      })

      expect(enzymeWrapper.find(Table).length).toBe(1)
      expect(enzymeWrapper.find('tbody tr').length).toBe(1)
      expect(enzymeWrapper.find(PortalLinkContainer).prop('to')).toEqual({
        pathname: '/downloads/8069076',
        search: '?ee=uat'
      })
      expect(enzymeWrapper.find(PortalLinkContainer).prop('portalId')).toEqual('test')
      expect(enzymeWrapper.find(PortalLinkContainer).prop('children')).toEqual('Collection Title')
    })

    test('onHandleRemove calls onDeleteRetrieval', () => {
      const { enzymeWrapper, props } = setup({
        authToken: 'testToken',
        earthdataEnvironment: 'prod',
        retrievalHistory: [{
          id: '8069076',
          jsondata: {},
          created_at: '2019-08-25T11:58:14.390Z',
          collections: [{
            title: 'Collection Title'
          }]
        }],
        retrievalHistoryLoading: false,
        retrievalHistoryLoaded: true,
        onDeleteRetrieval: jest.fn()
      })

      window.confirm = jest.fn().mockImplementation(() => true)

      const removeButton = enzymeWrapper.find('.download-history__button--remove')

      removeButton.simulate('click')

      expect(props.onDeleteRetrieval).toBeCalledTimes(1)
      expect(props.onDeleteRetrieval).toBeCalledWith('8069076')
    })
  })
})
