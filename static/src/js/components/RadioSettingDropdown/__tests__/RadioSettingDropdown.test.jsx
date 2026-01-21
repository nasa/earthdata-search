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

    // The `useEffect` updating `menuOffsetX` is causing the component to render twice.
    expect(RadioSettingDropdownItem).toHaveBeenCalledTimes(2)
    expect(RadioSettingDropdownItem).toHaveBeenNthCalledWith(1, {
      icon: undefined,
      inProgress: undefined,
      isActive: false,
      onClick: expect.any(Function),
      title: 'setting label'
    }, {})

    expect(RadioSettingDropdownItem).toHaveBeenNthCalledWith(2, {
      icon: undefined,
      inProgress: undefined,
      isActive: false,
      onClick: expect.any(Function),
      title: 'setting label'
    }, {})
  })
})
