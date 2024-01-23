import React from 'react'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import MaintenanceBannerContainer from '../MaintenanceBannerContainer'

describe('MaintenanceBannerContainer', () => {
  test('informs the user about the ongoing maintenance', () => {
    render(
      <MaintenanceBannerContainer
        message="testing maintenance message"
      />
    )

    expect(screen.getByText('testing maintenance message')).toBeDefined()
  })

  describe('when the user dismisses the maintenance banner', () => {
    test('maintenance banner is no longer visible on the page', async () => {
      const user = userEvent.setup()
      render(
        <MaintenanceBannerContainer
          message="testing maintenance message"
        />
      )

      expect(screen.getByText('testing maintenance message')).toBeInTheDocument()
      await user.click(screen.getByRole('button', { title: 'Close' }))

      expect(screen.queryByText('testing maintenance message')).not.toBeInTheDocument()
    })
  })
})
