import React from 'react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import ProjectCollectionsList from '../ProjectCollectionsList'
import ProjectCollectionItem from '../ProjectCollectionItem'

vi.mock('../ProjectCollectionItem', () => ({ default: vi.fn(() => <div />) }))

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')), // Preserve other exports
  useLocation: vi.fn().mockReturnValue({
    pathname: '/projects',
    search: '?p=!C1205428742-ASF&pg[1][v]=t&pg[1][m]=download&pg[1][cd]=f&tl=1574502188.065!5!!',
    hash: '',
    state: null,
    key: 'testKey'
  })
}))

const setup = setupTest({
  Component: ProjectCollectionsList,
  defaultProps: {
    collectionsMetadata: {
      collectionId1: {
        mock: 'data 1'
      },
      collectionId2: {
        mock: 'data 2'
      }
    },
    onSetActivePanel: vi.fn(),
    onSetActivePanelSection: vi.fn(),
    onTogglePanels: vi.fn(),
    panels: {
      activePanel: '0.0.0',
      isOpen: true
    }
  },
  defaultZustandState: {
    project: {
      collections: {
        allIds: ['collectionId1', 'collectionId2'],
        byId: {
          collectionId1: {
            isValid: false
          },
          collectionId2: {
            isValid: false
          }
        }
      }
    }
  },
  withRouter: true
})

describe('ProjectCollectionsList component', () => {
  test('renders itself correctly', () => {
    setup()

    expect(ProjectCollectionItem).toHaveBeenCalledTimes(2)
    expect(ProjectCollectionItem).toHaveBeenNthCalledWith(1, {
      activePanelSection: '0',
      collectionCount: 2,
      collectionId: 'collectionId1',
      collectionMetadata: { mock: 'data 1' },
      color: 'rgb(46, 204, 113, 1)',
      index: 0,
      isPanelActive: true,
      onSetActivePanel: expect.any(Function),
      onSetActivePanelSection: expect.any(Function),
      onTogglePanels: expect.any(Function),
      projectCollection: { isValid: false }
    }, {})

    expect(ProjectCollectionItem).toHaveBeenNthCalledWith(2, {
      activePanelSection: '0',
      collectionCount: 2,
      collectionId: 'collectionId2',
      collectionMetadata: { mock: 'data 2' },
      color: 'rgb(52, 152, 219, 1)',
      index: 1,
      isPanelActive: false,
      onSetActivePanel: expect.any(Function),
      onSetActivePanelSection: expect.any(Function),
      onTogglePanels: expect.any(Function),
      projectCollection: { isValid: false }
    }, {})
  })
})
