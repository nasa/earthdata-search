import { screen } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import CollectionResultsTableHeaderCell from '../CollectionResultsTableHeaderCell'
import { metricsAddCollectionToProject } from '../../../util/metrics/metricsAddCollectionToProject'

vi.mock('../../../util/metrics/metricsAddCollectionToProject', () => ({
  metricsAddCollectionToProject: vi.fn()
}))

const setup = setupTest({
  Component: CollectionResultsTableHeaderCell,
  defaultProps: {
    cell: {
      value: 'test value'
    },
    row: {
      original: {
        collectionId: 'collectionId',
        isCollectionInProject: false
      }
    }
  },
  defaultZustandState: {
    collection: {
      viewCollectionDetails: vi.fn(),
      viewCollectionGranules: vi.fn()
    },
    portal: {
      features: {
        authentication: true
      }
    },
    project: {
      addProjectCollection: vi.fn(),
      removeProjectCollection: vi.fn()
    }
  }
})

describe('CollectionResultsTableHeaderCell component', () => {
  test('clicking the title button calls viewCollectionGranules', async () => {
    const { user, zustandState } = setup()

    const titleButton = screen.getByRole('button', { name: 'test value' })
    await user.click(titleButton)

    expect(zustandState.collection.viewCollectionGranules).toHaveBeenCalledTimes(1)
    expect(zustandState.collection.viewCollectionGranules).toHaveBeenCalledWith('collectionId')
  })

  test('clicking the details button calls viewCollectionDetails', async () => {
    const { user, zustandState } = setup()

    const detailsButton = screen.getByRole('button', { name: 'View collection details' })
    await user.click(detailsButton)

    expect(zustandState.collection.viewCollectionDetails).toHaveBeenCalledTimes(1)
    expect(zustandState.collection.viewCollectionDetails).toHaveBeenCalledWith('collectionId')
  })

  test('clicking the add to project button calls addProjectCollection and metricsAddCollectionToProject', async () => {
    const { user, zustandState } = setup()

    const addButton = screen.getByRole('button', { name: 'Add collection to the current project' })
    await user.click(addButton)

    expect(zustandState.project.addProjectCollection).toHaveBeenCalledTimes(1)
    expect(zustandState.project.addProjectCollection).toHaveBeenCalledWith('collectionId')

    expect(metricsAddCollectionToProject).toHaveBeenCalledTimes(1)
    expect(metricsAddCollectionToProject).toHaveBeenCalledWith({
      collectionConceptId: 'collectionId',
      page: 'collections',
      view: 'table'
    })
  })

  test('clicking the remove from project button calls removeProjectCollection', async () => {
    const { user, zustandState } = setup({
      overrideProps: {
        row: {
          original: {
            collectionId: 'collectionId',
            isCollectionInProject: true
          }
        }
      }
    })

    const removeButton = screen.getByRole('button', { name: 'Remove collection from the current project' })
    await user.click(removeButton)

    expect(zustandState.project.removeProjectCollection).toHaveBeenCalledTimes(1)
    expect(zustandState.project.removeProjectCollection).toHaveBeenCalledWith('collectionId')
  })
})
