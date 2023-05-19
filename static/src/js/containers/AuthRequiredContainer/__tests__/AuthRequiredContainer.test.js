import React from 'react'
import { render, screen } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import '@testing-library/jest-dom'
import * as tinyCookie from 'tiny-cookie'

import { AuthRequiredContainer, mapStateToProps } from '../AuthRequiredContainer'

const setup = (overrideProps) => {
  const props = {
    children: 'children',
    earthdataEnvironment: 'prod',
    ...overrideProps
  }

  act(() => {
    render(
      <AuthRequiredContainer {...props} />
    )
  })
}

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      earthdataEnvironment: 'prod'
    }

    const expectedState = {
      earthdataEnvironment: 'prod'
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('AuthRequiredContainer component', () => {
  const { href } = window.location

  afterEach(() => {
    jest.clearAllMocks()
    window.location.href = href
  })

  test('should redirect if there is no auth cookie', () => {
    jest.spyOn(tinyCookie, 'get').mockImplementation((param) => {
      if (param === 'authToken') return null
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
    jest.spyOn(tinyCookie, 'get').mockImplementation((param) => {
      if (param === 'authToken') return 'token'
      return null
    })

    setup()
    expect(screen.getByText('children')).toBeInTheDocument()
  })

  describe('when redirect is set to false', () => {
    test('should not redirect if there is no auth cookie', () => {
      jest.spyOn(tinyCookie, 'get').mockImplementation((param) => {
        if (param === 'authToken') return null
        return null
      })

      const returnPath = 'http://example.com/test/path'
      delete window.location
      window.location = { href: returnPath }

      setup({ noRedirect: true })
      expect(screen.getByTestId('auth-required')).toBeInTheDocument()
      expect(window.location.href).toEqual('http://example.com/test/path')
    })

    test('should not render the children', () => {
      jest.spyOn(tinyCookie, 'get').mockImplementation((param) => {
        if (param === 'authToken') return null
        return null
      })

      setup({ noRedirect: true })
      expect(screen.queryByText('children')).not.toBeInTheDocument()
    })
  })
})
