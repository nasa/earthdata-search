import React from 'react'

import { screen, render } from '@testing-library/react'

import ExternalLink from '../ExternalLink'

const setup = (props) => {
  const { withWrappingLink } = props
  if (withWrappingLink) {
    render(
      <a href="www.example.com">
        <ExternalLink innerLink href="example.test.com">example.test.com</ExternalLink>
      </a>
    )

    return
  }

  render(<ExternalLink href="example.test.com">example.test.com</ExternalLink>)
}

describe('when a link and child is passed into the component', () => {
  test('the link renders and the external icon appears', () => {
    setup({ withWrappingLink: false })
    expect(screen.getByRole('link', { name: 'example.test.com' })).toBeInTheDocument()
    expect(screen.getByTestId('edsc-icon')).toBeInTheDocument()
  })
})

describe('when the link is inside of another link and child is passed into the component', () => {
  test('the link renders only once and the external icon appears', () => {
    setup({ withWrappingLink: true })
    // This will fail without `innerLink` prop because its against DOM rules
    expect(screen.getAllByRole('link', { name: 'example.test.com' }).length).toBe(1)
    expect(screen.getByTestId('edsc-icon')).toBeInTheDocument()
  })
})
