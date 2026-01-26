import React from 'react'

import { screen } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import EDSCModal from '../EDSCModal'
import Spinner from '../../Spinner/Spinner'

vi.mock('../../Spinner/Spinner', () => ({ default: vi.fn(() => null) }))

const setup = setupTest({
  Component: EDSCModal,
  defaultProps: {
    bodyEl: <div className="test-body">Test body content</div>,
    modalClassNames: 'test-modal',
    size: 'lg',
    identifier: 'test-identifier',
    isOpen: true,
    modalInner: React.createRef()
  }
})

describe('EDSCModal component', () => {
  test('should render closed Modal by default', () => {
    setup({
      overrideProps: {
        isOpen: false
      }
    })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  test('should render a Modal when open', () => {
    setup()

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  test('should render a title', () => {
    setup({
      overrideProps: {
        title: 'Test Title'
      }
    })

    expect(screen.getByRole('dialog')).toHaveTextContent('Test Title')
  })

  describe('when a title is not defined', () => {
    test('should not render a title', () => {
      setup()

      const title = screen.getByTestId('edsc-modal__title')
      expect(title).toBeEmptyDOMElement()
    })
  })

  test('should render no footer by default', () => {
    setup()

    const footer = screen.queryByTestId('edsc-modal__footer')
    expect(footer).not.toBeInTheDocument()
  })

  test('should render a custom footer', () => {
    setup({
      overrideProps: {
        footer: <>Test Footer</>
      }
    })

    expect(screen.getByText('Test Footer')).toBeInTheDocument()
  })

  describe('spinner', () => {
    test('should not render spinner by default', () => {
      setup()

      expect(Spinner).toHaveBeenCalledTimes(0)
    })

    test('should render innerHeader', () => {
      setup({
        overrideProps: {
          spinner: true
        }
      })

      expect(Spinner).toHaveBeenCalledTimes(1)
      expect(Spinner).toHaveBeenCalledWith({ type: 'dots' }, {})
    })
  })

  describe('footerMeta', () => {
    test('should not render footerMeta by default', () => {
      setup()

      expect(screen.queryByText('Footer Meta')).not.toBeInTheDocument()
    })

    test('should render the footer meta information', () => {
      setup({
        overrideProps: {
          footerMeta: 'Footer Meta'
        }
      })

      expect(screen.getByText('Footer Meta')).toBeInTheDocument()
    })
  })

  describe('innerHeader', () => {
    test('should not render innerHeader by default', () => {
      setup()

      expect(screen.queryByText('Inner Header')).not.toBeInTheDocument()
    })

    test('should render innerHeader', () => {
      setup({
        overrideProps: {
          innerHeaderEl: <>Inner Header</>
        }
      })

      expect(screen.getByText('Inner Header')).toBeInTheDocument()
    })
  })

  describe('primary action', () => {
    test('should render a primary action when passed', () => {
      setup({
        overrideProps: {
          primaryAction: 'Test',
          onPrimaryAction: vi.fn()
        }
      })

      expect(screen.getByRole('button', { name: 'Test' })).toHaveClass('edsc-modal__action--primary')
    })

    test('should call onPrimaryAction when clicked', async () => {
      const { props, user } = setup({
        overrideProps: {
          primaryAction: 'Test',
          onPrimaryAction: vi.fn()
        }
      })

      await user.click(screen.getByRole('button', { name: 'Test' }))

      expect(props.onPrimaryAction).toHaveBeenCalledTimes(1)
      expect(props.onPrimaryAction).toHaveBeenCalledWith(expect.objectContaining({
        type: 'click'
      }))
    })
  })

  describe('secondary action', () => {
    test('should not render a secondary action without a primary action', () => {
      setup({
        overrideProps: {
          secondaryAction: 'Test Secondary',
          onSecondaryAction: vi.fn()
        }
      })

      expect(screen.queryByRole('button', { name: 'Test Secondary' })).not.toBeInTheDocument()
    })

    test('should render when a primary action when passed', () => {
      setup({
        overrideProps: {
          primaryAction: 'Test Primary',
          onPrimaryAction: vi.fn(),
          secondaryAction: 'Test Secondary',
          onSecondaryAction: vi.fn()
        }
      })

      expect(screen.getByRole('button', { name: 'Test Secondary' })).toHaveClass('edsc-modal__action--secondary')
    })

    test('should call onSecondaryAction when clicked', async () => {
      const { props, user } = setup({
        overrideProps: {
          primaryAction: 'Test Primary',
          onPrimaryAction: vi.fn(),
          secondaryAction: 'Test Secondary',
          onSecondaryAction: vi.fn()
        }
      })

      await user.click(screen.getByRole('button', { name: 'Test Secondary' }))

      expect(props.onSecondaryAction).toHaveBeenCalledTimes(1)
      expect(props.onSecondaryAction).toHaveBeenCalledWith(expect.objectContaining({
        type: 'click'
      }))
    })
  })

  describe('when hiding the modal', () => {
    test('should call onModalHide', async () => {
      const { props, user } = setup({
        overrideProps: {
          onModalHide: vi.fn()
        }
      })

      await user.click(screen.getByRole('button', { name: 'Close' }))

      expect(props.onModalHide).toHaveBeenCalledTimes(1)
      expect(props.onModalHide).toHaveBeenCalledWith()
    })
  })
})
