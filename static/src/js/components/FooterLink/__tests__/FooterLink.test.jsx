import { screen } from '@testing-library/react'

import { FooterLink } from '../FooterLink'
import setupTest from '../../../../../../jestConfigs/setupTest'

const setup = setupTest({
  Component: FooterLink,
  defaultProps: {
    href: 'http://example.com',
    title: 'Example Link'
  }
})

describe('FooterLink component', () => {
  test('it renders the link', () => {
    setup()

    expect(screen.getByRole('link').href).toEqual('http://example.com/')
    expect(screen.getByRole('link').textContent).toEqual('Example Link')
  })

  test('it renders the link with secondary classNames', () => {
    setup({
      overrideProps: {
        secondary: true
      }
    })

    expect(screen.getByRole('link').href).toEqual('http://example.com/')
    expect(screen.getByRole('link').textContent).toEqual('Example Link')
    expect(screen.getByRole('link').className).toContain('link footer-link__info-link footer-link__info-link--underline')
  })
})
