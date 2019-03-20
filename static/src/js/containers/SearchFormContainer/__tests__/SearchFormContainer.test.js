import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { SearchFormContainer } from '../SearchFormContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    keywordSearch: 'Test value',
    onChangeQuery: jest.fn(),
    onClearFilters: jest.fn()
  }

  const enzymeWrapper = shallow(<SearchFormContainer {...props} />)

  return {
    props,
    enzymeWrapper
  }
}

describe('SearchFormContainer component', () => {
  test('should render self and form fields', () => {
    const { enzymeWrapper } = setup()
    const keywordSearch = enzymeWrapper.find('TextField')

    expect(keywordSearch.prop('name')).toEqual('keywordSearch')
    expect(keywordSearch.prop('value')).toEqual('Test value')
  })

  test('should call onInputChange when TextField value changes', () => {
    const { enzymeWrapper } = setup()
    const input = enzymeWrapper.find('TextField')

    expect(enzymeWrapper.state().keywordSearch).toEqual('Test value')

    input.simulate('change', 'keywordSearch', 'new value')
    expect(enzymeWrapper.state().keywordSearch).toEqual('new value')
  })

  test('should call onBlur when the TextField is blurred', () => {
    const { enzymeWrapper, props } = setup()
    const input = enzymeWrapper.find('TextField')

    input.simulate('change', 'keywordSearch', 'new value')
    input.simulate('blur')

    expect(props.onChangeQuery.mock.calls.length).toBe(1)
    expect(props.onChangeQuery.mock.calls[0]).toEqual([{ keyword: 'new value' }])
  })

  test('should call onClearFilters when the Clear Button is clicked', () => {
    const { enzymeWrapper, props } = setup()
    const button = enzymeWrapper.find('Button')

    button.simulate('click')

    expect(props.onClearFilters.mock.calls.length).toBe(1)
  })

  test('componentWillReceiveProps sets the state', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.state().keywordSearch).toEqual('Test value')
    const newSearch = 'new seach'
    enzymeWrapper.setProps({ keywordSearch: newSearch })
  })
})
