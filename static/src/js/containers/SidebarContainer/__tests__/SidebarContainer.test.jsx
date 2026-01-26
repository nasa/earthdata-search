import React from 'react'
import { useLocation } from 'react-router-dom'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import { SidebarContainer } from '../SidebarContainer'
import Sidebar from '../../../components/Sidebar/Sidebar'

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')), // Preserve other exports
  useLocation: vi.fn().mockReturnValue({
    pathname: '/search',
    search: '',
    hash: '',
    state: null,
    key: 'testKey'
  })
}))

vi.mock('../../../components/Sidebar/Sidebar', () => ({ default: vi.fn(() => null) }))

const setup = setupTest({
  Component: SidebarContainer,
  defaultProps: {
    headerChildren: null,
    panels: null,
    children: <div>Sidebar Children</div>
  }
})

describe('SidebarContainer component', () => {
  describe('when the sidebar is not visible', () => {
    test('passes its props and renders a single Sidebar component', () => {
      useLocation.mockReturnValue({
        pathname: '/downloads'
      })

      setup()

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
      useLocation.mockReturnValue({
        pathname: '/search'
      })

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
