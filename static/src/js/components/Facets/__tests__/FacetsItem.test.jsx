import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'
import FacetsItem from '../FacetsItem'

const setup = setupTest({
  Component: FacetsItem,
  defaultProps: {
    changeHandler: jest.fn(),
    facet: {
      applied: false,
      applyingFacet: null,
      children: [],
      count: 10,
      setApplyingFacet: jest.fn(),
      title: 'Test Facet'
    },
    facetCategory: 'test_category',
    level: 0,
    uid: 'facet-item_test'
  },
  defaultZustandState: {
    collections: {
      collections: {
        isLoading: true
      }
    }
  }
})

describe('FacetsItem', () => {
  describe('when the collections are loading', () => {
    describe('when the facet is not being applied', () => {
      test('renders a disabled checkbox', () => {
        setup()

        const checkbox = screen.getByRole('checkbox', { name: 'Test Facet' })
        expect(checkbox).toBeDisabled()
      })
    })

    describe('when the facet is being applied', () => {
      test('renders a checked disabled checkbox', () => {
        setup({
          overrideProps: {
            facet: {
              applied: false,
              applyingFacet: 'Test Facet',
              children: [],
              count: 10,
              setApplyingFacet: jest.fn(),
              title: 'Test Facet'
            }
          }
        })

        const checkbox = screen.queryByRole('checkbox', { name: 'Test Facet' })
        expect(checkbox).toBeDisabled()
        expect(checkbox).toBeChecked()
      })
    })
  })

  describe('when the collections are not loading', () => {
    test('renders an enabled checkbox', () => {
      setup({
        overrideZustandState: {
          collections: {
            collections: {
              isLoading: false
            }
          }
        }
      })

      const checkbox = screen.getByRole('checkbox', { name: 'Test Facet' })
      expect(checkbox).toBeEnabled()
    })
  })

  describe('when clicking on the checkbox', () => {
    test('calls the change handler and setApplyingFacet', async () => {
      const { props, user } = setup({
        overrideZustandState: {
          collections: {
            collections: {
              isLoading: false
            }
          }
        }
      })

      const checkbox = screen.getByRole('checkbox', { name: 'Test Facet' })
      await user.click(checkbox)

      expect(props.changeHandler).toHaveBeenCalledTimes(1)
      expect(props.changeHandler).toHaveBeenCalledWith(expect.objectContaining({
        type: 'change'
      }), {
        destination: null,
        title: 'Test Facet',
        value: undefined
      }, {
        level: 0,
        type: null,
        value: 'Test Facet'
      }, true)

      expect(props.facet.setApplyingFacet).toHaveBeenCalledTimes(1)
      expect(props.facet.setApplyingFacet).toHaveBeenCalledWith('Test Facet')
    })
  })
})
