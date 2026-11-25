import { screen } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import NlpSearchUnavailableBanner from '../NlpSearchUnavailableBanner'

const setup = setupTest({
  Component: NlpSearchUnavailableBanner,
  defaultZustandState: {
    home: {
      showNlpSearchUnavailableBanner: true,
      setShowNlpSearchUnavailableBanner: vi.fn()
    }
  }
})

describe('NlpSearchUnavailableBanner', () => {
  test('renders an info banner when showNlpSearchUnavailableBanner is true', () => {
    setup()

    const banner = screen.getByRole('banner')
    expect(banner).toHaveClass('banner--info')
    expect(banner).toHaveTextContent('Enhanced Search is temporarily unavailable Please try again using Traditional search')
  })

  test('does not render when showNlpSearchUnavailableBanner is false', () => {
    setup({
      overrideZustandState: {
        home: {
          showNlpSearchUnavailableBanner: false
        }
      }
    })

    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
  })

  test('hides the banner when the close button is clicked', async () => {
    const { user, zustandState } = setup()

    await user.click(screen.getByRole('button', { name: 'Close' }))

    expect(zustandState.home.setShowNlpSearchUnavailableBanner).toHaveBeenCalledTimes(1)
    expect(zustandState.home.setShowNlpSearchUnavailableBanner).toHaveBeenCalledWith(false)
  })
})
