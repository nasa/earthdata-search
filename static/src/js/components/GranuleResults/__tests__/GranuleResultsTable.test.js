import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import GranuleResultsTable from '../GranuleResultsTable'
import EDSCTable from '../../EDSCTable/EDSCTable'
import { granuleData } from './mocks'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    granules: granuleData,
    collectionId: 'collectionId',
    isItemLoaded: jest.fn(),
    itemCount: 1,
    focusedGranule: 'one',
    hasBrowseImagery: false,
    loadMoreItems: jest.fn(),
    location: {},
    onExcludeGranule: jest.fn(),
    onFocusedGranuleChange: jest.fn(),
    onMetricsDataAccess: jest.fn(),
    setVisibleMiddleIndex: jest.fn(),
    visibleMiddleIndex: 1,
    portal: {},
    ...overrideProps
  }

  const enzymeWrapper = shallow(<GranuleResultsTable {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleResultsTable component', () => {
  test('renders EDSCTable', () => {
    const { enzymeWrapper, props } = setup()
    const table = enzymeWrapper.find(EDSCTable)

    const { columns } = table.props()
    expect(columns[0]).toEqual(expect.objectContaining({
      Header: 'Granule',
      accessor: 'title'
    }))
    expect(columns[1]).toEqual(expect.objectContaining({
      Header: 'Image',
      accessor: 'granuleThumbnail'
    }))
    expect(columns[2]).toEqual(expect.objectContaining({
      Header: 'Start',
      accessor: 'timeStart'
    }))
    expect(columns[3]).toEqual(expect.objectContaining({
      Header: 'End',
      accessor: 'timeEnd'
    }))
    expect(columns[4]).toEqual(expect.objectContaining({
      Header: 'Orig. Format',
      accessor: 'originalFormat'
    }))
    expect(columns[5]).toEqual(expect.objectContaining({
      Header: 'Day/Night',
      accessor: 'dayNightFlag'
    }))

    expect(table.props().data).toEqual(granuleData)
    expect(table.props().itemCount).toEqual(props.itemCount)
    expect(table.props().loadMoreItems).toEqual(props.loadMoreItems)
    expect(table.props().isItemLoaded).toEqual(props.isItemLoaded)
    expect(table.props().visibleMiddleIndex).toEqual(props.visibleMiddleIndex)
    expect(table.props().setVisibleMiddleIndex).toEqual(props.setVisibleMiddleIndex)
  })

  describe('onRowClick', () => {
    test('fires the callback with the correct values', () => {
      const handleClickMock = jest.fn()
      const { enzymeWrapper } = setup()
      const table = enzymeWrapper.find(EDSCTable)

      table.props().onRowClick({ event: 'event' }, {
        original: {
          handleClick: handleClickMock
        }
      })

      expect(handleClickMock).toHaveBeenCalledTimes(1)
      expect(handleClickMock).toHaveBeenCalledWith(
        {
          event: 'event'
        },
        {
          original: {
            handleClick: handleClickMock
          }
        }
      )
    })
  })

  describe('onRowMouseEnter', () => {
    test('fires the callback with the correct values', () => {
      const handleMouseEnterMock = jest.fn()
      const { enzymeWrapper } = setup()
      const table = enzymeWrapper.find(EDSCTable)

      table.props().onRowMouseEnter({ event: 'event' }, {
        original: {
          handleMouseEnter: handleMouseEnterMock
        }
      })

      expect(handleMouseEnterMock).toHaveBeenCalledTimes(1)
      expect(handleMouseEnterMock).toHaveBeenCalledWith(
        {
          event: 'event'
        },
        {
          original: {
            handleMouseEnter: handleMouseEnterMock
          }
        }
      )
    })
  })

  describe('onRowMouseLeave', () => {
    test('fires the callback with the correct values', () => {
      const handleMouseEnterLeave = jest.fn()
      const { enzymeWrapper } = setup()
      const table = enzymeWrapper.find(EDSCTable)

      table.props().onRowMouseLeave({ event: 'event' }, {
        original: {
          handleMouseLeave: handleMouseEnterLeave
        }
      })

      expect(handleMouseEnterLeave).toHaveBeenCalledTimes(1)
      expect(handleMouseEnterLeave).toHaveBeenCalledWith(
        {
          event: 'event'
        },
        {
          original: {
            handleMouseLeave: handleMouseEnterLeave
          }
        }
      )
    })
  })

  describe('rowClassNamesFromRowState', () => {
    describe('when the granule is focused', () => {
      test('fires the callback with the correct values', () => {
        const { enzymeWrapper } = setup()
        const table = enzymeWrapper.find(EDSCTable)

        const result = table.props().rowClassNamesFromRowState({
          isFocusedGranule: true
        })

        expect(result).toEqual([
          'granule-results-table__tr',
          'granule-results-table__tr--selected'
        ])
      })
    })

    describe('when the granule is not focused', () => {
      test('fires the callback with the correct values', () => {
        const { enzymeWrapper } = setup()
        const table = enzymeWrapper.find(EDSCTable)

        const result = table.props().rowClassNamesFromRowState({
          isFocusedGranule: false
        })

        expect(result).toEqual([
          'granule-results-table__tr'
        ])
      })
    })

    describe('initialRowStateAccessor', () => {
      test('fires the callback with the correct values', () => {
        const { enzymeWrapper } = setup()
        const table = enzymeWrapper.find(EDSCTable)

        const result = table.props().initialRowStateAccessor({
          isFocusedGranule: true
        })

        expect(result).toEqual({
          isFocusedGranule: true
        })
      })
    })
  })
})
