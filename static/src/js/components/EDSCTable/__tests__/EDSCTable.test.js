import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import { FixedSizeList as List } from 'react-window'

import EDSCTable from '../EDSCTable'
import EDSCTableCell from '../EDSCTableCell'

import { collectionData, collectionDataTwo } from './mocks'

Enzyme.configure({ adapter: new Adapter() })

const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight')
const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth')

beforeEach(() => {
  jest.clearAllMocks()

  // The AutoSizer requires that the offsetHeight and offsetWidth properties are set
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 500 })
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 800 })
})

afterEach(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight)
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth)
})

const defaultProps = {
  columns: [
    {
      Header: 'Collection ID',
      EDSCTableCell,
      accessor: 'datasetId',
      width: '100'
    },
    {
      Header: 'Version',
      EDSCTableCell,
      accessor: 'versionId',
      width: '100',
      customProps: {
        centerContent: true
      }
    }
  ],
  data: collectionData,
  id: 'test-table',
  itemCount: 1,
  rowTestId: 'row-test-id',
  isItemLoaded: jest.fn(),
  loadMoreItems: jest.fn(),
  setVisibleMiddleIndex: jest.fn(),
  visibleMiddleIndex: 0
}

function setup(mountType, overrideProps) {
  const props = {
    ...defaultProps,
    ...overrideProps
  }

  const enzymeWrapper = mountType(<EDSCTable {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('EDSCTable component', () => {
  test('renders the table header correctly', () => {
    const { enzymeWrapper } = setup(mount)
    const header = enzymeWrapper.find('.edsc-table__thead')

    expect(header.text()).toContain('Collection ID')
    expect(header.text()).toContain('Version')
  })

  test('should pass the height and width', () => {
    const { enzymeWrapper } = setup(mount)

    expect(enzymeWrapper.find(List).prop('height')).toEqual(500)
    expect(enzymeWrapper.find(List).prop('width')).toEqual(800)
  })

  test('should add the striped class', () => {
    const { enzymeWrapper } = setup(mount, {
      striped: true
    })

    expect(enzymeWrapper.find('.edsc-table').prop('className')).toContain('edsc-table__table--striped')
  })

  describe('loading list item', () => {
    test('shows on first load', () => {
      const isItemLoadedMock = jest.fn()
        .mockReturnValueOnce(false)

      const { enzymeWrapper } = setup(mount, {
        data: [],
        itemCount: 1,
        isItemLoaded: isItemLoadedMock
      })

      expect(enzymeWrapper.find('.edsc-table__tbody').children().length).toEqual(1)
      expect(enzymeWrapper.find('.edsc-table__tbody').childAt(0).find('.edsc-table__td').length).toEqual(2)
      expect(enzymeWrapper.find('.edsc-table__tbody').childAt(0).find('.skeleton').length).toEqual(2)
    })

    test('shows when additional items are being loaded', () => {
      const isItemLoadedMock = jest.fn()
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true)
        .mockReturnValue(false)

      const { enzymeWrapper } = setup(mount, {
        data: collectionDataTwo,
        itemCount: 3,
        isItemLoaded: isItemLoadedMock
      })

      expect(enzymeWrapper.find('.edsc-table__tbody').children().length).toEqual(3)
      expect(enzymeWrapper.find('.edsc-table__tbody').text()).toContain('3')
      expect(enzymeWrapper.find('.edsc-table__tbody').text()).toContain('2')
      expect(enzymeWrapper.find('.edsc-table__tbody').childAt(2).find('.skeleton').length).toEqual(2)
    })

    test('does not show the loading item when items are loaded', () => {
      const isItemLoadedMock = jest.fn()
        .mockReturnValue(true)

      const { enzymeWrapper } = setup(mount, {
        data: collectionDataTwo,
        itemCount: 2,
        isItemLoaded: isItemLoadedMock
      })

      expect(enzymeWrapper.find('.edsc-table__tbody').children().length).toEqual(2)
      expect(enzymeWrapper.find('.edsc-table__tbody').text()).toContain('3')
      expect(enzymeWrapper.find('.edsc-table__tbody').text()).toContain('2')
      expect(enzymeWrapper.find('.edsc-table__tbody').find('.skeleton').length).toEqual(0)
    })
  })

  describe('adds the correct classes to rows', () => {
    test('adds even and odd classes', () => {
      const isItemLoadedMock = jest.fn()
        .mockReturnValue(true)

      const { enzymeWrapper } = setup(mount, {
        data: collectionDataTwo,
        itemCount: 2,
        isItemLoaded: isItemLoadedMock
      })

      const rows = enzymeWrapper.find('.edsc-table__tbody').find('.edsc-table__tr')

      expect(rows.at(0).prop('className')).toEqual('edsc-table__tr edsc-table__tr--odd')
      expect(rows.at(1).prop('className')).toEqual('edsc-table__tr edsc-table__tr--even')
    })
  })

  describe('row classnames', () => {
    test('are applied when the row state is set', () => {
      const isItemLoadedMock = jest.fn()
        .mockReturnValue(true)

      const initialRowStateAccessorMock = jest.fn()
        .mockImplementation(() => ({
          active: true
        }))

      const { enzymeWrapper } = setup(mount, {
        data: collectionDataTwo,
        itemCount: 2,
        initialRowStateAccessor: initialRowStateAccessorMock,
        isItemLoaded: isItemLoadedMock,
        rowClassNamesFromRowState: ({ active }) => {
          if (active) return ['table-test-class--active']
          return []
        }
      })

      expect(enzymeWrapper.find('.table-test-class--active').length).toEqual(2)
    })
  })

  describe('row callbacks', () => {
    test('onRowMouseEnterMock', () => {
      const onRowMouseEnterMock = jest.fn()
      const isItemLoadedMock = jest.fn()
        .mockReturnValue(true)

      const { enzymeWrapper } = setup(mount, {
        data: collectionDataTwo,
        itemCount: 2,
        isItemLoaded: isItemLoadedMock,
        onRowMouseEnter: onRowMouseEnterMock
      })

      const row = enzymeWrapper.find('.edsc-table__tbody').find('.edsc-table__tr').at(0)

      row.simulate('mouseenter')

      expect(onRowMouseEnterMock).toHaveBeenCalledTimes(1)
    })

    test('onRowMouseLeave', () => {
      const onRowMouseLeaveMock = jest.fn()
      const isItemLoadedMock = jest.fn()
        .mockReturnValue(true)

      const { enzymeWrapper } = setup(mount, {
        data: collectionDataTwo,
        itemCount: 2,
        isItemLoaded: isItemLoadedMock,
        onRowMouseLeave: onRowMouseLeaveMock
      })

      const row = enzymeWrapper.find('.edsc-table__tbody').find('.edsc-table__tr').at(0)

      row.simulate('mouseleave')

      expect(onRowMouseLeaveMock).toHaveBeenCalledTimes(1)
    })

    test('onRowFocus', () => {
      const onRowFocusMock = jest.fn()
      const isItemLoadedMock = jest.fn()
        .mockReturnValue(true)

      const { enzymeWrapper } = setup(mount, {
        data: collectionDataTwo,
        itemCount: 2,
        isItemLoaded: isItemLoadedMock,
        onRowFocus: onRowFocusMock
      })

      const row = enzymeWrapper.find('.edsc-table__tbody').find('.edsc-table__tr').at(0)

      row.simulate('focus')

      expect(onRowFocusMock).toHaveBeenCalledTimes(1)
    })

    test('onRowMouseBlur', () => {
      const onRowMouseBlurMock = jest.fn()
      const isItemLoadedMock = jest.fn()
        .mockReturnValue(true)

      const { enzymeWrapper } = setup(mount, {
        data: collectionDataTwo,
        itemCount: 2,
        isItemLoaded: isItemLoadedMock,
        onRowBlur: onRowMouseBlurMock
      })

      const row = enzymeWrapper.find('.edsc-table__tbody').find('.edsc-table__tr').at(0)

      row.simulate('blur')

      expect(onRowMouseBlurMock).toHaveBeenCalledTimes(1)
    })
  })
})
