import React from 'react'
import { screen } from '@testing-library/react'

import SidebarFiltersItem from '../SidebarFiltersItem'
import setupTest from '../../../../../../jestConfigs/setupTest'

const setup = setupTest({
  Component: SidebarFiltersItem,
  defaultProps: {
    children: <div>Test Child</div>,
    description: 'Test description',
    heading: 'Test heading'
  }
})

describe('SidebarFiltersItem component', () => {
  test('renders a list item', () => {
    setup()

    expect(screen.getByRole('listitem')).toBeInTheDocument()
  })

  test('renders its children correctly', () => {
    setup()

    expect(screen.getByText('Test Child')).toBeInTheDocument()
  })

  test('renders its heading correctly', () => {
    setup()

    expect(screen.getByText('Test heading')).toBeInTheDocument()
  })

  describe('Description', () => {
    test('does not render when null', () => {
      setup({
        overrideProps: {
          description: null
        }
      })

      expect(screen.queryByText('Test description')).not.toBeInTheDocument()
    })

    test('renders correctly when defined', () => {
      setup()

      expect(screen.getByText('Test description')).toBeInTheDocument()
    })
  })
})
