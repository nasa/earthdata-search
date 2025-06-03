import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import { mapStateToProps, SearchSidebarHeaderContainer } from '../SearchSidebarHeaderContainer'
import SearchSidebarHeader from '../../../components/SearchSidebar/SearchSidebarHeader'

jest.mock('../../../components/SearchSidebar/SearchSidebarHeader', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: SearchSidebarHeaderContainer,
  defaultProps: {
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
    }
  }
})

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
    setup()

    expect(SearchSidebarHeader).toHaveBeenCalledTimes(1)
    expect(SearchSidebarHeader).toHaveBeenCalledWith({
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
      }
    }, {})
  })
})
