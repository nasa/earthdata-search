import { screen } from '@testing-library/react'
import { FaGlobe } from 'react-icons/fa'
// @ts-expect-error: This file does not have types
import { ArrowLineRight } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import setupTest from '../../../../../../jestConfigs/setupTest'

import Button from '../Button'

import Spinner from '../../Spinner/Spinner'
import EDSCIcon from '../../EDSCIcon/EDSCIcon'

jest.mock('../../EDSCIcon/EDSCIcon', () => jest.fn(() => null))
jest.mock('../../Spinner/Spinner', () => jest.fn(() => null))
jest.mock('../../../util/renderTooltip', () => ({
  __esModule: true,
  default: jest.fn()
}))

const setup = setupTest({
  Component: Button,
  defaultProps: {
    onClick: jest.fn(),
    label: 'Test Label',
    ariaLabel: 'Test aria Label'
  }
})

describe('Button component', () => {
  test('should render self', () => {
    setup()

    const button = screen.getByRole('button')

    expect(button).toHaveAttribute('label', 'Test Label')
    expect(button).toHaveAttribute('aria-label', 'Test aria Label')
  })

  test('should call onClick if the button is clicked', async () => {
    const { props, user } = setup()

    const button = screen.getByRole('button')
    await user.click(button)

    expect(props.onClick).toHaveBeenCalledTimes(1)
    expect(props.onClick).toHaveBeenCalledWith(expect.objectContaining({
      type: 'click'
    }))
  })

  test('should not render self with an icon when missing an iconClass prop', () => {
    setup()

    expect(EDSCIcon).toHaveBeenCalledTimes(0)
  })

  test('should render self with an icon', () => {
    setup({
      overrideProps: {
        icon: FaGlobe
      }
    })

    expect(EDSCIcon).toHaveBeenCalledTimes(1)
    expect(EDSCIcon).toHaveBeenCalledWith({
      className: 'button__icon',
      icon: FaGlobe,
      size: undefined
    }, {})
  })

  test('should render self with an edsc-icon', () => {
    setup({
      overrideProps: {
        icon: 'edsc-icon'
      }
    })

    expect(EDSCIcon).toHaveBeenCalledTimes(1)
    expect(EDSCIcon).toHaveBeenCalledWith({
      className: 'button__icon edsc-icon',
      icon: 'edsc-icon',
      size: undefined
    }, {})
  })

  test('should render self with a badge', () => {
    setup({
      overrideProps: {
        badge: 'badge test'
      }
    })

    expect(screen.getByText('badge test')).toBeInTheDocument()
  })

  test('should render self as a link when an href is provided', () => {
    setup({
      overrideProps: {
        href: 'https://example.com'
      }
    })

    const button = screen.getByRole('button')

    expect(button).toHaveAttribute('href', 'https://example.com')
  })

  test('should render a rel with the target is _blank', () => {
    setup({
      overrideProps: {
        href: 'https://example.com',
        target: '_blank'
      }
    })

    const button = screen.getByRole('button')

    expect(button).toHaveAttribute('rel', 'noopener nofollow')
  })

  test('should render the naked variant when hds-primary variant is provided', () => {
    setup({
      overrideProps: {
        variant: 'hds-primary'
      }
    })

    const button = screen.getByRole('button')

    expect(button.className).toContain('btn-naked')
  })

  test('should render the correct icon size for bootstrapSize of lg', () => {
    setup({
      overrideProps: {
        variant: 'hds-primary',
        bootstrapSize: 'lg'
      }
    })

    expect(EDSCIcon).toHaveBeenCalledTimes(1)
    expect(EDSCIcon).toHaveBeenCalledWith({
      className: 'button__hds-primary-icon',
      icon: ArrowLineRight,
      size: '12'
    }, {})
  })

  test('should render the correct icon size for bootstrapSize of sm', () => {
    setup({
      overrideProps: {
        variant: 'hds-primary',
        bootstrapSize: 'sm'
      }
    })

    expect(EDSCIcon).toHaveBeenCalledTimes(1)
    expect(EDSCIcon).toHaveBeenCalledWith({
      className: 'button__hds-primary-icon',
      icon: ArrowLineRight,
      size: '8'
    }, {})
  })

  describe('when spinner is true', () => {
    test('should render disabled with a Spinner', () => {
      setup({
        overrideProps: {
          spinner: true
        }
      })

      expect(screen.getByRole('button')).toBeDisabled()

      expect(Spinner).toHaveBeenCalledTimes(1)
      expect(Spinner).toHaveBeenCalledWith({
        color: 'white',
        inline: true,
        size: 'tiny',
        type: 'dots'
      }, {})
    })
  })

  describe('when positioning the icon to the right', () => {
    test('should render the icon after the text', () => {
      setup({
        overrideProps: {
          icon: FaGlobe,
          iconPosition: 'right'
        }
      })

      expect(screen.getByRole('button').className).toContain('button--icon-right')

      expect(EDSCIcon).toHaveBeenCalledTimes(1)
      expect(EDSCIcon).toHaveBeenCalledWith({
        className: 'button__icon',
        icon: FaGlobe,
        size: undefined
      }, {})
    })
  })
})
