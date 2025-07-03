import React from 'react'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import Form from '@rjsf/core'
import { act } from 'react-dom/test-utils'

import { collectionSortKeys } from '../../../constants/collectionSortKeys'
import PreferencesForm from '../PreferencesForm'
import schema from '../../../../../../schemas/sitePreferencesSchema.json'
import uiSchema from '../../../../../../schemas/sitePreferencesUISchema.json'
import mapLayers from '../../../constants/mapLayers'
import projectionCodes from '../../../constants/projectionCodes'

import mockUseEdscStore from '../../../zustand/useEdscStore'

Enzyme.configure({ adapter: new Adapter() })

jest.mock('../../../zustand/useEdscStore')

const defaultStoreData = {
  preferencesData: {
    panelState: 'default',
    collectionListView: 'default',
    granuleListView: 'default',
    collectionSort: 'default',
    granuleSort: 'default',
    mapView: {
      baseLayer: 'worldImagery',
      latitude: 0,
      longitude: 0,
      overlayLayers: [
        'bordersRoads',
        'placeLabels'
      ],
      projection: 'epsg4326',
      rotation: 0,
      zoom: 3
    }
  },
  isSubmitting: false,
  submitAndUpdatePreferences: jest.fn()
}

function setup(storeData = defaultStoreData) {
  mockUseEdscStore.mockReturnValue(storeData)
  const enzymeWrapper = shallow(<PreferencesForm />)

  return {
    enzymeWrapper,
    storeData
  }
}

function setupMount(storeData = defaultStoreData) {
  mockUseEdscStore.mockReturnValue(storeData)
  const enzymeWrapper = mount(<PreferencesForm />)

  return {
    enzymeWrapper,
    storeData
  }
}

describe('PreferencesForm component', () => {
  test('renders a Form component', () => {
    const { enzymeWrapper, storeData } = setup()

    const form = enzymeWrapper.find(Form)

    expect(form.props().schema).toEqual(schema)
    expect(form.props().uiSchema).toEqual(uiSchema)
    expect(form.props().formData).toEqual(storeData.preferencesData)
    expect(form.props().onSubmit).toEqual(storeData.submitAndUpdatePreferences)
  })

  test('onChange sets the state', () => {
    const { enzymeWrapper } = setupMount()

    act(() => {
      enzymeWrapper.find(Form).props().onChange({
        formData: {
          panelState: 'collapsed',
          collectionListView: 'list',
          collectionSort: collectionSortKeys.scoreDescending,
          granuleListView: 'table',
          granuleSort: 'end_date',
          mapView: {
            zoom: 4,
            baseLayer: mapLayers.worldImagery,
            latitude: 39,
            longitude: -95,
            overlayLayers: [
              mapLayers.bordersRoads,
              mapLayers.placeLabels
            ],
            projection: projectionCodes.geographic
          }
        }
      })
    })

    enzymeWrapper.update()

    expect(enzymeWrapper.find(Form).props().formData).toEqual({
      panelState: 'collapsed',
      collectionListView: 'list',
      collectionSort: collectionSortKeys.scoreDescending,
      granuleListView: 'table',
      granuleSort: 'end_date',
      mapView: {
        zoom: 4,
        baseLayer: mapLayers.worldImagery,
        latitude: 39,
        longitude: -95,
        overlayLayers: [
          mapLayers.bordersRoads,
          mapLayers.placeLabels
        ],
        projection: projectionCodes.geographic
      }
    })
  })

  test('updating store data updates the state', () => {
    const { enzymeWrapper } = setup()

    const newStoreData = {
      ...defaultStoreData,
      preferencesData: {
        ...defaultStoreData.preferencesData,
        panelState: 'collapsed',
        collectionListView: 'list',
        granuleListView: 'table'
      }
    }

    mockUseEdscStore.mockReturnValue(newStoreData)
    enzymeWrapper.setProps({})

    const form = enzymeWrapper.find(Form)

    form.simulate('change', {
      formData: {
        panelState: 'collapsed',
        collectionListView: 'list',
        granuleListView: 'table',
        collectionSort: 'default',
        granuleSort: 'default',
        mapView: {
          baseLayer: 'worldImagery',
          latitude: 0,
          longitude: 0,
          overlayLayers: [
            'bordersRoads',
            'placeLabels'
          ],
          projection: 'epsg4326',
          rotation: 0,
          zoom: 3
        }
      }
    })

    expect(enzymeWrapper.find(Form).props().formData).toEqual({
      panelState: 'collapsed',
      collectionListView: 'list',
      granuleListView: 'table',
      collectionSort: 'default',
      granuleSort: 'default',
      mapView: {
        baseLayer: 'worldImagery',
        latitude: 0,
        longitude: 0,
        overlayLayers: [
          'bordersRoads',
          'placeLabels'
        ],
        projection: 'epsg4326',
        rotation: 0,
        zoom: 3
      }
    })
  })
})
