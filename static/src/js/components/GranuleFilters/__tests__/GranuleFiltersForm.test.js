import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Form as FormikForm } from 'formik'
import moment from 'moment'

import { Form, FormControl } from 'react-bootstrap'

import GranuleFiltersForm from '../GranuleFiltersForm'
import SidebarFiltersItem from '../../Sidebar/SidebarFiltersItem'
import TemporalSelection from '../../TemporalSelection/TemporalSelection'

Enzyme.configure({ adapter: new Adapter() })

// TODO: Figure out how to test validation @low

function setup(overrideProps) {
  const props = {
    cmrFacetParams: {},
    collectionMetadata: {},
    collectionQuery: {},
    errors: {},
    excludedGranuleIds: [],
    handleBlur: jest.fn(),
    handleChange: jest.fn(),
    handleSubmit: jest.fn(),
    onUndoExcludeGranule: jest.fn(),
    setFieldValue: jest.fn(),
    setFieldTouched: jest.fn(),
    touched: {},
    values: {},
    ...overrideProps
  }

  // eslint-disable-next-line react/jsx-props-no-spreading
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

  describe('Filtered Granules', () => {
    describe('when no granules are filtered', () => {
      test('does not display the filtered granules section', () => {
        const { enzymeWrapper } = setup()

        expect(enzymeWrapper.find(SidebarFiltersItem).at(0).prop('heading')).not.toEqual('Filtered Granules')
      })
    })

    describe('when a granule is filtered', () => {
      test('displays the filtered granules section', () => {
        const { enzymeWrapper } = setup({
          excludedGranuleIds: ['GRAN_ID_1']
        })

        expect(enzymeWrapper.find(SidebarFiltersItem).at(0).prop('heading')).toEqual('Filtered Granules')
      })

      test('displays the undo button', () => {
        const { enzymeWrapper } = setup({
          excludedGranuleIds: ['GRAN_ID_1']
        })

        const sidebarItem = enzymeWrapper.find(SidebarFiltersItem).at(0)

        const button = sidebarItem.find('.granule-filters-form__item-button')

        expect(button.text()).toEqual('Undo')
        expect(button.props().label).toEqual('Undo last filtered granule')
      })

      describe('when a single granule is filtered', () => {
        test('displays the correct status text', () => {
          const { enzymeWrapper } = setup({
            excludedGranuleIds: ['GRAN_ID_1']
          })

          const sidebarItem = enzymeWrapper.find(SidebarFiltersItem).at(0)

          const item = sidebarItem.find('.granule-filters-form__item-meta')

          expect(item.text()).toEqual('1 Granule Filtered')
        })
      })

      describe('when multiple granules are filtered', () => {
        test('displays the correct status text', () => {
          const { enzymeWrapper } = setup({
            excludedGranuleIds: ['GRAN_ID_1', 'GRAN_ID_2']
          })

          const sidebarItem = enzymeWrapper.find(SidebarFiltersItem).at(0)

          const item = sidebarItem.find('.granule-filters-form__item-meta')

          expect(item.text()).toEqual('2 Granules Filtered')
        })
      })

      describe('when clicking the undo button', () => {
        test('displays the undo button', () => {
          const { enzymeWrapper, props } = setup({
            excludedGranuleIds: ['GRAN_ID_1'],
            collectionMetadata: {
              id: 'COLL_ID'
            }
          })

          const sidebarItem = enzymeWrapper.find(SidebarFiltersItem).at(0)

          const button = sidebarItem.find('.granule-filters-form__item-button')

          button.simulate('click')

          expect(props.onUndoExcludeGranule).toHaveBeenCalledTimes(1)
          expect(props.onUndoExcludeGranule).toHaveBeenCalledWith('COLL_ID')
        })
      })
    })
  })

  describe('Form', () => {
    test('shows granule search by default', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find(SidebarFiltersItem).at(0).prop('heading')).toEqual('Granule Search')
    })

    test('shows temporal by default', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find(SidebarFiltersItem).at(1).prop('heading')).toEqual('Temporal')
    })

    test('shows data access by default', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find(SidebarFiltersItem).at(2).prop('heading')).toEqual('Data Access')
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

          const temporalSection = enzymeWrapper.find(SidebarFiltersItem).at(1)
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

          const temporalSection = enzymeWrapper.find(SidebarFiltersItem).at(1)
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

          const temporalSection = enzymeWrapper.find(SidebarFiltersItem).at(1)
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
          const temporalSection = enzymeWrapper.find(SidebarFiltersItem).at(1)
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
          const temporalSection = enzymeWrapper.find(SidebarFiltersItem).at(1)
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
            isOpenSearch: false,
            tags: {
              'edsc.extra.serverless.collection_capabilities': {
                data: { day_night_flag: true }
              }
            }
          }
        })

        const dayNightSection = enzymeWrapper.find(SidebarFiltersItem).at(2)
        expect(dayNightSection.find(FormControl).prop('value')).toEqual('')
      })

      test('displays selected item', () => {
        const { enzymeWrapper } = setup({
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
        expect(dayNightSection.find(FormControl).prop('value')).toEqual('NIGHT')
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

        dayNightInput.prop('onChange')({ event: 'test' })
        expect(props.handleChange).toHaveBeenCalledTimes(1)
        expect(props.handleChange).toHaveBeenCalledWith({ event: 'test' })
      })
    })

    describe('Data Access section', () => {
      describe('Browse only toggle', () => {
        test('defaults to an empty value', () => {
          const { enzymeWrapper } = setup()

          const dataAccessSection = enzymeWrapper.find(SidebarFiltersItem).at(2)
          expect(dataAccessSection.find(Form.Check).at(0).prop('value')).toEqual(false)
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

        test('calls handleChange on change', () => {
          const { enzymeWrapper, props } = setup({
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
          cloudCoverSection.find(Form.Control).at(0).prop('onChange')({ event: 'test' })
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
                  data: { cloud_cover: true }
                }
              }
            }
          })

          const cloudCoverSection = enzymeWrapper.find(SidebarFiltersItem).at(3)
          expect(cloudCoverSection.find(Form.Control).at(1).prop('value')).toEqual('')
        })

        test('calls handleChange on change', () => {
          const { enzymeWrapper, props } = setup({
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
              isOpenSearch: false,
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: { orbit_calculated_spatial_domains: true }
                }
              }
            }
          })

          const orbitNumberSection = enzymeWrapper.find(SidebarFiltersItem).at(3)
          expect(orbitNumberSection.find(Form.Control).at(0).prop('value')).toEqual('')
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
          orbitNumberSection.find(Form.Control).at(0).prop('onChange')({ event: 'test' })
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
