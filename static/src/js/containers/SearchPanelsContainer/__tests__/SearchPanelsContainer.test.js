import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { SearchPanelsContainer } from '../SearchPanelsContainer'
import SearchPanels from '../../../components/SearchPanels/SearchPanels'

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
    location: {},
    match: {
      url: '/search'
    },
    mapProjection: '',
    onApplyGranuleFilters: jest.fn(),
    onChangeQuery: jest.fn(),
    onFocusedCollectionChange: jest.fn(),
    onMetricsCollectionSortChange: jest.fn(),
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
