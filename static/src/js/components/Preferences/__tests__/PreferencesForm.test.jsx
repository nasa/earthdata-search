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

Enzyme.configure({ adapter: new Adapter() })

const defaultProps = {
  preferences: {
    preferences: {
      panelState: 'default',
      collectionListView: 'default',
      granuleListView: 'default'
    },
    isSubmitting: false
  },
  onUpdatePreferences: jest.fn()
}

function setup() {
  const enzymeWrapper = shallow(<PreferencesForm {...defaultProps} />)

  return {
    enzymeWrapper,
    props: defaultProps
  }
}

function setupMount() {
  const enzymeWrapper = mount(<PreferencesForm {...defaultProps} />)

  return {
    enzymeWrapper,
    props: defaultProps
  }
}

describe('PreferencesForm component', () => {
  test('renders a Form component', () => {
    const { enzymeWrapper, props } = setup()

    const form = enzymeWrapper.find(Form)

    expect(form.props().schema).toEqual(schema)
    expect(form.props().uiSchema).toEqual(uiSchema)
    expect(form.props().formData).toEqual(props.preferences.preferences)
    expect(form.props().onSubmit).toEqual(props.onUpdatePreferences)
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

  test('updating props updates the state', () => {
    const { enzymeWrapper } = setup()

    enzymeWrapper.setProps({
      preferences: {
        preferences: {
          panelState: 'collapsed',
          collectionListView: 'list',
          granuleListView: 'table'
        }
      }
    })

    const form = enzymeWrapper.find(Form)

    form.simulate('change', {
      formData: {
        panelState: 'collapsed',
        collectionListView: 'list',
        granuleListView: 'table'
      }
    })

    expect(enzymeWrapper.find(Form).props().formData).toEqual({
      panelState: 'collapsed',
      collectionListView: 'list',
      granuleListView: 'table'
    })
  })
})
