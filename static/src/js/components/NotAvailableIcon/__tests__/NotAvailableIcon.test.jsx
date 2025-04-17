import React from 'react'
import { render, screen } from '@testing-library/react'

import NotAvailableIcon from '../NotAvailableIcon'

describe('NotAvailableIcon component', () => {
  test('sets width and height correctly', () => {
    render(<NotAvailableIcon size="16px" />)

    const svg = screen.getByRole('graphics-symbol')

    expect(svg).toHaveAttribute('width', '16px')
    expect(svg).toHaveAttribute('height', '16px')
  })
})
