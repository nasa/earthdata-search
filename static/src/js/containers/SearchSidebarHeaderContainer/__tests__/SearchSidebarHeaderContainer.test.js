import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import { mapStateToProps, SearchSidebarHeaderContainer } from '../SearchSidebarHeaderContainer'
import SearchSidebarHeader from '../../../components/SearchSidebar/SearchSidebarHeader'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    location: {
      search: '?some=test-params'
    },
    onFocusedCollectionChange: jest.fn(),
    portal: {
      title: {
        primary: 'Earthdata Search'
      },
      logo: {
        id: 'idn-logo',
        link: 'https://idn.ceos.org/',
        title: 'CEOS IDN Search'
      },
      portalId: 'edsc'
    },
    onChangePath: jest.fn(),
    onLoadPortalConfig: jest.fn()
  }

  const enzymeWrapper = shallow(<SearchSidebarHeaderContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      portal: {
        portalId: 'edsc'
      }
    }

    const expectedState = {
      portal: {
        portalId: 'edsc'
      }
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('SearchSidebarHeaderContainer component', () => {
  test('passes its props and renders a single SearchSidebarHeader component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(SearchSidebarHeader).length).toBe(1)
    expect(enzymeWrapper.find(SearchSidebarHeader).props().location).toEqual({
      search: '?some=test-params'
    })
  })
})
