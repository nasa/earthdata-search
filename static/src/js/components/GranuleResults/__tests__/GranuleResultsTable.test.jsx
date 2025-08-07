import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import GranuleResultsTable from '../GranuleResultsTable'
import EDSCTable from '../../EDSCTable/EDSCTable'
import { granuleData } from './mocks'

jest.mock('../../EDSCTable/EDSCTable', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: GranuleResultsTable,
  defaultProps: {
    collectionId: 'collectionId',
    collectionTags: {},
    directDistributionInformation: {},
    focusedGranuleId: 'one',
    generateNotebook: {},
    granules: granuleData,
    isItemLoaded: jest.fn(),
    isGranuleInProject: jest.fn(),
    isProjectGranulesLoading: false,
    itemCount: 1,
    focusedGranule: 'one',
    loadMoreItems: jest.fn(),
    location: {},
    onFocusedGranuleChange: jest.fn(),
    onGenerateNotebook: jest.fn(),
    onMetricsDataAccess: jest.fn(),
    onMetricsAddGranuleProject: jest.fn(),
    setVisibleMiddleIndex: jest.fn(),
    visibleMiddleIndex: 1
  }
})

describe('GranuleResultsTable component', () => {
  test('renders EDSCTable', () => {
    setup()

    expect(EDSCTable).toHaveBeenCalledTimes(1)
    expect(EDSCTable).toHaveBeenCalledWith({
      columns: [{
        Cell: expect.any(Function),
        Header: 'Granule',
        accessor: 'title',
        customProps: {
          addGranuleToProjectCollection: expect.any(Function),
          cellClassName: 'granule-results-table__cell--granule',
          collectionId: 'collectionId',
          collectionQuerySpatial: {
            boundingBox: [],
            circle: [],
            line: [],
            point: [],
            polygon: []
          },
          collectionTags: {},
          directDistributionInformation: {},
          generateNotebook: {},
          GranuleResultsTableHeaderCell: expect.any(Function),
          isGranuleInProject: expect.any(Function),
          location: {},
          onExcludeGranule: expect.any(Function),
          onFocusedGranuleChange: expect.any(Function),
          onGenerateNotebook: expect.any(Function),
          onMetricsAddGranuleProject: expect.any(Function),
          onMetricsDataAccess: expect.any(Function),
          removeGranuleFromProjectCollection: expect.any(Function)
        },
        sticky: 'left',
        width: '325'
      }, {
        Cell: expect.any(Function),
        Header: 'Image',
        accessor: 'granuleThumbnail',
        customProps: {},
        width: '60'
      }, {
        Cell: expect.any(Function),
        Header: 'Start',
        accessor: 'timeStart',
        customProps: { centerContent: true },
        width: '175'
      }, {
        Cell: expect.any(Function),
        Header: 'End',
        accessor: 'timeEnd',
        customProps: { centerContent: true },
        width: '175'
      }, {
        Cell: expect.any(Function),
        Header: 'Day/Night',
        accessor: 'dayNightFlag',
        customProps: { centerContent: true },
        width: '100'
      }],
      data: [{
        browseFlag: true,
        dayNightFlag: 'DAY',
        formattedTemporal: ['2019-04-28 00:00:00', '2019-04-29 23:59:59'],
        handleMouseEnter: expect.any(Function),
        id: 'one',
        links: [{
          href: 'http://linkhref',
          rel: 'http://linkrel/data#',
          title: 'linktitle'
        }],
        onlineAccessFlag: true,
        thumbnail: '/fake/path/image.jpg',
        title: 'Granule title one'
      }, {
        browseFlag: true,
        dayNightFlag: 'DAY',
        formattedTemporal: ['2019-04-28 00:00:00', '2019-04-29 23:59:59'],
        handleMouseEnter: expect.any(Function),
        id: 'two',
        links: [{
          href: 'http://linkhref',
          rel: 'http://linkrel/data#',
          title: 'linktitle'
        }],
        onlineAccessFlag: true,
        thumbnail: '/fake/path/image.jpg',
        title: 'Granule title two'
      }],
      focusedItem: 'one',
      id: 'granule-results-table',
      initialRowStateAccessor: expect.any(Function),
      initialTableState: { hiddenColumns: ['granuleThumbnail'] },
      isItemLoaded: expect.any(Function),
      itemCount: 1,
      loadMoreItems: expect.any(Function),
      onRowClick: expect.any(Function),
      onRowMouseEnter: expect.any(Function),
      onRowMouseLeave: expect.any(Function),
      rowClassNamesFromRowState: expect.any(Function),
      rowLabelFromRowState: expect.any(Function),
      rowTestId: 'granule-results-table__item',
      setVisibleMiddleIndex: expect.any(Function),
      striped: true,
      visibleMiddleIndex: 1
    }, {})
  })

  describe('onRowClick', () => {
    test('fires the callback with the correct values', () => {
      const handleClickMock = jest.fn()
      setup()

      EDSCTable.mock.calls[0][0].onRowClick({ event: 'event' }, {
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
      setup()

      EDSCTable.mock.calls[0][0].onRowMouseEnter({ event: 'event' }, {
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
      setup()

      EDSCTable.mock.calls[0][0].onRowMouseLeave({ event: 'event' }, {
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

  describe('rowLabelFromRowState', () => {
    describe('when the granule is focused', () => {
      test('fires the callback with the correct values', () => {
        setup()

        const result = EDSCTable.mock.calls[0][0].rowLabelFromRowState({
          isFocusedGranule: true
        })

        expect(result).toBe('Unfocus granule on map')
      })
    })

    describe('when the granule is not focused', () => {
      test('fires the callback with the correct values', () => {
        setup()

        const result = EDSCTable.mock.calls[0][0].rowLabelFromRowState({
          isFocusedGranule: false
        })

        expect(result).toBe('Focus granule on map')
      })
    })
  })

  describe('rowClassNamesFromRowState', () => {
    describe('when the granule is focused', () => {
      test('fires the callback with the correct values', () => {
        setup()

        const result = EDSCTable.mock.calls[0][0].rowClassNamesFromRowState({
          isFocusedGranule: true
        })

        expect(result).toEqual([
          'granule-results-table__tr',
          'granule-results-table__tr--active'
        ])
      })
    })

    describe('when the granule is hovered', () => {
      test('fires the callback with the correct values', () => {
        setup()

        const result = EDSCTable.mock.calls[0][0].rowClassNamesFromRowState({
          isHoveredGranule: true
        })

        expect(result).toEqual([
          'granule-results-table__tr',
          'granule-results-table__tr--active'
        ])
      })
    })

    describe('when the granule is not focused', () => {
      test('fires the callback with the correct values', () => {
        setup()

        const result = EDSCTable.mock.calls[0][0].rowClassNamesFromRowState({
          isFocusedGranule: false
        })

        expect(result).toEqual([
          'granule-results-table__tr'
        ])
      })
    })

    describe('initialRowStateAccessor', () => {
      test('fires the callback with the correct values', () => {
        setup()

        const result = EDSCTable.mock.calls[0][0].initialRowStateAccessor({
          original: {
            isFocusedGranule: true,
            isCollectionInProject: true,
            isInProject: false
          }
        })

        expect(result).toEqual({
          isFocusedGranule: true,
          isCollectionInProject: true,
          isInProject: false
        })
      })
    })

    describe('when the granule is added to the project', () => {
      test('fires the callback with the correct values', () => {
        setup()

        const result = EDSCTable.mock.calls[0][0].rowClassNamesFromRowState({
          isCollectionInProject: true,
          isInProject: true
        })

        expect(result).toEqual([
          'granule-results-table__tr',
          'granule-results-table__tr--emphisized'
        ])
      })
    })

    describe('when the granule is removed to the project', () => {
      test('fires the callback with the correct values', () => {
        setup()

        const result = EDSCTable.mock.calls[0][0].rowClassNamesFromRowState({
          isCollectionInProject: true,
          isInProject: false
        })

        expect(result).toEqual([
          'granule-results-table__tr',
          'granule-results-table__tr--deemphisized'
        ])
      })
    })
  })
})
