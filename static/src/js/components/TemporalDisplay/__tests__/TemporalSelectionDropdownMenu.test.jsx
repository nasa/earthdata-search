import React from 'react'
import ReactDOM from 'react-dom'

import TemporalSelectionDropdownMenu from '../TemporalSelectionDropdownMenu'
import setupTest from '../../../../../../jestConfigs/setupTest'

import PortalLinkContainer from '../../../containers/PortalLinkContainer/PortalLinkContainer'
import Button from '../../Button/Button'

jest.mock('../../../containers/PortalLinkContainer/PortalLinkContainer', () => ({
  __esModule: true,
  default: jest.fn(({ children }) => <div>{children}</div>)
}))

jest.mock('../../Button/Button', () => ({
  __esModule: true,
  default: jest.fn(({ children }) => <div>{children}</div>)
}))

// Mock react-bootstrap Dropdown
jest.mock('react-bootstrap/Dropdown', () => ({
  __esModule: true,
  default: {
    Menu: jest.fn(({ children }) => <div className="dropdown-menu">{children}</div>)
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
    onApplyClick: jest.fn(),
    onChangeQuery: jest.fn(),
    onChangeRecurring: jest.fn(),
    onClearClick: jest.fn(),
    onInvalid: jest.fn(),
    onRecurringToggle: jest.fn(),
    onSliderChange: jest.fn(),
    onValid: jest.fn(),
    setEndDate: jest.fn(),
    setStartDate: jest.fn(),
    temporal: { isRecurring: false }
  }
})

beforeEach(() => {
  ReactDOM.createPortal = jest.fn((dropdown) => dropdown)
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
