import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Banner from '../Banner'

function setup(overrideProps = {}) {
  const props = {
    title: 'Banner Title',
    message: 'Banner Message',
    onClose: jest.fn(),
    type: 'error',
    ...overrideProps
  }

  const { container } = render(<Banner {...props} />)

  return {
    container,
    props
  }
}

describe('Banner component', () => {
  test('should render self', () => {
    setup()

    expect(screen.getByText('Banner Title')).toBeInTheDocument()
    expect(screen.getByText('Banner Message')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'High Alert Icon' })).toBeInTheDocument()
  })

  test('clicking the close button calls onClose', async () => {
    const user = userEvent.setup()
    const { props } = setup()

    const closeBtn = screen.getByRole('button', { name: 'Close' })
    await user.click(closeBtn)

    expect(props.onClose).toBeCalledTimes(1)
  })

  test('error banner should render correctly', () => {
    setup()

    expect(screen.getByRole('banner')).toHaveClass('banner--error')
  })

  describe('when the message prop is provided', () => {
    test('render a message', async () => {
      const { container } = setup()

      // GetByRole('paragraph') does not work as expected so querySelectorAll is used to verify
      // the element is exists
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelectorAll('p')[0]).toBeDefined()
    })
  })

  describe('when the message prop is not provided', () => {
    test('does not render a message', async () => {
      const { container } = setup({
        message: undefined
      })

      // GetByRole('paragraph') does not work as expected so querySelectorAll is used to verify
      // the element does not exist
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelectorAll('p')[0]).not.toBeDefined()
    })
  })
})
