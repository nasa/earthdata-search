import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { SearchFormContainer } from '../SearchFormContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    keywordSearch: 'Test value',
    getCollections: jest.fn(),
    onChangeKeywordSearch: jest.fn()
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
    expect(props.onChangeKeywordSearch.mock.calls.length).toBe(1)
    expect(props.onChangeKeywordSearch.mock.calls[0]).toEqual(['new value'])

    expect(props.getCollections.mock.calls.length).toBe(2) // called once on componentDidMount
    expect(props.getCollections.mock.calls[1]).toEqual(['new value'])
  })

  test('should call getCollections on page load', () => {
    const { props } = setup()

    expect(props.getCollections.mock.calls.length).toBe(1)
    expect(props.getCollections.mock.calls[0]).toEqual(['Test value'])
  })
})
