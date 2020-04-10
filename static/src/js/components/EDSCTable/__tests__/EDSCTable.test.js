import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { FixedSizeList as List } from 'react-window'

import EDSCTable from '../EDSCTable'
import Cell from '../../CollectionResultsTable/Cell'

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
      Cell,
      accessor: 'datasetId',
      width: '100'
    },
    {
      Header: 'Version',
      Cell,
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
    // console.log('enzymeWrapper', enzymeWrapper.render().children()[1].children[0].children)
    const header = enzymeWrapper.find('.edsc-table__thead')
    expect(header.text()).toContain('Collection ID')
    expect(header.text()).toContain('Version')
  })

  test('should pass the height and width', () => {
    const { enzymeWrapper } = setup(mount)

    expect(enzymeWrapper.find(List).prop('height')).toEqual(500)
    expect(enzymeWrapper.find(List).prop('width')).toEqual(800)
  })

  // test('renders the table cell correctly', () => {
  //   const { enzymeWrapper } = setup(mount)
  //   const cell = enzymeWrapper.find('Cell')
  //   expect(cell.props().data).toEqual(collectionData)
  // })

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
})
