import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import {
  Search,
  mapDispatchToProps,
  mapStateToProps
} from '../Search'
import PortalFeatureContainer from '../../../containers/PortalFeatureContainer/PortalFeatureContainer'
import AdvancedSearchModalContainer from '../../../containers/AdvancedSearchModalContainer/AdvancedSearchModalContainer'

import actions from '../../../actions'

// Mock react-leaflet because it causes errors
jest.mock('react-leaflet', () => ({
  createLayerComponent: jest.fn().mockImplementation(() => {})
}))

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    collectionQuery: {},
    match: {},
    advancedSearch: {},
    onChangeQuery: jest.fn(),
    onTogglePortalBrowserModal: jest.fn(),
    onUpdateAdvancedSearch: jest.fn()
  }

  const enzymeWrapper = shallow(<Search {...props} />)

  return {
    enzymeWrapper,
    props
  }
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

describe('Search component', () => {
  test('should render self', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.exists()).toBeTruthy()
  })

  test('renders AdvancedSearchModalContainer under PortalFeatureContainer', () => {
    const { enzymeWrapper } = setup()

    const advancedSearchModalContainer = enzymeWrapper
      .find(PortalFeatureContainer)
      .find(AdvancedSearchModalContainer)
    const portalFeatureContainer = advancedSearchModalContainer.parents(PortalFeatureContainer)

    expect(advancedSearchModalContainer.exists()).toBeTruthy()
    expect(portalFeatureContainer.props().advancedSearch).toBeTruthy()
  })

  test('renders the Additional Filters under PortalFeatureContainer', () => {
    const { enzymeWrapper } = setup()

    const filters = enzymeWrapper
      .find('#input__only-granules')
    const portalFeatureContainer = filters
      .parents(PortalFeatureContainer) // #input__only-granules PortalFeatureContainer
      .first()
      .parents(PortalFeatureContainer) // Additional Filters PortalFeatureContainer

    expect(portalFeatureContainer.props().onlyGranulesCheckbox).toBeTruthy()
    expect(portalFeatureContainer.props().nonEosdisCheckbox).toBeTruthy()
  })

  test('renders the "Include collections without granules" checkbox under PortalFeatureContainer', () => {
    const { enzymeWrapper } = setup()

    const filters = enzymeWrapper
      .find('#input__only-granules')
    const portalFeatureContainer = filters.parents(PortalFeatureContainer).first()

    expect(portalFeatureContainer.props().onlyGranulesCheckbox).toBeTruthy()
  })

  test('renders the "Include only EOSDIS collections" checkbox under PortalFeatureContainer', () => {
    const { enzymeWrapper } = setup()

    const filters = enzymeWrapper
      .find('#input__non-eosdis')
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
