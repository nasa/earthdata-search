import React from 'react'
import { screen } from '@testing-library/react'

import {
  FaFileExport,
  FaSortAmountDown,
  FaSortAmountDownAlt,
  FaTable
} from 'react-icons/fa'
import { List } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'
import setupTest from '../../../../../../jestConfigs/setupTest'
import getByTextWithMarkup from '../../../../../../jestConfigs/getByTextWithMarkup'

import PanelGroupHeader from '../PanelGroupHeader'
import Skeleton from '../../Skeleton/Skeleton'
import RadioSettingDropdown from '../../RadioSettingDropdown/RadioSettingDropdown'

jest.mock('../../Skeleton/Skeleton', () => jest.fn(() => null))
jest.mock('../../RadioSettingDropdown/RadioSettingDropdown', () => jest.fn(() => null))

const setup = setupTest({
  Component: PanelGroupHeader,
  defaultProps: {
    activeSort: 'active-sort',
    activeView: 'active-view',
    breadcrumbs: [],
    exportsArray: [],
    handoffLinks: [],
    headerLoading: false,
    headerMessage: '',
    headerMetaPrimaryLoading: false,
    headerMetaPrimaryText: 'Header Meta Primary Text',
    moreActionsDropdownItems: [],
    panelGroupId: '0',
    primaryHeading: 'Primary Heading',
    sortsArray: [],
    viewsArray: []
  },
  withRouter: true
})

