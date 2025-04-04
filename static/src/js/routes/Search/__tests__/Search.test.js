import React from 'react'
import { render, screen } from '@testing-library/react'

import { Router } from 'react-router'
import { createMemoryHistory } from 'history'
import {
  Search,
  mapDispatchToProps,
  mapStateToProps
} from '../Search'
import PortalFeatureContainer from '../../../containers/PortalFeatureContainer/PortalFeatureContainer'
import actions from '../../../actions'
import Providers from '../../../providers/Providers/Providers'

// Mock react-leaflet because it causes errors
jest.mock('react-leaflet', () => ({
  createLayerComponent: jest.fn().mockImplementation(() => {})
}))

jest.mock('../../../containers/SidebarContainer/SidebarContainer', () => {
  const SidebarContainer = () => <div data-testid="mocked-SidebarContainer" />

  return SidebarContainer
})

jest.mock('../../../containers/PortalBrowserModalContainer/PortalBrowserModalContainer', () => {
  const PortalBrowserModalContainer = () => <div data-testid="mocked-PortalBrowserModalContainer" />

  return PortalBrowserModalContainer
})

jest.mock('../../../containers/RelatedUrlsModalContainer/RelatedUrlsModalContainer', () => {
  const RelatedUrlsModalContainer = () => <div data-testid="mocked-RelatedUrlsModalContainer" />

  return RelatedUrlsModalContainer
})

jest.mock('../../../containers/FacetsModalContainer/FacetsModalContainer', () => {
  const FacetsModalContainer = () => <div data-testid="mocked-FacetsModalContainer" />

  return FacetsModalContainer
})

jest.mock('../../../containers/PortalFeatureContainer/PortalFeatureContainer', () => (
  jest.fn(({ children }) => (
    <mock-PortalFeatureContainer data-testid="PortalFeatureContainer">
      {children}
    </mock-PortalFeatureContainer>
  ))
))

jest.mock('../../../containers/AdvancedSearchModalContainer/AdvancedSearchModalContainer', () => {
  const AdvancedSearchModalContainer = () => <div data-testid="mock-AdvancedSearchModalContainer" />

  return AdvancedSearchModalContainer
})

beforeEach(() => {
  jest.clearAllMocks()
})

afterEach(() => {
  // Don't share global state between the tests
  delete global.ResizeObserver
})

const history = createMemoryHistory()

function setup() {
  const props = {
    collectionQuery: {},
    match: {},
    advancedSearch: {},
    onChangeQuery: jest.fn(),
    onTogglePortalBrowserModal: jest.fn(),
    onUpdateAdvancedSearch: jest.fn()
  }

  render(
    <Providers>
      <Router history={history} location={props.location}>
        <Search {...props} />
      </Router>
    </Providers>
  )
}

describe('mapDispatchToProps', () => {
  test('onChangeQuery calls actions.changeQuery', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeQuery')

    mapDispatchToProps(dispatch).onChangeQuery({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onTogglePortalBrowserModal calls actions.togglePortalBrowserModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'togglePortalBrowserModal')

    mapDispatchToProps(dispatch).onTogglePortalBrowserModal({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onUpdateAdvancedSearch calls actions.updateAdvancedSearch', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateAdvancedSearch')

    mapDispatchToProps(dispatch).onUpdateAdvancedSearch({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      query: {
        collection: {}
      }
    }

    const expectedState = {
      collectionQuery: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

// TODO fix these tests
describe.skip('Search component', () => {
  test('should render self', () => {
    setup()

    expect(screen.getByTestId('mocked-SidebarContainer')).toBeInTheDocument()
  })

  test('renders AdvancedSearchModalContainer under PortalFeatureContainer', () => {
    setup()
    screen.debug()
    // Expect(screen.getByTestId('mock-AdvancedSearchModalContainer').parentElement.dataset.testid).toBe('PortalFeatureContainer')
  })

  test('calls onTogglePortalBrowserModal(true) when "Browse Portals" button is clicked', () => {
    const { enzymeWrapper, props } = setup()

    const browsePortalsButton = enzymeWrapper.find('Button').filterWhere((button) => button.text().includes('Browse Portals'))

    browsePortalsButton.simulate('click')

    expect(props.onTogglePortalBrowserModal).toHaveBeenCalledWith(true)
  })

  test('renders the Additional Filters under PortalFeatureContainer', () => {
    const { enzymeWrapper } = setup()

    const filters = enzymeWrapper.find('#input__only-granules')
    const portalFeatureContainer = filters
      .parents(PortalFeatureContainer) // #input__only-granules PortalFeatureContainer
      .first()
      .parents(PortalFeatureContainer) // Additional Filters PortalFeatureContainer

    expect(portalFeatureContainer.props().onlyGranulesCheckbox).toBeTruthy()
    expect(portalFeatureContainer.props().nonEosdisCheckbox).toBeTruthy()
  })

  test('renders the "Include collections without granules" checkbox under PortalFeatureContainer', () => {
    const { enzymeWrapper } = setup()

    const filters = enzymeWrapper.find('#input__only-granules')
    const portalFeatureContainer = filters.parents(PortalFeatureContainer).first()

    expect(portalFeatureContainer.props().onlyGranulesCheckbox).toBeTruthy()
  })

  test('renders the "Include only EOSDIS collections" checkbox under PortalFeatureContainer', () => {
    const { enzymeWrapper } = setup()

    const filters = enzymeWrapper.find('#input__non-eosdis')
    const portalFeatureContainer = filters.parents(PortalFeatureContainer).first()

    expect(portalFeatureContainer.props().nonEosdisCheckbox).toBeTruthy()
  })

  describe('handleCheckboxCheck', () => {
    test('checking the "Include collections without granules" checkbox calls onChangeQuery', () => {
      const { enzymeWrapper, props } = setup()

      const event = {
        target: {
          checked: true,
          id: 'input__only-granules'
        }
      }

      enzymeWrapper.find('#input__only-granules').props().onChange(event)

      expect(props.onChangeQuery).toHaveBeenCalledTimes(1)
      expect(props.onChangeQuery).toHaveBeenCalledWith({
        collection: {
          hasGranulesOrCwic: undefined
        }
      })
    })

    test('checking the "Include only EOSDIS collections" checkbox calls onChangeQuery', () => {
      const { enzymeWrapper, props } = setup()

      const event = {
        target: {
          checked: true,
          id: 'input__non-eosdis'
        }
      }

      enzymeWrapper.find('#input__non-eosdis').props().onChange(event)

      expect(props.onChangeQuery).toHaveBeenCalledTimes(1)
      expect(props.onChangeQuery).toHaveBeenCalledWith({
        collection: {
          onlyEosdisCollections: true
        }
      })
    })
  })
})
