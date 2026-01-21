import React from 'react'
import ReactDOM from 'react-dom'

import TemporalSelectionDropdownMenu from '../TemporalSelectionDropdownMenu'
import setupTest from '../../../../../../vitestConfigs/setupTest'

import PortalLinkContainer from '../../../containers/PortalLinkContainer/PortalLinkContainer'
import Button from '../../Button/Button'

vi.mock('../../../containers/PortalLinkContainer/PortalLinkContainer', () => ({
  __esModule: true,
  default: vi.fn(({ children }) => <div>{children}</div>)
}))

vi.mock('../../Button/Button', () => ({
  __esModule: true,
  default: vi.fn(({ children }) => <div>{children}</div>)
}))

// Mock react-bootstrap Dropdown
vi.mock('react-bootstrap/Dropdown', () => ({
  __esModule: true,
  default: {
    Menu: vi.fn(({ children }) => <div className="dropdown-menu">{children}</div>)
  }
}))

const setup = setupTest({
  Component: TemporalSelectionDropdownMenu,
  defaultProps: {
    allowRecurring: true,
    disabled: false,
    displayStartDate: '',
    displayEndDate: '',
    isHomePage: true,
    onApplyClick: vi.fn(),
    onChangeRecurring: vi.fn(),
    onClearClick: vi.fn(),
    onInvalid: vi.fn(),
    onRecurringToggle: vi.fn(),
    onSliderChange: vi.fn(),
    onValid: vi.fn(),
    setEndDate: vi.fn(),
    setStartDate: vi.fn(),
    temporal: { isRecurring: false }
  }
})

beforeEach(() => {
  ReactDOM.createPortal = vi.fn((dropdown) => dropdown)
})

describe('TemporalSelectionDropdownMenu component', () => {
  describe('when isHomePage is true', () => {
    test('renders the Apply button with PortalLinkContainer', () => {
      const { props } = setup()

      expect(PortalLinkContainer).toHaveBeenCalledTimes(1)
      expect(PortalLinkContainer).toHaveBeenCalledWith(
        {
          className: 'temporal-selection-dropdown-menu__button temporal-selection-dropdown-menu__button--apply',
          type: 'button',
          bootstrapVariant: 'primary',
          label: 'Apply',
          onClick: props.onApplyClick,
          disabled: false,
          to: '/search',
          children: 'Apply'
        },
        {}
      )

      expect(Button).toHaveBeenCalledTimes(1)
      expect(Button).toHaveBeenCalledWith({
        className: 'temporal-selection-dropdown-menu__button temporal-selection-dropdown-menu__button--cancel',
        bootstrapVariant: 'light',
        label: 'Clear',
        onClick: props.onClearClick,
        children: 'Clear'
      }, {})
    })
  })

  describe('when isHomePage is false', () => {
    test('renders the Apply button with Button and Clear button with Button', () => {
      const { props } = setup({
        overrideProps: {
          isHomePage: false
        }
      })

      expect(Button).toHaveBeenCalledTimes(2)
      expect(Button).toHaveBeenNthCalledWith(
        1,
        {
          className: 'temporal-selection-dropdown-menu__button temporal-selection-dropdown-menu__button--apply',
          type: 'button',
          bootstrapVariant: 'primary',
          label: 'Apply',
          onClick: props.onApplyClick,
          disabled: false,
          children: 'Apply'
        },
        {}
      )

      expect(Button).toHaveBeenNthCalledWith(
        2,
        {
          className: 'temporal-selection-dropdown-menu__button temporal-selection-dropdown-menu__button--cancel',
          bootstrapVariant: 'light',
          label: 'Clear',
          onClick: props.onClearClick,
          children: 'Clear'
        },
        {}
      )
    })
  })
})
