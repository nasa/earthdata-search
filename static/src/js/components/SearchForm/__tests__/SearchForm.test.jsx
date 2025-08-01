import React from 'react'
import { screen, act } from '@testing-library/react'

import SearchForm from '../SearchForm'
import setupTest from '../../../../../../jestConfigs/setupTest'

jest.mock('../../../containers/TemporalSelectionDropdownContainer/TemporalSelectionDropdownContainer', () => jest.fn(() => (
  <div>Temporal Selection</div>
)))

jest.mock('../../../containers/SpatialSelectionDropdownContainer/SpatialSelectionDropdownContainer', () => jest.fn(() => (
  <div>Spatial Selection</div>
)))

jest.mock('../../../containers/AdvancedSearchDisplayContainer/AdvancedSearchDisplayContainer', () => jest.fn(() => (
  <div>Advanced Search Display</div>
)))

jest.mock('../../../containers/SpatialDisplayContainer/SpatialDisplayContainer', () => jest.fn(() => (
  <div>Spatial Display</div>
)))

jest.mock('../../../containers/TemporalDisplayContainer/TemporalDisplayContainer', () => jest.fn(() => (
  <div>Temporal Display</div>
)))

jest.mock('../../../containers/PortalFeatureContainer/PortalFeatureContainer', () => jest.fn(({ children }) => (
  <div>{children}</div>
)))

const setup = setupTest({
  Component: SearchForm,
  defaultProps: {
    advancedSearch: {},
    keywordSearch: 'Test value',
    onChangeFocusedCollection: jest.fn(),
    onChangeQuery: jest.fn(),
    onClearFilters: jest.fn(),
    onToggleAdvancedSearchModal: jest.fn()
  }
})

describe('SearchForm component', () => {
  test('should render search form and search autocomplete', () => {
    setup()

    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByText('Search')).toBeInTheDocument()
    expect(screen.getByText('Temporal Selection')).toBeInTheDocument()
    expect(screen.getByText('Spatial Selection')).toBeInTheDocument()
    expect(screen.getByText('Advanced Search Display')).toBeInTheDocument()
    expect(screen.getByText('Spatial Display')).toBeInTheDocument()
    expect(screen.getByText('Temporal Display')).toBeInTheDocument()
  })

  test('should call onClearFilters when the Clear Button is clicked', async () => {
    const { user, props } = setup()

    const clearButton = screen.getByRole('button', { name: /clear all search filters/i })

    await act(async () => {
      await user.click(clearButton)
    })

    expect(props.onClearFilters).toHaveBeenCalledTimes(1)
    expect(props.onClearFilters).toHaveBeenCalledWith()
  })

  describe('advanced search button', () => {
    test('fires the action to open the advanced search modal', async () => {
      const { user, props } = setup()

      const advancedSearchButton = screen.getByRole('button', { name: /show advanced search options/i })
      expect(advancedSearchButton).toBeInTheDocument()

      await act(async () => {
        await user.click(advancedSearchButton)
      })

      expect(props.onToggleAdvancedSearchModal).toHaveBeenCalledTimes(1)
      expect(props.onToggleAdvancedSearchModal).toHaveBeenCalledWith(true)
    })
  })

  describe('SearchAutocomplete integration', () => {
    test('renders with initial keyword value', () => {
      setup({
        overrideProps: {
          keywordSearch: 'Test value'
        }
      })

      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('Test value')
    })

    test('passes required props to SearchAutocomplete', () => {
      const { props } = setup({
        overrideProps: {
          keywordSearch: 'Test keyword'
        }
      })

      expect(screen.getByRole('textbox')).toHaveValue('Test keyword')

      expect(props.onChangeQuery).toBeDefined()
      expect(props.onChangeFocusedCollection).toBeDefined()
    })
  })
})
