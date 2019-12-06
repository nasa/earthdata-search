import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { SearchFormContainer } from '../SearchFormContainer'
import SearchForm from '../../../components/SearchForm/SearchForm'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    keywordSearch: 'Test value',
    onClearFilters: jest.fn(),
    onChangeQuery: jest.fn(),
    onChangeFocusedCollection: jest.fn(),
    onToggleAdvancedSearchModal: jest.fn()
  }

  const enzymeWrapper = shallow(<SearchFormContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('SearchFormContainer component', () => {
  test('passes its props and renders a single SearchForm component', () => {
    const { enzymeWrapper, props } = setup()

    expect(enzymeWrapper.find(SearchForm).length).toBe(1)
    expect(enzymeWrapper.find(SearchForm).props().keywordSearch)
      .toEqual('Test value')
    expect(enzymeWrapper.find(SearchForm).props().onClearFilters)
      .toEqual(props.onClearFilters)
    expect(enzymeWrapper.find(SearchForm).props().onChangeQuery)
      .toEqual(props.onChangeQuery)
    expect(enzymeWrapper.find(SearchForm).props().onToggleAdvancedSearchModal)
      .toEqual(props.onToggleAdvancedSearchModal)
  })
})
