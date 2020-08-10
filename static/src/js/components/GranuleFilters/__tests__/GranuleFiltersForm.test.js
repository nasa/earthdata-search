import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Form as FormikForm } from 'formik'
import moment from 'moment'

import { Form, FormControl } from 'react-bootstrap'

import GranuleFiltersForm from '../GranuleFiltersForm'
import GranuleFiltersItem from '../GranuleFiltersItem'
import TemporalSelection from '../../TemporalSelection/TemporalSelection'

Enzyme.configure({ adapter: new Adapter() })

// TODO: Figure out how to test validation @low

function setup(overrideProps) {
  const props = {
    errors: {},
    handleBlur: jest.fn(),
    handleChange: jest.fn(),
    collectionMetadata: {},
    collectionQuery: {},
    setFieldValue: jest.fn(),
    setFieldTouched: jest.fn(),
    touched: {},
    values: {},
    ...overrideProps
  }

  const enzymeWrapper = shallow(<GranuleFiltersForm {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('GranuleFiltersForm component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBe(FormikForm)
  })

  describe('Form', () => {
    test('shows temporal by default', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find(GranuleFiltersItem).at(0).prop('heading')).toEqual('Temporal')
    })

    test('shows data access by default', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find(GranuleFiltersItem).at(1).prop('heading')).toEqual('Data Access')
    })

    describe('Temporal section', () => {
      describe('displays temporal', () => {
        test('displays correctly when only start date is set', () => {
          const { enzymeWrapper } = setup({
            values: {
              temporal: {
                startDate: '2019-08-14T00:00:00:000Z'
              }
            }
          })

          const temporalSection = enzymeWrapper.find(GranuleFiltersItem).at(0)
          expect(temporalSection.find(TemporalSelection).prop('temporal').startDate).toEqual('2019-08-14T00:00:00:000Z')
          expect(temporalSection.find(TemporalSelection).prop('temporal').endDate).toEqual(undefined)
        })

        test('displays correctly when only end date is set', () => {
          const { enzymeWrapper } = setup({
            values: {
              temporal: {
                endDate: '2019-08-14T00:00:00:000Z'
              }
            }
          })

          const temporalSection = enzymeWrapper.find(GranuleFiltersItem).at(0)
          expect(temporalSection.find(TemporalSelection).prop('temporal').endDate).toEqual('2019-08-14T00:00:00:000Z')
          expect(temporalSection.find(TemporalSelection).prop('temporal').startDate).toEqual(undefined)
        })

        test('displays correctly when both dates are set', () => {
          const { enzymeWrapper } = setup({
            values: {
              temporal: {
                startDate: '2019-08-13T00:00:00:000Z',
                endDate: '2019-08-14T23:59:59:999Z'
              }
            }
          })

          const temporalSection = enzymeWrapper.find(GranuleFiltersItem).at(0)
          expect(temporalSection.find(TemporalSelection).prop('temporal').endDate).toEqual('2019-08-14T23:59:59:999Z')
          expect(temporalSection.find(TemporalSelection).prop('temporal').startDate).toEqual('2019-08-13T00:00:00:000Z')
        })

        test('calls the correct callbacks on startDate submit', () => {
          const { enzymeWrapper, props } = setup({
            values: {
              temporal: {
                startDate: '2019-08-13T00:00:00:000Z',
                endDate: '2019-08-14T23:59:59:999Z'
              }
            }
          })
          const temporalSection = enzymeWrapper.find(GranuleFiltersItem).at(0)
          temporalSection.find(TemporalSelection).prop('onSubmitStart')(moment('2019-08-13T00:00:00:000Z', 'YYYY-MM-DDTHH:m:s.SSSZ', true))

          expect(props.setFieldTouched).toHaveBeenCalledTimes(1)
          expect(props.setFieldTouched).toHaveBeenCalledWith('temporal.startDate')
          expect(props.setFieldValue).toHaveBeenCalledTimes(1)
          expect(props.setFieldValue).toHaveBeenCalledWith('temporal.startDate', '2019-08-13T00:00:00:000Z')
        })

        test('calls the correct callbacks on endDate submit', () => {
          const { enzymeWrapper, props } = setup({
            values: {
              temporal: {
                startDate: '2019-08-13T00:00:00:000Z',
                endDate: '2019-08-14T23:59:59:999Z'
              }
            }
          })
          const temporalSection = enzymeWrapper.find(GranuleFiltersItem).at(0)
          temporalSection.find(TemporalSelection).prop('onSubmitEnd')(moment('2019-08-14T23:59:59:999Z', 'YYYY-MM-DDTHH:m:s.SSSZ', true))

          expect(props.setFieldTouched).toHaveBeenCalledTimes(1)
          expect(props.setFieldTouched).toHaveBeenCalledWith('temporal.endDate')
          expect(props.setFieldValue).toHaveBeenCalledTimes(1)
          expect(props.setFieldValue).toHaveBeenCalledWith('temporal.endDate', '2019-08-14T23:59:59:999Z')
        })
      })
    })

    describe('Day/Night section', () => {
      test('defaults to an empty value', () => {
        const { enzymeWrapper } = setup({
          collectionMetadata: {
            isCwic: false,
            tags: {
              'edsc.extra.serverless.collection_capabilities': {
                data: { day_night_flag: true }
              }
            }
          }
        })

        const dayNightSection = enzymeWrapper.find(GranuleFiltersItem).at(1)
        expect(dayNightSection.find(FormControl).prop('value')).toEqual('')
      })

      test('displays selected item', () => {
        const { enzymeWrapper } = setup({
          collectionMetadata: {
            isCwic: false,
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

        const dayNightSection = enzymeWrapper.find(GranuleFiltersItem).at(1)
        expect(dayNightSection.find(FormControl).prop('value')).toEqual('NIGHT')
      })

      test('calls handleChange on change', () => {
        const { enzymeWrapper, props } = setup({
          collectionMetadata: {
            isCwic: false,
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

        const dayNightSection = enzymeWrapper.find(GranuleFiltersItem).at(1)
        const dayNightInput = dayNightSection.find(Form.Control)

        dayNightInput.prop('onChange')({ event: 'test' })
        expect(props.handleChange).toHaveBeenCalledTimes(1)
        expect(props.handleChange).toHaveBeenCalledWith({ event: 'test' })
      })
    })

    describe('Data Access section', () => {
      describe('Browse only toggle', () => {
        test('defaults to an empty value', () => {
          const { enzymeWrapper } = setup()

          const dataAccessSection = enzymeWrapper.find(GranuleFiltersItem).at(1)
          expect(dataAccessSection.find(Form.Check).at(0).prop('value')).toEqual(false)
        })

        test('displays selected item', () => {
          const { enzymeWrapper } = setup({
            values: {
              browseOnly: true
            }
          })

          const dataAccessSection = enzymeWrapper.find(GranuleFiltersItem).at(1)
          expect(dataAccessSection.find(Form.Check).at(0).prop('value')).toEqual(true)
        })

        test('calls handleChange on change', () => {
          const { enzymeWrapper, props } = setup()

          const dataAccessSection = enzymeWrapper.find(GranuleFiltersItem).at(1)
          dataAccessSection.find(Form.Check).at(0).prop('onChange')({ event: 'test' })
          expect(props.handleChange).toHaveBeenCalledTimes(1)
          expect(props.handleChange).toHaveBeenCalledWith({ event: 'test' })
        })
      })

      describe('Online only toggle', () => {
        test('defaults to an empty value', () => {
          const { enzymeWrapper } = setup()

          const dataAccessSection = enzymeWrapper.find(GranuleFiltersItem).at(1)
          expect(dataAccessSection.find(Form.Check).at(1).prop('value')).toEqual(false)
        })

        test('displays selected item', () => {
          const { enzymeWrapper } = setup({
            values: {
              onlineOnly: true
            }
          })

          const dataAccessSection = enzymeWrapper.find(GranuleFiltersItem).at(1)
          expect(dataAccessSection.find(Form.Check).at(1).prop('value')).toEqual(true)
        })

        test('calls handleChange on change', () => {
          const { enzymeWrapper, props } = setup()

          const dataAccessSection = enzymeWrapper.find(GranuleFiltersItem).at(1)
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
              isCwic: false,
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: { cloud_cover: true }
                }
              }
            }
          })

          const cloudCoverSection = enzymeWrapper.find(GranuleFiltersItem).at(2)
          expect(cloudCoverSection.find(Form.Control).at(0).prop('value')).toEqual('')
        })

        test('calls handleChange on change', () => {
          const { enzymeWrapper, props } = setup({
            collectionMetadata: {
              isCwic: false,
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: { cloud_cover: true }
                }
              }
            }
          })

          const cloudCoverSection = enzymeWrapper.find(GranuleFiltersItem).at(2)
          cloudCoverSection.find(Form.Control).at(0).prop('onChange')({ event: 'test' })
          expect(props.handleChange).toHaveBeenCalledTimes(1)
          expect(props.handleChange).toHaveBeenCalledWith({ event: 'test' })
        })
      })

      describe('Max', () => {
        test('defaults to an empty value', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              isCwic: false,
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: { cloud_cover: true }
                }
              }
            }
          })

          const cloudCoverSection = enzymeWrapper.find(GranuleFiltersItem).at(2)
          expect(cloudCoverSection.find(Form.Control).at(1).prop('value')).toEqual('')
        })

        test('calls handleChange on change', () => {
          const { enzymeWrapper, props } = setup({
            collectionMetadata: {
              isCwic: false,
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: { cloud_cover: true }
                }
              }
            }
          })

          const cloudCoverSection = enzymeWrapper.find(GranuleFiltersItem).at(2)
          cloudCoverSection.find(Form.Control).at(1).prop('onChange')({ event: 'test' })
          expect(props.handleChange).toHaveBeenCalledTimes(1)
          expect(props.handleChange).toHaveBeenCalledWith({ event: 'test' })
        })
      })
    })

    describe('Orbit number section', () => {
      describe('Min', () => {
        test('defaults to an empty value', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              isCwic: false,
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: { orbit_calculated_spatial_domains: true }
                }
              }
            }
          })

          const orbitNumberSection = enzymeWrapper.find(GranuleFiltersItem).at(2)
          expect(orbitNumberSection.find(Form.Control).at(0).prop('value')).toEqual('')
        })

        test('calls handleChange on change', () => {
          const { enzymeWrapper, props } = setup({
            collectionMetadata: {
              isCwic: false,
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: { orbit_calculated_spatial_domains: true }
                }
              }
            }
          })

          const orbitNumberSection = enzymeWrapper.find(GranuleFiltersItem).at(2)
          orbitNumberSection.find(Form.Control).at(0).prop('onChange')({ event: 'test' })
          expect(props.handleChange).toHaveBeenCalledTimes(1)
          expect(props.handleChange).toHaveBeenCalledWith({ event: 'test' })
        })
      })

      describe('Max', () => {
        test('defaults to an empty value', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              isCwic: false,
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: { orbit_calculated_spatial_domains: true }
                }
              }
            }
          })

          const orbitNumberSection = enzymeWrapper.find(GranuleFiltersItem).at(2)
          expect(orbitNumberSection.find(Form.Control).at(1).prop('value')).toEqual('')
        })

        test('calls handleChange on change', () => {
          const { enzymeWrapper, props } = setup({
            collectionMetadata: {
              isCwic: false,
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: { orbit_calculated_spatial_domains: true }
                }
              }
            }
          })

          const orbitNumberSection = enzymeWrapper.find(GranuleFiltersItem).at(2)
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
              isCwic: false,
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: { orbit_calculated_spatial_domains: true }
                }
              }
            }
          })

          const equatorCrossingLongitudeSection = enzymeWrapper.find(GranuleFiltersItem).at(3)
          expect(equatorCrossingLongitudeSection.find(Form.Control).at(0).prop('value')).toEqual('')
        })

        test('calls handleChange on change', () => {
          const { enzymeWrapper, props } = setup({
            collectionMetadata: {
              isCwic: false,
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: { orbit_calculated_spatial_domains: true }
                }
              }
            }
          })

          const equatorCrossingLongitudeSection = enzymeWrapper.find(GranuleFiltersItem).at(3)
          equatorCrossingLongitudeSection.find(Form.Control).at(0).prop('onChange')({ event: 'test' })
          expect(props.handleChange).toHaveBeenCalledTimes(1)
          expect(props.handleChange).toHaveBeenCalledWith({ event: 'test' })
        })
      })

      describe('Max', () => {
        test('defaults to an empty value', () => {
          const { enzymeWrapper } = setup({
            collectionMetadata: {
              isCwic: false,
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: { orbit_calculated_spatial_domains: true }
                }
              }
            }
          })

          const equatorCrossingLongitudeSection = enzymeWrapper.find(GranuleFiltersItem).at(3)
          expect(equatorCrossingLongitudeSection.find(Form.Control).at(1).prop('value')).toEqual('')
        })

        test('calls handleChange on change', () => {
          const { enzymeWrapper, props } = setup({
            collectionMetadata: {
              isCwic: false,
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: { orbit_calculated_spatial_domains: true }
                }
              }
            }
          })

          const equatorCrossingLongitudeSection = enzymeWrapper.find(GranuleFiltersItem).at(3)
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
            isCwic: false,
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
        const equatorCrossingDateSection = enzymeWrapper.find(GranuleFiltersItem).at(4)
        expect(equatorCrossingDateSection.find(TemporalSelection).prop('temporal').startDate).toEqual('2019-08-14T00:00:00:000Z')
        expect(equatorCrossingDateSection.find(TemporalSelection).prop('temporal').endDate).toEqual(undefined)
      })

      test('displays correctly when only end date is set', () => {
        const { enzymeWrapper } = setup({
          collectionMetadata: {
            isCwic: false,
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

        const equatorCrossingDateSection = enzymeWrapper.find(GranuleFiltersItem).at(4)
        expect(equatorCrossingDateSection.find(TemporalSelection).prop('temporal').endDate).toEqual('2019-08-14T00:00:00:000Z')
        expect(equatorCrossingDateSection.find(TemporalSelection).prop('temporal').startDate).toEqual(undefined)
      })

      test('displays correctly when both dates are set', () => {
        const { enzymeWrapper } = setup({
          collectionMetadata: {
            isCwic: false,
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

        const equatorCrossingDateSection = enzymeWrapper.find(GranuleFiltersItem).at(4)
        expect(equatorCrossingDateSection.find(TemporalSelection).prop('temporal').endDate).toEqual('2019-08-14T23:59:59:999Z')
        expect(equatorCrossingDateSection.find(TemporalSelection).prop('temporal').startDate).toEqual('2019-08-13T00:00:00:000Z')
      })

      test('calls the correct callbacks on startDate submit', () => {
        const { enzymeWrapper, props } = setup({
          collectionMetadata: {
            isCwic: false,
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
        const equatorCrossingDateSection = enzymeWrapper.find(GranuleFiltersItem).at(4)
        equatorCrossingDateSection.find(TemporalSelection).prop('onSubmitStart')(moment('2019-08-13T00:00:00:000Z', 'YYYY-MM-DDTHH:m:s.SSSZ', true))

        expect(props.setFieldTouched).toHaveBeenCalledTimes(1)
        expect(props.setFieldTouched).toHaveBeenCalledWith('equatorCrossingDate.startDate')
        expect(props.setFieldValue).toHaveBeenCalledTimes(1)
        expect(props.setFieldValue).toHaveBeenCalledWith('equatorCrossingDate.startDate', '2019-08-13T00:00:00:000Z')
      })

      test('calls the correct callbacks on endDate submit', () => {
        const { enzymeWrapper, props } = setup({
          collectionMetadata: {
            isCwic: false,
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
        const equatorCrossingDateSection = enzymeWrapper.find(GranuleFiltersItem).at(4)
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

      const firstSection = enzymeWrapper.find(GranuleFiltersItem).at(0)
      expect(firstSection.props().heading).not.toEqual('Grid Coordinates')
    })

    test('defaults to an empty value', () => {
      const { enzymeWrapper } = setup({
        collectionQuery: {
          gridName: 'CALIPSO'
        }
      })

      const gridCoordsSection = enzymeWrapper.find(GranuleFiltersItem).at(0)
      expect(gridCoordsSection.find(Form.Control).at(0).prop('value')).toEqual('')
    })

    test('calls handleChange on change', () => {
      const { enzymeWrapper, props } = setup({
        collectionQuery: {
          gridName: 'CALIPSO'
        }
      })

      const gridCoordsSection = enzymeWrapper.find(GranuleFiltersItem).at(0)
      gridCoordsSection.find(Form.Control).prop('onChange')({ event: 'test' })
      expect(props.handleChange).toHaveBeenCalledTimes(1)
      expect(props.handleChange).toHaveBeenCalledWith({ event: 'test' })
    })
  })
})
