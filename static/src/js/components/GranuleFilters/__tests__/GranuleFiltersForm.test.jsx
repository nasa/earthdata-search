import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import MockDate from 'mockdate'

import GranuleFiltersForm from '../GranuleFiltersForm'

jest.mock('formik', () => ({
  Form: jest.fn(({ children }) => (
    <mock-formik data-testid="formik-mock">
      {children}
    </mock-formik>
  ))
}))

// TODO: Figure out how to test validation @low

const setup = (overrideProps) => {
  const user = userEvent.setup()

  const handleBlur = jest.fn()
  const handleChange = jest.fn()
  const handleSubmit = jest.fn()
  const onUndoExcludeGranule = jest.fn()
  const onMetricsGranuleFilter = jest.fn()
  const setFieldValue = jest.fn()
  const setFieldTouched = jest.fn()

  const props = {
    cmrFacetParams: {},
    collectionMetadata: {},
    collectionQuery: {},
    errors: {},
    excludedGranuleIds: [],
    handleBlur,
    handleChange,
    handleSubmit,
    onUndoExcludeGranule,
    onMetricsGranuleFilter,
    setFieldValue,
    setFieldTouched,
    touched: {},
    values: {},
    ...overrideProps
  }

  render(
    <GranuleFiltersForm {...props} />
  )

  return {
    handleBlur,
    handleChange,
    handleSubmit,
    onUndoExcludeGranule,
    onMetricsGranuleFilter,
    setFieldValue,
    setFieldTouched,
    user
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('GranuleFiltersForm component', () => {
  test('renders itself correctly', () => {
    setup()

    expect(screen.getByTestId('formik-mock')).toBeInTheDocument()
  })

  describe('Filtered Granules', () => {
    describe('when no granules are filtered', () => {
      test('does not display the filtered granules section', () => {
        setup()
        expect(screen.queryByText('Filtered Granules')).not.toBeInTheDocument()
      })
    })

    describe('when a granule is filtered', () => {
      test('displays the filtered granules section', () => {
        setup({
          excludedGranuleIds: ['GRAN_ID_1']
        })

        expect(screen.getByText('Filtered Granules')).toBeInTheDocument()
        expect(screen.getByText('1 Granule Filtered')).toBeInTheDocument()
      })

      test('displays the undo button', () => {
        setup({
          excludedGranuleIds: ['GRAN_ID_1']
        })

        expect(screen.getByRole('button', { name: 'Undo last filtered granule' })).toBeInTheDocument()
        expect(screen.getByText('Undo')).toBeInTheDocument()
      })

      describe('when a single granule is filtered', () => {
        test('displays the correct status text', () => {
          setup({
            excludedGranuleIds: ['GRAN_ID_1']
          })

          expect(screen.getByText('Filtered Granules')).toBeInTheDocument()
          expect(screen.getByText('1 Granule Filtered')).toBeInTheDocument()
        })
      })

      describe('when multiple granules are filtered', () => {
        test('displays the correct status text', () => {
          setup({
            excludedGranuleIds: ['GRAN_ID_1', 'GRAN_ID_2']
          })

          expect(screen.getByText('Filtered Granules')).toBeInTheDocument()
          expect(screen.getByText('2 Granules Filtered')).toBeInTheDocument()
        })
      })

      describe('when clicking the undo button', () => {
        test('displays the undo button', async () => {
          const { user, onUndoExcludeGranule } = setup({
            excludedGranuleIds: ['GRAN_ID_1'],
            collectionMetadata: {
              id: 'COLL_ID'
            }
          })

          const undoButton = screen.getByRole('button', { name: 'Undo last filtered granule' })
          await user.click(undoButton)

          expect(onUndoExcludeGranule).toHaveBeenCalledTimes(1)
          expect(onUndoExcludeGranule).toHaveBeenCalledWith('COLL_ID')
        })
      })
    })
  })

  describe('Form', () => {
    test('shows granule search by default', () => {
      setup()

      expect(screen.getByRole('heading', { name: 'Granule Search' })).toBeInTheDocument()
    })

    test('shows temporal by default', () => {
      setup()

      expect(screen.getByRole('heading', { name: 'Temporal' })).toBeInTheDocument()
    })

    test('shows data access by default', () => {
      setup()

      expect(screen.getByRole('heading', { name: 'Data Access' })).toBeInTheDocument()
    })

    describe('when `Enter` is pressed in the Granule ID(s) text field', () => {
      test('calls onSubmit', async () => {
        const { onMetricsGranuleFilter, handleSubmit, user } = setup({
          values: {
            readableGranuleName: ''
          }
        })

        expect(screen.getByRole('heading', { name: 'Granule Search' })).toBeInTheDocument()
        const readableGranuleNameTextField = screen.getByRole('textbox', { name: 'Granule ID(s)' })
        await user.type(readableGranuleNameTextField, '{testGranuleName}')
        await user.type(readableGranuleNameTextField, '{Enter}')

        expect(handleSubmit).toHaveBeenCalledTimes(1)
        expect(handleSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            _reactName: 'onKeyPress'
          })
        )

        expect(onMetricsGranuleFilter).toHaveBeenCalledTimes(1)
        expect(onMetricsGranuleFilter).toHaveBeenCalledWith({
          type: 'readableGranuleName',
          value: ''
        })
      })
    })

    describe('Temporal section', () => {
      describe('displays temporal', () => {
        test('displays correctly when only start date is set', () => {
          setup({
            values: {
              temporal: {
                startDate: '2019-08-14T00:00:00:000Z'
              }
            }
          })

          const startDateTextField = screen.getByRole('textbox', { name: 'Start Date' })
          expect(startDateTextField).toHaveValue('2019-08-14T00:00:00:000Z')

          const endDateTextField = screen.getByRole('textbox', { name: 'End Date' })
          expect(endDateTextField).toHaveValue('')
        })

        test('displays correctly when only end date is set', () => {
          setup({
            values: {
              temporal: {
                endDate: '2019-08-14T00:00:00:000Z'
              }
            }
          })

          const startDateTextField = screen.getByRole('textbox', { name: 'Start Date' })
          const endDateTextField = screen.getByRole('textbox', { name: 'End Date' })

          expect(startDateTextField).toHaveValue('')
          expect(endDateTextField).toHaveValue('2019-08-14T00:00:00:000Z')
        })

        test('displays correctly when both dates are set', () => {
          setup({
            values: {
              temporal: {
                startDate: '2019-08-13T00:00:00:000Z',
                endDate: '2019-08-14T23:59:59:999Z'
              }
            }
          })

          const startDateTextField = screen.getByRole('textbox', { name: 'Start Date' })
          const endDateTextField = screen.getByRole('textbox', { name: 'End Date' })

          expect(startDateTextField).toHaveValue('2019-08-13T00:00:00:000Z')
          expect(endDateTextField).toHaveValue('2019-08-14T23:59:59:999Z')
        })

        test('calls the correct callbacks on startDate submit', async () => {
          MockDate.set('2019-08-13')

          const {
            handleSubmit,
            onMetricsGranuleFilter,
            setFieldTouched,
            setFieldValue,
            user
          } = setup({
            values: {
              temporal: {
                startDate: '',
                endDate: '2019-08-14T23:59:59:999Z'
              }
            }
          })

          const button = screen.getAllByRole('button', { name: 'Today' })[0]
          await user.click(button)

          expect(setFieldTouched).toHaveBeenCalledTimes(1)
          expect(setFieldTouched).toHaveBeenCalledWith('temporal.startDate')

          expect(setFieldValue).toHaveBeenCalledTimes(1)
          expect(setFieldValue).toHaveBeenCalledWith('temporal.startDate', '2019-08-13T00:00:00.000Z')

          expect(handleSubmit).toHaveBeenCalledTimes(1)
          expect(handleSubmit).toHaveBeenCalledWith()

          expect(onMetricsGranuleFilter).toHaveBeenCalledTimes(1)
          expect(onMetricsGranuleFilter).toHaveBeenCalledWith({
            type: 'Set Start Date',
            value: '2019-08-13T00:00:00.000Z'
          })

          MockDate.reset()
        })

        test('calls the correct callbacks on startDate submit with an empty value', async () => {
          MockDate.set('2019-08-13')

          const {
            handleSubmit,
            onMetricsGranuleFilter,
            setFieldTouched,
            setFieldValue,
            user
          } = setup({
            values: {
              temporal: {
                startDate: '',
                endDate: '2019-08-14T23:59:59:999Z'
              }
            }
          })

          const button = screen.getAllByRole('button', { name: 'Clear' })[0]
          await user.click(button)

          // `onClearClick` calls `onChange` twice
          expect(setFieldTouched).toHaveBeenCalledTimes(2)
          expect(setFieldTouched).toHaveBeenCalledWith('temporal.startDate')

          expect(setFieldValue).toHaveBeenCalledTimes(2)
          expect(setFieldValue).toHaveBeenCalledWith('temporal.startDate', '')

          expect(handleSubmit).toHaveBeenCalledTimes(1)
          expect(handleSubmit).toHaveBeenCalledWith()

          expect(onMetricsGranuleFilter).toHaveBeenCalledTimes(1)
          expect(onMetricsGranuleFilter).toHaveBeenCalledWith({
            type: 'Set Start Date',
            value: ''
          })

          MockDate.reset()
        })

        test('does not call handleSubmit if shouldSubmit is false on startDate submit', async () => {
          const {
            handleSubmit,
            onMetricsGranuleFilter,
            setFieldTouched,
            setFieldValue,
            user
          } = setup({
            values: {
              temporal: {
                startDate: '',
                endDate: '2019-08-14T23:59:59:999Z'
              }
            }
          })

          const startDateTextField = screen.getByRole('textbox', { name: 'Start Date' })
          await user.type(startDateTextField, '2019')

          expect(setFieldTouched).toHaveBeenCalledTimes(4)
          expect(setFieldTouched).toHaveBeenCalledWith('temporal.startDate')

          expect(setFieldValue).toHaveBeenCalledTimes(4)
          expect(setFieldValue).toHaveBeenCalledWith('temporal.startDate', '2')
          expect(setFieldValue).toHaveBeenCalledWith('temporal.startDate', '0')
          expect(setFieldValue).toHaveBeenCalledWith('temporal.startDate', '1')
          expect(setFieldValue).toHaveBeenCalledWith('temporal.startDate', '9')

          expect(handleSubmit).toHaveBeenCalledTimes(0)
          expect(onMetricsGranuleFilter).toHaveBeenCalledTimes(0)
        })

        test('calls the correct callbacks on endDate submit', async () => {
          MockDate.set('2019-08-14')

          const {
            handleSubmit,
            onMetricsGranuleFilter,
            setFieldTouched,
            setFieldValue,
            user
          } = setup({
            values: {
              temporal: {
                startDate: '2019-08-13T00:00:00:000Z',
                endDate: ''
              }
            }
          })

          const button = screen.getAllByRole('button', { name: 'Today' })[1]
          await user.click(button)

          expect(setFieldTouched).toHaveBeenCalledTimes(1)
          expect(setFieldTouched).toHaveBeenCalledWith('temporal.endDate')

          expect(setFieldValue).toHaveBeenCalledTimes(1)
          expect(setFieldValue).toHaveBeenCalledWith('temporal.endDate', '2019-08-14T23:59:59.000Z')

          expect(handleSubmit).toHaveBeenCalledTimes(1)
          expect(handleSubmit).toHaveBeenCalledWith()

          expect(onMetricsGranuleFilter).toHaveBeenCalledTimes(1)
          expect(onMetricsGranuleFilter).toHaveBeenCalledWith({
            type: 'Set End Date',
            value: '2019-08-14T23:59:59.000Z'
          })

          MockDate.reset()
        })

        test('calls the correct callbacks on endDate submit with an empty value', async () => {
          MockDate.set('2019-08-14')

          const {
            handleSubmit,
            onMetricsGranuleFilter,
            setFieldTouched,
            setFieldValue,
            user
          } = setup({
            values: {
              temporal: {
                startDate: '2019-08-13T00:00:00:000Z',
                endDate: ''
              }
            }
          })

          const button = screen.getAllByRole('button', { name: 'Clear' })[1]
          await user.click(button)

          // `onClearClick` calls `onChange` twice
          expect(setFieldTouched).toHaveBeenCalledTimes(2)
          expect(setFieldTouched).toHaveBeenCalledWith('temporal.endDate')

          expect(setFieldValue).toHaveBeenCalledTimes(2)
          expect(setFieldValue).toHaveBeenCalledWith('temporal.endDate', '')

          expect(handleSubmit).toHaveBeenCalledTimes(1)
          expect(handleSubmit).toHaveBeenCalledWith()

          expect(onMetricsGranuleFilter).toHaveBeenCalledTimes(1)
          expect(onMetricsGranuleFilter).toHaveBeenCalledWith({
            type: 'Set End Date',
            value: ''
          })

          MockDate.reset()
        })

        test('does not call handleSubmit if shouldSubmit is false on endDate submit', async () => {
          const {
            handleSubmit,
            onMetricsGranuleFilter,
            setFieldTouched,
            setFieldValue,
            user
          } = setup({
            values: {
              temporal: {
                startDate: '2019-08-13T00:00:00:000Z',
                endDate: ''
              }
            }
          })

          const endDateTextField = screen.getByRole('textbox', { name: 'End Date' })
          await user.type(endDateTextField, '2020')

          expect(setFieldTouched).toHaveBeenCalledTimes(4)
          expect(setFieldTouched).toHaveBeenCalledWith('temporal.endDate')

          expect(setFieldValue).toHaveBeenCalledTimes(4)
          expect(setFieldValue).toHaveBeenCalledWith('temporal.endDate', '2')
          expect(setFieldValue).toHaveBeenCalledWith('temporal.endDate', '0')
          expect(setFieldValue).toHaveBeenCalledWith('temporal.endDate', '2')
          expect(setFieldValue).toHaveBeenCalledWith('temporal.endDate', '0')

          expect(handleSubmit).toHaveBeenCalledTimes(0)
          expect(onMetricsGranuleFilter).toHaveBeenCalledTimes(0)
        })

        test('calls the correct callbacks on onRecurringToggle', async () => {
          const {
            onMetricsGranuleFilter,
            setFieldTouched,
            setFieldValue,
            user
          } = setup({
            values: {
              temporal: {
                startDate: '2019-08-13T00:00:00.000Z',
                endDate: '2019-08-14T23:59:59.999Z'
              }
            }
          })

          const isRecurringCheckbox = screen.getByRole('checkbox', { name: 'Recurring?' })
          expect(isRecurringCheckbox.checked).toBe(false)

          await user.click(isRecurringCheckbox)

          expect(setFieldTouched).toHaveBeenCalledTimes(1)
          expect(setFieldTouched).toHaveBeenCalledWith('temporal.isRecurring', true)

          expect(setFieldValue).toHaveBeenCalledTimes(3)
          expect(setFieldValue).toHaveBeenCalledWith('temporal.isRecurring', true)
          expect(setFieldValue).toHaveBeenCalledWith('temporal.recurringDayStart', 225)
          expect(setFieldValue).toHaveBeenCalledWith('temporal.recurringDayEnd', 226)

          expect(isRecurringCheckbox.checked).toBe(true)

          expect(onMetricsGranuleFilter).toHaveBeenCalledTimes(1)
          expect(onMetricsGranuleFilter).toHaveBeenCalledWith({
            type: 'Set Recurring',
            value: true
          })
        })

        test('calls the correct callbacks on onRecurringToggle when a leap day is involved', async () => {
          const {
            setFieldTouched,
            setFieldValue,
            user
          } = setup({
            values: {
              temporal: {
                startDate: '2019-06-01T00:00:00.000Z',
                endDate: '2024-06-01T23:59:59.999Z'
              }
            }
          })

          const isRecurringCheckbox = screen.getByRole('checkbox', { name: 'Recurring?' })
          expect(isRecurringCheckbox.checked).toBe(false)

          await user.click(isRecurringCheckbox)

          expect(setFieldTouched).toHaveBeenCalledTimes(1)
          expect(setFieldTouched).toHaveBeenCalledWith('temporal.isRecurring', true)

          expect(setFieldValue).toHaveBeenCalledTimes(3)
          expect(setFieldValue).toHaveBeenCalledWith('temporal.isRecurring', true)
          expect(setFieldValue).toHaveBeenCalledWith('temporal.recurringDayStart', 152)
          expect(setFieldValue).toHaveBeenCalledWith('temporal.recurringDayEnd', 152)

          expect(isRecurringCheckbox.checked).toBe(true)
        })
      })
    })

    describe('Day/Night section', () => {
      test('defaults to an empty value', () => {
        setup({
          collectionMetadata: {
            isOpenSearch: false,
            tags: {
              'edsc.extra.serverless.collection_capabilities': {
                data: { day_night_flag: true }
              }
            }
          }
        })

        const dayNightSelection = screen.getByTestId('granule-filters__day-night-flag')
        expect(dayNightSelection).toHaveValue('')
      })

      test('displays selected item', async () => {
        setup({
          collectionMetadata: {
            isOpenSearch: false,
            tags: {
              'edsc.extra.serverless.collection_capabilities': {
                data: { day_night_flag: true }
              }
            }
          },
          values: {
            dayNightFlag: 'NIGHT'
          }
        })

        const dayNightSelection = screen.getByTestId('granule-filters__day-night-flag')
        expect(dayNightSelection).toHaveValue('NIGHT')
      })

      test('calls handleChange on change', async () => {
        const { user, handleChange } = setup({
          collectionMetadata: {
            isOpenSearch: false,
            tags: {
              'edsc.extra.serverless.collection_capabilities': {
                data: { day_night_flag: true }
              }
            }
          },
          values: {
            dayNightFlag: 'NIGHT'
          }
        })

        const dayNightSelection = screen.getByTestId('granule-filters__day-night-flag')

        await user.selectOptions(dayNightSelection, 'Day')
        await user.selectOptions(dayNightSelection, 'Both')

        expect(handleChange).toHaveBeenCalledTimes(2)
        expect(handleChange).toHaveBeenCalledWith(
          expect.objectContaining({
            _reactName: 'onChange'
          })
        )
      })
    })

    describe('Data Access section', () => {
      describe('Browse only toggle', () => {
        test('defaults to an empty value', () => {
          setup()

          const browseOnlyToggle = screen.getByRole('checkbox', { name: 'Find only granules that have browse images' })
          expect(browseOnlyToggle.checked).toBe(false)
        })

        test('displays selected item', () => {
          setup({
            values: {
              browseOnly: true
            }
          })

          const browseOnlyToggle = screen.getByRole('checkbox', { name: 'Find only granules that have browse images' })

          expect(browseOnlyToggle.checked).toBe(true)
        })

        test('calls handleChange on change', async () => {
          const { onMetricsGranuleFilter, handleChange, user } = setup()
          const browseOnlyToggle = screen.getByRole('checkbox', { name: 'Find only granules that have browse images' })

          await user.click(browseOnlyToggle)

          expect(handleChange).toHaveBeenCalledTimes(1)
          expect(handleChange).toHaveBeenCalledWith(
            expect.objectContaining({
              _reactName: 'onChange'
            })
          )

          expect(onMetricsGranuleFilter).toHaveBeenCalledTimes(1)
          expect(onMetricsGranuleFilter).toHaveBeenCalledWith({
            type: 'browseOnly',
            value: true
          })
        })
      })

      describe('Online only toggle', () => {
        test('defaults to an empty value', () => {
          setup()
          const onlineOnlyToggle = screen.getByRole('checkbox', { name: 'Find only granules that are available online' })

          expect(onlineOnlyToggle.checked).toBe(false)
        })

        test('displays selected item', () => {
          setup({
            values: {
              onlineOnly: true
            }
          })

          const onlineOnlyToggle = screen.getByRole('checkbox', { name: 'Find only granules that are available online' })
          expect(onlineOnlyToggle.checked).toBe(true)
        })

        test('calls handleChange on change', async () => {
          const { onMetricsGranuleFilter, handleChange, user } = setup()
          const onlineOnlyToggle = screen.getByRole('checkbox', { name: 'Find only granules that are available online' })
          await user.click(onlineOnlyToggle)

          expect(handleChange).toHaveBeenCalledTimes(1)
          expect(handleChange).toHaveBeenCalledWith(
            expect.objectContaining({
              _reactName: 'onChange'
            })
          )

          expect(onMetricsGranuleFilter).toHaveBeenCalledTimes(1)
          expect(onMetricsGranuleFilter).toHaveBeenCalledWith({
            type: 'onlineOnly',
            value: true
          })
        })
      })
    })

    describe('Cloud cover section', () => {
      describe('Min', () => {
        test('defaults to an empty value', () => {
          setup({
            collectionMetadata: {
              isOpenSearch: false,
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: { cloud_cover: true }
                }
              }
            }
          })

          expect(screen.getByRole('heading', { name: 'Cloud Cover' })).toBeInTheDocument()
          expect(screen.getByRole('textbox', { name: 'Minimum' })).toBeInTheDocument()

          const minCloudCover = screen.getByRole('textbox', { name: 'Minimum' })

          expect(minCloudCover).toHaveValue('')
        })

        test('calls handleChange on change', async () => {
          const { handleChange, user } = setup({
            collectionMetadata: {
              isOpenSearch: false,
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: { cloud_cover: true }
                }
              }
            }
          })
          const minCloudCover = screen.getByRole('textbox', { name: 'Minimum' })
          await user.type(minCloudCover, '1')
          await user.tab(minCloudCover)

          expect(handleChange).toHaveBeenCalledTimes(1)
          expect(handleChange).toHaveBeenCalledWith(
            expect.objectContaining({
              _reactName: 'onChange'
            })
          )
        })
      })

      describe('Max', () => {
        test('defaults to an empty value', async () => {
          const { handleChange } = setup({
            collectionMetadata: {
              isOpenSearch: false,
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: { cloud_cover: true }
                }
              }
            }
          })

          const maxCloudCover = screen.getByRole('textbox', { name: 'Maximum' })

          expect(maxCloudCover).toHaveValue('')
          expect(handleChange).toHaveBeenCalledTimes(0)
        })

        test('calls handleChange on change', async () => {
          const {
            handleChange, user
          } = setup({
            collectionMetadata: {
              isOpenSearch: false,
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: { cloud_cover: true }
                }
              }
            }
          })

          const maxCloudCover = screen.getByRole('textbox', { name: 'Maximum' })

          await user.type(maxCloudCover, '9')

          expect(handleChange).toHaveBeenCalledTimes(1)
          expect(handleChange).toHaveBeenCalledWith(
            expect.objectContaining({
              _reactName: 'onChange'
            })
          )
        })
      })
    })

    describe('Orbit number section', () => {
      describe('Min', () => {
        test('defaults to an empty value', () => {
          setup({
            collectionMetadata: {
              isOpenSearch: false,
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: { orbit_calculated_spatial_domains: true }
                }
              }
            }
          })

          const minOrbitNumber = screen.getByTestId('granule-filters__orbit-number-min')
          expect(minOrbitNumber).toHaveValue('')
        })

        test('calls handleChange on change', async () => {
          const { handleChange, user } = setup({
            collectionMetadata: {
              isOpenSearch: false,
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: { orbit_calculated_spatial_domains: true }
                }
              }
            }
          })

          const maxOrbitNumber = screen.getByTestId('granule-filters__orbit-number-max')
          await user.type(maxOrbitNumber, '9')

          expect(handleChange).toHaveBeenCalledTimes(1)
          expect(handleChange).toHaveBeenCalledWith(
            expect.objectContaining({
              _reactName: 'onChange'
            })
          )
        })

        test('calls onBlur when the filter is submitted', async () => {
          const {
            handleBlur, handleSubmit, onMetricsGranuleFilter, user
          } = setup({
            collectionMetadata: {
              isOpenSearch: false,
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: { orbit_calculated_spatial_domains: true }
                }
              }
            }
          })

          const minOrbitNumber = screen.getByTestId('granule-filters__orbit-number-min')
          await user.type(minOrbitNumber, '9')
          await user.tab()

          expect(handleSubmit).toHaveBeenCalledTimes(1)
          expect(handleSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
              _reactName: 'onBlur'
            })
          )

          expect(handleBlur).toHaveBeenCalledTimes(1)
          expect(handleBlur).toHaveBeenCalledWith(
            expect.objectContaining({
              _reactName: 'onBlur'
            })
          )

          expect(onMetricsGranuleFilter).toHaveBeenCalledTimes(1)
          expect(onMetricsGranuleFilter).toHaveBeenCalledWith({
            type: 'orbitNumber.min',
            value: ''
          })
        })
      })

      describe('Max', () => {
        test('defaults to an empty value', () => {
          setup({
            collectionMetadata: {
              isOpenSearch: false,
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: { orbit_calculated_spatial_domains: true }
                }
              }
            }
          })

          const maxOrbitNumber = screen.getByTestId('granule-filters__orbit-number-max')
          expect(maxOrbitNumber).toHaveValue('')
        })

        test('calls handleChange on change', async () => {
          const { handleChange, user } = setup({
            collectionMetadata: {
              isOpenSearch: false,
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: { orbit_calculated_spatial_domains: true }
                }
              }
            }
          })

          const maxOrbitNumber = screen.getByTestId('granule-filters__orbit-number-max')
          await user.type(maxOrbitNumber, '9')

          expect(handleChange).toHaveBeenCalledTimes(1)
          expect(handleChange).toHaveBeenCalledWith(
            expect.objectContaining({
              _reactName: 'onChange'
            })
          )
        })

        test('calls onBlur when the filter is submitted', async () => {
          const {
            handleBlur, handleSubmit, onMetricsGranuleFilter, user
          } = setup({
            collectionMetadata: {
              isOpenSearch: false,
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: { orbit_calculated_spatial_domains: true }
                }
              }
            }
          })

          const maxOrbitNumber = screen.getByTestId('granule-filters__orbit-number-max')
          await user.type(maxOrbitNumber, '9')
          await user.tab()

          expect(handleSubmit).toHaveBeenCalledTimes(1)
          expect(handleSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
              _reactName: 'onBlur'
            })
          )

          expect(handleBlur).toHaveBeenCalledTimes(1)
          expect(handleBlur).toHaveBeenCalledWith(
            expect.objectContaining({
              _reactName: 'onBlur'
            })
          )

          expect(onMetricsGranuleFilter).toHaveBeenCalledTimes(1)
          expect(onMetricsGranuleFilter).toHaveBeenCalledWith({
            type: 'orbitNumber.max',
            value: ''
          })
        })
      })
    })

    describe('Equator Crossing Longitude section', () => {
      describe('Min', () => {
        test('defaults to an empty value', () => {
          const { handleChange } = setup({
            collectionMetadata: {
              isOpenSearch: false,
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: { orbit_calculated_spatial_domains: true }
                }
              }
            }
          })

          const minEquatorCrossingLongitude = screen.getByTestId('granule-filters__equatorial-crossing-longitude-min')
          expect(minEquatorCrossingLongitude).toHaveValue('')
          expect(handleChange).toHaveBeenCalledTimes(0)
        })

        test('calls handleChange on change', async () => {
          const { handleChange, user } = setup({
            collectionMetadata: {
              isOpenSearch: false,
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: { orbit_calculated_spatial_domains: true }
                }
              }
            }
          })

          const minEquatorCrossingLongitude = screen.getByTestId('granule-filters__equatorial-crossing-longitude-min')
          await user.type(minEquatorCrossingLongitude, '1')
          await user.tab()

          expect(handleChange).toHaveBeenCalledTimes(1)
          expect(handleChange).toHaveBeenCalledWith(
            expect.objectContaining({
              _reactName: 'onChange'
            })
          )
        })

        test('calls onBlur when the filter is submitted ', async () => {
          const {
            onMetricsGranuleFilter, handleBlur, handleSubmit, user
          } = setup({
            collectionMetadata: {
              isOpenSearch: false,
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: { orbit_calculated_spatial_domains: true }
                }
              }
            }
          })

          const minEquatorCrossingLongitude = screen.getByTestId('granule-filters__equatorial-crossing-longitude-min')
          await user.type(minEquatorCrossingLongitude, '1')
          await user.tab()

          expect(handleSubmit).toHaveBeenCalledTimes(1)
          expect(handleSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
              _reactName: 'onBlur'
            })
          )

          expect(handleBlur).toHaveBeenCalledTimes(1)
          expect(handleBlur).toHaveBeenCalledWith(
            expect.objectContaining({
              _reactName: 'onBlur'
            })
          )

          expect(onMetricsGranuleFilter).toHaveBeenCalledTimes(1)
          expect(onMetricsGranuleFilter).toHaveBeenCalledWith({
            type: 'equatorCrossingLongitude.min',
            value: ''
          })
        })
      })

      describe('Max', () => {
        test('defaults to an empty value', () => {
          const { handleChange } = setup({
            collectionMetadata: {
              isOpenSearch: false,
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: { orbit_calculated_spatial_domains: true }
                }
              }
            }
          })

          const maxEquatorCrossingLongitude = screen.getByTestId('granule-filters__equatorial-crossing-longitude-max')
          expect(maxEquatorCrossingLongitude).toHaveValue('')
          expect(handleChange).toHaveBeenCalledTimes(0)
        })

        test('calls handleChange on change', async () => {
          const { user, handleChange } = setup({
            collectionMetadata: {
              isOpenSearch: false,
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: { orbit_calculated_spatial_domains: true }
                }
              }
            }
          })

          const maxEquatorCrossingLongitude = screen.getByTestId('granule-filters__equatorial-crossing-longitude-max')
          await user.type(maxEquatorCrossingLongitude, '1')
          await user.tab()

          expect(maxEquatorCrossingLongitude).toHaveValue('')
          expect(handleChange).toHaveBeenCalledTimes(1)
          expect(handleChange).toHaveBeenCalledWith(
            expect.objectContaining({
              _reactName: 'onChange'
            })
          )
        })

        test('calls onBlur when the filter is submitted ', async () => {
          const {
            onMetricsGranuleFilter, handleBlur, handleSubmit, user
          } = setup({
            collectionMetadata: {
              isOpenSearch: false,
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: { orbit_calculated_spatial_domains: true }
                }
              }
            }
          })

          const maxEquatorCrossingLongitude = screen.getByTestId('granule-filters__equatorial-crossing-longitude-max')
          await user.type(maxEquatorCrossingLongitude, '1')
          await user.tab()

          expect(handleSubmit).toHaveBeenCalledTimes(1)
          expect(handleSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
              _reactName: 'onBlur'
            })
          )

          expect(handleBlur).toHaveBeenCalledTimes(1)
          expect(handleBlur).toHaveBeenCalledWith(
            expect.objectContaining({
              _reactName: 'onBlur'
            })
          )

          expect(onMetricsGranuleFilter).toHaveBeenCalledTimes(1)
          expect(onMetricsGranuleFilter).toHaveBeenCalledWith({
            type: 'equatorCrossingLongitude.max',
            value: ''
          })
        })
      })
    })
  })

  describe('Equator Crossing Date section', () => {
    describe('displays equator crossing date', () => {
      test('displays correctly when only start date is set', () => {
        setup({
          collectionMetadata: {
            isOpenSearch: false,
            tags: {
              'edsc.extra.serverless.collection_capabilities': {
                data: { orbit_calculated_spatial_domains: true }
              }
            }
          },
          values: {
            equatorCrossingDate: {
              startDate: '2019-08-14T00:00:00:000Z'
            }
          }
        })

        const equatorCrossingStartDateTextField = screen.getAllByRole('textbox', { name: 'Start Date' })[1]
        const equatorCrossingEndDateTextField = screen.getAllByRole('textbox', { name: 'End Date' })[1]

        expect(equatorCrossingStartDateTextField).toHaveValue('2019-08-14T00:00:00:000Z')
        expect(equatorCrossingEndDateTextField).toHaveValue('')
      })

      test('displays correctly when only end date is set', () => {
        setup({
          collectionMetadata: {
            isOpenSearch: false,
            tags: {
              'edsc.extra.serverless.collection_capabilities': {
                data: { orbit_calculated_spatial_domains: true }
              }
            }
          },
          values: {
            equatorCrossingDate: {
              endDate: '2019-08-14T00:00:00:000Z'
            }
          }
        })

        const equatorCrossingStartDateTextField = screen.getAllByRole('textbox', { name: 'Start Date' })[1]
        const equatorCrossingEndDateTextField = screen.getAllByRole('textbox', { name: 'End Date' })[1]

        expect(equatorCrossingStartDateTextField).toHaveValue('')
        expect(equatorCrossingEndDateTextField).toHaveValue('2019-08-14T00:00:00:000Z')
      })

      test('displays correctly when both dates are set', () => {
        setup({
          collectionMetadata: {
            isOpenSearch: false,
            tags: {
              'edsc.extra.serverless.collection_capabilities': {
                data: { orbit_calculated_spatial_domains: true }
              }
            }
          },
          values: {
            equatorCrossingDate: {
              startDate: '2019-08-13T00:00:00:000Z',
              endDate: '2019-08-14T23:59:59:999Z'
            }
          }
        })

        const equatorCrossingStartDateTextField = screen.getAllByRole('textbox', { name: 'Start Date' })[1]
        const equatorCrossingEndDateTextField = screen.getAllByRole('textbox', { name: 'End Date' })[1]

        expect(equatorCrossingStartDateTextField).toHaveValue('2019-08-13T00:00:00:000Z')
        expect(equatorCrossingEndDateTextField).toHaveValue('2019-08-14T23:59:59:999Z')
      })

      test('calls the correct callbacks on startDate submit', async () => {
        MockDate.set('2019-08-13')

        const {
          handleSubmit,
          onMetricsGranuleFilter,
          setFieldTouched,
          setFieldValue,
          user
        } = setup({
          collectionMetadata: {
            isOpenSearch: false,
            tags: {
              'edsc.extra.serverless.collection_capabilities': {
                data: { orbit_calculated_spatial_domains: true }
              }
            }
          },
          values: {
            equatorCrossingDate: {
              startDate: '',
              endDate: '2019-08-14T23:59:59:999Z'
            }
          }
        })

        const button = screen.getAllByRole('button', { name: 'Today' })[2]
        await user.click(button)

        expect(setFieldTouched).toHaveBeenCalledTimes(1)
        expect(setFieldTouched).toHaveBeenCalledWith('equatorCrossingDate.startDate')

        expect(setFieldValue).toHaveBeenCalledTimes(1)
        expect(setFieldValue).toHaveBeenCalledWith('equatorCrossingDate.startDate', '2019-08-13T00:00:00.000Z')

        expect(handleSubmit).toHaveBeenCalledTimes(1)
        expect(handleSubmit).toHaveBeenCalledWith()

        expect(onMetricsGranuleFilter).toHaveBeenCalledTimes(1)
        expect(onMetricsGranuleFilter).toHaveBeenCalledWith({
          type: 'Equatorial Crossing Set Start Date',
          value: '2019-08-13T00:00:00.000Z'
        })

        MockDate.reset()
      })

      test('calls the correct callbacks on startDate submit with an empty value', async () => {
        const {
          handleSubmit,
          onMetricsGranuleFilter,
          setFieldTouched,
          setFieldValue,
          user
        } = setup({
          collectionMetadata: {
            isOpenSearch: false,
            tags: {
              'edsc.extra.serverless.collection_capabilities': {
                data: { orbit_calculated_spatial_domains: true }
              }
            }
          },
          values: {
            equatorCrossingDate: {
              startDate: '',
              endDate: '2019-08-14T23:59:59:999Z'
            }
          }
        })

        const button = screen.getAllByRole('button', { name: 'Clear' })[2]
        await user.click(button)

        // `onClearClick` calls `onChange` twice
        expect(setFieldTouched).toHaveBeenCalledTimes(2)
        expect(setFieldTouched).toHaveBeenCalledWith('equatorCrossingDate.startDate')

        expect(setFieldValue).toHaveBeenCalledTimes(2)
        expect(setFieldValue).toHaveBeenCalledWith('equatorCrossingDate.startDate', '')

        expect(handleSubmit).toHaveBeenCalledTimes(1)
        expect(handleSubmit).toHaveBeenCalledWith()

        expect(onMetricsGranuleFilter).toHaveBeenCalledTimes(1)
        expect(onMetricsGranuleFilter).toHaveBeenCalledWith({
          type: 'Equatorial Crossing Set Start Date',
          value: ''
        })
      })

      test('does not call handleSubmit if shouldSubmit is false on startDate submit', async () => {
        const {
          handleSubmit,
          onMetricsGranuleFilter,
          setFieldTouched,
          setFieldValue,
          user
        } = setup({
          collectionMetadata: {
            isOpenSearch: false,
            tags: {
              'edsc.extra.serverless.collection_capabilities': {
                data: { orbit_calculated_spatial_domains: true }
              }
            }
          },
          values: {
            equatorCrossingDate: {
              startDate: '',
              endDate: '2019-08-14T23:59:59:999Z'
            }
          }
        })

        const endDateTextField = screen.getAllByRole('textbox', { name: 'Start Date' })[1]
        await user.type(endDateTextField, '2019')

        expect(setFieldTouched).toHaveBeenCalledTimes(4)
        expect(setFieldTouched).toHaveBeenCalledWith('equatorCrossingDate.startDate')

        expect(setFieldValue).toHaveBeenCalledTimes(4)
        expect(setFieldValue).toHaveBeenCalledWith('equatorCrossingDate.startDate', '2')
        expect(setFieldValue).toHaveBeenCalledWith('equatorCrossingDate.startDate', '0')
        expect(setFieldValue).toHaveBeenCalledWith('equatorCrossingDate.startDate', '1')
        expect(setFieldValue).toHaveBeenCalledWith('equatorCrossingDate.startDate', '9')

        expect(handleSubmit).toHaveBeenCalledTimes(0)
        expect(onMetricsGranuleFilter).toHaveBeenCalledTimes(0)
      })

      test('calls the correct callbacks on endDate submit', async () => {
        MockDate.set('2019-08-14')

        const {
          handleSubmit,
          onMetricsGranuleFilter,
          setFieldTouched,
          setFieldValue,
          user
        } = setup({
          collectionMetadata: {
            isOpenSearch: false,
            tags: {
              'edsc.extra.serverless.collection_capabilities': {
                data: { orbit_calculated_spatial_domains: true }
              }
            }
          },
          values: {
            equatorCrossingDate: {
              startDate: '2019-08-13T00:00:00:000Z',
              endDate: ''
            }
          }
        })

        const button = screen.getAllByRole('button', { name: 'Today' })[3]
        await user.click(button)

        expect(setFieldTouched).toHaveBeenCalledTimes(1)
        expect(setFieldTouched).toHaveBeenCalledWith('equatorCrossingDate.endDate')

        expect(setFieldValue).toHaveBeenCalledTimes(1)
        expect(setFieldValue).toHaveBeenCalledWith('equatorCrossingDate.endDate', '2019-08-14T23:59:59.000Z')

        expect(handleSubmit).toHaveBeenCalledTimes(1)
        expect(handleSubmit).toHaveBeenCalledWith()

        expect(onMetricsGranuleFilter).toHaveBeenCalledTimes(1)
        expect(onMetricsGranuleFilter).toHaveBeenCalledWith({
          type: 'Equatorial Crossing Set End Date',
          value: '2019-08-14T23:59:59.000Z'
        })

        MockDate.reset()
      })

      test('calls the correct callbacks on endDate submit with an empty value', async () => {
        MockDate.set('2019-08-14')

        const {
          handleSubmit,
          onMetricsGranuleFilter,
          setFieldTouched,
          setFieldValue,
          user
        } = setup({
          collectionMetadata: {
            isOpenSearch: false,
            tags: {
              'edsc.extra.serverless.collection_capabilities': {
                data: { orbit_calculated_spatial_domains: true }
              }
            }
          },
          values: {
            equatorCrossingDate: {
              startDate: '2019-08-13T00:00:00:000Z',
              endDate: ''
            }
          }
        })

        const button = screen.getAllByRole('button', { name: 'Clear' })[3]
        await user.click(button)

        // `onClearClick` calls `onChange` twice
        expect(setFieldTouched).toHaveBeenCalledTimes(2)
        expect(setFieldTouched).toHaveBeenCalledWith('equatorCrossingDate.endDate')

        expect(setFieldValue).toHaveBeenCalledTimes(2)
        expect(setFieldValue).toHaveBeenCalledWith('equatorCrossingDate.endDate', '')

        expect(handleSubmit).toHaveBeenCalledTimes(1)
        expect(handleSubmit).toHaveBeenCalledWith()

        expect(onMetricsGranuleFilter).toHaveBeenCalledTimes(1)
        expect(onMetricsGranuleFilter).toHaveBeenCalledWith({
          type: 'Equatorial Crossing Set End Date',
          value: ''
        })

        MockDate.reset()
      })

      test('does not call handleSubmit if shouldSubmit is false on endDate submit', async () => {
        const {
          handleSubmit,
          onMetricsGranuleFilter,
          setFieldTouched,
          setFieldValue,
          user
        } = setup({
          collectionMetadata: {
            isOpenSearch: false,
            tags: {
              'edsc.extra.serverless.collection_capabilities': {
                data: { orbit_calculated_spatial_domains: true }
              }
            }
          },
          values: {
            equatorCrossingDate: {
              startDate: '2019-08-13T00:00:00:000Z',
              endDate: ''
            }
          }
        })

        const endDateTextField = screen.getAllByRole('textbox', { name: 'End Date' })[1]
        await user.type(endDateTextField, '2020')

        expect(setFieldTouched).toHaveBeenCalledTimes(4)
        expect(setFieldTouched).toHaveBeenCalledWith('equatorCrossingDate.endDate')

        expect(setFieldValue).toHaveBeenCalledTimes(4)
        expect(setFieldValue).toHaveBeenCalledWith('equatorCrossingDate.endDate', '2')
        expect(setFieldValue).toHaveBeenCalledWith('equatorCrossingDate.endDate', '0')
        expect(setFieldValue).toHaveBeenCalledWith('equatorCrossingDate.endDate', '2')
        expect(setFieldValue).toHaveBeenCalledWith('equatorCrossingDate.endDate', '0')

        expect(handleSubmit).toHaveBeenCalledTimes(0)
        expect(onMetricsGranuleFilter).toHaveBeenCalledTimes(0)
      })
    })
  })

  describe('Grid Coordinates section', () => {
    test('does not render if no gridName is applied', () => {
      setup()

      expect(screen.queryByText('Tiling System')).not.toBeInTheDocument()
      expect(screen.queryByRole('combobox', 'tilingSystem')).not.toBeInTheDocument()
    })

    test('defaults to an empty value', () => {
      setup({
        collectionMetadata: {
          tilingIdentificationSystems: [
            {
              tilingIdentificationSystemName: 'MISR',
              coordinate1: {
                minimumValue: 1,
                maximumValue: 233
              },
              coordinate2: {
                minimumValue: 1,
                maximumValue: 180
              }
            }
          ]
        }
      })

      expect(screen.getByLabelText('Tiling System')).toBeInTheDocument()
      const tileOptions = screen.getByRole('combobox', 'tilingSystem')
      expect(tileOptions).toHaveValue('')
    })

    test('calls handleChange on change', async () => {
      const { onMetricsGranuleFilter, handleChange, user } = setup({
        collectionMetadata: {
          tilingIdentificationSystems: [
            {
              tilingIdentificationSystemName: 'MISR',
              coordinate1: {
                minimumValue: 1,
                maximumValue: 233
              },
              coordinate2: {
                minimumValue: 1,
                maximumValue: 180
              }
            }
          ]
        }
      })

      const tileOptions = screen.getByRole('combobox', 'tilingSystem')

      await user.selectOptions(tileOptions, 'MISR')

      expect(handleChange).toHaveBeenCalledTimes(1)
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          _reactName: 'onChange'
        })
      )

      expect(onMetricsGranuleFilter).toHaveBeenCalledTimes(1)
      expect(onMetricsGranuleFilter).toHaveBeenCalledWith(
        {
          type: 'tilingSystem',
          value: 'MISR'
        }
      )
    })

    test('tiling system onchange displays grid coordinates', async () => {
      const { user } = setup({
        collectionMetadata: {
          tilingIdentificationSystems: [
            {
              tilingIdentificationSystemName: 'MISR',
              coordinate1: {
                minimumValue: 1,
                maximumValue: 233
              },
              coordinate2: {
                minimumValue: 1,
                maximumValue: 183
              }
            }
          ]
        },
        values: {
          tilingSystem: 'MISR'
        }
      })

      const gridCoordinatesMessage = 'Enter path (min: 1, max: 233) and block (min: 1, max: 183) coordinates separated by spaces, e.g. "2,3 5,7"'
      const tileOptions = screen.getByRole('combobox', 'tilingSystem')
      await user.click(tileOptions)

      const misrTileOption = screen.getByRole('option', { name: 'MISR' })
      await user.click(misrTileOption)

      expect(screen.getByText(gridCoordinatesMessage)).toBeVisible()
    })
  })
})
