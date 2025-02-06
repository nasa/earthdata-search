import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import actions from '../../../actions'
import {
  CollectionDetailsBodyContainer,
  mapDispatchToProps,
  mapStateToProps
} from '../CollectionDetailsBodyContainer'

// Mock react-leaflet because it causes errors
jest.mock('react-leaflet', () => ({
  createLayerComponent: jest.fn().mockImplementation(() => {})
}))

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    collectionMetadata: {
      test: 'metadata'
    },
    isActive: true,
    location: {
      pathname: '/search/granules/collection-details'
    },
    onToggleRelatedUrlsModal: jest.fn(),
    onMetricsRelatedCollection: jest.fn(),
    onFocusedCollectionChange: jest.fn()
  }

  const enzymeWrapper = shallow(<CollectionDetailsBodyContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapDispatchToProps', () => {
  test('onToggleRelatedUrlsModal calls actions.toggleRelatedUrlsModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleRelatedUrlsModal')

    mapDispatchToProps(dispatch).onToggleRelatedUrlsModal(false)

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(false)
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      metadata: {
        collections: {}
      },
      focusedCollection: 'collectionId'
    }

    const expectedState = {
      collectionMetadata: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('CollectionDetailsBodyContainer component', () => {
  test('passes its props and renders a single CollectionDetailsBody component', () => {
    const { enzymeWrapper } = setup()

    // CollectionDetailsBody is lazy loaded, and shows up under that element
    expect(enzymeWrapper.find('lazy').length).toBe(1)
    expect(enzymeWrapper.find('lazy').props().collectionMetadata).toEqual({ test: 'metadata' })
    expect(enzymeWrapper.find('lazy').props().isActive).toEqual(true)

    expect(typeof enzymeWrapper.find('lazy').props().onToggleRelatedUrlsModal).toEqual('function')
  })
})
