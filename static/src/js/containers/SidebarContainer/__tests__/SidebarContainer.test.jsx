import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import { SidebarContainer } from '../SidebarContainer'
import Sidebar from '../../../components/Sidebar/Sidebar'

jest.mock('../../../components/Sidebar/Sidebar', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: SidebarContainer,
  defaultProps: {
    headerChildren: null,
    panels: null,
    children: <div>Sidebar Children</div>
  },
  defaultZustandState: {
    location: {
      location: {
        pathname: '/search'
      }
    }
  }
})

describe('SidebarContainer component', () => {
  describe('when the sidebar is not visible', () => {
    test('passes its props and renders a single Sidebar component', () => {
      setup({
        overrideZustandState: {
          location: {
            location: {
              pathname: '/downloads'
            }
          }
        }
      })

      expect(Sidebar).toHaveBeenCalledTimes(1)
      expect(Sidebar).toHaveBeenCalledWith(
        {
          children: <div>Sidebar Children</div>,
          headerChildren: null,
          panels: null,
          visible: false
        },
        {}
      )
    })
  })

  describe('when the sidebar is visible', () => {
    test('passes its props and renders a single Sidebar component', () => {
      setup()

      expect(Sidebar).toHaveBeenCalledTimes(1)
      expect(Sidebar).toHaveBeenCalledWith(
        {
          children: <div>Sidebar Children</div>,
          headerChildren: null,
          panels: null,
          visible: true
        },
        {}
      )
    })
  })
})
