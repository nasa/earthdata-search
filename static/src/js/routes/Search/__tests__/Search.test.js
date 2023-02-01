import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { Search } from '../Search'
import PortalFeatureContainer from '../../../containers/PortalFeatureContainer/PortalFeatureContainer'
import AdvancedSearchModalContainer from '../../../containers/AdvancedSearchModalContainer/AdvancedSearchModalContainer'

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
    onUpdateAdvancedSearch: jest.fn()
  }

  const enzymeWrapper = shallow(<Search {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

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
