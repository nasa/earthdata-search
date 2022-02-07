import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import SearchSidebarHeader from '../SearchSidebarHeader'
import SearchFormContainer from '../../../containers/SearchFormContainer/SearchFormContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    location: {
      pathname: '/search',
      search: ''
    },
    onFocusedCollectionChange: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<SearchSidebarHeader {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('SearchSidebarHeader component', () => {
  test('renders the SearchFormContainer', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(SearchFormContainer).exists()).toBeTruthy()
  })

  test('does not display a "Back to collections" link on search page', () => {
    const { enzymeWrapper } = setup({
      location: {
        pathname: '/search',
        search: ''
      }
    })

    expect(enzymeWrapper.find('.search-sidebar-header__link-wrapper--is-active').length).toBe(0)
  })

  test('does not display a "Back to collections" link on portal search page', () => {
    const { enzymeWrapper } = setup({
      location: {
        pathname: '/portal/mockPortal/search',
        search: ''
      }
    })

    expect(enzymeWrapper.find('.search-sidebar-header__link-wrapper--is-active').length).toBe(0)
  })
})
