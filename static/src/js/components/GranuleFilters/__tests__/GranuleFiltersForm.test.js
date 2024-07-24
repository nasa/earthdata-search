import React from 'react'
import moment from 'moment'
import { Router } from 'react-router'

import {
  act,
  render,
  waitFor,
  screen
} from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'

import { Form, FormControl } from 'react-bootstrap'

import GranuleFiltersForm from '../GranuleFiltersForm'
import SidebarFiltersItem from '../../Sidebar/SidebarFiltersItem'
import TemporalSelection from '../../TemporalSelection/TemporalSelection'

jest.mock('formik', () => ({
  Form: jest.fn(({ children }) => (
    <mock-formik data-testid="formik-mock">
      {children}
    </mock-formik>
  ))
}))

// TODO: Figure out how to test validation @low

const setup = (overrideProps) => {
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

  const user = userEvent.setup()

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
        // TODO: This test is kind of a repeat now
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
      // Expect(enzymeWrapper.find(SidebarFiltersItem).at(0).prop('heading')).toEqual('Granule Search')
    })

    test('shows temporal by default', () => {
      setup()
      expect(screen.getByRole('heading', { name: 'Temporal' })).toBeInTheDocument()
    })

    test('shows data access by default', () => {
      setup()
      expect(screen.getByRole('heading', { name: 'Data Access' })).toBeInTheDocument()
    })

    // TODO fix  console.warn on the date
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
          expect(startDateTextField.value).toEqual('2019-08-14T00:00:00:000Z')

          const endDateTextField = screen.getByRole('textbox', { name: 'End Date' })
          // TODO type had changed diff in tests this on is '' not undefined
          expect(endDateTextField.value).toEqual('')
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
          expect(startDateTextField.value).toEqual('')

          const endDateTextField = screen.getByRole('textbox', { name: 'End Date' })
          expect(endDateTextField.value).toEqual('2019-08-14T00:00:00:000Z')
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
          expect(startDateTextField.value).toEqual('2019-08-13T00:00:00:000Z')

          const endDateTextField = screen.getByRole('textbox', { name: 'End Date' })
          expect(endDateTextField.value).toEqual('2019-08-14T23:59:59:999Z')
        })

        test.skip('calls the correct callbacks on startDate submit', async () => {
          const { setFieldTouched, setFieldValue, user } = setup({
            values: {
              temporal: {
                startDate: '2019-08-13T00:00:00:000Z',
                endDate: '2019-08-14T23:59:59:999Z'
              }
            }
          })
          const startDateTextField = screen.getByRole('textbox', { name: 'Start Date' })
          // Await user.type(startDateTextField, '2019-08-13T00:00:00:000Z')
          await user.click(startDateTextField)
          await user.tab(startDateTextField)
          // Await act(async () => {
          // })
          // TODO 24 is equal to the length of the string
          expect(setFieldTouched).toHaveBeenCalledTimes(24)
          expect(setFieldTouched).toHaveBeenCalledWith('temporal.startDate')

          expect(setFieldValue).toHaveBeenCalledTimes(24)
          expect(setFieldValue).toHaveBeenCalledWith('temporal.startDate', '2019-08-13T00:00:00:000Z')

          // Const temporalSection = enzymeWrapper.find(SidebarFiltersItem).at(1)
          // temporalSection.find(TemporalSelection).prop('onSubmitStart')(moment('2019-08-13T00:00:00:000Z', 'YYYY-MM-DDTHH:m:s.SSSZ', true))

          // expect(props.setFieldTouched).toHaveBeenCalledTimes(1)
          // expect(props.setFieldTouched).toHaveBeenCalledWith('temporal.startDate')
          // expect(props.setFieldValue).toHaveBeenCalledTimes(1)
          // expect(props.setFieldValue).toHaveBeenCalledWith('temporal.startDate', '2019-08-13T00:00:00:000Z')
        })

        test.skip('calls the correct callbacks on endDate submit', () => {
          const { enzymeWrapper, props } = setup({
            values: {
              temporal: {
                startDate: '2019-08-13T00:00:00:000Z',
                endDate: '2019-08-14T23:59:59:999Z'
              }
            }
          })
          const temporalSection = enzymeWrapper.find(SidebarFiltersItem).at(1)
          temporalSection.find(TemporalSelection).prop('onSubmitEnd')(moment('2019-08-14T23:59:59:999Z', 'YYYY-MM-DDTHH:m:s.SSSZ', true))

          expect(props.setFieldTouched).toHaveBeenCalledTimes(1)
          expect(props.setFieldTouched).toHaveBeenCalledWith('temporal.endDate')
          expect(props.setFieldValue).toHaveBeenCalledTimes(1)
          expect(props.setFieldValue).toHaveBeenCalledWith('temporal.endDate', '2019-08-14T23:59:59:999Z')
        })

        test('calls the correct callbacks on onRecurringToggle', async () => {
          const { user, setFieldTouched, setFieldValue } = setup({
            values: {
              temporal: {
                startDate: '2019-08-13T00:00:00.000Z',
                endDate: '2019-08-14T23:59:59.999Z'
              }
            }
          })
          const isRecurringCheckbox = screen.getByRole('checkbox', { name: 'is-recurring-checkbox' })
          expect(isRecurringCheckbox.checked).toBe(false)

          await user.click(isRecurringCheckbox)

          expect(setFieldTouched).toHaveBeenCalledTimes(1)
          expect(setFieldTouched).toHaveBeenCalledWith('temporal.isRecurring', true)
          console.log('🚀 ~ file: GranuleFiltersForm.test.js:303 ~ test ~ isRecurringCheckbox:', isRecurringCheckbox)

          expect(setFieldValue).toHaveBeenCalledTimes(3)
          expect(setFieldValue).toHaveBeenCalledWith('temporal.isRecurring', true)
          expect(setFieldValue).toHaveBeenCalledWith('temporal.recurringDayStart', 225)
          expect(setFieldValue).toHaveBeenCalledWith('temporal.recurringDayEnd', 226)

          expect(isRecurringCheckbox.checked).toBe(true)
        })

        test('calls the correct callbacks on onRecurringToggle when a leap day is involved', async () => {
          const { user, setFieldTouched, setFieldValue } = setup({
            values: {
              temporal: {
                startDate: '2019-06-01T00:00:00.000Z',
                endDate: '2024-06-01T23:59:59.999Z'
              }
            }
          })

          const isRecurringCheckbox = screen.getByRole('checkbox', { name: 'is-recurring-checkbox' })
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

        const anytimeOption = screen.getByRole('option', { name: 'Anytime' })
        expect(anytimeOption.value).toBe('')
        console.log('🚀 ~ file: GranuleFiltersForm.test.js:343 ~ test ~ anytimeOption:', anytimeOption)
        // Const dayNightSection = enzymeWrapper.find(SidebarFiltersItem).at(2)
        // expect(dayNightSection.find(FormControl).prop('value')).toEqual('')
      })

      test.skip('displays selected item', () => {
        const { user } = setup({
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
        screen.debug()
        // Const dayNightSection = enzymeWrapper.find(SidebarFiltersItem).at(2)
        // expect(dayNightSection.find(FormControl).prop('value')).toEqual('NIGHT')
      })

      test('calls handleChange on change', () => {
        const { enzymeWrapper, props } = setup({
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

        const dayNightSection = enzymeWrapper.find(SidebarFiltersItem).at(2)
        const dayNightInput = dayNightSection.find(FormControl)

        // DayNightInput.prop('onChange')({
        //   event: {
        //     target: {
        //       value: 'value',
        //       name: 'test'
        //     }
        //   }
        // })
        dayNightInput.simulate('change', {
          target: {
            name: 'testName',
            value: 'new value'
          }
        })

        expect(props.handleChange).toHaveBeenCalledTimes(1)
        expect(props.handleChange).toHaveBeenCalledWith({
          event: {
            value: 'value',
            name: 'test'
          }
        })
      })
    })

    describe('Data Access section', () => {
      describe('Browse only toggle', () => {
        test('defaults to an empty value', () => {
          setup()

          const browseOnlyToggle = screen.getByRole('checkbox', { name: 'browseOnly' })
          expect(browseOnlyToggle.checked).toBe(false)

          // Await user.click(isRecurringCheckbox)
          // const dataAccessSection = enzymeWrapper.find(SidebarFiltersItem).at(2)
          // expect(dataAccessSection.find(Form.Check).at(0).prop('value')).toEqual(false)
        })

        test('displays selected item', () => {
          const { enzymeWrapper } = setup({
            values: {
              browseOnly: true
            }
          })

          const dataAccessSection = enzymeWrapper.find(SidebarFiltersItem).at(2)
          expect(dataAccessSection.find(Form.Check).at(0).prop('value')).toEqual(true)
        })

        test('calls handleChange on change', () => {
          const { enzymeWrapper, props } = setup()

          const dataAccessSection = enzymeWrapper.find(SidebarFiltersItem).at(2)
          dataAccessSection.find(Form.Check).at(0).prop('onChange')({ event: 'test' })
          expect(props.handleChange).toHaveBeenCalledTimes(1)
          expect(props.handleChange).toHaveBeenCalledWith({ event: 'test' })
        })
      })

      describe('Online only toggle', () => {
        test('defaults to an empty value', () => {
          const { enzymeWrapper } = setup()

          const dataAccessSection = enzymeWrapper.find(SidebarFiltersItem).at(2)
          expect(dataAccessSection.find(Form.Check).at(1).prop('value')).toEqual(false)
        })

        test('displays selected item', () => {
          const { enzymeWrapper } = setup({
            values: {
              onlineOnly: true
            }
          })

          const dataAccessSection = enzymeWrapper.find(SidebarFiltersItem).at(2)
          expect(dataAccessSection.find(Form.Check).at(1).prop('value')).toEqual(true)
        })

        test('calls handleChange on change', () => {
          const { enzymeWrapper, props } = setup()

          const dataAccessSection = enzymeWrapper.find(SidebarFiltersItem).at(2)
          dataAccessSection.find(Form.Check).at(1).prop('onChange')({ event: 'test' })
          expect(props.handleChange).toHaveBeenCalledTimes(1)
          expect(props.handleChange).toHaveBeenCalledWith({ event: 'test' })
        })
      })
    })

    describe('Cloud cover section', () => {
      describe('Min', () => {
        test('defaults to an empty value', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              isOpenSearch: false,
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: { cloud_cover: true }
                }
              }
            }
          })

          const cloudCoverSection = enzymeWrapper.find(SidebarFiltersItem).at(3)
          expect(cloudCoverSection.find(Form.Control).at(0).prop('value')).toEqual('')
        })

        test.only('calls handleChange on change', async () => {
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
          // TODO: Need to get called with
          // expect(screen.findByRole('textbox', { name: 'Minimum' })).toHaveValue('1')
          // Const cloudCoverSection = enzymeWrapper.find(SidebarFiltersItem).at(3)
          // cloudCoverSection.find(Form.Control).at(0).prop('onChange')({ event: 'test' })
          // expect(props.handleChange).toHaveBeenCalledTimes(1)
          // expect(props.handleChange).toHaveBeenCalledWith({ event: 'test' })
        })
      })

      describe('Max', () => {
        test.only('defaults to an empty value', async () => {
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

          const minCloudCover = screen.getByRole('textbox', { name: 'Maximum' })
          expect(minCloudCover).toHaveValue('')
          // TODO debugging assertion not needed
          expect(handleChange).toHaveBeenCalledTimes(0)
        })

        test.only('calls handleChange on change', async () => {
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

          const maxCloudCover = screen.getByRole('textbox', { name: 'Maximum' })
          await user.type(maxCloudCover, '3')
          await user.tab(maxCloudCover)
          expect(handleChange).toHaveBeenCalledTimes(1)

          // const cloudCoverSection = enzymeWrapper.find(SidebarFiltersItem).at(3)
          // cloudCoverSection.find(Form.Control).at(1).prop('onChange')({ event: 'test' })
          // expect(props.handleChange).toHaveBeenCalledTimes(1)
          // expect(props.handleChange).toHaveBeenCalledWith({ event: 'test' })
        })
      })
    })

    describe('Orbit number section', () => {
      describe('Min', () => {
        test.only('defaults to an empty value', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              isOpenSearch: false,
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: { orbit_calculated_spatial_domains: true }
                }
              }
            }
          })
          const orbitNumberSection = screen.getByRole('textbox', { name: 'Minimum' })
          screen.debug()

          // const orbitNumberSection = enzymeWrapper.find(SidebarFiltersItem).at(3)
          // expect(orbitNumberSection.find(Form.Control).at(0).prop('value')).toEqual('')
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

          // Const orbitNumberSection = enzymeWrapper.find(SidebarFiltersItem).at(3)
          // orbitNumberSection.find(Form.Control).at(0).prop('onChange')({ event: 'test' })
          // expect(props.handleChange).toHaveBeenCalledTimes(1)
          // expect(props.handleChange).toHaveBeenCalledWith({ event: 'test' })
        })
      })

      describe('Max', () => {
        test('defaults to an empty value', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              isOpenSearch: false,
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: { orbit_calculated_spatial_domains: true }
                }
              }
            }
          })

          const orbitNumberSection = enzymeWrapper.find(SidebarFiltersItem).at(3)
          expect(orbitNumberSection.find(Form.Control).at(1).prop('value')).toEqual('')
        })

        test('calls handleChange on change', () => {
          const { enzymeWrapper, props } = setup({
            collectionMetadata: {
              isOpenSearch: false,
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: { orbit_calculated_spatial_domains: true }
                }
              }
            }
          })

          const orbitNumberSection = enzymeWrapper.find(SidebarFiltersItem).at(3)
          orbitNumberSection.find(Form.Control).at(1).prop('onChange')({ event: 'test' })
          expect(props.handleChange).toHaveBeenCalledTimes(1)
          expect(props.handleChange).toHaveBeenCalledWith({ event: 'test' })
        })
      })
    })

    describe('Equator Crossing Longitude section', () => {
      describe('Min', () => {
        test('defaults to an empty value', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              isOpenSearch: false,
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: { orbit_calculated_spatial_domains: true }
                }
              }
            }
          })

          const equatorCrossingLongitudeSection = enzymeWrapper.find(SidebarFiltersItem).at(4)
          expect(equatorCrossingLongitudeSection.find(Form.Control).at(0).prop('value')).toEqual('')
        })

        test('calls handleChange on change', () => {
          const { enzymeWrapper, props } = setup({
            collectionMetadata: {
              isOpenSearch: false,
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: { orbit_calculated_spatial_domains: true }
                }
              }
            }
          })

          const equatorCrossingLongitudeSection = enzymeWrapper.find(SidebarFiltersItem).at(4)
          equatorCrossingLongitudeSection.find(Form.Control).at(0).prop('onChange')({ event: 'test' })
          expect(props.handleChange).toHaveBeenCalledTimes(1)
          expect(props.handleChange).toHaveBeenCalledWith({ event: 'test' })
        })
      })

      describe('Max', () => {
        test('defaults to an empty value', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              isOpenSearch: false,
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: { orbit_calculated_spatial_domains: true }
                }
              }
            }
          })

          const equatorCrossingLongitudeSection = enzymeWrapper.find(SidebarFiltersItem).at(4)
          expect(equatorCrossingLongitudeSection.find(Form.Control).at(1).prop('value')).toEqual('')
        })

        test('calls handleChange on change', () => {
          const { enzymeWrapper, props } = setup({
            collectionMetadata: {
              isOpenSearch: false,
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: { orbit_calculated_spatial_domains: true }
                }
              }
            }
          })

          const equatorCrossingLongitudeSection = enzymeWrapper.find(SidebarFiltersItem).at(4)
          equatorCrossingLongitudeSection.find(Form.Control).at(1).prop('onChange')({ event: 'test' })
          expect(props.handleChange).toHaveBeenCalledTimes(1)
          expect(props.handleChange).toHaveBeenCalledWith({ event: 'test' })
        })
      })
    })
  })

  describe('Equator Crossing Date section', () => {
    describe('displays equator crossing date', () => {
      test('displays correctly when only start date is set', () => {
        const { enzymeWrapper } = setup({
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
        const equatorCrossingDateSection = enzymeWrapper.find(SidebarFiltersItem).at(5)
        expect(equatorCrossingDateSection.find(TemporalSelection).prop('temporal').startDate).toEqual('2019-08-14T00:00:00:000Z')
        expect(equatorCrossingDateSection.find(TemporalSelection).prop('temporal').endDate).toEqual(undefined)
      })

      test('displays correctly when only end date is set', () => {
        const { enzymeWrapper } = setup({
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

        const equatorCrossingDateSection = enzymeWrapper.find(SidebarFiltersItem).at(5)
        expect(equatorCrossingDateSection.find(TemporalSelection).prop('temporal').endDate).toEqual('2019-08-14T00:00:00:000Z')
        expect(equatorCrossingDateSection.find(TemporalSelection).prop('temporal').startDate).toEqual(undefined)
      })

      test('displays correctly when both dates are set', () => {
        const { enzymeWrapper } = setup({
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

        const equatorCrossingDateSection = enzymeWrapper.find(SidebarFiltersItem).at(5)
        expect(equatorCrossingDateSection.find(TemporalSelection).prop('temporal').endDate).toEqual('2019-08-14T23:59:59:999Z')
        expect(equatorCrossingDateSection.find(TemporalSelection).prop('temporal').startDate).toEqual('2019-08-13T00:00:00:000Z')
      })

      test('calls the correct callbacks on startDate submit', () => {
        const { enzymeWrapper, props } = setup({
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
        const equatorCrossingDateSection = enzymeWrapper.find(SidebarFiltersItem).at(5)
        equatorCrossingDateSection.find(TemporalSelection).prop('onSubmitStart')(moment('2019-08-13T00:00:00:000Z', 'YYYY-MM-DDTHH:m:s.SSSZ', true))

        expect(props.setFieldTouched).toHaveBeenCalledTimes(1)
        expect(props.setFieldTouched).toHaveBeenCalledWith('equatorCrossingDate.startDate')
        expect(props.setFieldValue).toHaveBeenCalledTimes(1)
        expect(props.setFieldValue).toHaveBeenCalledWith('equatorCrossingDate.startDate', '2019-08-13T00:00:00:000Z')
      })

      test('calls the correct callbacks on endDate submit', () => {
        const { enzymeWrapper, props } = setup({
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
        const equatorCrossingDateSection = enzymeWrapper.find(SidebarFiltersItem).at(5)
        equatorCrossingDateSection.find(TemporalSelection).prop('onSubmitEnd')(moment('2019-08-14T23:59:59:999Z', 'YYYY-MM-DDTHH:m:s.SSSZ', true))

        expect(props.setFieldTouched).toHaveBeenCalledTimes(1)
        expect(props.setFieldTouched).toHaveBeenCalledWith('equatorCrossingDate.endDate')
        expect(props.setFieldValue).toHaveBeenCalledTimes(1)
        expect(props.setFieldValue).toHaveBeenCalledWith('equatorCrossingDate.endDate', '2019-08-14T23:59:59:999Z')
      })
    })
  })

  describe('Grid Coordinates section', () => {
    test('does not render if no gridName is applied', () => {
      const { enzymeWrapper } = setup()

      const firstSection = enzymeWrapper.find(SidebarFiltersItem).at(1)
      expect(firstSection.props().heading).not.toEqual('Grid Coordinates')
    })

    test('defaults to an empty value', () => {
      const { enzymeWrapper } = setup({
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

      const gridCoordsSection = enzymeWrapper.find(SidebarFiltersItem).at(1)
      expect(gridCoordsSection.find(Form.Control).at(0).prop('value')).toEqual('')
    })

    test('calls handleChange on change', () => {
      const { enzymeWrapper, props } = setup({
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

      const gridCoordsSection = enzymeWrapper.find(SidebarFiltersItem).at(1)
      gridCoordsSection.find(Form.Control).prop('onChange')({ target: { value: 'MISR' } })
      expect(props.handleChange).toHaveBeenCalledTimes(1)
      expect(props.handleChange).toHaveBeenCalledWith({ target: { value: 'MISR' } })
    })

    test('tiling system onchange displays grid coordinates', () => {
      const { enzymeWrapper } = setup({
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

      const gridCoordsSection = enzymeWrapper.find(SidebarFiltersItem).at(1)
      expect(gridCoordsSection.find(Form.Control).length).toBe(2)
      expect(gridCoordsSection.find(Form.Text).at(0).text()).toEqual('Enter path (min: 1, max: 233) and block (min: 1, max: 183) coordinates separated by spaces, e.g. "2,3 5,7"')
    })
  })
})
