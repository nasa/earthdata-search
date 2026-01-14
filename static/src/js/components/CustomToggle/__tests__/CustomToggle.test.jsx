import { screen } from '@testing-library/react'
import { FaGlobe } from 'react-icons/fa'

import setupTest from '../../../../../../jestConfigs/setupTest'

import CustomToggle from '../CustomToggle'
import EDSCIcon from '../../EDSCIcon/EDSCIcon'

jest.mock('../../EDSCIcon/EDSCIcon', () => jest.fn(() => null))

const setup = setupTest({
  Component: CustomToggle,
  defaultProps: {
    className: 'test-class',
    onClick: jest.fn(),
    title: 'test-title'
  }
})

describe('CustomToggle component', () => {
  test('should render self', () => {
    setup()

    const button = screen.getByRole('button')

    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('title', 'test-title')
    expect(button).toHaveClass('custom-toggle')

    expect(EDSCIcon).toHaveBeenCalledTimes(0)
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

  test('should render self with an icon', () => {
    setup({
      overrideProps: {
        icon: FaGlobe
      }
    })

    expect(EDSCIcon).toHaveBeenCalledTimes(1)
    expect(EDSCIcon).toHaveBeenCalledWith({
      className: 'custom-toggle__icon',
      icon: FaGlobe,
      size: '16'
    }, {})
  })

  describe('when openOnHover is provided', () => {
    test('should call handleOpen on mouse in and handleClose on mouse out', async () => {
      const { props, user } = setup({
        overrideProps: {
          openOnHover: true,
          handleOpen: jest.fn(),
          handleClose: jest.fn()
        }
      })

      const button = screen.getByRole('button')
      await user.hover(button)

      expect(props.handleOpen).toHaveBeenCalledTimes(1)
      expect(props.handleOpen).toHaveBeenCalledWith(expect.objectContaining({
        type: 'mouseenter'
      }))

      await user.unhover(button)

      expect(props.handleClose).toHaveBeenCalledTimes(1)
      expect(props.handleClose).toHaveBeenCalledWith(expect.objectContaining({
        type: 'mouseleave'
      }))
    })
  })
})
