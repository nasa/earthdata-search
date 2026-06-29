import { screen } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import RedirectingAuthState from '../RedirectingAuthState'

const setup = setupTest({
  Component: RedirectingAuthState
})

describe('RedirectingAuthState component', () => {
  test('renders the default message and no spinner by default', () => {
    setup()

    expect(screen.getByText(/Redirecting to sign in/i)).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  test('renders a custom message when provided', () => {
    const customMessage = 'custom test message'
    setup({
      overrideProps: {
        message: customMessage
      }
    })

    expect(screen.getByText(customMessage)).toBeInTheDocument()
  })

  test('renders a spinner when showSpinner is true', () => {
    setup({
      overrideProps: {
        showSpinner: true
      }
    })

    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
