import { fireEvent, screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import EDSCTable from '../EDSCTable'
import EDSCTableCell from '../EDSCTableCell'

import { collectionData, collectionDataTwo } from './__mocks__/mocks'
import Skeleton from '../../Skeleton/Skeleton'
import { rowContentLarge } from '../skeleton'

jest.mock('../../Skeleton/Skeleton', () => jest.fn(() => null))

// Mock AutoSizer to return a fixed height and width (jsdom doesn't have sizes)
jest.mock('react-virtualized-auto-sizer', () => ({ children }) => children({
  height: 600,
  width: 600
}))

const skeletonProps = {
  containerStyle: {
    height: '18px',
    width: '80px'
  },
  shapes: rowContentLarge
}

const setup = setupTest({
  Component: EDSCTable,
  defaultProps: {
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
})

describe('EDSCTable component', () => {
  test('renders the table header correctly', () => {
    setup()

    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()

    const header = screen.getByRole('row', { name: 'Collection ID Version' })
    expect(header).toBeInTheDocument()
  })

  test('should add the striped class', () => {
    setup({
      overrideProps: {
        striped: true
      }
    })

    expect(screen.getByRole('table').className).toContain('edsc-table__table--striped')
  })

  describe('loading list item', () => {
    test('shows on first load', () => {
      setup({
        overrideProps: {
          data: [],
          itemCount: 1,
          isItemLoaded: jest.fn().mockReturnValueOnce(false)
        }
      })

      expect(Skeleton).toHaveBeenCalledTimes(2)
      expect(Skeleton).toHaveBeenNthCalledWith(1, skeletonProps, {})
      expect(Skeleton).toHaveBeenNthCalledWith(2, skeletonProps, {})
    })

    test('shows when additional items are being loaded', () => {
      setup({
        overrideProps: {
          data: [{}, {}],
          itemCount: 3,
          isItemLoaded: jest.fn()
            .mockReturnValueOnce(true)
            .mockReturnValueOnce(true)
            .mockReturnValue(false)
        }
      })

      expect(Skeleton).toHaveBeenCalledTimes(2)
      expect(Skeleton).toHaveBeenNthCalledWith(1, skeletonProps, {})
      expect(Skeleton).toHaveBeenNthCalledWith(2, skeletonProps, {})
    })

    test('does not show the loading item when items are loaded', () => {
      setup({
        overrideProps: {
          data: collectionDataTwo,
          itemCount: 2,
          isItemLoaded: jest.fn()
            .mockReturnValue(true)
        }
      })

      expect(Skeleton).toHaveBeenCalledTimes(0)
    })
  })

  describe('adds the correct classes to rows', () => {
    test('adds even and odd classes', () => {
      setup({
        overrideProps: {
          data: collectionDataTwo,
          itemCount: 2,
          isItemLoaded: jest.fn()
            .mockReturnValue(true)
        }
      })

      const rows = screen.getAllByRole('row')

      expect(rows.length).toBe(3) // Including header row

      expect(rows[1].className).toContain('edsc-table__tr--odd')
      expect(rows[2].className).toContain('edsc-table__tr--even')
    })
  })

  describe('row classnames', () => {
    test('are applied when the row state is set', () => {
      setup({
        overrideProps: {
          data: collectionDataTwo,
          itemCount: 2,
          initialRowStateAccessor: jest.fn()
            .mockImplementation(() => ({
              active: true
            })),
          isItemLoaded: jest.fn()
            .mockReturnValue(true),
          rowClassNamesFromRowState: ({ active }) => {
            if (active) return ['table-test-class--active']

            return []
          }
        }
      })

      const rows = screen.getAllByRole('row')

      expect(rows[1].className).toContain('table-test-class--active')
      expect(rows[2].className).toContain('table-test-class--active')
    })
  })

  describe('row callbacks', () => {
    test('onRowMouseEnterMock', async () => {
      const { props, user } = setup({
        overrideProps: {
          data: collectionDataTwo,
          itemCount: 2,
          isItemLoaded: jest.fn()
            .mockReturnValue(true),
          onRowMouseEnter: jest.fn()
        }
      })

      const row = screen.getAllByRole('row').at(1)
      await user.hover(row)

      expect(props.onRowMouseEnter).toHaveBeenCalledTimes(1)
      expect(props.onRowMouseEnter).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'mouseenter'
        }),
        expect.objectContaining({
          values: {
            datasetId: 'Test Collection 1',
            versionId: '3'
          }
        })
      )
    })

    test('onRowMouseLeave', () => {
      const { props } = setup({
        overrideProps: {
          data: collectionDataTwo,
          itemCount: 2,
          isItemLoaded: jest.fn()
            .mockReturnValue(true),
          onRowMouseLeave: jest.fn()
        }
      })

      const row = screen.getAllByRole('row').at(1)
      fireEvent.mouseLeave(row)

      expect(props.onRowMouseLeave).toHaveBeenCalledTimes(1)
      expect(props.onRowMouseLeave).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'mouseleave'
        }),
        expect.objectContaining({
          values: {
            datasetId: 'Test Collection 1',
            versionId: '3'
          }
        })
      )
    })

    test('onRowFocus', async () => {
      const { props } = setup({
        overrideProps: {
          data: collectionDataTwo,
          itemCount: 2,
          isItemLoaded: jest.fn()
            .mockReturnValue(true),
          onRowFocus: jest.fn()
        }
      })

      const row = screen.getAllByRole('row').at(1)
      fireEvent.focus(row)

      expect(props.onRowFocus).toHaveBeenCalledTimes(1)
      expect(props.onRowFocus).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'focus'
        }),
        expect.objectContaining({
          values: {
            datasetId: 'Test Collection 1',
            versionId: '3'
          }
        })
      )
    })

    test('onRowMouseBlur', async () => {
      const { props } = setup({
        overrideProps: {
          data: collectionDataTwo,
          itemCount: 2,
          isItemLoaded: jest.fn()
            .mockReturnValue(true),
          onRowBlur: jest.fn()
        }
      })

      const row = screen.getAllByRole('row').at(1)
      fireEvent.blur(row)

      expect(props.onRowBlur).toHaveBeenCalledTimes(1)
      expect(props.onRowBlur).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'blur'
        }),
        expect.objectContaining({
          values: {
            datasetId: 'Test Collection 1',
            versionId: '3'
          }
        })
      )
    })
  })
})
