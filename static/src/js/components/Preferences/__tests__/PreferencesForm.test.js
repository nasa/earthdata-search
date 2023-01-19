import React from 'react'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import Form from '@rjsf/core'
import { act } from 'react-dom/test-utils'

import PreferencesForm from '../PreferencesForm'
import schema from '../../../../../../schemas/sitePreferencesSchema.json'
import uiSchema from '../../../../../../schemas/sitePreferencesUISchema.json'

Enzyme.configure({ adapter: new Adapter() })

const props = {
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
  const enzymeWrapper = shallow(<PreferencesForm {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

function setupMount() {
  const enzymeWrapper = mount(<PreferencesForm {...props} />)

  return {
    enzymeWrapper,
    props
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
          collectionSort: 'relevance',
          granuleListView: 'table',
          granuleSort: 'end_date',
          mapView: {
            zoom: 4,
            baseLayer: 'blueMarble',
            latitude: 39,
            longitude: -95,
            overlayLayers: [
              'referenceFeatures',
              'referenceLabels'
            ],
            projection: 'epsg4326'
          }
        }
      })
    })

    enzymeWrapper.update()

    expect(enzymeWrapper.find(Form).props().formData).toEqual({
      panelState: 'collapsed',
      collectionListView: 'list',
      collectionSort: 'relevance',
      granuleListView: 'table',
      granuleSort: 'end_date',
      mapView: {
        zoom: 4,
        baseLayer: 'blueMarble',
        latitude: 39,
        longitude: -95,
        overlayLayers: [
          'referenceFeatures',
          'referenceLabels'
        ],
        projection: 'epsg4326'
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
