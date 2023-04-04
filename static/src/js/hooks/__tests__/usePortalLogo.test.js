import React from 'react'
import { act } from 'react-dom/test-utils'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

import usePortalLogo from '../usePortalLogo'

jest.mock('../../../../../portals/soos/images/logo.png', () => 'soos_logo_path')

const TestComponent = ({ portalId }) => {
  const result = usePortalLogo(portalId)
  return (
    <img data-testid="test-component" src={result} alt="test" />
  )
}

describe('usePortalLogo', () => {
  describe('when a portal is not provided', () => {
    test('does not add a src', async () => {
      act(() => {
        render(<TestComponent />)
      })

      await waitFor(() => {
        expect(screen.getByTestId('test-component')).toHaveAttribute('src', '')
      })
    })
  })

  describe('when a portal is provided', () => {
    describe('when the portal does not exist', () => {
      test('does not add a src', async () => {
        act(() => {
          render(<TestComponent portalId="invalid" />)
        })

        await waitFor(() => {
            expect(screen.getByTestId('test-component')).toHaveAttribute('src', '')
        })
      })
    })

    describe('when the portalId does not exist', () => {
      test('does not add a src', async () => {
        act(() => {
          render(<TestComponent portalId="test" />)
        })

        await waitFor(() => {
            expect(screen.getByTestId('test-component')).toHaveAttribute('src', '')
        })
      })
    })

    describe('when the portal exists', () => {
      test('adds the correct src', async () => {
        act(() => {
          render(<TestComponent portalId="soos" />)
        })

        await waitFor(() => {
            expect(screen.getByTestId('test-component')).toHaveAttribute('src', 'soos_logo_path')
        })
      })
    })
  })
})
