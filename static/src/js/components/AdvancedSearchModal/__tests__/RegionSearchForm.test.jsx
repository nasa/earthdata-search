import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import RegionSearchForm from '../RegionSearchForm'

const regionSearchForm = {
  errors: {},
  handleBlur: jest.fn(),
  handleChange: jest.fn(),
  handleSubmit: jest.fn(),
  isValid: false,
  touched: {},
  validateForm: jest.fn(),
  values: {
    endpoint: 'huc'
  }
}

const setup = setupTest({
  Component: RegionSearchForm,
  defaultProps: {
    regionSearchForm,
    selectedRegion: {},
    onRemoveSelected: jest.fn()
  }
})

describe('RegionSearchForm component', () => {
  describe('when not searched or selected', () => {
    test('renders the form', () => {
      setup()

      expect(screen.getByRole('combobox', { value: 'huc' })).toBeInTheDocument()
      expect(screen.getByPlaceholderText('ex. 1805000301')).toBeInTheDocument()
      expect(screen.getByRole('checkbox', { name: 'Exact match' })).not.toBeChecked()

      expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled()
    })

    describe('when clicking the submit button', () => {
      test('calls handleSubmit', async () => {
        const { props, user } = setup({
          overrideProps: {
            regionSearchForm: {
              ...regionSearchForm,
              isValid: true,
              touched: {
                keyword: true
              },
              values: {
                endpoint: 'huc',
                keyword: '1111'
              }
            }
          }
        })

        const searchButton = screen.getByRole('button', { name: 'Search' })

        await user.click(searchButton)

        expect(props.regionSearchForm.handleSubmit).toHaveBeenCalledTimes(1)
        expect(props.regionSearchForm.handleSubmit).toHaveBeenCalledWith(expect.objectContaining({
          type: 'click'
        }))
      })
    })

    describe('when pressing enter', () => {
      test('calls handleSubmit', async () => {
        const { props, user } = setup({
          overrideProps: {
            regionSearchForm: {
              ...regionSearchForm,
              isValid: true,
              touched: {
                keyword: true
              },
              values: {
                endpoint: 'huc',
                keyword: '1111'
              }
            }
          }
        })

        const input = screen.getByPlaceholderText('ex. 1805000301')
        await user.type(input, '{enter}')

        expect(props.regionSearchForm.handleSubmit).toHaveBeenCalledTimes(1)
        expect(props.regionSearchForm.handleSubmit).toHaveBeenCalledWith()
      })
    })
  })

  describe('shows extra information in an alert box', () => {
    test('when the huc endpoint is selected', () => {
      setup()

      expect(screen.getByText('Find more information about Hydrological Units at')).toBeInTheDocument()

      expect(screen.getByRole('link', { value: 'https://water.usgs.gov/GIS/huc.html' })).toHaveAttribute('href', 'https://water.usgs.gov/GIS/huc.html')
    })

    test('when the rivers/reach endpoint is selected', () => {
      setup({
        overrideProps: {
          regionSearchForm: {
            ...regionSearchForm,
            values: {
              endpoint: 'rivers/reach'
            }
          }
        }
      })

      expect(screen.getByText('Find River Reach IDs in the SWOT River Database (SWORD):')).toBeInTheDocument()
      expect(screen.getByRole('link', { value: 'https://www.swordexplorer.com/' })).toHaveAttribute('href', 'https://www.swordexplorer.com/')
    })
  })

  describe('when keyword input is invalid', () => {
    test('shows the invalid feedback', () => {
      setup({
        overrideProps: {
          regionSearchForm: {
            ...regionSearchForm,
            errors: {
              keyword: 'The keyword is invalid'
            },
            touched: {
              keyword: true
            },
            values: {
              endpoint: 'huc'
            },
            validateForm: jest.fn(),
            isValid: false
          }
        }
      })

      expect(screen.getByText('The keyword is invalid')).toBeInTheDocument()
    })
  })

  describe('when searched and selected', () => {
    test('renders the selected result', () => {
      setup({
        overrideProps: {
          selectedRegion: {
            type: 'huc',
            id: '12341231235',
            name: 'Upper Cayote Creek',
            polygon: '30.57275390625,61.4593006372525,24.90106201171875,56.06661507755054,36.52569580078125,51.63698756452315,30.57275390625,61.4593006372525'
          }
        }
      })

      expect(screen.getByText('HUC 12341231235')).toBeInTheDocument()
      expect(screen.getByText('(Upper Cayote Creek)')).toBeInTheDocument()

      expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument()
    })

    describe('when clicking the remove button', () => {
      test('calls onRemoveSelected', async () => {
        const { props, user } = setup({
          overrideProps: {
            selectedRegion: {
              type: 'huc',
              id: '12341231235',
              name: 'Upper Cayote Creek',
              polygon: '30.57275390625,61.4593006372525,24.90106201171875,56.06661507755054,36.52569580078125,51.63698756452315,30.57275390625,61.4593006372525'
            }
          }
        })

        const button = screen.getByRole('button', { name: 'Remove' })

        await user.click(button)

        expect(props.onRemoveSelected).toHaveBeenCalledTimes(1)
        expect(props.onRemoveSelected).toHaveBeenCalledWith(expect.objectContaining({
          type: 'click'
        }))
      })
    })
  })
})
