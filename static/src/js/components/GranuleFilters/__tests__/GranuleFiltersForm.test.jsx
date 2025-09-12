import React from 'react'
import { screen } from '@testing-library/react'
import MockDate from 'mockdate'

import setupTest from '../../../../../../jestConfigs/setupTest'

import GranuleFiltersForm from '../GranuleFiltersForm'

jest.mock('formik', () => ({
  Form: jest.fn(({ children }) => (
    <mock-formik>
      {children}
    </mock-formik>
  ))
}))

// TODO: Figure out how to test validation @low

const setup = setupTest({
  Component: GranuleFiltersForm,
  defaultProps: {
    cmrFacetParams: {},
    errors: {},
    handleBlur: jest.fn(),
    handleChange: jest.fn(),
    handleSubmit: jest.fn(),
    onMetricsGranuleFilter: jest.fn(),
    setFieldValue: jest.fn(),
    setFieldTouched: jest.fn(),
    touched: {},
    values: {
      temporal: {
        isRecurring: false,
        startDate: '',
        endDate: ''
      }
    }
  },
  defaultZustandState: {
    collection: {
      collectionId: 'collectionId',
      collectionMetadata: {
        collectionId: {}
      }
    }
  },
  withRedux: true
})

describe('GranuleFiltersForm component', () => {
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
          overrideZustandState: {
            query: {
              collection: {
                byId: {
                  collectionId: {
                    granules: {
                      excludedGranuleIds: ['GRAN_ID_1']
                    }
                  }
                }
              }
            }
          }
        })

        expect(screen.getByText('Filtered Granules')).toBeInTheDocument()
        expect(screen.getByText('1 Granule Filtered')).toBeInTheDocument()
      })

      test('displays the undo button', () => {
        setup({
          overrideZustandState: {
            query: {
              collection: {
                byId: {
                  collectionId: {
                    granules: {
                      excludedGranuleIds: ['GRAN_ID_1']
                    }
                  }
                }
              }
            }
          }
        })

        expect(screen.getByRole('button', { name: 'Undo last filtered granule' })).toBeInTheDocument()
        expect(screen.getByText('Undo')).toBeInTheDocument()
      })

      describe('when a single granule is filtered', () => {
        test('displays the correct status text', () => {
          setup({
            overrideZustandState: {
              query: {
                collection: {
                  byId: {
                    collectionId: {
                      granules: {
                        excludedGranuleIds: ['GRAN_ID_1']
                      }
                    }
                  }
                }
              }
            }
          })

          expect(screen.getByText('Filtered Granules')).toBeInTheDocument()
          expect(screen.getByText('1 Granule Filtered')).toBeInTheDocument()
        })
      })

      describe('when multiple granules are filtered', () => {
        test('displays the correct status text', () => {
          setup({
            overrideZustandState: {
              query: {
                collection: {
                  byId: {
                    collectionId: {
                      granules: {
                        excludedGranuleIds: ['GRAN_ID_1', 'GRAN_ID_2']
                      }
                    }
                  }
                }
              }
            }
          })

          expect(screen.getByText('Filtered Granules')).toBeInTheDocument()
          expect(screen.getByText('2 Granules Filtered')).toBeInTheDocument()
        })
      })

      describe('when clicking the undo button', () => {
        test('displays the undo button', async () => {
          const { user, zustandState } = setup({
            overrideZustandState: {
              collection: {
                collectionMetadata: {
                  collectionId: {
                    id: 'collectionId'
                  }
                }
              },
              query: {
                collection: {
                  byId: {
                    collectionId: {
                      granules: {
                        excludedGranuleIds: ['GRAN_ID_1']
                      }
                    }
                  }
                },
                undoExcludeGranule: jest.fn()
              }
            }
          })

          const undoButton = screen.getByRole('button', { name: 'Undo last filtered granule' })
          await user.click(undoButton)

          expect(zustandState.query.undoExcludeGranule).toHaveBeenCalledTimes(1)
          expect(zustandState.query.undoExcludeGranule).toHaveBeenCalledWith('collectionId')
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
      test('calls handleSubmit', async () => {
        const { props, user } = setup()

        expect(screen.getByRole('heading', { name: 'Granule Search' })).toBeInTheDocument()
        const readableGranuleNameTextField = screen.getByRole('textbox', { name: 'Granule ID(s)' })
        await user.type(readableGranuleNameTextField, '{testGranuleName}')
        await user.type(readableGranuleNameTextField, '{Enter}')

        expect(props.handleSubmit).toHaveBeenCalledTimes(1)
        expect(props.handleSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            _reactName: 'onKeyPress'
          })
        )

        expect(props.onMetricsGranuleFilter).toHaveBeenCalledTimes(1)
        expect(props.onMetricsGranuleFilter).toHaveBeenCalledWith({
          type: 'readableGranuleName',
          value: ''
        })
      })
    })

    describe('Temporal section', () => {
      describe('displays temporal', () => {
        test('displays correctly when only start date is set', () => {
          setup({
            overrideProps: {
              values: {
                temporal: {
                  startDate: '2019-08-14T00:00:00:000Z'
                }
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
            overrideProps: {
              values: {
                temporal: {
                  endDate: '2019-08-14T00:00:00:000Z'
                }
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
            overrideProps: {
              values: {
                temporal: {
                  startDate: '2019-08-13T00:00:00:000Z',
                  endDate: '2019-08-14T23:59:59:999Z'
                }
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

          const { props, user } = setup({
            overrideProps: {
              values: {
                temporal: {
                  startDate: '',
                  endDate: '2019-08-14T23:59:59:999Z'
                }
              }
            }
          })

          const button = screen.getAllByRole('button', { name: 'Today' })[0]
          await user.click(button)

          expect(props.setFieldTouched).toHaveBeenCalledTimes(1)
          expect(props.setFieldTouched).toHaveBeenCalledWith('temporal.startDate')

          expect(props.setFieldValue).toHaveBeenCalledTimes(1)
          expect(props.setFieldValue).toHaveBeenCalledWith('temporal.startDate', '2019-08-13T00:00:00.000Z')

          expect(props.handleSubmit).toHaveBeenCalledTimes(1)
          expect(props.handleSubmit).toHaveBeenCalledWith()

          expect(props.onMetricsGranuleFilter).toHaveBeenCalledTimes(1)
          expect(props.onMetricsGranuleFilter).toHaveBeenCalledWith({
            type: 'Set Start Date',
            value: '2019-08-13T00:00:00.000Z'
          })

          MockDate.reset()
        })

        test('calls the correct callbacks on startDate submit with an empty value', async () => {
          MockDate.set('2019-08-13')

          const { props, user } = setup({
            overrideProps: {
              values: {
                temporal: {
                  startDate: '',
                  endDate: '2019-08-14T23:59:59:999Z'
                }
              }
            }
          })

          const button = screen.getAllByRole('button', { name: 'Clear' })[0]
          await user.click(button)

          // `onClearClick` calls `onChange` twice
          expect(props.setFieldTouched).toHaveBeenCalledTimes(2)
          expect(props.setFieldTouched).toHaveBeenCalledWith('temporal.startDate')

          expect(props.setFieldValue).toHaveBeenCalledTimes(2)
          expect(props.setFieldValue).toHaveBeenCalledWith('temporal.startDate', '')

          expect(props.handleSubmit).toHaveBeenCalledTimes(1)
          expect(props.handleSubmit).toHaveBeenCalledWith()

          expect(props.onMetricsGranuleFilter).toHaveBeenCalledTimes(1)
          expect(props.onMetricsGranuleFilter).toHaveBeenCalledWith({
            type: 'Set Start Date',
            value: ''
          })

          MockDate.reset()
        })

        test('does not call handleSubmit if shouldSubmit is false on startDate submit', async () => {
          const { props, user } = setup({
            overrideProps: {
              values: {
                temporal: {
                  startDate: '',
                  endDate: '2019-08-14T23:59:59:999Z'
                }
              }
            }
          })

          const startDateTextField = screen.getByRole('textbox', { name: 'Start Date' })
          await user.type(startDateTextField, '2019')

          expect(props.setFieldTouched).toHaveBeenCalledTimes(4)
          expect(props.setFieldTouched).toHaveBeenCalledWith('temporal.startDate')

          expect(props.setFieldValue).toHaveBeenCalledTimes(4)
          expect(props.setFieldValue).toHaveBeenCalledWith('temporal.startDate', '2')
          expect(props.setFieldValue).toHaveBeenCalledWith('temporal.startDate', '0')
          expect(props.setFieldValue).toHaveBeenCalledWith('temporal.startDate', '1')
          expect(props.setFieldValue).toHaveBeenCalledWith('temporal.startDate', '9')

          expect(props.handleSubmit).toHaveBeenCalledTimes(0)
          expect(props.onMetricsGranuleFilter).toHaveBeenCalledTimes(0)
        })

        test('calls the correct callbacks on endDate submit', async () => {
          MockDate.set('2019-08-14')

          const { props, user } = setup({
            overrideProps: {
              values: {
                temporal: {
                  startDate: '2019-08-13T00:00:00:000Z',
                  endDate: ''
                }
              }
            }
          })

          const button = screen.getAllByRole('button', { name: 'Today' })[1]
          await user.click(button)

          expect(props.setFieldTouched).toHaveBeenCalledTimes(1)
          expect(props.setFieldTouched).toHaveBeenCalledWith('temporal.endDate')

          expect(props.setFieldValue).toHaveBeenCalledTimes(1)
          expect(props.setFieldValue).toHaveBeenCalledWith('temporal.endDate', '2019-08-14T23:59:59.000Z')

          expect(props.handleSubmit).toHaveBeenCalledTimes(1)
          expect(props.handleSubmit).toHaveBeenCalledWith()

          expect(props.onMetricsGranuleFilter).toHaveBeenCalledTimes(1)
          expect(props.onMetricsGranuleFilter).toHaveBeenCalledWith({
            type: 'Set End Date',
            value: '2019-08-14T23:59:59.000Z'
          })

          MockDate.reset()
        })

        test('calls the correct callbacks on endDate submit with an empty value', async () => {
          MockDate.set('2019-08-14')

          const { props, user } = setup({
            overrideProps: {
              values: {
                temporal: {
                  startDate: '2019-08-13T00:00:00:000Z',
                  endDate: ''
                }
              }
            }
          })

          const button = screen.getAllByRole('button', { name: 'Clear' })[1]
          await user.click(button)

          // `onClearClick` calls `onChange` twice
          expect(props.setFieldTouched).toHaveBeenCalledTimes(2)
          expect(props.setFieldTouched).toHaveBeenCalledWith('temporal.endDate')

          expect(props.setFieldValue).toHaveBeenCalledTimes(2)
          expect(props.setFieldValue).toHaveBeenCalledWith('temporal.endDate', '')

          expect(props.handleSubmit).toHaveBeenCalledTimes(1)
          expect(props.handleSubmit).toHaveBeenCalledWith()

          expect(props.onMetricsGranuleFilter).toHaveBeenCalledTimes(1)
          expect(props.onMetricsGranuleFilter).toHaveBeenCalledWith({
            type: 'Set End Date',
            value: ''
          })

          MockDate.reset()
        })

        test('does not call handleSubmit if shouldSubmit is false on endDate submit', async () => {
          const { props, user } = setup({
            overrideProps: {
              values: {
                temporal: {
                  startDate: '2019-08-13T00:00:00:000Z',
                  endDate: ''

                }
              }
            }
          })

          const endDateTextField = screen.getByRole('textbox', { name: 'End Date' })
          await user.type(endDateTextField, '2020')

          expect(props.setFieldTouched).toHaveBeenCalledTimes(4)
          expect(props.setFieldTouched).toHaveBeenCalledWith('temporal.endDate')

          expect(props.setFieldValue).toHaveBeenCalledTimes(4)
          expect(props.setFieldValue).toHaveBeenCalledWith('temporal.endDate', '2')
          expect(props.setFieldValue).toHaveBeenCalledWith('temporal.endDate', '0')
          expect(props.setFieldValue).toHaveBeenCalledWith('temporal.endDate', '2')
          expect(props.setFieldValue).toHaveBeenCalledWith('temporal.endDate', '0')

          expect(props.handleSubmit).toHaveBeenCalledTimes(0)
          expect(props.onMetricsGranuleFilter).toHaveBeenCalledTimes(0)
        })

        test('calls the correct callbacks on onRecurringToggle', async () => {
          const { props, user } = setup({
            overrideProps: {
              values: {
                temporal: {
                  startDate: '2019-08-13T00:00:00.000Z',
                  endDate: '2019-08-14T23:59:59.999Z'
                }
              }
            }
          })

          const isRecurringCheckbox = screen.getByRole('checkbox', { name: 'Use a recurring date range' })
          expect(isRecurringCheckbox.checked).toBe(false)

          await user.click(isRecurringCheckbox)

          expect(props.setFieldTouched).toHaveBeenCalledTimes(1)
          expect(props.setFieldTouched).toHaveBeenCalledWith('temporal.isRecurring', true)

          expect(props.setFieldValue).toHaveBeenCalledTimes(4)
          expect(props.setFieldValue).toHaveBeenCalledWith('temporal.isRecurring', true)
          expect(props.setFieldValue).toHaveBeenCalledWith('temporal.startDate', '1960-08-13T00:00:00.000Z')
          expect(props.setFieldValue).toHaveBeenCalledWith('temporal.recurringDayStart', 225)
          expect(props.setFieldValue).toHaveBeenCalledWith('temporal.recurringDayEnd', 226)

          expect(isRecurringCheckbox.checked).toBe(true)

          expect(props.onMetricsGranuleFilter).toHaveBeenCalledTimes(1)
          expect(props.onMetricsGranuleFilter).toHaveBeenCalledWith({
            type: 'Set Recurring',
            value: true
          })
        })

        test('calls the correct callbacks on onRecurringToggle when a leap day is involved', async () => {
          const { props, user } = setup({
            overrideProps: {
              values: {
                temporal: {
                  startDate: '2019-06-01T00:00:00.000Z',
                  endDate: '2024-06-01T23:59:59.999Z'
                }
              }
            }
          })

          const isRecurringCheckbox = screen.getByRole('checkbox', { name: 'Use a recurring date range' })
          expect(isRecurringCheckbox.checked).toBe(false)

          await user.click(isRecurringCheckbox)

          expect(props.setFieldTouched).toHaveBeenCalledTimes(1)
          expect(props.setFieldTouched).toHaveBeenCalledWith('temporal.isRecurring', true)

          expect(props.setFieldValue).toHaveBeenCalledTimes(3)
          expect(props.setFieldValue).toHaveBeenCalledWith('temporal.isRecurring', true)
          expect(props.setFieldValue).toHaveBeenCalledWith('temporal.recurringDayStart', 152)
          expect(props.setFieldValue).toHaveBeenCalledWith('temporal.recurringDayEnd', 152)

          expect(isRecurringCheckbox.checked).toBe(true)
        })
      })
    })

    describe('Day/Night section', () => {
      test('defaults to an empty value', () => {
        setup({
          overrideZustandState: {
            collection: {
              collectionMetadata: {
                collectionId: {
                  isOpenSearch: false,
                  tags: {
                    'edsc.extra.serverless.collection_capabilities': {
                      data: { day_night_flag: true }
                    }
                  }
                }
              }
            }
          }
        })

        const dayNightSelection = screen.getByTestId('granule-filters__day-night-flag')
        expect(dayNightSelection).toHaveValue('')
      })

      test('displays selected item', async () => {
        setup({
          overrideZustandState: {
            collection: {
              collectionMetadata: {
                collectionId: {
                  isOpenSearch: false,
                  tags: {
                    'edsc.extra.serverless.collection_capabilities': {
                      data: { day_night_flag: true }
                    }
                  }
                }
              }
            }
          },
          overrideProps: {
            values: {
              dayNightFlag: 'NIGHT'
            }
          }
        })

        const dayNightSelection = screen.getByTestId('granule-filters__day-night-flag')
        expect(dayNightSelection).toHaveValue('NIGHT')
      })

      test('calls handleChange on change', async () => {
        const { props, user } = setup({
          overrideZustandState: {
            collection: {
              collectionMetadata: {
                collectionId: {
                  isOpenSearch: false,
                  tags: {
                    'edsc.extra.serverless.collection_capabilities': {
                      data: { day_night_flag: true }
                    }
                  }
                }
              }
            }
          },
          overrideProps: {
            values: {
              dayNightFlag: 'NIGHT'
            }
          }
        })

        const dayNightSelection = screen.getByTestId('granule-filters__day-night-flag')

        await user.selectOptions(dayNightSelection, 'Day')
        await user.selectOptions(dayNightSelection, 'Both')

        expect(props.handleChange).toHaveBeenCalledTimes(2)
        expect(props.handleChange).toHaveBeenCalledWith(
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
            overrideProps: {
              values: {
                browseOnly: true
              }
            }
          })

          const browseOnlyToggle = screen.getByRole('checkbox', { name: 'Find only granules that have browse images' })

          expect(browseOnlyToggle.checked).toBe(true)
        })

        test('calls handleChange on change', async () => {
          const { props, user } = setup()

          const browseOnlyToggle = screen.getByRole('checkbox', { name: 'Find only granules that have browse images' })

          await user.click(browseOnlyToggle)

          expect(props.handleChange).toHaveBeenCalledTimes(1)
          expect(props.handleChange).toHaveBeenCalledWith(
            expect.objectContaining({
              _reactName: 'onChange'
            })
          )

          expect(props.onMetricsGranuleFilter).toHaveBeenCalledTimes(1)
          expect(props.onMetricsGranuleFilter).toHaveBeenCalledWith({
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
            overrideProps: {
              values: {
                onlineOnly: true
              }
            }
          })

          const onlineOnlyToggle = screen.getByRole('checkbox', { name: 'Find only granules that are available online' })
          expect(onlineOnlyToggle.checked).toBe(true)
        })

        test('calls handleChange on change', async () => {
          const { props, user } = setup()

          const onlineOnlyToggle = screen.getByRole('checkbox', { name: 'Find only granules that are available online' })
          await user.click(onlineOnlyToggle)

          expect(props.handleChange).toHaveBeenCalledTimes(1)
          expect(props.handleChange).toHaveBeenCalledWith(
            expect.objectContaining({
              _reactName: 'onChange'
            })
          )

          expect(props.onMetricsGranuleFilter).toHaveBeenCalledTimes(1)
          expect(props.onMetricsGranuleFilter).toHaveBeenCalledWith({
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
            overrideZustandState: {
              collection: {
                collectionMetadata: {
                  collectionId: {
                    isOpenSearch: false,
                    tags: {
                      'edsc.extra.serverless.collection_capabilities': {
                        data: { cloud_cover: true }
                      }
                    }
                  }
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
          const { props, user } = setup({
            overrideZustandState: {
              collection: {
                collectionMetadata: {
                  collectionId: {
                    isOpenSearch: false,
                    tags: {
                      'edsc.extra.serverless.collection_capabilities': {
                        data: { cloud_cover: true }
                      }
                    }
                  }
                }
              }
            }
          })
          const minCloudCover = screen.getByRole('textbox', { name: 'Minimum' })
          await user.type(minCloudCover, '1')
          await user.tab(minCloudCover)

          expect(props.handleChange).toHaveBeenCalledTimes(1)
          expect(props.handleChange).toHaveBeenCalledWith(
            expect.objectContaining({
              _reactName: 'onChange'
            })
          )
        })
      })

      describe('Max', () => {
        test('defaults to an empty value', async () => {
          const { props } = setup({
            overrideZustandState: {
              collection: {
                collectionMetadata: {
                  collectionId: {
                    isOpenSearch: false,
                    tags: {
                      'edsc.extra.serverless.collection_capabilities': {
                        data: { cloud_cover: true }
                      }
                    }
                  }
                }
              }
            }
          })

          const maxCloudCover = screen.getByRole('textbox', { name: 'Maximum' })

          expect(maxCloudCover).toHaveValue('')

          expect(props.handleChange).toHaveBeenCalledTimes(0)
        })

        test('calls handleChange on change', async () => {
          const { props, user } = setup({
            overrideZustandState: {
              collection: {
                collectionMetadata: {
                  collectionId: {
                    isOpenSearch: false,
                    tags: {
                      'edsc.extra.serverless.collection_capabilities': {
                        data: { cloud_cover: true }
                      }
                    }
                  }
                }
              }
            }
          })

          const maxCloudCover = screen.getByRole('textbox', { name: 'Maximum' })

          await user.type(maxCloudCover, '9')

          expect(props.handleChange).toHaveBeenCalledTimes(1)
          expect(props.handleChange).toHaveBeenCalledWith(
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
            overrideZustandState: {
              collection: {
                collectionMetadata: {
                  collectionId: {
                    isOpenSearch: false,
                    tags: {
                      'edsc.extra.serverless.collection_capabilities': {
                        data: { orbit_calculated_spatial_domains: true }
                      }
                    }
                  }
                }
              }
            }
          })

          const minOrbitNumber = screen.getByTestId('granule-filters__orbit-number-min')
          expect(minOrbitNumber).toHaveValue('')
        })

        test('calls handleChange on change', async () => {
          const { props, user } = setup({
            overrideZustandState: {
              collection: {
                collectionMetadata: {
                  collectionId: {
                    isOpenSearch: false,
                    tags: {
                      'edsc.extra.serverless.collection_capabilities': {
                        data: { orbit_calculated_spatial_domains: true }
                      }
                    }
                  }
                }
              }
            }
          })

          const maxOrbitNumber = screen.getByTestId('granule-filters__orbit-number-max')
          await user.type(maxOrbitNumber, '9')

          expect(props.handleChange).toHaveBeenCalledTimes(1)
          expect(props.handleChange).toHaveBeenCalledWith(
            expect.objectContaining({
              _reactName: 'onChange'
            })
          )
        })

        test('calls onBlur when the filter is submitted', async () => {
          const { props, user } = setup({
            overrideZustandState: {
              collection: {
                collectionMetadata: {
                  collectionId: {
                    isOpenSearch: false,
                    tags: {
                      'edsc.extra.serverless.collection_capabilities': {
                        data: { orbit_calculated_spatial_domains: true }
                      }
                    }
                  }
                }
              }
            }
          })

          const minOrbitNumber = screen.getByTestId('granule-filters__orbit-number-min')
          await user.type(minOrbitNumber, '9')
          await user.tab()

          expect(props.handleSubmit).toHaveBeenCalledTimes(1)
          expect(props.handleSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
              _reactName: 'onBlur'
            })
          )

          expect(props.handleBlur).toHaveBeenCalledTimes(1)
          expect(props.handleBlur).toHaveBeenCalledWith(
            expect.objectContaining({
              _reactName: 'onBlur'
            })
          )

          expect(props.onMetricsGranuleFilter).toHaveBeenCalledTimes(1)
          expect(props.onMetricsGranuleFilter).toHaveBeenCalledWith({
            type: 'orbitNumber.min',
            value: ''
          })
        })
      })

      describe('Max', () => {
        test('defaults to an empty value', () => {
          setup({
            overrideZustandState: {
              collection: {
                collectionMetadata: {
                  collectionId: {
                    isOpenSearch: false,
                    tags: {
                      'edsc.extra.serverless.collection_capabilities': {
                        data: { orbit_calculated_spatial_domains: true }
                      }
                    }
                  }
                }
              }
            }
          })

          const maxOrbitNumber = screen.getByTestId('granule-filters__orbit-number-max')
          expect(maxOrbitNumber).toHaveValue('')
        })

        test('calls handleChange on change', async () => {
          const { props, user } = setup({
            overrideZustandState: {
              collection: {
                collectionMetadata: {
                  collectionId: {
                    isOpenSearch: false,
                    tags: {
                      'edsc.extra.serverless.collection_capabilities': {
                        data: { orbit_calculated_spatial_domains: true }
                      }
                    }
                  }
                }
              }
            }
          })

          const maxOrbitNumber = screen.getByTestId('granule-filters__orbit-number-max')
          await user.type(maxOrbitNumber, '9')

          expect(props.handleChange).toHaveBeenCalledTimes(1)
          expect(props.handleChange).toHaveBeenCalledWith(
            expect.objectContaining({
              _reactName: 'onChange'
            })
          )
        })

        test('calls onBlur when the filter is submitted', async () => {
          const { props, user } = setup({
            overrideZustandState: {
              collection: {
                collectionMetadata: {
                  collectionId: {
                    isOpenSearch: false,
                    tags: {
                      'edsc.extra.serverless.collection_capabilities': {
                        data: { orbit_calculated_spatial_domains: true }
                      }
                    }
                  }
                }
              }
            }
          })

          const maxOrbitNumber = screen.getByTestId('granule-filters__orbit-number-max')
          await user.type(maxOrbitNumber, '9')
          await user.tab()

          expect(props.handleSubmit).toHaveBeenCalledTimes(1)
          expect(props.handleSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
              _reactName: 'onBlur'
            })
          )

          expect(props.handleBlur).toHaveBeenCalledTimes(1)
          expect(props.handleBlur).toHaveBeenCalledWith(
            expect.objectContaining({
              _reactName: 'onBlur'
            })
          )

          expect(props.onMetricsGranuleFilter).toHaveBeenCalledTimes(1)
          expect(props.onMetricsGranuleFilter).toHaveBeenCalledWith({
            type: 'orbitNumber.max',
            value: ''
          })
        })
      })
    })

    describe('Equator Crossing Longitude section', () => {
      describe('Min', () => {
        test('defaults to an empty value', () => {
          const { props } = setup({
            overrideZustandState: {
              collection: {
                collectionMetadata: {
                  collectionId: {
                    isOpenSearch: false,
                    tags: {
                      'edsc.extra.serverless.collection_capabilities': {
                        data: { orbit_calculated_spatial_domains: true }
                      }
                    }
                  }
                }
              }
            }
          })

          const minEquatorCrossingLongitude = screen.getByTestId('granule-filters__equatorial-crossing-longitude-min')
          expect(minEquatorCrossingLongitude).toHaveValue('')

          expect(props.handleChange).toHaveBeenCalledTimes(0)
        })

        test('calls handleChange on change', async () => {
          const { props, user } = setup({
            overrideZustandState: {
              collection: {
                collectionMetadata: {
                  collectionId: {
                    isOpenSearch: false,
                    tags: {
                      'edsc.extra.serverless.collection_capabilities': {
                        data: { orbit_calculated_spatial_domains: true }
                      }
                    }
                  }
                }
              }
            }
          })

          const minEquatorCrossingLongitude = screen.getByTestId('granule-filters__equatorial-crossing-longitude-min')
          await user.type(minEquatorCrossingLongitude, '1')
          await user.tab()

          expect(props.handleChange).toHaveBeenCalledTimes(1)
          expect(props.handleChange).toHaveBeenCalledWith(
            expect.objectContaining({
              _reactName: 'onChange'
            })
          )
        })

        test('calls onBlur when the filter is submitted ', async () => {
          const { props, user } = setup({
            overrideZustandState: {
              collection: {
                collectionMetadata: {
                  collectionId: {
                    isOpenSearch: false,
                    tags: {
                      'edsc.extra.serverless.collection_capabilities': {
                        data: { orbit_calculated_spatial_domains: true }
                      }
                    }
                  }
                }
              }
            }
          })

          const minEquatorCrossingLongitude = screen.getByTestId('granule-filters__equatorial-crossing-longitude-min')
          await user.type(minEquatorCrossingLongitude, '1')
          await user.tab()

          expect(props.handleSubmit).toHaveBeenCalledTimes(1)
          expect(props.handleSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
              _reactName: 'onBlur'
            })
          )

          expect(props.handleBlur).toHaveBeenCalledTimes(1)
          expect(props.handleBlur).toHaveBeenCalledWith(
            expect.objectContaining({
              _reactName: 'onBlur'
            })
          )

          expect(props.onMetricsGranuleFilter).toHaveBeenCalledTimes(1)
          expect(props.onMetricsGranuleFilter).toHaveBeenCalledWith({
            type: 'equatorCrossingLongitude.min',
            value: ''
          })
        })
      })

      describe('Max', () => {
        test('defaults to an empty value', () => {
          const { props } = setup({
            overrideZustandState: {
              collection: {
                collectionMetadata: {
                  collectionId: {
                    isOpenSearch: false,
                    tags: {
                      'edsc.extra.serverless.collection_capabilities': {
                        data: { orbit_calculated_spatial_domains: true }
                      }
                    }
                  }
                }
              }
            }
          })

          const maxEquatorCrossingLongitude = screen.getByTestId('granule-filters__equatorial-crossing-longitude-max')
          expect(maxEquatorCrossingLongitude).toHaveValue('')

          expect(props.handleChange).toHaveBeenCalledTimes(0)
        })

        test('calls handleChange on change', async () => {
          const { props, user } = setup({
            overrideZustandState: {
              collection: {
                collectionMetadata: {
                  collectionId: {
                    isOpenSearch: false,
                    tags: {
                      'edsc.extra.serverless.collection_capabilities': {
                        data: { orbit_calculated_spatial_domains: true }
                      }
                    }
                  }
                }
              }
            }
          })

          const maxEquatorCrossingLongitude = screen.getByTestId('granule-filters__equatorial-crossing-longitude-max')
          await user.type(maxEquatorCrossingLongitude, '1')
          await user.tab()

          expect(maxEquatorCrossingLongitude).toHaveValue('')

          expect(props.handleChange).toHaveBeenCalledTimes(1)
          expect(props.handleChange).toHaveBeenCalledWith(
            expect.objectContaining({
              _reactName: 'onChange'
            })
          )
        })

        test('calls onBlur when the filter is submitted ', async () => {
          const { props, user } = setup({
            overrideZustandState: {
              collection: {
                collectionMetadata: {
                  collectionId: {
                    isOpenSearch: false,
                    tags: {
                      'edsc.extra.serverless.collection_capabilities': {
                        data: { orbit_calculated_spatial_domains: true }
                      }
                    }
                  }
                }
              }
            }
          })

          const maxEquatorCrossingLongitude = screen.getByTestId('granule-filters__equatorial-crossing-longitude-max')
          await user.type(maxEquatorCrossingLongitude, '1')
          await user.tab()

          expect(props.handleSubmit).toHaveBeenCalledTimes(1)
          expect(props.handleSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
              _reactName: 'onBlur'
            })
          )

          expect(props.handleBlur).toHaveBeenCalledTimes(1)
          expect(props.handleBlur).toHaveBeenCalledWith(
            expect.objectContaining({
              _reactName: 'onBlur'
            })
          )

          expect(props.onMetricsGranuleFilter).toHaveBeenCalledTimes(1)
          expect(props.onMetricsGranuleFilter).toHaveBeenCalledWith({
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
          overrideZustandState: {
            collection: {
              collectionMetadata: {
                collectionId: {
                  isOpenSearch: false,
                  tags: {
                    'edsc.extra.serverless.collection_capabilities': {
                      data: { orbit_calculated_spatial_domains: true }
                    }
                  }
                }
              }
            }
          },
          overrideProps: {
            values: {
              equatorCrossingDate: {
                startDate: '2019-08-14T00:00:00:000Z'
              }
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
          overrideZustandState: {
            collection: {
              collectionMetadata: {
                collectionId: {
                  isOpenSearch: false,
                  tags: {
                    'edsc.extra.serverless.collection_capabilities': {
                      data: { orbit_calculated_spatial_domains: true }
                    }
                  }
                }
              }
            }
          },
          overrideProps: {
            values: {
              equatorCrossingDate: {
                endDate: '2019-08-14T00:00:00:000Z'
              }
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
          overrideZustandState: {
            collection: {
              collectionMetadata: {
                collectionId: {
                  isOpenSearch: false,
                  tags: {
                    'edsc.extra.serverless.collection_capabilities': {
                      data: { orbit_calculated_spatial_domains: true }
                    }
                  }
                }
              }
            }
          },
          overrideProps: {
            values: {
              equatorCrossingDate: {
                startDate: '2019-08-13T00:00:00:000Z',
                endDate: '2019-08-14T23:59:59:999Z'
              }
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

        const { props, user } = setup({
          overrideZustandState: {
            collection: {
              collectionMetadata: {
                collectionId: {
                  isOpenSearch: false,
                  tags: {
                    'edsc.extra.serverless.collection_capabilities': {
                      data: { orbit_calculated_spatial_domains: true }
                    }
                  }
                }
              }
            }
          },
          overrideProps: {
            values: {
              equatorCrossingDate: {
                startDate: '',
                endDate: '2019-08-14T23:59:59:999Z'
              }
            }
          }
        })

        const button = screen.getAllByRole('button', { name: 'Today' })[2]
        await user.click(button)

        expect(props.setFieldTouched).toHaveBeenCalledTimes(1)
        expect(props.setFieldTouched).toHaveBeenCalledWith('equatorCrossingDate.startDate')

        expect(props.setFieldValue).toHaveBeenCalledTimes(1)
        expect(props.setFieldValue).toHaveBeenCalledWith('equatorCrossingDate.startDate', '2019-08-13T00:00:00.000Z')

        expect(props.handleSubmit).toHaveBeenCalledTimes(1)
        expect(props.handleSubmit).toHaveBeenCalledWith()

        expect(props.onMetricsGranuleFilter).toHaveBeenCalledTimes(1)
        expect(props.onMetricsGranuleFilter).toHaveBeenCalledWith({
          type: 'Equatorial Crossing Set Start Date',
          value: '2019-08-13T00:00:00.000Z'
        })

        MockDate.reset()
      })

      test('calls the correct callbacks on startDate submit with an empty value', async () => {
        const { props, user } = setup({
          overrideZustandState: {
            collection: {
              collectionMetadata: {
                collectionId: {
                  isOpenSearch: false,
                  tags: {
                    'edsc.extra.serverless.collection_capabilities': {
                      data: { orbit_calculated_spatial_domains: true }
                    }
                  }
                }
              }
            }
          },
          overrideProps: {
            values: {
              equatorCrossingDate: {
                startDate: '',
                endDate: '2019-08-14T23:59:59:999Z'
              }
            }
          }
        })

        const button = screen.getAllByRole('button', { name: 'Clear' })[2]
        await user.click(button)

        // `onClearClick` calls `onChange` twice
        expect(props.setFieldTouched).toHaveBeenCalledTimes(2)
        expect(props.setFieldTouched).toHaveBeenCalledWith('equatorCrossingDate.startDate')

        expect(props.setFieldValue).toHaveBeenCalledTimes(2)
        expect(props.setFieldValue).toHaveBeenCalledWith('equatorCrossingDate.startDate', '')

        expect(props.handleSubmit).toHaveBeenCalledTimes(1)
        expect(props.handleSubmit).toHaveBeenCalledWith()

        expect(props.onMetricsGranuleFilter).toHaveBeenCalledTimes(1)
        expect(props.onMetricsGranuleFilter).toHaveBeenCalledWith({
          type: 'Equatorial Crossing Set Start Date',
          value: ''
        })
      })

      test('does not call handleSubmit if shouldSubmit is false on startDate submit', async () => {
        const { props, user } = setup({
          overrideZustandState: {
            collection: {
              collectionMetadata: {
                collectionId: {
                  isOpenSearch: false,
                  tags: {
                    'edsc.extra.serverless.collection_capabilities': {
                      data: { orbit_calculated_spatial_domains: true }
                    }
                  }
                }
              }
            }
          },
          overrideProps: {
            values: {
              equatorCrossingDate: {
                startDate: '',
                endDate: '2019-08-14T23:59:59:999Z'
              }
            }
          }
        })

        const endDateTextField = screen.getAllByRole('textbox', { name: 'Start Date' })[1]
        await user.type(endDateTextField, '2019')

        expect(props.setFieldTouched).toHaveBeenCalledTimes(4)
        expect(props.setFieldTouched).toHaveBeenCalledWith('equatorCrossingDate.startDate')

        expect(props.setFieldValue).toHaveBeenCalledTimes(4)
        expect(props.setFieldValue).toHaveBeenCalledWith('equatorCrossingDate.startDate', '2')
        expect(props.setFieldValue).toHaveBeenCalledWith('equatorCrossingDate.startDate', '0')
        expect(props.setFieldValue).toHaveBeenCalledWith('equatorCrossingDate.startDate', '1')
        expect(props.setFieldValue).toHaveBeenCalledWith('equatorCrossingDate.startDate', '9')

        expect(props.handleSubmit).toHaveBeenCalledTimes(0)
        expect(props.onMetricsGranuleFilter).toHaveBeenCalledTimes(0)
      })

      test('calls the correct callbacks on endDate submit', async () => {
        MockDate.set('2019-08-14')

        const { props, user } = setup({
          overrideZustandState: {
            collection: {
              collectionMetadata: {
                collectionId: {
                  isOpenSearch: false,
                  tags: {
                    'edsc.extra.serverless.collection_capabilities': {
                      data: { orbit_calculated_spatial_domains: true }
                    }
                  }
                }
              }
            }
          },
          overrideProps: {
            values: {
              equatorCrossingDate: {
                startDate: '2019-08-13T00:00:00:000Z',
                endDate: ''
              }
            }
          }
        })

        const button = screen.getAllByRole('button', { name: 'Today' })[3]
        await user.click(button)

        expect(props.setFieldTouched).toHaveBeenCalledTimes(1)
        expect(props.setFieldTouched).toHaveBeenCalledWith('equatorCrossingDate.endDate')

        expect(props.setFieldValue).toHaveBeenCalledTimes(1)
        expect(props.setFieldValue).toHaveBeenCalledWith('equatorCrossingDate.endDate', '2019-08-14T23:59:59.000Z')

        expect(props.handleSubmit).toHaveBeenCalledTimes(1)
        expect(props.handleSubmit).toHaveBeenCalledWith()

        expect(props.onMetricsGranuleFilter).toHaveBeenCalledTimes(1)
        expect(props.onMetricsGranuleFilter).toHaveBeenCalledWith({
          type: 'Equatorial Crossing Set End Date',
          value: '2019-08-14T23:59:59.000Z'
        })

        MockDate.reset()
      })

      test('calls the correct callbacks on endDate submit with an empty value', async () => {
        MockDate.set('2019-08-14')

        const { props, user } = setup({
          overrideZustandState: {
            collection: {
              collectionMetadata: {
                collectionId: {
                  isOpenSearch: false,
                  tags: {
                    'edsc.extra.serverless.collection_capabilities': {
                      data: { orbit_calculated_spatial_domains: true }
                    }
                  }
                }
              }
            }
          },
          overrideProps: {
            values: {
              equatorCrossingDate: {
                startDate: '2019-08-13T00:00:00:000Z',
                endDate: ''
              }
            }
          }
        })

        const button = screen.getAllByRole('button', { name: 'Clear' })[3]
        await user.click(button)

        // `onClearClick` calls `onChange` twice
        expect(props.setFieldTouched).toHaveBeenCalledTimes(2)
        expect(props.setFieldTouched).toHaveBeenCalledWith('equatorCrossingDate.endDate')

        expect(props.setFieldValue).toHaveBeenCalledTimes(2)
        expect(props.setFieldValue).toHaveBeenCalledWith('equatorCrossingDate.endDate', '')

        expect(props.handleSubmit).toHaveBeenCalledTimes(1)
        expect(props.handleSubmit).toHaveBeenCalledWith()

        expect(props.onMetricsGranuleFilter).toHaveBeenCalledTimes(1)
        expect(props.onMetricsGranuleFilter).toHaveBeenCalledWith({
          type: 'Equatorial Crossing Set End Date',
          value: ''
        })

        MockDate.reset()
      })

      test('does not call handleSubmit if shouldSubmit is false on endDate submit', async () => {
        const { props, user } = setup({
          overrideZustandState: {
            collection: {
              collectionMetadata: {
                collectionId: {
                  isOpenSearch: false,
                  tags: {
                    'edsc.extra.serverless.collection_capabilities': {
                      data: { orbit_calculated_spatial_domains: true }
                    }
                  }
                }
              }
            }
          },
          overrideProps: {
            values: {
              equatorCrossingDate: {
                startDate: '2019-08-13T00:00:00:000Z',
                endDate: ''
              }
            }
          }
        })

        const endDateTextField = screen.getAllByRole('textbox', { name: 'End Date' })[1]
        await user.type(endDateTextField, '2020')

        expect(props.setFieldTouched).toHaveBeenCalledTimes(4)
        expect(props.setFieldTouched).toHaveBeenCalledWith('equatorCrossingDate.endDate')

        expect(props.setFieldValue).toHaveBeenCalledTimes(4)
        expect(props.setFieldValue).toHaveBeenCalledWith('equatorCrossingDate.endDate', '2')
        expect(props.setFieldValue).toHaveBeenCalledWith('equatorCrossingDate.endDate', '0')
        expect(props.setFieldValue).toHaveBeenCalledWith('equatorCrossingDate.endDate', '2')
        expect(props.setFieldValue).toHaveBeenCalledWith('equatorCrossingDate.endDate', '0')

        expect(props.handleSubmit).toHaveBeenCalledTimes(0)
        expect(props.onMetricsGranuleFilter).toHaveBeenCalledTimes(0)
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
        overrideZustandState: {
          collection: {
            collectionMetadata: {
              collectionId: {
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
            }
          }
        }
      })

      expect(screen.getByLabelText('Tiling System')).toBeInTheDocument()
      const tileOptions = screen.getByRole('combobox', 'tilingSystem')
      expect(tileOptions).toHaveValue('')
    })

    test('calls handleChange on change', async () => {
      const { props, user } = setup({
        overrideZustandState: {
          collection: {
            collectionMetadata: {
              collectionId: {
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
            }
          }
        }
      })

      const tileOptions = screen.getByRole('combobox', 'tilingSystem')

      await user.selectOptions(tileOptions, 'MISR')

      expect(props.handleChange).toHaveBeenCalledTimes(1)
      expect(props.handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          _reactName: 'onChange'
        })
      )

      expect(props.onMetricsGranuleFilter).toHaveBeenCalledTimes(1)
      expect(props.onMetricsGranuleFilter).toHaveBeenCalledWith(
        {
          type: 'tilingSystem',
          value: 'MISR'
        }
      )
    })

    test('tiling system onchange displays grid coordinates', async () => {
      const { user } = setup({
        overrideZustandState: {
          collection: {
            collectionMetadata: {
              collectionId: {
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
              }
            }
          }
        },
        overrideProps: {
          values: {
            tilingSystem: 'MISR'
          }
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

  describe('Recurring date toggle behavior', () => {
    test('when toggling recurring with same year dates, adjusts start date to minimum year', async () => {
      const { props, user } = setup({
        overrideProps: {
          values: {
            temporal: {
              startDate: '2024-03-01T00:00:00.000Z',
              endDate: '2024-12-31T23:59:59.999Z',
              isRecurring: false
            }
          }
        }
      })

      const recurringCheckbox = screen.getByRole('checkbox', { name: 'Use a recurring date range' })
      await user.click(recurringCheckbox)

      // Verify isRecurring was set
      expect(props.setFieldValue).toHaveBeenCalledWith('temporal.isRecurring', true)
      expect(props.setFieldTouched).toHaveBeenCalledWith('temporal.isRecurring', true)

      // Verify start date was adjusted to minimum year while preserving month/day
      expect(props.setFieldValue).toHaveBeenCalledWith('temporal.startDate', '1960-03-01T00:00:00.000Z')

      // Verify recurringDay values were set correctly
      expect(props.setFieldValue).toHaveBeenCalledWith('temporal.recurringDayStart', 61) // March 1st
      expect(props.setFieldValue).toHaveBeenCalledWith('temporal.recurringDayEnd', 366) // December 31st

      // Verify form was submitted
      expect(props.handleSubmit).toHaveBeenCalled()

      // Verify metrics were recorded
      expect(props.onMetricsGranuleFilter).toHaveBeenCalledWith({
        type: 'Set Recurring',
        value: true
      })
    })

    test('when toggling recurring with different year dates, preserves original start date year', async () => {
      const { props, user } = setup({
        overrideProps: {
          values: {
            temporal: {
              startDate: '2023-03-01T00:00:00.000Z',
              endDate: '2024-12-31T23:59:59.999Z',
              isRecurring: false
            }
          }
        }
      })

      const recurringCheckbox = screen.getByRole('checkbox', { name: 'Use a recurring date range' })
      await user.click(recurringCheckbox)

      // Verify start date was NOT adjusted since years are different
      expect(props.setFieldValue).not.toHaveBeenCalledWith(
        'temporal.startDate',
        expect.stringContaining('1960')
      )
    })
  })

  describe('Start date submission behavior', () => {
    test('when submitting start date in same year as end date with recurring enabled, adjusts to minimum year', async () => {
      MockDate.set('2024-03-15')

      const { props, user } = setup({
        overrideProps: {
          values: {
            temporal: {
              isRecurring: true,
              startDate: '',
              endDate: '2024-12-31T23:59:59.999Z'
            }
          }
        }
      })

      // Click "Today" button for start date
      const todayButton = screen.getAllByRole('button', { name: 'Today' })[0]
      await user.click(todayButton)

      // Verify start date was adjusted to minimum year while preserving month/day
      expect(props.setFieldValue).toHaveBeenCalledWith(
        'temporal.startDate',
        '1960-03-15T00:00:00.000Z'
      )

      expect(props.handleSubmit).toHaveBeenCalled()
      expect(props.onMetricsGranuleFilter).toHaveBeenCalledWith({
        type: 'Set Start Date',
        value: '2024-03-15T00:00:00.000Z'
      })

      MockDate.reset()
    })
  })

  describe('End date submission behavior', () => {
    test('when submitting end date in same year as start date with recurring enabled, adjusts start date to minimum year', async () => {
      MockDate.set('2024-12-15')

      const { props, user } = setup({
        overrideProps: {
          values: {
            temporal: {
              isRecurring: true,
              startDate: '2024-03-15T00:00:00.000Z',
              endDate: ''
            }
          }
        }
      })

      // Click "Today" button for end date
      const todayButton = screen.getAllByRole('button', { name: 'Today' })[1]
      await user.click(todayButton)

      // Verify start date was adjusted to minimum year while preserving month/day
      expect(props.setFieldValue).toHaveBeenCalledWith(
        'temporal.startDate',
        '1960-03-15T00:00:00.000Z'
      )

      expect(props.handleSubmit).toHaveBeenCalled()
      expect(props.onMetricsGranuleFilter).toHaveBeenCalledWith({
        type: 'Set End Date',
        value: '2024-12-15T23:59:59.000Z'
      })

      MockDate.reset()
    })
  })
})
