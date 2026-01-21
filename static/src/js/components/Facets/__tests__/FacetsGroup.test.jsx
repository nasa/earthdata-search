import React from 'react'
import { act, screen } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import FacetsGroup from '../FacetsGroup'
import FacetsList from '../FacetsList'
import useEdscStore from '../../../zustand/useEdscStore'

vi.mock('../FacetsList', () => ({ default: vi.fn(() => <div />) }))

const setup = setupTest({
  Component: FacetsGroup,
  defaultProps: {
    facet: {
      applied: false,
      autocompleteType: 'project',
      title: 'Projects',
      children: [{}],
      totalSelected: 0,
      changeHandler: vi.fn()
    },
    facetCategory: 'projects'
  },
  defaultZustandState: {
    facetParams: {
      triggerViewAllFacets: vi.fn()
    }
  }
})

describe('FacetsGroup component', () => {
  describe('renders correctly', () => {
    test('does not render the children by default', () => {
      setup()

      expect(FacetsList).toHaveBeenCalledTimes(0)
    })
  })

  describe('when the group is clicked', () => {
    test('when rendering valid facets', async () => {
      const { user } = setup()

      const button = screen.getByRole('button', { name: 'Projects Open' })
      await user.click(button)

      expect(FacetsList).toHaveBeenCalledTimes(1)
      expect(FacetsList).toHaveBeenCalledWith({
        autocompleteType: 'project',
        changeHandler: expect.any(Function),
        facetCategory: 'projects',
        facets: [{}],
        liftSelectedFacets: undefined
      }, {})
    })
  })

  describe('when there are selected facets', () => {
    test('displays the number of selected facets', () => {
      setup({
        overrideProps: {
          facet: {
            applied: true,
            children: new Array(10),
            totalSelected: 9,
            changeHandler: vi.fn()
          }
        }
      })

      expect(screen.getByText('9 Selected')).toBeInTheDocument()
    })
  })

  describe('when there are more than 50 items', () => {
    test('displays a view all facets link', () => {
      setup({
        overrideProps: {
          facet: {
            applied: true,
            children: new Array(51),
            totalSelected: 0,
            changeHandler: vi.fn()
          }
        }
      })

      expect(screen.getByText('View All')).toBeInTheDocument()
      expect(screen.getByText('Showing Top 50')).toBeInTheDocument()
    })
  })

  describe('when clicking the view all facets link', () => {
    test('fires the action to open the modal', async () => {
      const { user } = setup({
        overrideProps: {
          facet: {
            applied: true,
            children: new Array(51),
            totalSelected: 0,
            changeHandler: vi.fn()
          }
        }
      })

      const button = screen.getByRole('button', { name: 'View All' })
      await user.click(button)

      const { triggerViewAllFacets } = useEdscStore.getState().facetParams
      expect(triggerViewAllFacets).toHaveBeenCalledTimes(1)
      expect(triggerViewAllFacets).toHaveBeenCalledWith(undefined)
    })
  })

  describe('when the group is open', () => {
    test('when rendering valid facets', async () => {
      setup()

      expect(FacetsList).toHaveBeenCalledTimes(0)

      vi.clearAllMocks()

      const zustandState = useEdscStore.getState()
      const { home } = zustandState
      const { setOpenFacetGroup } = home

      await act(() => {
        setOpenFacetGroup('project')
      })

      expect(FacetsList).toHaveBeenCalledTimes(1)
      expect(FacetsList).toHaveBeenCalledWith({
        autocompleteType: 'project',
        changeHandler: expect.any(Function),
        facetCategory: 'projects',
        facets: [{}],
        liftSelectedFacets: undefined
      }, {})
    })
  })
})
