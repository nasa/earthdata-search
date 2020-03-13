import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { SearchSidebarHeaderContainer } from '../SearchSidebarHeaderContainer'
import SearchSidebarHeader from '../../../components/SearchSidebar/SearchSidebarHeader'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    location: {
      search: '?some=test-params'
    },
    onFocusedCollectionChange: jest.fn()
  }

  const enzymeWrapper = shallow(<SearchSidebarHeaderContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('SearchSidebarHeaderContainer component', () => {
  test('passes its props and renders a single SearchSidebarHeader component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(SearchSidebarHeader).length).toBe(1)
    expect(enzymeWrapper.find(SearchSidebarHeader).props().location).toEqual({
      search: '?some=test-params'
    })
    expect(typeof enzymeWrapper.find(SearchSidebarHeader).props().onFocusedCollectionChange).toEqual('function')
  })
})
