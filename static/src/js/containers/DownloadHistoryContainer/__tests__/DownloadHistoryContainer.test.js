import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Table } from 'react-bootstrap'
import { PortalLinkContainer } from '../../PortalLinkContainer/PortalLinkContainer'
import { DownloadHistoryContainer } from '../DownloadHistoryContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup(props) {
  const enzymeWrapper = shallow(<DownloadHistoryContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('DownloadHistoryContainer component', () => {
  describe('when passed the correct props', () => {
    test('renders a message when no retrievals exist', () => {
      const { enzymeWrapper } = setup({
        authToken: 'testToken',
        retrievalHistory: [],
        onFetchRetrievalHistory: jest.fn()
      })

      expect(enzymeWrapper.find(Table).length).toBe(0)
      expect(enzymeWrapper.find('p').text()).toBe('No download history to display.')
    })

    test('renders a table when a retrieval exists with one collection that has no title', () => {
      const { enzymeWrapper } = setup({
        authToken: 'testToken',
        retrievalHistory: [{
          id: '8069076',
          jsondata: {},
          created_at: '2019-08-25T11:58:14.390Z',
          collections: [{}]
        }],
        onFetchRetrievalHistory: jest.fn()
      })
      expect(enzymeWrapper.find(Table).length).toBe(1)
      expect(enzymeWrapper.find('tbody tr').length).toBe(1)
      expect(enzymeWrapper.find(PortalLinkContainer).prop('to')).toEqual('/downloads/8069076')
      expect(enzymeWrapper.find(PortalLinkContainer).prop('children')).toEqual('1 collection')
    })

    test('renders a table when a retrieval exists with one collection', () => {
      const { enzymeWrapper } = setup({
        authToken: 'testToken',
        retrievalHistory: [{
          id: '8069076',
          jsondata: {},
          created_at: '2019-08-25T11:58:14.390Z',
          collections: [{
            title: 'Collection Title'
          }]
        }],
        onFetchRetrievalHistory: jest.fn()
      })
      expect(enzymeWrapper.find(Table).length).toBe(1)
      expect(enzymeWrapper.find('tbody tr').length).toBe(1)
      expect(enzymeWrapper.find(PortalLinkContainer).prop('to')).toEqual('/downloads/8069076')
      expect(enzymeWrapper.find(PortalLinkContainer).prop('children')).toEqual('Collection Title')
    })

    test('renders a table when a retrieval exists with two collections', () => {
      const { enzymeWrapper } = setup({
        authToken: 'testToken',
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
        onFetchRetrievalHistory: jest.fn()
      })
      expect(enzymeWrapper.find(Table).length).toBe(1)
      expect(enzymeWrapper.find('tbody tr').length).toBe(1)
      expect(enzymeWrapper.find(PortalLinkContainer).prop('to')).toEqual('/downloads/8069076')
      expect(enzymeWrapper.find(PortalLinkContainer).prop('children')).toEqual('Collection Title and 1 other collection')
    })

    test('renders links correctly when portals were used to place an order', () => {
      const { enzymeWrapper } = setup({
        authToken: 'testToken',
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
        onFetchRetrievalHistory: jest.fn()
      })

      expect(enzymeWrapper.find(Table).length).toBe(1)
      expect(enzymeWrapper.find('tbody tr').length).toBe(1)
      expect(enzymeWrapper.find(PortalLinkContainer).prop('to')).toEqual('/downloads/8069076')
      expect(enzymeWrapper.find(PortalLinkContainer).prop('portalId')).toEqual('test')
      expect(enzymeWrapper.find(PortalLinkContainer).prop('children')).toEqual('Collection Title')
    })
  })
})
