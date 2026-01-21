import React from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'

import usePortalLogo from '../usePortalLogo'

// Use virtual mocks of modules that don't exist anywhere in the system
vi.mock('../../../../../portals/above/images/logo.png?h=56&format=webp', () => ({ default: 'above_logo_path' }))
vi.mock('../../../../../portals/amd/images/logo.png?h=56&format=webp', () => ({ default: 'amd_logo_path' }))

// eslint-disable-next-line react/prop-types
const TestComponent = ({ portalId }) => {
  const result = usePortalLogo(portalId)

  return <div data-testid="test-component">{result}</div>
}

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
        render(<TestComponent portalId="above" />)

        await waitFor(() => {
          expect(screen.getByTestId('test-component').textContent).toEqual('above_logo_path')
        })
      })
    })

    describe('when the portal exists and has already been cached', () => {
      test('adds the correct src', async () => {
        const { rerender } = render(<TestComponent portalId="above" />)

        await waitFor(() => {
          expect(screen.getByTestId('test-component').textContent).toEqual('above_logo_path')
        })

        rerender(<TestComponent portalId="amd" />)

        await waitFor(() => {
          expect(screen.getByTestId('test-component').textContent).toEqual('amd_logo_path')
        })

        rerender(<TestComponent portalId="above" />)

        await waitFor(() => {
          expect(screen.getByTestId('test-component').textContent).toEqual('above_logo_path')
        })
      })
    })
  })
})
