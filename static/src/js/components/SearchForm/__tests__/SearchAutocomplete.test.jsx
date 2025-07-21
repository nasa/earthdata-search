import React from 'react'
import {
  screen,
  waitFor,
  fireEvent
} from '@testing-library/react'
import nock from 'nock'

import SearchAutocomplete from '../SearchAutocomplete'
import setupTest from '../../../../../../jestConfigs/setupTest'
import * as actions from '../../../actions/errors'

beforeEach(() => {
  nock.cleanAll()

  // Mock console.error to prevent test failures from React warnings
  jest.spyOn(console, 'error').mockImplementation(() => {})

  // Always mock the error logger endpoint
  nock(/localhost/)
    .post(/error_logger/)
    .reply(200)
    .persist()

  // Always mock the autocomplete logger endpoint
  nock(/localhost/)
    .post(/autocomplete_logger/)
    .reply(200)
    .persist()
})

afterEach(() => {
  nock.cleanAll()
})

describe('SearchAutocomplete', () => {
  const defaultProps = {
    initialKeyword: '',
    onChangeQuery: jest.fn(),
    onChangeFocusedCollection: jest.fn()
  }

  // Default Redux state needed by the component
  const defaultReduxState = {
    authToken: '',
    earthdataEnvironment: 'prod'
  }

  describe('when rendering the component', () => {
    test('renders correctly', () => {
      setupTest({
        Component: SearchAutocomplete,
        defaultProps
      })()

      expect(screen.getByRole('textbox')).toBeInTheDocument()
      expect(screen.getByText('Search')).toBeInTheDocument()
    })

    test('renders with initial keyword value', () => {
      setupTest({
        Component: SearchAutocomplete,
        defaultProps: {
          ...defaultProps,
          initialKeyword: 'Test value'
        },
        withRedux: true,
        defaultReduxState
      })()

      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('Test value')
    })

    test('updates input when initialKeyword prop changes', () => {
      const { rerender } = setupTest({
        Component: SearchAutocomplete,
        defaultProps: {
          ...defaultProps,
          initialKeyword: 'initial value'
        }
      })()

      expect(screen.getByRole('textbox')).toHaveValue('initial value')

      rerender(
        <SearchAutocomplete
          {...defaultProps}
          initialKeyword="new value"
        />
      )

      expect(screen.getByRole('textbox')).toHaveValue('new value')
    })
  })

  describe('when typing in the search input', () => {
    test('updates the input value', async () => {
      const { user } = setupTest({
        Component: SearchAutocomplete,
        defaultProps,
        withRedux: true,
        defaultReduxState
      })()

      const input = screen.getByRole('textbox')
      await user.type(input, 'MODIS')

      await waitFor(() => {
        expect(input).toHaveValue('MODIS')
      })
    })

    test('fetches autocomplete suggestions after 3 characters', async () => {
      const { user } = setupTest({
        Component: SearchAutocomplete,
        defaultProps,
        withRedux: true,
        defaultReduxState
      })()

      nock(/localhost/)
        .post(/autocomplete/)
        .reply(200, {
          feed: {
            entry: [{
              type: 'mock_type',
              fields: 'mock value',
              value: 'mock value'
            }]
          }
        })

      const input = screen.getByRole('textbox')
      await user.type(input, 'tes')

      await screen.findByText('mock value')
    })

    test('does not fetch suggestions with less than 3 characters', async () => {
      const { user } = setupTest({
        Component: SearchAutocomplete,
        defaultProps,
        withRedux: true,
        defaultReduxState
      })()

      const input = screen.getByRole('textbox')
      await user.type(input, 'te')

      expect(screen.queryByText('Loading collections...')).not.toBeInTheDocument()
    })

    test('shows loading state while fetching', async () => {
      const { user } = setupTest({
        Component: SearchAutocomplete,
        defaultProps,
        withRedux: true,
        defaultReduxState
      })()

      nock(/localhost/)
        .post(/autocomplete/)
        .reply(() => new Promise((resolve) => {
          setTimeout(() => resolve([200, { feed: { entry: [] } }]), 100)
        }))

      const input = screen.getByRole('textbox')
      await user.type(input, 'test')

      expect(screen.getByText('Loading collections...')).toBeInTheDocument()
    })

    test('calls handleError when autocomplete API returns an error', async () => {
      const handleErrorMock = jest.spyOn(actions, 'handleError')
      const consoleMock = jest.spyOn(console, 'error').mockImplementation(() => {})

      const { user } = setupTest({
        Component: SearchAutocomplete,
        defaultProps,
        withRedux: true,
        defaultReduxState
      })()

      nock(/localhost/)
        .post(/autocomplete/)
        .reply(500, {
          errors: [{
            message: 'Server error'
          }]
        })

      const input = screen.getByRole('textbox')
      // So only one request is made
      await user.type(input, 'tes')

      await waitFor(() => {
        expect(handleErrorMock).toHaveBeenCalledTimes(1)
      })

      expect(handleErrorMock).toHaveBeenCalledWith(expect.objectContaining({
        action: 'fetchAutocomplete',
        resource: 'suggestions'
      }))

      expect(screen.queryByText('Loading collections...')).not.toBeInTheDocument()

      // Cleanup
      handleErrorMock.mockRestore()
      consoleMock.mockRestore()
    })
  })

  describe('when submitting the form', () => {
    test('calls onChangeQuery and onChangeFocusedCollection when keyword has changed', async () => {
      const { user, props } = setupTest({
        Component: SearchAutocomplete,
        defaultProps: {
          ...defaultProps,
          initialKeyword: 'initial'
        }
      })()

      const input = screen.getByRole('textbox')
      await user.clear(input)
      await user.type(input, 'MODIS')

      const searchButton = screen.getByText('Search')
      await user.click(searchButton)

      expect(props.onChangeFocusedCollection).toHaveBeenCalledTimes(1)
      expect(props.onChangeFocusedCollection).toHaveBeenCalledWith('')
      expect(props.onChangeQuery).toHaveBeenCalledTimes(1)
      expect(props.onChangeQuery).toHaveBeenCalledWith({
        collection: {
          keyword: 'MODIS'
        }
      })
    })

    test('cancels inflight autocomplete requests', async () => {
      const { user } = setupTest({
        Component: SearchAutocomplete,
        defaultProps: {
          ...defaultProps,
          initialKeyword: 'initial'
        }
      })()

      // Create a delayed response
      nock(/localhost/)
        .post(/autocomplete/)
        .reply(() => new Promise((resolve) => {
          setTimeout(() => resolve([200, { feed: { entry: [] } }]), 100)
        }))

      const input = screen.getByRole('textbox')
      await user.clear(input)
      await user.type(input, 'test')

      // Submit form while request is in flight
      const searchButton = screen.getByText('Search')
      await user.click(searchButton)

      // Loading should be cleared
      expect(screen.queryByText('Loading collections...')).not.toBeInTheDocument()
    })
  })

  describe('when selecting a suggestion', () => {
    test('calls onChangeQuery with empty keyword and resets page', async () => {
      const { user, props } = setupTest({
        Component: SearchAutocomplete,
        defaultProps,
        withRedux: true,
        defaultReduxState
      })()

      nock(/localhost/)
        .post(/autocomplete/)
        .reply(200, {
          feed: {
            entry: [{
              type: 'platform',
              fields: 'MODIS',
              value: 'MODIS'
            }]
          }
        })

      const input = screen.getByRole('textbox')
      await user.type(input, 'MOD')

      await screen.findByText('MODIS')

      await user.click(screen.getByText('MODIS'))

      await waitFor(() => {
        expect(props.onChangeQuery).toHaveBeenCalledWith({
          collection: {
            pageNum: 1,
            keyword: ''
          }
        })
      })
    })

    test('clears the input after selection', async () => {
      const { user } = setupTest({
        Component: SearchAutocomplete,
        defaultProps,
        withRedux: true,
        defaultReduxState
      })()

      nock(/localhost/)
        .post(/autocomplete/)
        .reply(200, {
          feed: {
            entry: [{
              type: 'platform',
              fields: 'MODIS',
              value: 'MODIS'
            }]
          }
        })

      const input = screen.getByRole('textbox')
      await user.type(input, 'MOD')

      await screen.findByText('MODIS')

      await user.click(screen.getByText('MODIS'))

      expect(input).toHaveValue('')
    })

    test('maps science keywords to CMR facets', async () => {
      const addCmrFacetFromAutocomplete = jest.fn()
      const setOpenFacetGroup = jest.fn()

      const { user } = setupTest({
        Component: SearchAutocomplete,
        defaultProps,
        defaultZustandState: {
          home: { setOpenFacetGroup },
          facetParams: { addCmrFacetFromAutocomplete }
        }
      })()

      nock(/localhost/)
        .post(/autocomplete/)
        .reply(200, {
          feed: {
            entry: [{
              type: 'science_keywords',
              fields: 'Land Surface:Surface Radiative Properties:Reflectance:Laser Reflectance',
              value: 'Laser Reflectance'
            }]
          }
        })

      const input = screen.getByRole('textbox')
      await user.type(input, 'laser')

      await screen.findByText('Laser Reflectance')

      await user.click(screen.getByText('Laser Reflectance'))

      expect(addCmrFacetFromAutocomplete).toHaveBeenCalledWith({
        science_keywords_h: {
          topic: 'Land Surface',
          term: 'Surface Radiative Properties',
          variable_level_1: 'Reflectance',
          variable_level_2: 'Laser Reflectance'
        }
      })

      expect(setOpenFacetGroup).toHaveBeenCalledWith('science_keywords')
    })

    test('maps platforms to CMR facets', async () => {
      const addCmrFacetFromAutocomplete = jest.fn()
      const setOpenFacetGroup = jest.fn()

      const { user } = setupTest({
        Component: SearchAutocomplete,
        defaultProps,
        defaultZustandState: {
          home: { setOpenFacetGroup },
          facetParams: { addCmrFacetFromAutocomplete }
        }
      })()

      nock(/localhost/)
        .post(/autocomplete/)
        .reply(200, {
          feed: {
            entry: [{
              type: 'platforms',
              fields: 'Space-based Platforms:Earth Observation Satellites:Landsat:LANDSAT-8',
              value: 'LANDSAT-8'
            }]
          }
        })

      const input = screen.getByRole('textbox')
      await user.type(input, 'landsat')

      await screen.findByText('LANDSAT-8')

      await user.click(screen.getByText('LANDSAT-8'))

      expect(addCmrFacetFromAutocomplete).toHaveBeenCalledWith({
        platforms_h: {
          basis: 'Space-based Platforms',
          category: 'Earth Observation Satellites',
          sub_category: 'Landsat',
          short_name: 'LANDSAT-8'
        }
      })

      expect(setOpenFacetGroup).toHaveBeenCalledWith('platforms')
    })

    test('does not add facet for unmapped types', async () => {
      const addCmrFacetFromAutocomplete = jest.fn()
      const setOpenFacetGroup = jest.fn()

      const { user } = setupTest({
        Component: SearchAutocomplete,
        defaultProps,
        defaultZustandState: {
          home: { setOpenFacetGroup },
          facetParams: { addCmrFacetFromAutocomplete }
        }
      })()

      nock(/localhost/)
        .post(/autocomplete/)
        .reply(200, {
          feed: {
            entry: [{
              type: 'platform',
              fields: 'Landsat',
              value: 'Landsat'
            }]
          }
        })

      const input = screen.getByRole('textbox')
      await user.type(input, 'land')

      await screen.findByText('Landsat')

      await user.click(screen.getByText('Landsat'))

      expect(addCmrFacetFromAutocomplete).not.toHaveBeenCalled()
      expect(setOpenFacetGroup).not.toHaveBeenCalled()
    })
  })

  describe('cleanup', () => {
    test('removes event listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')

      const { unmount } = setupTest({
        Component: SearchAutocomplete,
        defaultProps,
        withRedux: true,
        defaultReduxState
      })()

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keyup', expect.any(Function))
    })

    test('cancels pending requests on unmount', async () => {
      const { user, unmount } = setupTest({
        Component: SearchAutocomplete,
        defaultProps,
        withRedux: true,
        defaultReduxState
      })()

      // Create a delayed response
      nock(/localhost/)
        .post(/autocomplete/)
        .reply(() => new Promise((resolve) => {
          setTimeout(() => resolve([200, { feed: { entry: [] } }]), 1000)
        }))

      const input = screen.getByRole('textbox')
      await user.type(input, 'test')

      // Unmount while request is pending
      unmount()

      // Should not throw any errors
    })
  })

  describe('keyboard shortcuts', () => {
    test('focuses input on "/"', () => {
      setupTest({
        Component: SearchAutocomplete,
        defaultProps
      })()

      const input = screen.getByRole('textbox')
      input.blur() // Prove it starts unfocused
      expect(document.activeElement).not.toBe(input)

      fireEvent.keyUp(window, { key: '/' }) // RTL helper

      expect(document.activeElement).toBe(input)
    })

    test('does not focus search input when "/" is pressed while already in an input', () => {
      setupTest({
        Component: SearchAutocomplete,
        defaultProps
      })()

      const searchInput = screen.getByRole('textbox')

      // Create another input to test the behavior
      const otherInput = document.createElement('input')
      otherInput.type = 'text'
      document.body.appendChild(otherInput)

      otherInput.focus()
      expect(document.activeElement).toBe(otherInput)

      // Fire keyup from the other input so event.target is the input
      fireEvent.keyUp(otherInput, { key: '/' })

      // Focus should remain on the other input
      expect(document.activeElement).toBe(otherInput)
      expect(document.activeElement).not.toBe(searchInput)

      // Cleanup
      document.body.removeChild(otherInput)
    })
  })
})
