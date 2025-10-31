import { screen } from '@testing-library/react'

import PreferencesForm from '../PreferencesForm'
import setupTest from '../../../../../../jestConfigs/setupTest'
import UPDATE_PREFERENCES from '../../../operations/mutations/updatePreferences'
import addToast from '../../../util/addToast'

jest.mock('../../../util/addToast')

const defaultZustandState = {
  errors: {
    handleError: jest.fn()
  },
  user: {
    sitePreferences: {
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
    setSitePreferences: jest.fn()
  }
}

const setup = setupTest({
  Component: PreferencesForm,
  defaultZustandState,
  withApolloClient: true
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

  describe('when submitting the form', () => {
    test('submits the form successfully', async () => {
      const { user } = setup({
        overrideApolloClientMocks: [
          {
            request: {
              query: UPDATE_PREFERENCES,
              variables: {
                preferences: {
                  collectionSort: '-score',
                  granuleSort: '-start_date',
                  panelState: 'collapsed',
                  collectionListView: 'default',
                  granuleListView: 'default',
                  mapView: {
                    latitude: 45,
                    longitude: -95,
                    zoom: 3,
                    projection: 'epsg3413',
                    baseLayer: 'worldImagery',
                    overlayLayers: ['bordersRoads', 'placeLabels'],
                    rotation: 0
                  }
                }
              }
            },
            result: {
              data: {
                updatePreferences: {
                  id: 42,
                  sitePreferences: {
                    panelState: 'collapsed',
                    collectionListView: 'default',
                    granuleListView: 'default',
                    collectionSort: '-score',
                    granuleSort: '-start_date',
                    mapView: {
                      baseLayer: 'worldImagery',
                      latitude: 45,
                      longitude: -95,
                      overlayLayers: [
                        'bordersRoads',
                        'placeLabels'
                      ],
                      projection: 'epsg3413',
                      rotation: 0,
                      zoom: 3
                    }
                  },
                  ursId: 'testuser',
                  ursProfile: null
                }
              }
            }
          }
        ]
      })

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

      await user.click(submitButton)

      expect(addToast).toHaveBeenCalledTimes(1)
      expect(addToast).toHaveBeenCalledWith('Preferences saved!', {
        appearance: 'success',
        autoDismiss: true
      })
    })

    describe('when the mutation fails', () => {
      test('calls onHandleError', async () => {
        const { user, zustandState } = setup({
          overrideApolloClientMocks: [
            {
              request: {
                query: UPDATE_PREFERENCES,
                variables: {
                  preferences: {
                    collectionSort: 'default',
                    granuleSort: 'default',
                    panelState: 'default',
                    collectionListView: 'default',
                    granuleListView: 'default',
                    mapView: {
                      latitude: 0,
                      longitude: 0,
                      zoom: 3,
                      projection: 'epsg4326',
                      baseLayer: 'worldImagery',
                      overlayLayers: ['bordersRoads', 'placeLabels'],
                      rotation: 0
                    }
                  }
                }
              },
              error: new Error('GraphQL error')
            }
          ]
        })

        const submitButton = screen.getByRole('button', { name: /submit/i })
        expect(submitButton).not.toBeDisabled()

        await user.click(submitButton)

        expect(zustandState.errors.handleError).toHaveBeenCalledTimes(1)
        expect(zustandState.errors.handleError).toHaveBeenCalledWith({
          error: expect.any(Error),
          action: 'updatePreferences',
          resource: 'preferences',
          requestObject: null,
          notificationType: 'toast'
        })
      })
    })
  })
})
