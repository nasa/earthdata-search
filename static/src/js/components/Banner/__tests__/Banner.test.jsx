import { screen, waitFor } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import Banner from '../Banner'

const setup = setupTest({
  Component: Banner,
  defaultProps: {
    title: 'Banner Title',
    message: 'Banner Message',
    onClose: vi.fn(),
    type: 'error'
  }
})

describe('Banner component', () => {
  test('should render self', () => {
    setup()

    expect(screen.getByText('Banner Title')).toBeInTheDocument()
    expect(screen.getByText('Banner Message')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'High Alert Icon' })).toBeInTheDocument()
  })

  test('clicking the close button calls onClose', async () => {
    const { props, user } = setup()

    const closeBtn = screen.getByRole('button', { name: 'Close' })
    await user.click(closeBtn)

    expect(props.onClose).toHaveBeenCalledTimes(1)
  })

  test('error banner should render correctly', () => {
    setup()

    expect(screen.getByRole('banner')).toHaveClass('banner--error')
  })

  describe('when the message prop is not provided', () => {
    test('does not render a message', async () => {
      setup({
        overrideProps: {
          message: undefined
        }
      })

      expect(screen.queryByText('Banner Message')).not.toBeInTheDocument()
    })
  })

  describe('when showAlertButton is true', () => {
    test('clicking See Alerts button triggers tophat alerts', async () => {
      const mockClick = vi.fn()
      const mockButton = { click: mockClick }
      const mockQuerySelector = vi.spyOn(document, 'querySelector').mockReturnValue(mockButton)

      const { user } = setup({
        overrideProps: {
          showAlertButton: true
        }
      })

      expect(screen.getByText('Check alerts for outage information or refresh the page.')).toBeInTheDocument()

      const seeAlertsButton = screen.getByRole('button', { name: 'See Alerts' })

      await user.click(seeAlertsButton)

      await waitFor(() => {
        expect(mockQuerySelector).toHaveBeenCalledTimes(1)
      })

      expect(mockQuerySelector).toHaveBeenCalledWith('.th-status-link')
      expect(mockClick).toHaveBeenCalledTimes(1)
    })
  })
})
