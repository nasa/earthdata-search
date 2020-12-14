import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import actions from '../../../actions'
import { CollectionResultsBodyContainer, mapDispatchToProps, mapStateToProps } from '../CollectionResultsBodyContainer'
import CollectionResultsBody from '../../../components/CollectionResults/CollectionResultsBody'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    browser: {
      name: 'browser name'
    },
    collectionsMetadata: {
      id1: {
        title: 'collection 1 title'
      },
      id2: {
        title: 'collection 2 title'
      }
    },
    collectionsSearch: {},
    portal: {},
    projectCollectionsIds: [],
    location: {
      value: 'location'
    },
    onAddProjectCollection: jest.fn(),
    onRemoveCollectionFromProject: jest.fn(),
    onChangeCollectionPageNum: jest.fn(),
    onViewCollectionGranules: jest.fn(),
    onViewCollectionDetails: jest.fn(),
    panelView: 'list',
    query: {
      pageNum: 1
    }
  }

  const enzymeWrapper = shallow(<CollectionResultsBodyContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapDispatchToProps', () => {
  test('onAddProjectCollection calls actions.addProjectCollection', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'addProjectCollection')

    mapDispatchToProps(dispatch).onAddProjectCollection('collectionId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('collectionId')
  })

  test('onRemoveCollectionFromProject calls actions.removeCollectionFromProject', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'removeCollectionFromProject')

    mapDispatchToProps(dispatch).onRemoveCollectionFromProject('collectionId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('collectionId')
  })

  test('onViewCollectionGranules calls actions.viewCollectionGranules', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'viewCollectionGranules')

    mapDispatchToProps(dispatch).onViewCollectionGranules('collectionId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('collectionId')
  })

  test('onViewCollectionDetails calls actions.viewCollectionDetails', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'viewCollectionDetails')

    mapDispatchToProps(dispatch).onViewCollectionDetails('collectionId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('collectionId')
  })

  test('onChangeCollectionPageNum calls actions.changeCollectionPageNum', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeCollectionPageNum')

    mapDispatchToProps(dispatch).onChangeCollectionPageNum({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      browser: {},
      metadata: {
        collections: {}
      },
      portal: {},
      query: {
        collection: {}
      },
      searchResults: {
        collections: {}
      }
    }

    const expectedState = {
      browser: {},
      collectionsSearch: {},
      collectionsMetadata: {},
      portal: {},
      projectCollectionsIds: [],
      query: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('CollectionResultsBodyContainer component', () => {
  test('passes its props and renders a single CollectionResultsBody component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(CollectionResultsBody).length).toBe(1)
    expect(enzymeWrapper.find(CollectionResultsBody).props().browser).toEqual({
      name: 'browser name'
    })
    expect(enzymeWrapper.find(CollectionResultsBody).props().collectionsMetadata).toEqual({
      id1: {
        title: 'collection 1 title'
      },
      id2: {
        title: 'collection 2 title'
      }
    })
    expect(enzymeWrapper.find(CollectionResultsBody).props().projectCollectionsIds).toEqual([])
    expect(enzymeWrapper.find(CollectionResultsBody).props().location).toEqual({
      value: 'location'
    })
    expect(typeof enzymeWrapper.find(CollectionResultsBody).props().onAddProjectCollection).toEqual('function')
    expect(typeof enzymeWrapper.find(CollectionResultsBody).props().onRemoveCollectionFromProject).toEqual('function')
    expect(typeof enzymeWrapper.find(CollectionResultsBody).props().onViewCollectionGranules).toEqual('function')
    expect(typeof enzymeWrapper.find(CollectionResultsBody).props().onViewCollectionDetails).toEqual('function')
  })

  test('loadNextPage calls onChangeCollectionPageNum', () => {
    const { enzymeWrapper, props } = setup()

    const collectionResultsBody = enzymeWrapper.find(CollectionResultsBody)

    collectionResultsBody.prop('loadNextPage')()

    setTimeout(() => {
      expect(props.onChangeCollectionPageNum.mock.calls.length).toBe(1)
      expect(props.onChangeCollectionPageNum.mock.calls[0]).toEqual([2])
    }, 0)
  })
})
