import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import actions from '../../../actions'
import { mapDispatchToProps, mapStateToProps, SearchPanelsContainer } from '../SearchPanelsContainer'
import SearchPanels from '../../../components/SearchPanels/SearchPanels'
import * as metricsCollectionSortChange from '../../../middleware/metrics/actions'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    authToken: '',
    collectionMetadata: {},
    collectionQuery: {},
    collectionsSearch: {},
    granuleMetadata: {},
    granuleSearchResults: {},
    granuleQuery: {},
    handoffs: {},
    isExportRunning: {
      csv: false,
      json: false
    },
    location: {},
    match: {
      url: '/search'
    },
    map: {},
    onApplyGranuleFilters: jest.fn(),
    onChangeQuery: jest.fn(),
    onCollectionExport: jest.fn(),
    onFocusedCollectionChange: jest.fn(),
    onGranuleExport: jest.fn(),
    onMetricsCollectionSortChange: jest.fn(),
    onToggleAboutCSDAModal: jest.fn(),
    onToggleAboutCwicModal: jest.fn(),
    onTogglePanels: jest.fn(),
    onSetActivePanel: jest.fn(),
    panels: {
      activePanel: '0.0.0',
      isOpen: false
    },
    preferences: {
      panelState: 'default',
      collectionListView: 'default',
      granuleListView: 'default'
    },
    portal: {
      test: 'portal'
    }
  }

  const enzymeWrapper = shallow(<SearchPanelsContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapDispatchToProps', () => {
  test('onApplyGranuleFilters calls actions.applyGranuleFilters', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'applyGranuleFilters')

    mapDispatchToProps(dispatch).onApplyGranuleFilters({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onChangeQuery calls actions.changeQuery', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeQuery')

    mapDispatchToProps(dispatch).onChangeQuery({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onFocusedCollectionChange calls actions.changeFocusedCollection', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeFocusedCollection')

    mapDispatchToProps(dispatch).onFocusedCollectionChange('collectionId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('collectionId')
  })

  test('onMetricsCollectionSortChange calls metricsCollectionSortChange', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(metricsCollectionSortChange, 'metricsCollectionSortChange')

    mapDispatchToProps(dispatch).onMetricsCollectionSortChange({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onSetActivePanel calls actions.setActivePanel', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'setActivePanel')

    mapDispatchToProps(dispatch).onSetActivePanel('panelId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('panelId')
  })

  test('onToggleAboutCSDAModal calls actions.toggleAboutCSDAModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleAboutCSDAModal')

    mapDispatchToProps(dispatch).onToggleAboutCSDAModal(true)

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(true)
  })

  test('onToggleAboutCwicModal calls actions.toggleAboutCwicModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleAboutCwicModal')

    mapDispatchToProps(dispatch).onToggleAboutCwicModal(true)

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(true)
  })

  test('onTogglePanels calls actions.togglePanels', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'togglePanels')

    mapDispatchToProps(dispatch).onTogglePanels('value')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('value')
  })

  test('onCollectionExport calls actions.exportCollectionSearch', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'exportCollectionSearch')

    mapDispatchToProps(dispatch).onCollectionExport('json')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('json')
  })

  test('onGranuleExport calls actions.exportGranuleSearch', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'exportGranuleSearch')

    mapDispatchToProps(dispatch).onGranuleExport('stac')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('stac')
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      authToken: 'mock-token',
      metadata: {
        collections: {
          collectionId: {
            subscriptions: []
          }
        }
      },
      focusedCollection: 'collectionId',
      handoffs: {},
      map: {
        projection: ''
      },
      panels: {},
      preferences: {
        preferences: {}
      },
      portal: {},
      query: {
        collection: {}
      },
      searchResults: {
        collections: {}
      },
      ui: {
        export: {
          isExportRunning: {
            collection: {
              csv: false,
              json: false
            },
            granule: {
              stac: false
            }
          }
        }
      }
    }

    const expectedState = {
      authToken: 'mock-token',
      collectionMetadata: {
        subscriptions: []
      },
      collectionQuery: {},
      collectionsSearch: {},
      granuleMetadata: {},
      granuleSearchResults: {},
      granuleQuery: {},
      handoffs: {},
      isExportRunning: {
        collection: {
          csv: false,
          json: false
        },
        granule: {
          stac: false
        }
      },
      map: {
        projection: ''
      },
      panels: {},
      preferences: {},
      portal: {},
      subscriptions: []
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('SearchPanelsContainer component', () => {
  test('passes its props and renders a single SearchPanels component', () => {
    const { enzymeWrapper } = setup()

    const searchPanels = enzymeWrapper.find(SearchPanels)

    expect(searchPanels.length).toBe(1)
    expect(typeof searchPanels.props().onSetActivePanel).toEqual('function')
    expect(typeof searchPanels.props().onTogglePanels).toEqual('function')
    expect(searchPanels.props().panels).toEqual({
      activePanel: '0.0.0',
      isOpen: false
    })
    expect(searchPanels.props().match).toEqual({ url: '/search' })
    expect(searchPanels.props().portal).toEqual({
      test: 'portal'
    })
  })
})
