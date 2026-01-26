import { FaBacon } from 'react-icons/fa'
import { screen } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import EDSCIcon from '../../EDSCIcon/EDSCIcon'
import RadioSettingDropdownItem from '../RadioSettingDropdownItem'
import Spinner from '../../Spinner/Spinner'

vi.mock('../../EDSCIcon/EDSCIcon', () => ({ default: vi.fn(() => null) }))
vi.mock('../../Spinner/Spinner', () => ({ default: vi.fn(() => null) }))

const setup = setupTest({
  Component: RadioSettingDropdownItem,
  defaultProps: {
    className: 'test-class',
    icon: FaBacon,
    onClick: vi.fn(),
    title: 'Test Title'
  }
})

describe('RadioSettingDropdownItem component', () => {
  test('renders a dropdown item', () => {
    setup()

    const button = screen.getByRole('button', { name: 'Test Title' })

    expect(button.className).toContain('test-class radio-setting-dropdown-item dropdown-item')

    expect(EDSCIcon).toHaveBeenCalledTimes(1)
    expect(EDSCIcon).toHaveBeenCalledWith({
      className: 'radio-setting-dropdown-item__icon',
      icon: FaBacon,
      size: '12'
    }, {})
  })

  test('calls the onClick callback', async () => {
    const { props, user } = setup()

    const button = screen.getByRole('button', { name: 'Test Title' })
    await user.click(button)

    expect(props.onClick).toHaveBeenCalledTimes(1)
    expect(props.onClick).toHaveBeenCalledWith()
  })

  test('will not call the onClick callback, if item is active', async () => {
    const { props, user } = setup({
      overrideProps: {
        isActive: true
      }
    })

    const button = screen.getByRole('button', { name: 'Test Title' })
    await user.click(button)

    expect(props.onClick).toHaveBeenCalledTimes(0)
  })

  describe('when in progress', () => {
    test('disables the dropdown item', () => {
      setup({
        overrideProps: {
          inProgress: true
        }
      })

      const button = screen.getByRole('button', { name: 'Test Title' })
      expect(button.className).toContain('radio-setting-dropdown-item--in-progress')

      // The button is disabled
      expect(button.className).toContain('disabled')
      expect(button).toHaveAttribute('aria-disabled', 'true')
    })

    test('displays a spinner', () => {
      setup({
        overrideProps: {
          inProgress: true
        }
      })

      expect(Spinner).toHaveBeenCalledTimes(1)
      expect(Spinner).toHaveBeenCalledWith({
        className: 'radio-setting-dropdown-item__spinner',
        inline: true,
        size: 'x-tiny',
        type: 'dots'
      }, {})
    })
  })
})
