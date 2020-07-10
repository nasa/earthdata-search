import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import SearchSidebarHeader from '../SearchSidebarHeader'
import SearchFormContainer from '../../../containers/SearchFormContainer/SearchFormContainer'
import PortalLinkContainer from '../../../containers/PortalLinkContainer/PortalLinkContainer'

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

  test('displays a "Back to collections" link on granules page', () => {
    const { enzymeWrapper } = setup({
      location: {
        pathname: '/search/granules',
        search: '?p=C12345-EDSC'
      }
    })

    expect(enzymeWrapper.find('.search-sidebar-header__link-wrapper--is-active').length).toBe(1)
  })

  test('clicking the "Back to collections" link calls onFocusedCollectionChange', () => {
    const { enzymeWrapper, props } = setup({
      location: {
        pathname: '/search/granules',
        search: '?p=C12345-EDSC'
      }
    })

    enzymeWrapper.find(PortalLinkContainer).simulate('click')

    expect(props.onFocusedCollectionChange).toBeCalledTimes(1)
    expect(props.onFocusedCollectionChange).toBeCalledWith('')
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
