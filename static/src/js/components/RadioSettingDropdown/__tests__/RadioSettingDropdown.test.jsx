import React from 'react'
import ReactDOM from 'react-dom'
import { screen } from '@testing-library/react'
import { FaBacon } from 'react-icons/fa'

import { RadioSettingDropdown } from '../RadioSettingDropdown'
import setupTest from '../../../../../../vitestConfigs/setupTest'
import RadioSettingDropdownItem from '../RadioSettingDropdownItem'

vi.mock('../RadioSettingDropdownItem', () => ({ default: vi.fn(() => null) }))

const itemOnClickCallbackMock = vi.fn()

const setup = setupTest({
  Component: RadioSettingDropdown,
  defaultProps: {
    id: 'radio-setting-dropdown',
    children: null,
    className: null,
    handoffLinks: [],
    activeIcon: FaBacon,
    label: 'Label'
  }
})

beforeEach(() => {
  ReactDOM.createPortal = vi.fn((dropdown) => dropdown)
})

describe('RadioSettingDropdown component', () => {
  test('renders nothing when no settings are provided', () => {
    const { container } = setup()

    expect(container.innerHTML).toBe('')
  })

  test('renders correctly when settings are provided', async () => {
    const { user } = setup({
      overrideProps: {
        id: 'test-id',
        label: 'menu label',
        settings: [
          {
            label: 'setting label',
            isActive: false,
            onClick: itemOnClickCallbackMock
          }
        ]
      }
    })

    // Open the dropdown menu
    const button = screen.getByRole('button')
    await user.click(button)

    expect(RadioSettingDropdownItem).toHaveBeenCalledTimes(1)
    expect(RadioSettingDropdownItem).toHaveBeenCalledWith({
      icon: undefined,
      inProgress: undefined,
      isActive: false,
      onClick: expect.any(Function),
      title: 'setting label'
    }, {})
  })

  test('does not remount the dropdown when the label changes', () => {
    const settings = [{
      label: 'setting label',
      isActive: false,
      onClick: itemOnClickCallbackMock
    }]

    const { props, rerender } = setup({
      overrideProps: {
        label: 'Sort: Usage',
        settings
      }
    })

    const toggle = screen.getByRole('button')

    // Changing the label (e.g. picking a new sort) must keep the same toggle element.
    // Remounting the Dropdown re-creates the portaled menu, which flashes at the top left of the page.
    rerender(<RadioSettingDropdown {...props} label="Sort: Relevance" />)

    expect(screen.getByRole('button')).toBe(toggle)
    expect(toggle).toHaveTextContent('Sort: Relevance')
  })
})
