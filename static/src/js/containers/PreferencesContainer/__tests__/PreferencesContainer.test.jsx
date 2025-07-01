import React from 'react'
import { render, act } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'

import { PreferencesContainer } from '../PreferencesContainer'
import useEdscStore from '../../../zustand/useEdscStore'

jest.mock('../../../components/Preferences/Preferences', () => {
  const MockPreferences = ({ preferences, onUpdatePreferences }) => (
    <div role="region" aria-label="preferences">
      <div role="status" aria-label="preferences data">{JSON.stringify(preferences)}</div>
      <button
        type="button"
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
    const { getByRole } = renderWithRouter(<PreferencesContainer />)

    expect(getByRole('region', { name: 'preferences' })).toBeInTheDocument()
  })

  test('passes correct preferences data structure to Preferences component', () => {
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

    const { getByRole } = renderWithRouter(<PreferencesContainer />)

    const preferencesData = JSON.parse(getByRole('status', { name: 'preferences data' }).textContent)

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

    const { getByRole } = renderWithRouter(<PreferencesContainer />)

    getByRole('button', { name: 'Update Preferences' }).click()

    expect(mockUpdatePreferences).toHaveBeenCalledWith({
      formData: { panelState: 'updated' }
    })
  })

  test('updates when Zustand preferences state changes', () => {
    const { getByRole, rerender } = renderWithRouter(<PreferencesContainer />)

    let preferencesData = JSON.parse(getByRole('status', { name: 'preferences data' }).textContent)
    expect(preferencesData.preferences.panelState).toBe('default')
    expect(preferencesData.isSubmitting).toBe(false)

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

    preferencesData = JSON.parse(getByRole('status', { name: 'preferences data' }).textContent)
    expect(preferencesData.preferences.panelState).toBe('updated')
    expect(preferencesData.isSubmitting).toBe(true)
  })

  test('handles default initial preferences correctly', () => {
    const { getByRole } = renderWithRouter(<PreferencesContainer />)

    const preferencesData = JSON.parse(getByRole('status', { name: 'preferences data' }).textContent)

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
