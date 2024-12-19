import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import PanelGroupHeader from '../PanelGroupHeader'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    activeSort: 'active-sort',
    activeView: 'active-view',
    breadcrumbs: [],
    handoffLinks: [],
    headerMessage: '',
    headerMetaPrimaryLoading: false,
    headerMetaPrimaryText: 'Header Meta Primary Text',
    panelGroupId: '0',
    primaryHeading: 'Primary Heading',
    headerLoading: false,
    moreActionsDropdownItems: [],
    exportsArray: [],
    sortsArray: [],
    viewsArray: [],
    ...overrideProps
  }
  const enzymeWrapper = shallow(<PanelGroupHeader {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

describe('PanelGroupHeader component', () => {
  describe('when content is loading', () => {
    const { enzymeWrapper } = setup({
      headerMetaPrimaryLoading: true,
      headerLoading: true
    })

    test('should not render the primary text', () => {
      expect(enzymeWrapper.find('.panel-group-header__heading-primary').length).toEqual(0)
    })

    test('should not render the meta text', () => {
      expect(enzymeWrapper.find('.panel-group-header__heading-meta-text').length).toEqual(0)
    })

    test('should render the primary skeleton', () => {
      expect(enzymeWrapper.find('.panel-group-header__heading--skeleton').length).toEqual(1)
    })

    test('should render the meta skeleton', () => {
      expect(enzymeWrapper.find('.panel-group-header__heading-meta-skeleton').length).toEqual(1)
    })
  })

  describe('when content is loaded', () => {
    const { enzymeWrapper } = setup()

    test('should render the primary text', () => {
      expect(enzymeWrapper.find('.panel-group-header__heading-primary').text()).toEqual('Primary Heading')
    })

    test('should render the meta text', () => {
      expect(enzymeWrapper.find('.panel-group-header__heading-meta-text').text()).toEqual('Header Meta Primary Text')
    })
  })

  describe('when breadcrumbs are provided', () => {
    const firstBreadcrumbOnClickMock = jest.fn()
    const secondBreadcrumbOnClickMock = jest.fn()

    const { enzymeWrapper } = setup({
      breadcrumbs: [
        {
          title: 'Breadcrumb 1',
          link: {
            pathname: 'pathname',
            search: 'search'
          },
          onClick: firstBreadcrumbOnClickMock
        },
        {
          title: 'Breadcrumb 2',
          onClick: secondBreadcrumbOnClickMock,
          options: {
            shrink: true
          }
        }
      ]
    })

    test('should render the breadcrumbs', () => {
      expect(enzymeWrapper.find('.panel-group-header__breadcrumbs').children().length).toEqual(3)
    })

    test('should render the breadcrumb divider', () => {
      expect(enzymeWrapper.find('.panel-group-header__breadcrumb-divider').length).toEqual(1)
    })
  })

  describe('when a secondary header is provided', () => {
    test('should render the secondary header', () => {
      const { enzymeWrapper } = setup({
        secondaryHeading: <span>Secondary Heading</span>
      })

      expect(enzymeWrapper.find('.panel-group-header__heading').children().length).toEqual(2)
      expect(enzymeWrapper.find('.panel-group-header__heading').childAt(1).text()).toEqual('Secondary Heading')
    })
  })

  describe('when more action dropdown items are provided', () => {
    const firstMoreActionOnClickMock = jest.fn()
    const secondMoreActionOnClickMock = jest.fn()

    const { enzymeWrapper } = setup({
      moreActionsDropdownItems: [
        {
          title: 'More Action Dropdown Item 1',
          link: {
            pathname: 'pathname',
            search: 'search'
          },
          onClick: firstMoreActionOnClickMock
        },
        {
          title: 'More Action Dropdown Item 2',
          onClick: secondMoreActionOnClickMock,
          options: {
            shrink: true
          }
        }
      ]
    })

    test('should render the items', () => {
      expect(enzymeWrapper.find('.panel-group-header__more-actions').children().length).toEqual(2)
    })
  })

  describe('when a header message is provided', () => {
    const { enzymeWrapper } = setup({
      headerMessage: 'Header Message'
    })

    test('should render the message', () => {
      expect(enzymeWrapper.find('.panel-group-header__message').text()).toEqual('Header Message')
    })
  })

  describe('when sorts are provided', () => {
    const firstSortItemOnClickMock = jest.fn()
    const secondSortItemOnClickMock = jest.fn()

    const { enzymeWrapper, props } = setup({
      sortsArray: [
        {
          title: 'Sort Item 1',
          icon: 'test-icon',
          isActive: false,
          onClick: firstSortItemOnClickMock
        },
        {
          title: 'Sort Item 2',
          icon: 'test-icon',
          isActive: false,
          onClick: secondSortItemOnClickMock
        }
      ]
    })

    test('should render the sort list', () => {
      expect(enzymeWrapper.find('.panel-group-header__setting-dropdown').length).toEqual(1)
      expect(enzymeWrapper.find('.panel-group-header__setting-dropdown').props().settings).toEqual(props.sortsArray)
    })
  })

  describe('when views are provided', () => {
    const firstViewItemOnClickMock = jest.fn()
    const secondViewItemOnClickMock = jest.fn()

    const { enzymeWrapper, props } = setup({
      viewsArray: [
        {
          title: 'View Item 1',
          icon: 'test-icon',
          isActive: false,
          onClick: firstViewItemOnClickMock
        },
        {
          title: 'View Item 2',
          icon: 'test-icon',
          isActive: false,
          onClick: secondViewItemOnClickMock
        }
      ]
    })

    test('should render the views list', () => {
      expect(enzymeWrapper.find('.panel-group-header__setting-dropdown').length).toEqual(1)
      expect(enzymeWrapper.find('.panel-group-header__setting-dropdown').props().settings).toEqual(props.viewsArray)
    })
  })

  describe('when exports are provided', () => {
    test('should render the exports list', () => {
      const exportsClickMock = jest.fn()

      const { enzymeWrapper, props } = setup({
        exportsArray: [
          {
            label: 'JSON',
            onClick: () => exportsClickMock('json')
          }
        ]
      })

      expect(enzymeWrapper.find('.panel-group-header__setting-dropdown').length).toEqual(1)
      expect(enzymeWrapper.find('.panel-group-header__setting-dropdown').props().settings).toEqual(props.exportsArray)
    })

    test('when an export is in progress', () => {
      const exportsClickMock = jest.fn()

      const { enzymeWrapper } = setup({
        exportsArray: [
          {
            label: 'JSON',
            inProgress: true,
            onClick: () => exportsClickMock('json')
          }
        ]
      })

      expect(enzymeWrapper.find('.panel-group-header__setting-dropdown').props().settings[0].inProgress).toEqual(true)
    })
  })
})
