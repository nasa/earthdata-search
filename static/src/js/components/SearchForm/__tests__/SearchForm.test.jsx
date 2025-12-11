import React from 'react'
import { screen } from '@testing-library/react'

import SearchForm from '../SearchForm'
import setupTest from '../../../../../../jestConfigs/setupTest'
import { MODAL_NAMES } from '../../../constants/modalNames'

jest.mock('../../../containers/TemporalSelectionDropdownContainer/TemporalSelectionDropdownContainer', () => jest.fn(() => (
  <div>Temporal Selection</div>
)))

jest.mock('../../../containers/SpatialSelectionDropdownContainer/SpatialSelectionDropdownContainer', () => jest.fn(() => (
  <div>Spatial Selection</div>
)))

jest.mock('../../../components/AdvancedSearchDisplay/AdvancedSearchDisplay', () => jest.fn(() => (
  <div>Advanced Search Display</div>
)))

jest.mock('../../SpatialDisplay/SpatialDisplay', () => jest.fn(() => (
  <div>Spatial Display</div>
)))

jest.mock('../../TemporalDisplay/TemporalDisplay', () => jest.fn(() => (
  <div>Temporal Display</div>
)))

jest.mock('../../../containers/PortalFeatureContainer/PortalFeatureContainer', () => jest.fn(({ children }) => (
  <div>{children}</div>
)))

const setup = setupTest({
  Component: SearchForm,
  defaultZustandState: {
    query: {
      clearFilters: jest.fn()
    },
    ui: {
      modals: {
        setOpenModal: jest.fn()
      }
    }
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
    const { user, zustandState } = setup()

    const clearButton = screen.getByRole('button', { name: 'Clear all search filters' })
    await user.click(clearButton)

    expect(zustandState.query.clearFilters).toHaveBeenCalledTimes(1)
    expect(zustandState.query.clearFilters).toHaveBeenCalledWith(expect.objectContaining({
      type: 'click'
    }))
  })

  describe('advanced search button', () => {
    test('fires the action to open the advanced search modal', async () => {
      const { user, zustandState } = setup()

      const advancedSearchButton = screen.getByRole('button', { name: /show advanced search options/i })
      expect(advancedSearchButton).toBeInTheDocument()

      await user.click(advancedSearchButton)

      expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(1)
      expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledWith(MODAL_NAMES.ADVANCED_SEARCH)
    })
  })
})
