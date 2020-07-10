import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router'
import configureStore from '../../../store/configureStore'

import SearchPanels from '../SearchPanels'
import Panels from '../../Panels/Panels'

const store = configureStore()

beforeEach(() => {
  jest.clearAllMocks()
})

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps, location = '/search') {
  const props = {
    location: {},
    match: {
      url: '/search'
    },
    onTogglePanels: jest.fn(),
    onSetActivePanel: jest.fn(),
    panels: {
      activePanel: '0.0.0',
      isOpen: true
    },
    preferences: {
      panelState: 'default',
      collectionListView: 'default',
      granuleListView: 'default'
    },
    portal: {
      portalId: ''
    },
    ...overrideProps
  }

  const enzymeWrapper = mount(
    <Provider store={store}>
      <StaticRouter location={location}>
        <SearchPanels {...props} />
      </StaticRouter>
    </Provider>
  )

  return {
    enzymeWrapper,
    props
  }
}

describe('SearchPanels component', () => {
  test('renders a Panels component for search page', () => {
    const { enzymeWrapper } = setup()

    const panels = enzymeWrapper.find(Panels)
    expect(panels.props().show).toBeTruthy()
    expect(panels.props().activePanel).toEqual('0.0.0')
    expect(panels.props().draggable).toBeTruthy()
    expect(panels.props().panelState).toEqual('default')
  })

  test('renders a Panels component for granules page', () => {
    const { enzymeWrapper } = setup({}, '/search/granules')

    const panels = enzymeWrapper.find(Panels)
    expect(panels.props().show).toBeTruthy()
    expect(panels.props().activePanel).toEqual('0.1.0')
    expect(panels.props().draggable).toBeTruthy()
    expect(panels.props().panelState).toEqual('default')
  })

  test('renders a Panels component for collection details page', () => {
    const { enzymeWrapper } = setup({}, '/search/granules/collection-details')

    const panels = enzymeWrapper.find(Panels)
    expect(panels.props().show).toBeTruthy()
    expect(panels.props().activePanel).toEqual('0.2.0')
    expect(panels.props().draggable).toBeTruthy()
    expect(panels.props().panelState).toEqual('default')
  })

  test('renders a Panels component for granule details page', () => {
    const { enzymeWrapper } = setup({}, '/search/granules/granule-details')

    const panels = enzymeWrapper.find(Panels)
    expect(panels.props().show).toBeTruthy()
    expect(panels.props().activePanel).toEqual('0.3.0')
    expect(panels.props().draggable).toBeTruthy()
    expect(panels.props().panelState).toEqual('default')
  })

  describe('componentDidUpdate updates the state if the panelView props have changed', () => {
    const { enzymeWrapper, props } = setup()

    const newProps = {
      ...props,
      preferences: {
        ...props.preferences,
        collectionListView: 'table'
      }
    }
    // setProps only updates the props of the root component, so we need to update the children prop to get to SearchPanels
    enzymeWrapper.setProps({
      children: (
        <StaticRouter location="/search">
          <SearchPanels {...newProps} />
        </StaticRouter>
      )
    })

    expect(enzymeWrapper.find(SearchPanels).instance().state.collectionPanelView).toEqual('table')
  })

  test('onPanelClose calls onTogglePanels', () => {
    const { enzymeWrapper, props } = setup()

    enzymeWrapper.find(SearchPanels).instance().onPanelClose()
    expect(props.onTogglePanels).toHaveBeenCalledTimes(1)
    expect(props.onTogglePanels).toHaveBeenCalledWith(false)
  })

  test('onChangePanel calls onSetActivePanel', () => {
    const { enzymeWrapper, props } = setup()

    enzymeWrapper.find(SearchPanels).instance().onChangePanel('0.1.0')
    expect(props.onSetActivePanel).toHaveBeenCalledTimes(1)
    expect(props.onSetActivePanel).toHaveBeenCalledWith('0.1.0')
  })

  test('onChangeCollectionPanelView sets the state', () => {
    const { enzymeWrapper } = setup()

    enzymeWrapper.find(SearchPanels).instance().onChangeCollectionPanelView('table')

    expect(enzymeWrapper.find(SearchPanels).instance().state.collectionPanelView).toEqual('table')
  })

  test('onChangeGranulePanelView sets the state', () => {
    const { enzymeWrapper } = setup()

    enzymeWrapper.find(SearchPanels).instance().onChangeGranulePanelView('table')

    expect(enzymeWrapper.find(SearchPanels).instance().state.granulePanelView).toEqual('table')
  })

  test('updatePanelViewState sets the state', () => {
    const { enzymeWrapper } = setup()

    enzymeWrapper.find(SearchPanels).instance().updatePanelViewState({
      collectionPanelView: 'table'
    })

    expect(enzymeWrapper.find(SearchPanels).instance().state.collectionPanelView).toEqual('table')
    expect(enzymeWrapper.find(SearchPanels).instance().state.granulePanelView).toEqual('list')
  })
})