describe('PanelGroupHeader component', () => {
  describe('when breadcrumbs are loading', () => {
    test('should render the breadcrumb skeleton', () => {
      setup({
        overrideProps: {
          breadcrumbs: [
            {
              title: 'Loading Breadcrumb',
              isLoading: true
            }
          ]
        }
      })

      expect(Skeleton).toHaveBeenCalledTimes(1)
      expect(Skeleton).toHaveBeenCalledWith({
        className: 'panel-group-header__breadcrumbs-skeleton',
        containerStyle: {
          height: '1.5rem',
          width: '100%'
        },
        shapes: [{
          height: 18,
          left: 0,
          radius: 2,
          shape: 'rectangle',
          top: 3,
          width: 280
        }]
      }, {})
    })
  })

  describe('when content is loading', () => {
    test('should render the loading state', () => {
      setup({
        overrideProps: {
          headerMetaPrimaryLoading: true,
          headerLoading: true
        }
      })

      expect(screen.queryByText('Primary Heading')).not.toBeInTheDocument()
      expect(screen.queryByText('Header Meta Primary Text')).not.toBeInTheDocument()

      expect(Skeleton).toHaveBeenCalledTimes(2)
      expect(Skeleton).toHaveBeenNthCalledWith(1, {
        className: 'panel-group-header__heading panel-group-header__heading--skeleton',
        containerStyle: {
          display: 'inline-block',
          height: '1.25rem',
          width: '100%'
        },
        shapes: [{
          height: 22,
          left: 0,
          radius: 2,
          shape: 'rectangle',
          top: 0,
          width: 280
        }]
      }, {})

      expect(Skeleton).toHaveBeenNthCalledWith(2, {
        className: 'panel-group-header__heading-meta-skeleton',
        containerStyle: {
          height: '18px',
          width: '213px'
        },
        shapes: [{
          height: 12,
          left: 0,
          radius: 2,
          shape: 'rectangle',
          top: 3,
          width: 213
        }]
      }, {})
    })
  })

  describe('when content is loaded', () => {
    test('should render the text', () => {
      setup()

      expect(screen.getByText('Primary Heading')).toBeInTheDocument()
      expect(screen.getByText('Header Meta Primary Text')).toBeInTheDocument()

      expect(Skeleton).toHaveBeenCalledTimes(0)
    })
  })

  describe('when breadcrumbs are provided', () => {
    test('should render the breadcrumbs', () => {
      setup({
        overrideProps: {
          breadcrumbs: [{
            link: {
              pathname: 'pathname',
              search: 'search'
            },
            onClick: jest.fn(),
            title: 'Breadcrumb 1'
          }, {
            onClick: jest.fn(),
            options: {
              shrink: true
            },
            title: 'Breadcrumb 2'
          }]
        }
      })

      const element = getByTextWithMarkup('Breadcrumb 1/Breadcrumb 2')
      expect(element).toBeInTheDocument()
    })
  })

  describe('when a secondary header is provided', () => {
    test('should render the secondary header', () => {
      setup({
        overrideProps: {
          secondaryHeading: <span>Secondary Heading</span>
        }
      })

      expect(screen.getByText('Secondary Heading')).toBeInTheDocument()
    })
  })

  describe('when more action dropdown items are provided', () => {
    test('should render the items', async () => {
      const { user } = setup({
        overrideProps: {
          moreActionsDropdownItems: [{
            link: {
              pathname: 'pathname',
              search: 'search'
            },
            onClick: jest.fn(),
            title: 'More Action Dropdown Item 1'
          }, {
            onClick: jest.fn(),
            options: {
              shrink: true
            },
            title: 'More Action Dropdown Item 2'
          }]
        }
      })

      const moreActionsButton = screen.getByRole('button', { name: 'More actions' })
      await user.click(moreActionsButton)

      const firstItem = screen.getByRole('button', { name: 'More Action Dropdown Item 1' })
      const secondItem = screen.getByRole('button', { name: 'More Action Dropdown Item 2' })

      expect(firstItem).toBeInTheDocument()
      expect(secondItem).toBeInTheDocument()
    })
  })

  describe('when a header message is provided', () => {
    test('should render the message', () => {
      setup({
        overrideProps: {
          headerMessage: 'Header Message'
        }
      })

      expect(screen.getByText('Header Message')).toBeInTheDocument()
    })
  })

  describe('when sorts are provided', () => {
    describe('when the active sort is ascending', () => {
      test('should render the sort list', () => {
        setup({
          overrideProps: {
            activeSort: 'Sort Item 1',
            sortsArray: [
              {
                title: 'Sort Item 1',
                isActive: false,
                onClick: jest.fn()
              },
              {
                title: '-Sort Item 2',
                isActive: false,
                onClick: jest.fn()
              }
            ]
          }
        })

        expect(RadioSettingDropdown).toHaveBeenCalledTimes(1)
        expect(RadioSettingDropdown).toHaveBeenCalledWith({
          activeIcon: FaSortAmountDownAlt,
          className: 'panel-group-header__setting-dropdown',
          id: 'panel-group-header-dropdown__sort__0',
          label: 'Sort: Sort Item 1',
          settings: [{
            isActive: false,
            onClick: expect.any(Function),
            title: 'Sort Item 1'
          }, {
            isActive: false,
            onClick: expect.any(Function),
            title: '-Sort Item 2'
          }]
        }, {})
      })
    })

    describe('when the active sort is descending', () => {
      test('should render the sort list', () => {
        setup({
          overrideProps: {
            activeSort: '-Sort Item 2',
            sortsArray: [
              {
                title: 'Sort Item 1',
                isActive: false,
                onClick: jest.fn()
              },
              {
                title: '-Sort Item 2',
                isActive: false,
                onClick: jest.fn()
              }
            ]
          }
        })

        expect(RadioSettingDropdown).toHaveBeenCalledTimes(1)
        expect(RadioSettingDropdown).toHaveBeenCalledWith({
          activeIcon: FaSortAmountDown,
          className: 'panel-group-header__setting-dropdown',
          id: 'panel-group-header-dropdown__sort__0',
          label: 'Sort: -Sort Item 2',
          settings: [{
            isActive: false,
            onClick: expect.any(Function),
            title: 'Sort Item 1'
          }, {
            isActive: false,
            onClick: expect.any(Function),
            title: '-Sort Item 2'
          }]
        }, {})
      })
    })
  })

  describe('when views are provided', () => {
    describe('when the current view is List', () => {
      test('should render the views list', () => {
        setup({
          overrideProps: {
            activeView: 'list',
            viewsArray: [
              {
                title: 'View Item 1',
                icon: 'test-icon',
                isActive: false,
                onClick: jest.fn()
              },
              {
                title: 'View Item 2',
                icon: 'test-icon',
                isActive: false,
                onClick: jest.fn()
              }
            ]
          }
        })

        expect(RadioSettingDropdown).toHaveBeenCalledTimes(1)
        expect(RadioSettingDropdown).toHaveBeenCalledWith({
          activeIcon: List,
          className: 'panel-group-header__setting-dropdown',
          id: 'panel-group-header-dropdown__view__0',
          label: 'View: List',
          settings: [{
            icon: 'test-icon',
            isActive: false,
            onClick: expect.any(Function),
            title: 'View Item 1'
          }, {
            icon: 'test-icon',
            isActive: false,
            onClick: expect.any(Function),
            title: 'View Item 2'
          }]
        }, {})
      })
    })

    describe('when the current view is Table', () => {
      test('should render the views list', () => {
        setup({
          overrideProps: {
            activeView: 'table',
            viewsArray: [
              {
                title: 'View Item 1',
                icon: 'test-icon',
                isActive: false,
                onClick: jest.fn()
              },
              {
                title: 'View Item 2',
                icon: 'test-icon',
                isActive: false,
                onClick: jest.fn()
              }
            ]
          }
        })

        expect(RadioSettingDropdown).toHaveBeenCalledTimes(1)
        expect(RadioSettingDropdown).toHaveBeenCalledWith({
          activeIcon: FaTable,
          className: 'panel-group-header__setting-dropdown',
          id: 'panel-group-header-dropdown__view__0',
          label: 'View: Table',
          settings: [{
            icon: 'test-icon',
            isActive: false,
            onClick: expect.any(Function),
            title: 'View Item 1'
          }, {
            icon: 'test-icon',
            isActive: false,
            onClick: expect.any(Function),
            title: 'View Item 2'
          }]
        }, {})
      })
    })
  })

  describe('when exports are provided', () => {
    test('should render the exports list', () => {
      setup({
        overrideProps: {
          exportsArray: [
            {
              label: 'JSON',
              onClick: jest.fn()
            }
          ]
        }
      })

      expect(RadioSettingDropdown).toHaveBeenCalledTimes(1)
      expect(RadioSettingDropdown).toHaveBeenCalledWith({
        activeIcon: FaFileExport,
        className: 'panel-group-header__setting-dropdown',
        id: 'panel-group-header-dropdown__export__0',
        label: 'Export',
        settings: [{
          label: 'JSON',
          onClick: expect.any(Function)
        }]
      }, {})
    })

    test('when an export is in progress', () => {
      setup({
        overrideProps: {
          exportsArray: [
            {
              label: 'JSON',
              inProgress: true,
              onClick: jest.fn()
            }
          ]
        }
      })

      expect(RadioSettingDropdown).toHaveBeenCalledTimes(1)
      expect(RadioSettingDropdown).toHaveBeenCalledWith({
        activeIcon: FaFileExport,
        className: 'panel-group-header__setting-dropdown',
        id: 'panel-group-header-dropdown__export__0',
        label: 'Export',
        settings: [{
          label: 'JSON',
          inProgress: true,
          onClick: expect.any(Function)
        }]
      }, {})
    })
  })
})
