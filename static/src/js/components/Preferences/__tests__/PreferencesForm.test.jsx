import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import PreferencesForm from '../PreferencesForm'
import setupTest from '../../../../../../jestConfigs/setupTest'

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
  test('renders a Form component', () => {
    setup()

    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()

    expect(screen.getByText(/Panel State/i)).toBeInTheDocument()
    expect(screen.getByText(/Collection.*Sort/i)).toBeInTheDocument()
    expect(screen.getByText(/Granule.*Sort/i)).toBeInTheDocument()
    expect(screen.getByText(/Collection List View/i)).toBeInTheDocument()
    expect(screen.getByText(/Granule List View/i)).toBeInTheDocument()
    expect(screen.getByText(/Map View/i)).toBeInTheDocument()

    const panelStateDefault = screen.getByLabelText('Default', { selector: '[name="panelState"]' })
    expect(panelStateDefault).toBeChecked()

    const collectionSortDefault = screen.getByLabelText('Default', { selector: '[name="collectionSort"]' })
    expect(collectionSortDefault).toBeChecked()

    const granuleSortDefault = screen.getByLabelText('Default', { selector: '[name="granuleSort"]' })
    expect(granuleSortDefault).toBeChecked()

    const collectionListViewDefault = screen.getByLabelText('Default', { selector: '[name="collectionListView"]' })
    expect(collectionListViewDefault).toBeChecked()

    const granuleListViewDefault = screen.getByLabelText('Default', { selector: '[name="granuleListView"]' })
    expect(granuleListViewDefault).toBeChecked()

    const numberInputs = screen.getAllByRole('spinbutton')

    const latitudeInput = numberInputs.find((input) => input.name === 'latitude')
    expect(latitudeInput).toHaveValue(0)

    const longitudeInput = numberInputs.find((input) => input.name === 'longitude')
    expect(longitudeInput).toHaveValue(0)

    const zoomInput = numberInputs.find((input) => input.name === 'zoom')
    expect(zoomInput).toHaveValue(3)

    const geographicProjection = screen.getByLabelText('Geographic (Equirectangular)', { selector: '[name="projection"]' })
    expect(geographicProjection).toBeChecked()

    const worldImageryLayer = screen.getByLabelText('World Imagery', { selector: '[name="baseLayer"]' })
    expect(worldImageryLayer).toBeChecked()

    expect(screen.getByText(/Overlay Layers/i)).toBeInTheDocument()
  })

  test('allows user to change form values', async () => {
    const user = userEvent.setup()
    setup()

    const collapsedPanelOption = screen.getByLabelText('Collapsed', { selector: '[name="panelState"]' })
    expect(collapsedPanelOption).not.toBeChecked()

    await user.click(collapsedPanelOption)
    expect(collapsedPanelOption).toBeChecked()

    const relevanceOption = screen.getByLabelText('Relevance', { selector: '[name="collectionSort"]' })
    expect(relevanceOption).not.toBeChecked()

    await user.click(relevanceOption)
    expect(relevanceOption).toBeChecked()

    const newestFirstOption = screen.getByLabelText('Start Date, Newest First', { selector: '[name="granuleSort"]' })
    expect(newestFirstOption).not.toBeChecked()

    await user.click(newestFirstOption)
    expect(newestFirstOption).toBeChecked()

    const numberInputs = screen.getAllByRole('spinbutton')
    const latitudeInput = numberInputs.find((input) => input.name === 'latitude')

    await user.clear(latitudeInput)
    await user.type(latitudeInput, '45')
    expect(latitudeInput).toHaveValue(45)

    const longitudeInput = numberInputs.find((input) => input.name === 'longitude')

    await user.clear(longitudeInput)
    await user.type(longitudeInput, '-95')
    expect(longitudeInput).toHaveValue(-95)

    const polarProjection = screen.getByLabelText('North Polar Stereographic', { selector: '[name="projection"]' })
    expect(polarProjection).not.toBeChecked()

    await user.click(polarProjection)
    expect(polarProjection).toBeChecked()

    const submitButton = screen.getByRole('button', { name: /submit/i })
    expect(submitButton).not.toBeDisabled()
  })
})
