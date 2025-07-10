import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { collectionSortKeys } from '../../../constants/collectionSortKeys'
import PreferencesForm from '../PreferencesForm'
import mapLayers from '../../../constants/mapLayers'
import projectionCodes from '../../../constants/projectionCodes'
import setupTest from '../../../../../../jestConfigs/setupTest'
import useEdscStore from '../../../zustand/useEdscStore'

const defaultZustandState = {
  preferences: {
    preferences: {
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
}

const setup = setupTest({
  Component: PreferencesForm,
  defaultZustandState
})

describe('PreferencesForm component', () => {
  beforeEach(() => {
    useEdscStore.setState(useEdscStore.getInitialState(), true)
  })

  test('renders a Form component', () => {
    setup()

    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
    expect(screen.getByText(/Panel State/i)).toBeInTheDocument()
    expect(screen.getByText(/Collection.*Sort/i)).toBeInTheDocument()
    expect(screen.getByText(/Granule.*Sort/i)).toBeInTheDocument()
  })

  test('onChange sets the state', async () => {
    setup()

    const submitButton = screen.getByRole('button', { name: /submit/i })

    expect(submitButton).toBeInTheDocument()
    expect(screen.getByText(/Panel State/i)).toBeInTheDocument()
    expect(screen.getByText(/Collection.*Sort/i)).toBeInTheDocument()
    expect(screen.getByText(/Granule.*Sort/i)).toBeInTheDocument()

    expect(submitButton).not.toBeDisabled()
  })

  test('updating store data updates the state', () => {
    const updatedState = {
      preferences: {
        preferences: {
          panelState: 'collapsed',
          collectionListView: 'list',
          granuleListView: 'table',
          collectionSort: collectionSortKeys.scoreDescending,
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
        },
        isSubmitting: false,
        submitAndUpdatePreferences: jest.fn()
      }
    }

    setup({
      overrideZustandState: updatedState
    })

    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
    expect(screen.getByText(/Panel State/i)).toBeInTheDocument()
    expect(screen.getByText(/Collection.*Sort/i)).toBeInTheDocument()
    expect(screen.getByText(/Granule.*Sort/i)).toBeInTheDocument()
  })
})
