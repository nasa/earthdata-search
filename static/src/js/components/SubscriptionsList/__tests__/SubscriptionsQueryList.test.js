import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import SubscriptionsQueryList from '../SubscriptionsQueryList'

Enzyme.configure({ adapter: new Adapter() })

beforeAll(() => {
  jest.clearAllMocks()
})

function setup(overrideProps) {
  const props = {
    disabledFields: {},
    query: {},
    subscriptionType: 'granule',
    showCheckboxes: false,
    onUpdateSubscriptionDisabledFields: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<SubscriptionsQueryList {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('SubscriptionsQueryList component', () => {
  describe('when querying collections with granules', () => {
    test('does not render the label', () => {
      const { enzymeWrapper } = setup({
        subscriptionType: 'collection',
        query: {
          hasGranulesOrCwic: true
        }
      })

      expect(enzymeWrapper.find('.subscriptions-query-list__query-list').text())
        .not.toContain('Collections without granules')
    })
  })

  describe('when querying collections without granules', () => {
    test('should render the label', () => {
      const { enzymeWrapper } = setup({
        subscriptionType: 'collection',
        query: {}
      })

      expect(enzymeWrapper.find('.subscriptions-query-list__query-list').text())
        .toContain('Include datasets without granules')
    })
  })

  describe('when displaying a query with a temporal range', () => {
    test('should render the label', () => {
      const { enzymeWrapper } = setup({
        subscriptionType: 'collection',
        query: {
          temporal: '2000-01-01T10:00:00Z,2010-03-10T12:00:00Z'
        }
      })

      expect(enzymeWrapper.find('.subscriptions-query-list__query-list').text())
        .toContain('Start: 2000-01-01 10:00:00')
      expect(enzymeWrapper.find('.subscriptions-query-list__query-list').text())
        .toContain('End: 2010-03-10 12:00:00')
    })
  })

  describe('when displaying a query with a bounding box', () => {
    test('should render the label', () => {
      const { enzymeWrapper } = setup({
        subscriptionType: 'collection',
        query: {
          boundingBox: ['2,1,4,3']
        }
      })

      expect(enzymeWrapper.find('.subscriptions-query-list__query-list').text())
        .toContain('SW: 1, 2')
      expect(enzymeWrapper.find('.subscriptions-query-list__query-list').text())
        .toContain('NE: 3, 4')
    })
  })

  describe('when displaying a query with a circle', () => {
    test('should render the label', () => {
      const { enzymeWrapper } = setup({
        subscriptionType: 'collection',
        query: {
          circle: ['2,1,3']
        }
      })

      expect(enzymeWrapper.find('.subscriptions-query-list__query-list').text())
        .toContain('Center: 1, 2')
      expect(enzymeWrapper.find('.subscriptions-query-list__query-list').text())
        .toContain('Radius (m): 3')
    })
  })

  describe('when displaying a query with a hierarchy', () => {
    test('should render the label', () => {
      const { enzymeWrapper } = setup({
        subscriptionType: 'collection',
        query: {
          scienceKeywordsH: [{
            topic: 'topic',
            term: 'term',
            variable_level_1: 'variable_level_1',
            variable_level_2: 'variable_level_2',
            variable_level_3: 'variable_level_3',
            detailed_variable: 'detailed_variable'
          }]
        }
      })

      expect(enzymeWrapper.find('.subscriptions-query-list__query-list').text())
        .toContain('topic > term > variable_level_1 > variable_level_2 > variable_level_3 > detailed_variable')
    })
  })

  describe('when rendering a query property that does not exist in the mapping', () => {
    test('renders the key', () => {
      const { enzymeWrapper } = setup({
        subscriptionType: 'collection',
        query: {
          something: 'test'
        }
      })

      expect(enzymeWrapper.find('.subscriptions-query-list__query-list').text())
        .toContain('something')
    })
  })

  describe('when rendering a query property that does exist in the mapping', () => {
    test('renders the humanized vaules', () => {
      const { enzymeWrapper } = setup({
        subscriptionType: 'collection',
        query: {
          polygon: ['1,1,1,0,0,0,0,1']
        }
      })

      expect(enzymeWrapper.find('.subscriptions-query-list__query-list').text())
        .toContain('Polygon')
    })
  })

  describe('when showCheckboxes is true', () => {
    test('displays the checkbox', () => {
      const { enzymeWrapper } = setup({
        subscriptionType: 'collection',
        query: {
          hasGranulesOrCwic: true,
          keyword: 'modis*'
        },
        showCheckboxes: true
      })

      expect(enzymeWrapper.find('.subscriptions-query-list__query-list-item__checkbox').exists())
        .toBeTruthy()
      expect(enzymeWrapper.find('.subscriptions-query-list__query-list-item__checkbox').props().checked)
        .toBeTruthy()
    })

    test('displays the checkbox unchecked when the field is disabled', () => {
      const { enzymeWrapper } = setup({
        subscriptionType: 'collection',
        query: {
          hasGranulesOrCwic: true,
          keyword: 'modis*'
        },
        showCheckboxes: true,
        disabledFields: {
          keyword: true
        }
      })

      expect(enzymeWrapper.find('.subscriptions-query-list__query-list-item__checkbox').exists())
        .toBeTruthy()
      expect(enzymeWrapper.find('.subscriptions-query-list__query-list-item__checkbox').props().checked)
        .toBeFalsy()
    })

    test('handleCheckboxChange calls onUpdateSubscriptionDisabledFields', () => {
      const { enzymeWrapper, props } = setup({
        subscriptionType: 'collection',
        query: {
          hasGranulesOrCwic: true,
          keyword: 'modis*'
        },
        showCheckboxes: true
      })

      const checkbox = enzymeWrapper.find('.subscriptions-query-list__query-list-item__checkbox')

      checkbox.simulate('change', { target: { id: 'collection-keyword', checked: false } })

      expect(props.onUpdateSubscriptionDisabledFields).toHaveBeenCalledTimes(1)
      expect(props.onUpdateSubscriptionDisabledFields).toHaveBeenCalledWith({
        collection: {
          keyword: true
        }
      })
    })
  })
})
