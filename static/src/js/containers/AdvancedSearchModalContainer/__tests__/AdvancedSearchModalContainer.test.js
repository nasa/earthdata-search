import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import actions from '../../../actions'
import { AdvancedSearchModalContainer, mapDispatchToProps, mapStateToProps } from '../AdvancedSearchModalContainer'
import { AdvancedSearchModal } from '../../../components/AdvancedSearchModal/AdvancedSearchModal'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    advancedSearch: {},
    isOpen: true,
    isValid: true,
    errors: {},
    fields: [],
    handleBlur: jest.fn(),
    handleChange: jest.fn(),
    handleSubmit: jest.fn(),
    onChangeRegionQuery: jest.fn(),
    onChangeQuery: jest.fn(),
    regionSearchResults: {
      byId: {},
      allIds: []
    },
    resetForm: jest.fn(),
    setFieldValue: jest.fn(),
    setFieldTouched: jest.fn(),
    touched: {},
    values: {},
    validateForm: jest.fn(),
    onToggleAdvancedSearchModal: jest.fn()
  }

  const enzymeWrapper = shallow(<AdvancedSearchModalContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapDispatchToProps', () => {
  test('onToggleAdvancedSearchModal calls actions.toggleAdvancedSearchModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleAdvancedSearchModal')

    mapDispatchToProps(dispatch).onToggleAdvancedSearchModal({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onChangeRegionQuery calls actions.changeRegionQuery', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeRegionQuery')

    mapDispatchToProps(dispatch).onChangeRegionQuery({ mock: 'data' })

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
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      advancedSearch: {},
      searchResults: {
        regions: {}
      },
      ui: {
        advancedSearchModal: {
          isOpen: false
        }
      }
    }

    const expectedState = {
      advancedSearch: {},
      isOpen: false,
      regionSearchResults: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('AdvancedSearchModalContainer component', () => {
  test('passes its props and renders a single FacetsModal component', () => {
    const { enzymeWrapper, props } = setup()

    expect(enzymeWrapper.find(AdvancedSearchModal).length)
      .toBe(1)
    expect(enzymeWrapper.find(AdvancedSearchModal).props().isOpen)
      .toEqual(true)
    expect(enzymeWrapper.find(AdvancedSearchModal).props().onToggleAdvancedSearchModal)
      .toEqual(props.onToggleAdvancedSearchModal)
    expect(enzymeWrapper.find(AdvancedSearchModal).props().advancedSearch)
      .toEqual(props.advancedSearch)
    expect(enzymeWrapper.find(AdvancedSearchModal).props().resetForm)
      .toEqual(props.resetForm)
    expect(enzymeWrapper.find(AdvancedSearchModal).props().onChangeRegionQuery)
      .toEqual(props.onChangeRegionQuery)
    expect(enzymeWrapper.find(AdvancedSearchModal).props().onChangeQuery)
      .toEqual(props.onChangeQuery)
    expect(enzymeWrapper.find(AdvancedSearchModal).props().validateForm)
      .toEqual(props.validateForm)
  })
})
