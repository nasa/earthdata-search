import React from 'react'
import { render, act } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'

import { PreferencesContainer } from '../PreferencesContainer'
import useEdscStore from '../../../zustand/useEdscStore'

// Mock the Preferences component
jest.mock('../../../components/Preferences/Preferences', () => {
  const MockPreferences = ({ preferences, onUpdatePreferences }) => (
    <div data-testid="preferences-component">
      <div data-testid="preferences-data">{JSON.stringify(preferences)}</div>
      <button
        type="button"
        data-testid="update-button"
        onClick={() => onUpdatePreferences({ formData: { panelState: 'updated' } })}
      >
        Update Preferences
      </button>
    </div>
  )
  return MockPreferences
})

const renderWithRouter = (component) => {
  const history = createMemoryHistory()
  return render(
    <Router history={history}>
      {component}
    </Router>
  )
}

describe('PreferencesContainer', () => {
  beforeEach(() => {
    useEdscStore.setState(useEdscStore.getInitialState())
  })

  test('renders the Preferences component', () => {
    const { getByTestId } = renderWithRouter(<PreferencesContainer />)

    expect(getByTestId('preferences-component')).toBeInTheDocument()
  })

  test('passes correct preferences data structure to Preferences component', () => {
    // Set some test preferences
    act(() => {
      useEdscStore.setState((state) => ({
        ...state,
        preferences: {
          ...state.preferences,
          panelState: 'custom',
          collectionListView: 'table',
          granuleListView: 'list',
          collectionSort: 'score',
          granuleSort: '-start_date',
          mapView: {
            zoom: 5,
            latitude: 10,
            longitude: -20,
            baseLayer: 'trueColor',
            overlayLayers: ['coastlines'],
            projection: 'arctic',
            rotation: 45
          },
          isSubmitting: true,
          isSubmitted: false
        }
      }))
    })

    const { getByTestId } = renderWithRouter(<PreferencesContainer />)

    const preferencesData = JSON.parse(getByTestId('preferences-data').textContent)

    expect(preferencesData).toEqual({
      preferences: {
        panelState: 'custom',
        collectionListView: 'table',
        granuleListView: 'list',
        collectionSort: 'score',
        granuleSort: '-start_date',
        mapView: {
          zoom: 5,
          latitude: 10,
          longitude: -20,
          baseLayer: 'trueColor',
          overlayLayers: ['coastlines'],
          projection: 'arctic',
          rotation: 45
        }
      },
      isSubmitting: true,
      isSubmitted: false
    })
  })

  test('excludes action methods from preferences data', () => {
    const { getByTestId } = renderWithRouter(<PreferencesContainer />)

    const preferencesData = JSON.parse(getByTestId('preferences-data').textContent)

    // Should not include any action methods
    expect(preferencesData.preferences.setPreferences).toBeUndefined()
    expect(preferencesData.preferences.setIsSubmitting).toBeUndefined()
    expect(preferencesData.preferences.setIsSubmitted).toBeUndefined()
    expect(preferencesData.preferences.resetPreferences).toBeUndefined()
    expect(preferencesData.preferences.setPanelState).toBeUndefined()
    expect(preferencesData.preferences.setCollectionListView).toBeUndefined()
    expect(preferencesData.preferences.setGranuleListView).toBeUndefined()
    expect(preferencesData.preferences.setCollectionSort).toBeUndefined()
    expect(preferencesData.preferences.setGranuleSort).toBeUndefined()
    expect(preferencesData.preferences.setMapView).toBeUndefined()
    expect(preferencesData.preferences.setPreferencesFromJwt).toBeUndefined()
    expect(preferencesData.preferences.updatePreferences).toBeUndefined()
  })

  test('passes updatePreferences function to Preferences component', () => {
    const mockUpdatePreferences = jest.fn()

    act(() => {
      useEdscStore.setState((state) => ({
        ...state,
        preferences: {
          ...state.preferences,
          updatePreferences: mockUpdatePreferences
        }
      }))
    })

    const { getByTestId } = renderWithRouter(<PreferencesContainer />)

    // Click the update button to trigger the callback
    getByTestId('update-button').click()

    expect(mockUpdatePreferences).toHaveBeenCalledWith({
      formData: { panelState: 'updated' }
    })
  })

  test('updates when Zustand preferences state changes', () => {
    const { getByTestId, rerender } = renderWithRouter(<PreferencesContainer />)

    // Initial state
    let preferencesData = JSON.parse(getByTestId('preferences-data').textContent)
    expect(preferencesData.preferences.panelState).toBe('default')
    expect(preferencesData.isSubmitting).toBe(false)

    // Update Zustand state
    act(() => {
      useEdscStore.setState((state) => ({
        ...state,
        preferences: {
          ...state.preferences,
          panelState: 'updated',
          isSubmitting: true
        }
      }))
    })

    // Re-render to trigger state update
    rerender(<PreferencesContainer />)

    // Check updated state
    preferencesData = JSON.parse(getByTestId('preferences-data').textContent)
    expect(preferencesData.preferences.panelState).toBe('updated')
    expect(preferencesData.isSubmitting).toBe(true)
  })

  test('handles default initial preferences correctly', () => {
    const { getByTestId } = renderWithRouter(<PreferencesContainer />)

    const preferencesData = JSON.parse(getByTestId('preferences-data').textContent)

    expect(preferencesData.preferences).toEqual({
      panelState: 'default',
      collectionListView: 'default',
      granuleListView: 'default',
      collectionSort: 'default',
      granuleSort: 'default',
      mapView: {
        zoom: 3,
        latitude: 0,
        longitude: 0,
        baseLayer: 'worldImagery',
        projection: 'epsg4326',
        overlayLayers: ['bordersRoads', 'placeLabels'],
        rotation: 0
      }
    })
    expect(preferencesData.isSubmitting).toBe(false)
    expect(preferencesData.isSubmitted).toBe(false)
  })
})