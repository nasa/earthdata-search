import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Table } from 'react-bootstrap'

import * as deployedEnvironment from '../../../../../../sharedUtils/deployedEnvironment'

import Spinner from '../../Spinner/Spinner'

import { SubscriptionsList } from '../SubscriptionsList'

Enzyme.configure({ adapter: new Adapter() })

function setup(props) {
  const enzymeWrapper = shallow(<SubscriptionsList {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

beforeEach(() => {
  jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
})

describe('SubscriptionsList component', () => {
  describe('when passed the correct props', () => {
    test('renders a spinner when retrievals are loading', () => {
      const { enzymeWrapper } = setup({
        subscriptions: {
          byId: {},
          isLoading: true,
          isLoaded: false,
          error: null,
          timerStart: Date.now(),
          loadTime: null
        },
        onDeleteSubscription: jest.fn(),
        onFocusedCollectionChange: jest.fn()
      })

      expect(enzymeWrapper.find(Spinner).length).toBe(1)
    })

    test('renders a message when no retrievals exist', () => {
      const { enzymeWrapper } = setup({
        subscriptions: {
          byId: {},
          isLoading: false,
          isLoaded: true,
          error: null,
          timerStart: null,
          loadTime: 1265
        },
        onDeleteSubscription: jest.fn(),
        onFocusedCollectionChange: jest.fn()
      })

      expect(enzymeWrapper.find(Table).length).toBe(0)
      expect(enzymeWrapper.find(Spinner).length).toBe(0)
      expect(enzymeWrapper.find('p').text()).toBe('No subscriptions to display.')
    })

    test('renders a table when subscriptions exist', () => {
      const { enzymeWrapper } = setup({
        subscriptions: {
          byId: {
            'SUB100000-EDSC': {
              collection: {
                conceptId: 'C100000-EDSC',
                title: 'Mattis Justo Vulputate Ullamcorper Amet.'
              },
              collectionConceptId: 'C100000-EDSC',
              conceptId: 'SUB100000-EDSC',
              name: 'Test Subscription',
              query: 'polygon=-18,-78,-13,-74,-16,-73,-22,-77,-18,-78'
            }
          },
          isLoading: false,
          isLoaded: true,
          error: null,
          timerStart: null,
          loadTime: 1265
        },
        onDeleteSubscription: jest.fn(),
        onFocusedCollectionChange: jest.fn()
      })
      expect(enzymeWrapper.find(Table).length).toBe(1)
      expect(enzymeWrapper.find('tbody tr').length).toBe(1)
    })

    test('onHandleRemove calls onDeleteSubscription', () => {
      const { enzymeWrapper, props } = setup({
        subscriptions: {
          byId: {
            'SUB100000-EDSC': {
              collection: {
                conceptId: 'C100000-EDSC',
                title: 'Mattis Justo Vulputate Ullamcorper Amet.'
              },
              collectionConceptId: 'C100000-EDSC',
              conceptId: 'SUB100000-EDSC',
              name: 'Test Subscription',
              nativeId: 'mock-guid',
              query: 'polygon=-18,-78,-13,-74,-16,-73,-22,-77,-18,-78'
            }
          },
          isLoading: false,
          isLoaded: true,
          error: null,
          timerStart: null,
          loadTime: 1265
        },
        onDeleteSubscription: jest.fn(),
        onFocusedCollectionChange: jest.fn()
      })

      window.confirm = jest.fn().mockImplementation(() => true)

      const removeButton = enzymeWrapper.find('.subscriptions-list__button--remove')

      removeButton.simulate('click')

      expect(props.onDeleteSubscription).toHaveBeenCalledTimes(1)
      expect(props.onDeleteSubscription).toHaveBeenCalledWith('SUB100000-EDSC', 'mock-guid', 'C100000-EDSC')
    })
  })

  describe('edit subscriptions button', () => {
    const { enzymeWrapper, props } = setup({
      subscriptions: {
        byId: {
          'SUB100000-EDSC': {
            collection: {
              conceptId: 'C100000-EDSC',
              title: 'Mattis Justo Vulputate Ullamcorper Amet.'
            },
            collectionConceptId: 'C100000-EDSC',
            conceptId: 'SUB100000-EDSC',
            name: 'Test Subscription',
            nativeId: 'mock-guid',
            query: 'polygon=-18,-78,-13,-74,-16,-73,-22,-77,-18,-78'
          }
        },
        isLoading: false,
        isLoaded: true,
        error: null,
        timerStart: null,
        loadTime: 1265
      },
      onDeleteSubscription: jest.fn(),
      onFocusedCollectionChange: jest.fn()
    })

    window.confirm = jest.fn().mockImplementation(() => true)

    const editButton = enzymeWrapper.find('.subscriptions-list__button--edit')

    test('redirects to the focused collection subscriptions', () => {
      expect(editButton.props().to).toEqual({
        pathname: '/search/granules/subscriptions',
        search: '?p=C100000-EDSC'
      })
    })

    test('calls onFocusedCollectionChange', () => {
      editButton.props().onClick()
      expect(props.onFocusedCollectionChange).toHaveBeenCalledTimes(1)
    })
  })
})
