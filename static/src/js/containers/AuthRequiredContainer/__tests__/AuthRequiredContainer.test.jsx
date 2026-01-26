import { screen } from '@testing-library/react'
import * as tinyCookie from 'tiny-cookie'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import * as getApplicationConfig from '../../../../../../sharedUtils/config'

import { AuthRequiredContainer } from '../AuthRequiredContainer'

vi.mock('tiny-cookie', () => ({
  get: vi.fn(),
  set: vi.fn(),
  remove: vi.fn()
}))

const setup = setupTest({
  Component: AuthRequiredContainer,
  defaultProps: {
    children: 'children'
  }
})

beforeEach(() => {
  vi.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
    disableDatabaseComponents: false
  }))
})

describe('AuthRequiredContainer component', () => {
  const { href } = window.location

  afterEach(() => {
    window.location.href = href
  })

  test('should redirect if there is no auth cookie', () => {
    vi.spyOn(tinyCookie, 'get').mockImplementation((param) => {
      if (param === 'edlToken') return null

      return null
    })

    const returnPath = 'http://example.com/test/path'
    delete window.location
    window.location = { href: returnPath }

    setup()

    expect(screen.getByTestId('auth-required')).toBeInTheDocument()
    expect(window.location.href).toEqual(`http://localhost:3000/login?ee=prod&state=${encodeURIComponent(returnPath)}`)
  })

  test('should render children if there is an auth cookie', () => {
    vi.spyOn(tinyCookie, 'get').mockImplementation((param) => {
      if (param === 'edlToken') return 'token'

      return null
    })

    setup()

    expect(screen.getByText('children')).toBeInTheDocument()
  })

  describe('when redirect is set to false', () => {
    test('should not redirect if there is no auth cookie', () => {
      vi.spyOn(tinyCookie, 'get').mockImplementation((param) => {
        if (param === 'edlToken') return null

        return null
      })

      const returnPath = 'http://example.com/test/path'
      delete window.location
      window.location = { href: returnPath }

      setup({
        overrideProps: {
          noRedirect: true
        }
      })

      expect(screen.getByTestId('auth-required')).toBeInTheDocument()
      expect(window.location.href).toEqual('http://example.com/test/path')
    })

    test('should not render the children', () => {
      vi.spyOn(tinyCookie, 'get').mockImplementation((param) => {
        if (param === 'edlToken') return null

        return null
      })

      setup({
        overrideProps: {
          noRedirect: true
        }
      })

      expect(screen.queryByText('children')).not.toBeInTheDocument()
    })
  })

  describe('when database components are turned off', () => {
    test('should redirect to the home `search` page', () => {
      vi.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
        disableDatabaseComponents: 'true'
      }))

      setup()

      expect(screen.getByTestId('auth-required')).toBeInTheDocument()
      expect(window.location.href).toEqual('/search')
    })

    test('the token cookie should be cleared', () => {
      vi.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
        disableDatabaseComponents: 'true'
      }))

      vi.spyOn(tinyCookie, 'remove').mockImplementation(() => null)

      setup()

      expect(tinyCookie.remove).toHaveBeenCalledTimes(1)
      expect(tinyCookie.remove).toHaveBeenCalledWith('edlToken')
    })
  })
})
