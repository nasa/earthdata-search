import React from 'react'
import ReactDOM from 'react-dom'

import TemporalSelectionDropdownMenu from '../TemporalSelectionDropdownMenu'
import setupTest from '../../../../../../jestConfigs/setupTest'

import PortalLinkContainer from '../../../containers/PortalLinkContainer/PortalLinkContainer'
import Button from '../../Button/Button'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn().mockReturnValue({
    pathname: '/',
    search: '',
    hash: '',
    state: null,
    key: 'testKey'
  })
}))

jest.mock('../../../containers/PortalLinkContainer/PortalLinkContainer', () => ({
  __esModule: true,
  default: jest.fn(() => <div />)
}))

jest.mock('../../Button/Button', () => ({
  __esModule: true,
  default: jest.fn(() => <div />)
}))

// Mock react-bootstrap Dropdown
jest.mock('react-bootstrap/Dropdown', () => ({
  __esModule: true,
  default: {
    Menu: jest.fn(({ children }) => <div className="dropdown-menu">{children}</div>)
  }
}))

const setup = setupTest({
  ComponentsByRoute: {
    '/': TemporalSelectionDropdownMenu
  },
  defaultPropsByRoute: {
    '/': {
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
  },
  withRedux: true,
  withRouter: true
})

beforeAll(() => {
})

beforeEach(() => {
  jest.clearAllMocks()
  ReactDOM.createPortal = jest.fn((dropdown) => dropdown)
  window.console.warn = jest.fn()
})

afterEach(() => {
  ReactDOM.createPortal.mockClear()
  window.console.warn.mockClear()
})

describe('TemporalSelectionDropdownMenu component', () => {
  test('renders PortalLinkContainer when isHomePage is true', () => {
    setup({
      overridePropsByRoute: {
        '/': {
          isHomePage: true
        }
      }
    })

    expect(PortalLinkContainer).toHaveBeenCalledTimes(1)
  })

  test('renders Button twice when isHomePage is false', () => {
    setup({
      overridePropsByRoute: {
        '/': {
          isHomePage: false
        }
      }
    })

    expect(Button).toHaveBeenCalledTimes(2)
    expect(PortalLinkContainer).not.toHaveBeenCalled()
  })
})
