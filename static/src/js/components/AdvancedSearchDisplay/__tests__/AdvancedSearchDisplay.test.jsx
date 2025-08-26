import { act, screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import AdvancedSearchDisplay from '../AdvancedSearchDisplay'

const setup = setupTest({
  Component: AdvancedSearchDisplay,
  defaultZustandState: {
    query: {
      changeQuery: jest.fn()
    }
  }
})

describe('AdvancedSearchDisplay component', () => {
  describe('with no active advancedSearch filters', () => {
    test('should render self without display', () => {
      setup()

      expect(screen.queryByText('Advanced Search')).not.toBeInTheDocument()
    })
  })

  describe('with active advancedSearch filters', () => {
    test('should display the filter stack item', () => {
      setup({
        overrideZustandState: {
          query: {
            selectedRegion: {
              test: 'test'
            }
          }
        }
      })

      expect(screen.getByText('Advanced Search')).toBeInTheDocument()
      expect(screen.getByText('(1 applied)')).toBeInTheDocument()
    })
  })

  describe('FilterStackItem', () => {
    describe('onRemove', () => {
      test('calls the callbacks to update the advanced search and query states', async () => {
        const { user, zustandState } = setup({
          overrideZustandState: {
            query: {
              selectedRegion: {
                test: 'test'
              }
            }
          }
        })

        const button = screen.getByRole('button', { name: 'Remove advanced search filter' })
        await act(async () => {
          await user.click(button)
        })

        expect(zustandState.query.changeQuery).toHaveBeenCalledTimes(1)
        expect(zustandState.query.changeQuery).toHaveBeenCalledWith({
          collection: {
            spatial: {}
          },
          selectedRegion: {}
        })
      })
    })
  })
})
