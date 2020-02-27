import React from 'react'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import SimpleBar from 'simplebar-react'

import CollectionResultsBody from '../CollectionResultsBody'
import CollectionResultsList from '../CollectionResultsList'

beforeEach(() => {
  jest.clearAllMocks()
})

const mockSimpleBarWrapper = (() => {
  const el = document.createElement('div')
  el.classList.add('simplebar-content-wrapper')
  return el
})()

const mockRefElement = (() => {
  const el = document.createElement('div')
  el.classList.add('granule-results-body')
  el.appendChild(mockSimpleBarWrapper)
  return el
})()

jest.spyOn(CollectionResultsBody.prototype, 'getRef').mockImplementation(function mockRef() {
  this.wrapper = {
    current: mockRefElement
  }
})

// TODO: Write more tests

Enzyme.configure({ adapter: new Adapter() })

function setup(options = {
  mount: false
}) {
  const props = {
    browser: {
      name: 'browser name'
    },
    collections: {
      allIds: ['collectionId1', 'collectionId2'],
      byId: {
        collectionId1: {
          id: 'collectionId1'
        },
        collectionId2: {
          id: 'collectionId2'
        }
      },
      hits: '181',
      isLoaded: true,
      isLoading: false,
      loadTime: 1150,
      timerStart: null
    },
    portal: {
      portalId: []
    },
    projectIds: [],
    location: {
      pathname: '/test'
    },
    onAddProjectCollection: jest.fn(),
    onRemoveCollectionFromProject: jest.fn(),
    onViewCollectionGranules: jest.fn(),
    onViewCollectionDetails: jest.fn(),
    waypointEnter: jest.fn()
  }

  let enzymeWrapper

  if (options.mount) {
    enzymeWrapper = mount(<CollectionResultsBody {...props} />)
  } else {
    enzymeWrapper = shallow(<CollectionResultsBody {...props} />)
  }


  return {
    enzymeWrapper,
    props
  }
}

describe('CollectionResultsBody component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBe('div')
    expect(enzymeWrapper.prop('className')).toBe('collection-results-body')
  })

  test('renders the SimpleBar correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.children().at(0).type()).toBe(SimpleBar)
    expect(enzymeWrapper.children().at(0).prop('className')).toBe('collection-results-body__scroll-container')
  })

  test('passes the correct props to CollectionResultsList', () => {
    const { enzymeWrapper, props } = setup()
    const collectionResultsList = enzymeWrapper.find(CollectionResultsList)
    expect(collectionResultsList.props().collections)
      .toEqual(props.collections)
    expect(collectionResultsList.props().onViewCollectionGranules)
      .toEqual(props.onViewCollectionGranules)
    expect(collectionResultsList.props().onViewCollectionDetails)
      .toEqual(props.onViewCollectionDetails)
    expect(collectionResultsList.props().waypointEnter)
      .toEqual(props.waypointEnter)
  })

  test('should create a ref', () => {
    setup({
      mount: true
    })

    expect(CollectionResultsBody.prototype.getRef).toHaveBeenCalledTimes(1)
  })
})
