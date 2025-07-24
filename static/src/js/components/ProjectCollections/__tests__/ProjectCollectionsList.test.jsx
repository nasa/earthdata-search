import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import { ProjectCollectionsList } from '../ProjectCollectionsList'
import ProjectCollectionItem from '../ProjectCollectionItem'

jest.mock('../ProjectCollectionItem', () => jest.fn(() => <div />))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Preserve other exports
  useLocation: jest.fn().mockReturnValue({
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
    collectionsQuery: {},
    onSetActivePanel: jest.fn(),
    onSetActivePanelSection: jest.fn(),
    onTogglePanels: jest.fn(),
    onUpdateFocusedCollection: jest.fn(),
    onViewCollectionDetails: jest.fn(),
    onViewCollectionGranules: jest.fn(),
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
  }
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
      collectionsQuery: {},
      color: 'rgb(46, 204, 113, 1)',
      index: 0,
      isPanelActive: true,
      onSetActivePanel: expect.any(Function),
      onSetActivePanelSection: expect.any(Function),
      onTogglePanels: expect.any(Function),
      onUpdateFocusedCollection: expect.any(Function),
      onViewCollectionDetails: expect.any(Function),
      onViewCollectionGranules: expect.any(Function),
      projectCollection: { isValid: false }
    }, {})

    expect(ProjectCollectionItem).toHaveBeenNthCalledWith(2, {
      activePanelSection: '0',
      collectionCount: 2,
      collectionId: 'collectionId2',
      collectionMetadata: { mock: 'data 2' },
      collectionsQuery: {},
      color: 'rgb(52, 152, 219, 1)',
      index: 1,
      isPanelActive: false,
      onSetActivePanel: expect.any(Function),
      onSetActivePanelSection: expect.any(Function),
      onTogglePanels: expect.any(Function),
      onUpdateFocusedCollection: expect.any(Function),
      onViewCollectionDetails: expect.any(Function),
      onViewCollectionGranules: expect.any(Function),
      projectCollection: { isValid: false }
    }, {})
  })
})
