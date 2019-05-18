import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import SearchForm from '../SearchForm'
import TextField from '../../FormFields/TextField/TextField'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    auth: '',
    keywordSearch: 'Test value',
    onChangeNlpSearch: jest.fn(),
    onClearFilters: jest.fn()
  }

  const enzymeWrapper = shallow(<SearchForm {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('SearchForm component', () => {
  test('should render self and form fields', () => {
    const { enzymeWrapper } = setup()
    const keywordSearch = enzymeWrapper.find('TextField')

    expect(keywordSearch.prop('name')).toEqual('keywordSearch')
    expect(keywordSearch.prop('value')).toEqual('Test value')
  })

  test('should call onInputChange when TextField value changes', () => {
    const { enzymeWrapper } = setup()
    const input = enzymeWrapper.find(TextField)

    expect(enzymeWrapper.state().keywordSearch).toEqual('Test value')

    input.simulate('change', 'keywordSearch', 'new value')
    expect(enzymeWrapper.state().keywordSearch).toEqual('new value')
  })

  test('should call onBlur when the TextField is blurred', () => {
    const { enzymeWrapper, props } = setup()
    const input = enzymeWrapper.find(TextField)

    input.simulate('change', 'keywordSearch', 'new value')
    input.simulate('blur')

    expect(props.onChangeNlpSearch.mock.calls.length).toBe(1)
    expect(props.onChangeNlpSearch.mock.calls[0]).toEqual(['new value'])
  })

  test('should call onClearFilters when the Clear Button is clicked', () => {
    const { enzymeWrapper, props } = setup()
    const button = enzymeWrapper.find('.search-form__button--clear')

    button.simulate('click')

    expect(props.onClearFilters.mock.calls.length).toBe(1)
  })

  test('componentWillReceiveProps sets the state', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.state().keywordSearch).toEqual('Test value')
    const newSearch = 'new seach'
    enzymeWrapper.setProps({ keywordSearch: newSearch })
    expect(enzymeWrapper.state().keywordSearch).toEqual(newSearch)
  })
})
