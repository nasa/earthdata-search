import React from 'react'
import { screen } from '@testing-library/react'

import SearchForm from '../SearchForm'
import setupTest from '../../../../../../vitestConfigs/setupTest'
import { MODAL_NAMES } from '../../../constants/modalNames'
import SearchFormFeedback from '../../SearchFormFeedback/SearchFormFeedback'

vi.mock('../../TemporalDisplay/TemporalSelectionDropdown', () => ({
  default: vi.fn(() => (
    <div>Temporal Selection</div>
  ))
}))

vi.mock('../../../components/SpatialDisplay/SpatialSelectionDropdown', () => ({
  default: vi.fn(() => (
    <div>Spatial Selection</div>
  ))
}))

vi.mock('../../../components/AdvancedSearchDisplay/AdvancedSearchDisplay', () => ({
  default: vi.fn(() => (
    <div>Advanced Search Display</div>
  ))
}))

vi.mock('../../SpatialDisplay/SpatialDisplay', () => ({
  default: vi.fn(() => (
    <div>Spatial Display</div>
  ))
}))

vi.mock('../../TemporalDisplay/TemporalDisplay', () => ({
  default: vi.fn(() => (
    <div>Temporal Display</div>
  ))
}))

vi.mock('../../SearchFormFeedback/SearchFormFeedback', () => ({
  default: vi.fn(() => (
    <div>Search Form Feedback</div>
  ))
}))

vi.mock('../../../containers/PortalFeatureContainer/PortalFeatureContainer', () => ({
  default: vi.fn(({ children }) => (
    <div>{children}</div>
  ))
}))

const setup = setupTest({
  Component: SearchForm,
  defaultZustandState: {
    query: {
      clearFilters: vi.fn()
    },
    ui: {
      modals: {
        setOpenModal: vi.fn()
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
    expect(screen.queryByText('Search Form Feedback')).not.toBeInTheDocument()
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

  describe('when a nlpRequestId is present', () => {
    test('renders the SearchFormFeedback component', () => {
      setup({
        overrideZustandState: {
          query: {
            collection: {
              nlpRequestId: 'b65c3f7b-91f1-4df3-a61f-13a887a0dbf0'
            }
          }
        }
      })

      expect(SearchFormFeedback).toHaveBeenCalledTimes(1)
      expect(SearchFormFeedback).toHaveBeenCalledWith({}, {})
    })
  })
})
