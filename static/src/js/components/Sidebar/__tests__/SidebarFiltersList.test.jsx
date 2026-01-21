import React from 'react'
import { screen } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import SidebarFiltersList from '../SidebarFiltersList'

const setup = setupTest({
  Component: SidebarFiltersList,
  defaultProps: {
    children: <div>Test Child</div>
  }
})

describe('SidebarFiltersList component', () => {
  test('renders itself correctly', () => {
    setup()

    expect(screen.getByRole('list')).toBeInTheDocument()
  })

  test('is passed a child', () => {
    setup()

    expect(screen.getByText('Test Child')).toBeInTheDocument()
  })
})
