import React from 'react'

import { screen, render } from '@testing-library/react'
import '@testing-library/jest-dom'

import ExternalLink from '../ExternalLink'

const setup = () => {
  render(<ExternalLink href="example.test.com">example.test.com</ExternalLink>)
}

describe('when a link and child is passed into the component', () => {
  test('the link renders and the external icon appears', () => {
    setup()
    expect(screen.getByRole('link', { name: 'example.test.com' })).toBeInTheDocument()
    expect(screen.getByTestId('edsc-icon')).toBeInTheDocument()
  })
})
