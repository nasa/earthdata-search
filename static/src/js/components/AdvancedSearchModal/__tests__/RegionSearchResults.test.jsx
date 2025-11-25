import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import RegionSearchResults from '../RegionSearchResults'

const setup = setupTest({
  Component: RegionSearchResults,
  defaultProps: {
    regionResults: {
      count: 1,
      error: undefined,
      keyword: '1234',
      loading: false,
      regions: [{
        name: 'Upper Creek',
        id: '1234',
        type: 'huc'
      }]
    },
    setModalOverlay: jest.fn(),
    setFieldValue: jest.fn()
  }
})

describe('RegionSearchResults component', () => {
  test('should render a note to select a region', () => {
    setup()

    expect(screen.getByText('Select a region from the list below to filter your search results.')).toBeInTheDocument()
  })

  describe('when the results are loading', () => {
    test('renders a spinner', () => {
      setup({
        overrideProps: {
          regionResults: {
            count: 0,
            error: undefined,
            keyword: '1234',
            loading: true,
            regions: []
          }
        }
      })

      expect(screen.getByRole('status')).toBeInTheDocument()
    })
  })

  describe('when no regions are returned', () => {
    test('renders a message indicating no regions were found', () => {
      setup({
        overrideProps: {
          regionResults: {
            count: 0,
            error: undefined,
            keyword: '1234',
            loading: false,
            regions: []
          }
        }
      })

      expect(screen.getByText(/Your search returned no results./)).toBeInTheDocument()
    })

    describe('when clicking Try again', () => {
      test('calls setModalOverlay', async () => {
        const { props, user } = setup({
          overrideProps: {
            regionResults: {
              count: 0,
              error: undefined,
              keyword: '1234',
              loading: false,
              regions: []
            }
          }
        })

        const button = screen.getByRole('button', { name: 'Try again' })
        await user.click(button)

        expect(props.setModalOverlay).toHaveBeenCalledTimes(1)
        expect(props.setModalOverlay).toHaveBeenCalledWith(null)
      })
    })
  })

  describe('when an error is returned', () => {
    test('shows the error message', () => {
      setup({
        overrideProps: {
          regionResults: {
            count: 0,
            error: 'An error occurred',
            keyword: '1234',
            loading: false,
            regions: []
          }
        }
      })

      expect(screen.getByText(/An error occurred/)).toBeInTheDocument()

      expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
    })

    describe('when clicking Try again', () => {
      test('calls setModalOverlay', async () => {
        const { props, user } = setup({
          overrideProps: {
            regionResults: {
              count: 0,
              error: 'An error occurred',
              keyword: '1234',
              loading: false,
              regions: []
            }
          }
        })

        const button = screen.getByRole('button', { name: 'Try again' })
        await user.click(button)

        expect(props.setModalOverlay).toHaveBeenCalledTimes(1)
        expect(props.setModalOverlay).toHaveBeenCalledWith(null)
      })
    })
  })

  describe('when selecting a value', () => {
    test('calls setFieldValue and setModalOverlay', async () => {
      const { props, user } = setup()

      const button = screen.getByRole('button', { name: '1234' })
      await user.click(button)

      expect(props.setFieldValue).toHaveBeenCalledTimes(1)
      expect(props.setFieldValue).toHaveBeenCalledWith(
        'regionSearch.selectedRegion',
        {
          name: 'Upper Creek',
          id: '1234',
          type: 'huc'
        }
      )

      expect(props.setModalOverlay).toHaveBeenCalledTimes(1)
      expect(props.setModalOverlay).toHaveBeenCalledWith(null)
    })
  })

  describe('when clicking Back to Feature', () => {
    test('calls setModalOverlay', async () => {
      const { props, user } = setup()

      const button = screen.getByRole('button', { name: 'Back to Feature' })
      await user.click(button)

      expect(props.setModalOverlay).toHaveBeenCalledTimes(1)
      expect(props.setModalOverlay).toHaveBeenCalledWith(null)
    })
  })
})
