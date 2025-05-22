import React from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'

import usePortalLogo from '../usePortalLogo'

// Use virtual mocks of modules that don't exist anywhere in the system
jest.mock('../../../../../portals/abcPortal/images/logo.png?h=56&format=webp', () => ('abcPortal_logo_path'), { virtual: true })
jest.mock('../../../../../portals/xyzPortal/images/logo.png?h=56&format=webp', () => ('xyzPortal_logo_path'), { virtual: true })

// eslint-disable-next-line react/prop-types
const TestComponent = ({ portalId }) => {
  const result = usePortalLogo(portalId)

  return <div data-testid="test-component">{result}</div>
}

afterEach(() => {
  jest.resetAllMocks()
})

describe('usePortalLogo', () => {
  describe('when a portal is not provided', () => {
    test('does not generate a src', async () => {
      render(<TestComponent />)

      await waitFor(() => {
        expect(screen.getByTestId('test-component').textContent).toEqual('')
      })
    })
  })

  describe('when a portal is provided', () => {
    describe('when the portal does not exist', () => {
      test('does not generate a src', async () => {
        render(<TestComponent portalId="invalid" />)

        await waitFor(() => {
          expect(screen.getByTestId('test-component').textContent).toEqual('')
        })
      })
    })

    describe('when the portal exists', () => {
      test('adds the correct src', async () => {
        render(<TestComponent portalId="abcPortal" />)

        await waitFor(() => {
          expect(screen.getByTestId('test-component').textContent).toEqual('abcPortal_logo_path')
        })
      })
    })

    describe('when the portal exists and has already been cached', () => {
      test('adds the correct src', async () => {
        const { rerender } = render(<TestComponent portalId="abcPortal" />)

        await waitFor(() => {
          expect(screen.getByTestId('test-component').textContent).toEqual('abcPortal_logo_path')
        })

        rerender(<TestComponent portalId="xyzPortal" />)

        await waitFor(() => {
          expect(screen.getByTestId('test-component').textContent).toEqual('xyzPortal_logo_path')
        })

        rerender(<TestComponent portalId="abcPortal" />)

        await waitFor(() => {
          expect(screen.getByTestId('test-component').textContent).toEqual('abcPortal_logo_path')
        })
      })
    })
  })
})
