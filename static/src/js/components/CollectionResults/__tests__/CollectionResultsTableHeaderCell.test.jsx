import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import CollectionResultsTableHeaderCell from '../CollectionResultsTableHeaderCell'

const setup = setupTest({
  Component: CollectionResultsTableHeaderCell,
  defaultProps: {
    column: {
      customProps: {
        onMetricsAddCollectionProject: jest.fn()
      }
    },
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
      viewCollectionDetails: jest.fn(),
      viewCollectionGranules: jest.fn()
    },
    portal: {
      features: {
        authentication: true
      }
    },
    project: {
      addProjectCollection: jest.fn(),
      removeProjectCollection: jest.fn()
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

  test('clicking the add to project button calls addProjectCollection and onMetricsAddCollectionProject', async () => {
    const { props, user, zustandState } = setup()

    const addButton = screen.getByRole('button', { name: 'Add collection to the current project' })
    await user.click(addButton)

    expect(zustandState.project.addProjectCollection).toHaveBeenCalledTimes(1)
    expect(zustandState.project.addProjectCollection).toHaveBeenCalledWith('collectionId')

    expect(props.column.customProps.onMetricsAddCollectionProject).toHaveBeenCalledTimes(1)
    expect(props.column.customProps.onMetricsAddCollectionProject).toHaveBeenCalledWith({
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
