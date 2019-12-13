import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { AdvancedSearchModalContainer } from '../AdvancedSearchModalContainer'
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
    onToggleAdvancedSearchModal: jest.fn()
  }

  const enzymeWrapper = shallow(<AdvancedSearchModalContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

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
  })
})
