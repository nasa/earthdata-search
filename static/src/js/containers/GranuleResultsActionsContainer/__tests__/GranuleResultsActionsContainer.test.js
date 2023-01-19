import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import actions from '../../../actions'
import { mapDispatchToProps, mapStateToProps, GranuleResultsActionsContainer } from '../GranuleResultsActionsContainer'
import GranuleResultsActions from '../../../components/GranuleResults/GranuleResultsActions'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    location: {
      search: 'value'
    },
    collectionMetadata: {
      mock: 'data'
    },
    collectionQuery: {},
    focusedCollectionId: 'focusedCollection',
    focusedProjectCollection: {
      accessMethods: {},
      selectedAccessMethod: '',
      granules: {
        params: {
          pageNum: 1
        },
        isLoaded: true,
        isLoading: false,
        hits: 100,
        totalSize: '',
        allIds: [],
        addedIds: [],
        removedIds: []
      }
    },
    granuleQuery: {
      pageNum: 1
    },
    granuleSearchResults: {
      isLoaded: true,
      isLoading: false,
      hits: 100,
      allIds: [],
      excludledGranuleIds: []
    },
    map: {},
    project: {
      collections: {
        allIds: ['focusedCollection'],
        byId: {
          focusedCollection: {
            accessMethods: {},
            selectedAccessMethod: '',
            granules: {
              params: {
                pageNum: 1
              },
              isLoaded: true,
              isLoading: false,
              hits: 100,
              totalSize: '',
              allIds: [],
              addedIds: [],
              removedIds: []
            }
          }
        }
      }
    },
    onAddProjectCollection: jest.fn(),
    onRemoveCollectionFromProject: jest.fn(),
    onSetActivePanelSection: jest.fn(),
    onChangePath: jest.fn(),
    subscriptions: []
  }

  const enzymeWrapper = shallow(<GranuleResultsActionsContainer {...props} />)

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

  test('onSetActivePanelSection calls actions.setActivePanelSection', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'setActivePanelSection')

    mapDispatchToProps(dispatch).onSetActivePanelSection('panelId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('panelId')
  })

  test('onUpdateFocusedCollection calls actions.updateFocusedCollection', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateFocusedCollection')

    mapDispatchToProps(dispatch).onUpdateFocusedCollection('collectionId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('collectionId')
  })

  test('onChangePath calls actions.changePath', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changePath')

    mapDispatchToProps(dispatch).onChangePath('path')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('path')
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      metadata: {
        collections: {
          collectionId: {
            subscriptions: []
          }
        }
      },
      focusedCollection: 'collectionId',
      focusedGranule: 'granuleId',
      query: {
        collection: {}
      },
      map: {
        projection: 'TestProjection'
      },
      project: {},
      shapefile: {}
    }

    const expectedState = {
      collectionMetadata: {
        subscriptions: []
      },
      collectionQuery: {},
      focusedCollectionId: 'collectionId',
      focusedProjectCollection: {},
      granuleQuery: {},
      granuleSearchResults: {},
      map: {
        projection: 'TestProjection'
      },
      project: {},
      subscriptions: []
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('GranuleResultsActionsContainer component', () => {
  test('passes its props and renders a single GranuleResultsActions component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(GranuleResultsActions).length).toBe(1)
    expect(enzymeWrapper.find(GranuleResultsActions).props().focusedCollectionId).toEqual('focusedCollection')
    expect(enzymeWrapper.find(GranuleResultsActions).props().isCollectionInProject).toEqual(true)

    expect(typeof enzymeWrapper.find(GranuleResultsActions).props().onAddProjectCollection).toEqual('function')
    expect(typeof enzymeWrapper.find(GranuleResultsActions).props().onRemoveCollectionFromProject).toEqual('function')
  })
})
