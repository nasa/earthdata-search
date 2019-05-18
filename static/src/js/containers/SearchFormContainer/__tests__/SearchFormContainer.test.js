import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { SearchFormContainer } from '../SearchFormContainer'
import SearchForm from '../../../components/SearchForm/SearchForm'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    auth: '',
    keywordSearch: 'Test value',
    onClearFilters: jest.fn(),
    onChangeNlpSearch: jest.fn(),
    onChangeQuery: jest.fn()
  }

  const enzymeWrapper = shallow(<SearchFormContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('SearchFormContainer component', () => {
  test('passes its props and renders a single SearchForm component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(SearchForm).length).toBe(1)
    expect(enzymeWrapper.find(SearchForm).props().auth).toEqual('')
    expect(enzymeWrapper.find(SearchForm).props().keywordSearch).toEqual('Test value')
    expect(typeof enzymeWrapper.find(SearchForm).props().onClearFilters).toEqual('function')
    expect(typeof enzymeWrapper.find(SearchForm).props().onChangeNlpSearch).toEqual('function')
    expect(typeof enzymeWrapper.find(SearchForm).props().onChangeQuery).toEqual('function')
  })
})
