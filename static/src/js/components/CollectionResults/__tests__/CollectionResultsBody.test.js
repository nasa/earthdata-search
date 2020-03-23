import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import CollectionResultsBody from '../CollectionResultsBody'
import CollectionResultsList from '../CollectionResultsList'
import CollectionResultsTable from '../../CollectionResultsTable/CollectionResultsTable'

beforeEach(() => {
  jest.clearAllMocks()
})

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
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
    panelView: 'list',
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
    scrollContainer: (() => {
      const el = document.createElement('div')
      el.classList.add('simplebar-content-wrapper')
      return el
    })(),
    waypointEnter: jest.fn(),
    ...overrideProps
  }

  let enzymeWrapper

  if (props.panelView === 'list') {
    enzymeWrapper = shallow(<CollectionResultsList {...props} />)
  }

  if (props.panelView === 'table') {
    enzymeWrapper = shallow(<CollectionResultsTable {...props} />)
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

  describe('panel view set to list', () => {
    test('passes the correct props to CollectionResultsList', () => {
      const { enzymeWrapper, props } = setup()
      const collectionResultsList = enzymeWrapper.find(CollectionResultsList)

      expect(collectionResultsList.props().collections[0].collectionId)
        .toEqual('collectionId1')
      expect(collectionResultsList.props().collections[1].collectionId)
        .toEqual('collectionId2')
      expect(collectionResultsList.props().onViewCollectionGranules)
        .toEqual(props.onViewCollectionGranules)
      expect(collectionResultsList.props().onViewCollectionDetails)
        .toEqual(props.onViewCollectionDetails)
      expect(collectionResultsList.props().waypointEnter)
        .toEqual(props.waypointEnter)
    })
  })

  describe('panel view set to table', () => {
    test('passes the correct props to CollectionResultsTable', () => {
      const { enzymeWrapper, props } = setup({
        panelView: 'table'
      })
      const collectionResultsTable = enzymeWrapper.find(CollectionResultsTable)

      expect(collectionResultsTable.props().collections[0].collectionId)
        .toEqual('collectionId1')
      expect(collectionResultsTable.props().collections[1].collectionId)
        .toEqual('collectionId2')
      expect(collectionResultsTable.props().onViewCollectionGranules)
        .toEqual(props.onViewCollectionGranules)
      expect(collectionResultsTable.props().onViewCollectionDetails)
        .toEqual(props.onViewCollectionDetails)
      expect(collectionResultsTable.props().waypointEnter)
        .toEqual(props.waypointEnter)
    })
  })

  test('waypointEnter calls onChangeCollectionPageNum', () => {
    const { enzymeWrapper, props } = setup()

    const collectionResultsBody = enzymeWrapper.find(CollectionResultsBody)

    collectionResultsBody.prop('waypointEnter')({ event: { type: 'scroll' } })

    expect(props.onChangeCollectionPageNum.mock.calls.length).toBe(1)
    expect(props.onChangeCollectionPageNum.mock.calls[0]).toEqual([2])
  })

  test('waypointEnter does not call onChangeCollectionPageNum if there is no scroll event', () => {
    const { enzymeWrapper, props } = setup()

    const collectionResultsBody = enzymeWrapper.find(CollectionResultsBody)

    collectionResultsBody.prop('waypointEnter')({ event: null })

    expect(props.onChangeCollectionPageNum.mock.calls.length).toBe(0)
  })
})
