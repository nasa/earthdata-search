import React from 'react'
import { render, screen } from '@testing-library/react'

import NotAvailableIcon from '../NotAvailableIcon'

describe('NotAvailableIcon component', () => {
  test('sets width and height correctly', () => {
    render(<NotAvailableIcon size="1rem" />)

    const svg = screen.getByRole('graphics-symbol')

    expect(svg).toHaveAttribute('width', '1rem')
    expect(svg).toHaveAttribute('height', '1rem')
  })
})
