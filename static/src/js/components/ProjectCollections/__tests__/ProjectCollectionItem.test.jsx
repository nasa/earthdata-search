import React from 'react'
import { screen } from '@testing-library/react'

import { AlertMediumPriority } from '@edsc/earthdata-react-icons/horizon-design-system/earthdata/ui'
import setupTest from '../../../../../../jestConfigs/setupTest'

import Skeleton from '../../Skeleton/Skeleton'
import ProjectCollectionItem from '../ProjectCollectionItem'
import projectionCodes from '../../../constants/projectionCodes'
import EDSCIcon from '../../EDSCIcon/EDSCIcon'

jest.mock('../../Skeleton/Skeleton', () => jest.fn(() => <div />))
jest.mock('../../EDSCIcon/EDSCIcon', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: ProjectCollectionItem,
  defaultProps: {
    activePanelSection: '0',
    collectionCount: 1,
    collectionId: 'collectionId',
    collectionMetadata: {
      granule_count: 4,
      title: 'Collection Title'
    },
    color: 'color',
    index: 0,
    isPanelActive: false,
    onSetActivePanel: jest.fn(),
    onSetActivePanelSection: jest.fn(),
    onTogglePanels: jest.fn(),
    projectCollection: {
      granules: {
        count: 4,
        isLoading: false,
        isLoaded: true,
        totalSize: {
          size: '4.0',
          unit: 'MB'
        },
        singleGranuleSize: 1
      },
      isVisible: true
    }
  },
  defaultZustandState: {
    collection: {
      setCollectionId: jest.fn(),
      viewCollectionDetails: jest.fn(),
      viewCollectionGranules: jest.fn()
    },
    project: {
      removeProjectCollection: jest.fn(),
      toggleCollectionVisibility: jest.fn()
    },
    query: {
      collection: {
        byId: {
          collectionId: {
            excludedGranuleIds: ['G10000001-EDSC']
          }
        },
        pageNum: 1
      }
    },
    map: {
      mapView: {
        projection: projectionCodes.geographic
      }
    }
  }
})

describe('ProjectCollectionItem component', () => {
  describe('renders itself correctly', () => {
    test('when the title and metadata are loading', () => {
      setup({
        overrideProps: {
          collectionMetadata: {},
          projectCollection: {
            granules: {
              isLoading: true
            }
          }
        }
      })

      expect(Skeleton).toHaveBeenCalledTimes(2)
      expect(Skeleton).toHaveBeenNthCalledWith(1, {
        containerStyle: {
          height: '40px',
          width: '100%'
        },
        shapes: [{
          height: 12,
          left: 2,
          radius: 2,
          shape: 'rectangle',
          top: 2,
          width: '80%'
        }, {
          height: 12,
          left: 2,
          radius: 2,
          shape: 'rectangle',
          top: 21,
          width: '40%'
        }]
      }, {})

      expect(Skeleton).toHaveBeenNthCalledWith(2, {
        containerStyle: {
          height: '40px',
          width: '100%'
        },
        shapes: [{
          height: 12,
          left: 2,
          radius: 2,
          shape: 'rectangle',
          top: 4,
          width: 75
        }, {
          height: 12,
          left: 97,
          radius: 2,
          shape: 'rectangle',
          top: 4,
          width: 50
        }, {
          height: 12,
          radius: 2,
          right: 0,
          shape: 'rectangle',
          top: 27,
          width: 105
        }]
      }, {})

      expect(screen.queryByRole('button', { name: 'Edit options' })).not.toBeInTheDocument()
    })

    test('when the metadata is loading', () => {
      setup({
        overrideProps: {
          collectionMetadata: {
            title: 'Collection Title',
            granule_count: 4
          },
          projectCollection: {
            granules: {
              isLoading: true
            }
          }
        }
      })

      expect(Skeleton).toHaveBeenCalledTimes(1)
      expect(Skeleton).toHaveBeenCalledWith({
        containerStyle: {
          height: '40px',
          width: '100%'
        },
        shapes: [{
          height: 12,
          left: 2,
          radius: 2,
          shape: 'rectangle',
          top: 4,
          width: 75
        }, {
          height: 12,
          left: 97,
          radius: 2,
          shape: 'rectangle',
          top: 4,
          width: 50
        }, {
          height: 12,
          radius: 2,
          right: 0,
          shape: 'rectangle',
          top: 27,
          width: 105
        }]
      }, {})

      expect(screen.getByRole('heading', { name: 'Collection Title' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Edit options' })).not.toBeInTheDocument()
    })

    test('when fully loaded', () => {
      setup()

      expect(screen.getByRole('heading', { name: 'Collection Title' })).toBeInTheDocument()
      expect(screen.getByText('4 Granules')).toBeInTheDocument()
      expect(screen.getByText('Est. Size 4.0 MB')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Edit options' })).toBeInTheDocument()
    })
  })

  describe('when clicking Remove', () => {
    test('removes collection from project and updates the active panel', async () => {
      const { props, user, zustandState } = setup()

      const moreActionsButton = screen.getByRole('button', { name: 'More actions' })
      await user.click(moreActionsButton)

      const button = screen.getByRole('button', { name: 'Remove' })
      await user.click(button)

      expect(zustandState.project.removeProjectCollection).toHaveBeenCalledTimes(1)
      expect(zustandState.project.removeProjectCollection).toHaveBeenCalledWith('collectionId')

      expect(props.onSetActivePanel).toHaveBeenCalledTimes(1)
      expect(props.onSetActivePanel).toHaveBeenCalledWith('0.0.0')
    })

    describe('when any collection but the first in the project is removed', () => {
      test('removes collection from project and updates the active panel to be the one listed above the removed collection', async () => {
        const { props, user, zustandState } = setup({
          overrideProps: {
            index: 2
          }
        })

        const moreActionsButton = screen.getByRole('button', { name: 'More actions' })
        await user.click(moreActionsButton)

        const button = screen.getByRole('button', { name: 'Remove' })
        await user.click(button)

        expect(zustandState.project.removeProjectCollection).toHaveBeenCalledTimes(1)
        expect(zustandState.project.removeProjectCollection).toHaveBeenCalledWith('collectionId')

        expect(props.onSetActivePanel).toHaveBeenCalledTimes(1)
        expect(props.onSetActivePanel).toHaveBeenCalledWith('0.1.0')
      })
    })

    describe('when the user is looking at a non default panel section and a project is removed', () => {
      describe('if the project only contains one collection', () => {
        test('removes collection from project and updates the active panel, resetting it to 0', async () => {
          const { props, user, zustandState } = setup({
            overrideProps: {
              activePanelSection: '1'
            }
          })

          const moreActionsButton = screen.getByRole('button', { name: 'More actions' })
          await user.click(moreActionsButton)

          const button = screen.getByRole('button', { name: 'Remove' })
          await user.click(button)

          expect(zustandState.project.removeProjectCollection).toHaveBeenCalledTimes(1)
          expect(zustandState.project.removeProjectCollection).toHaveBeenCalledWith('collectionId')

          expect(props.onSetActivePanel).toHaveBeenCalledTimes(1)
          expect(props.onSetActivePanel).toHaveBeenCalledWith('0.0.0')
        })
      })

      describe('if the project contains multiple collections', () => {
        test('removes collection from project and updates the active panel ensuring the same panel section is displayed', async () => {
          const { props, user, zustandState } = setup({
            overrideProps: {
              activePanelSection: '1',
              collectionCount: 2
            }
          })

          const moreActionsButton = screen.getByRole('button', { name: 'More actions' })
          await user.click(moreActionsButton)

          const button = screen.getByRole('button', { name: 'Remove' })
          await user.click(button)

          expect(zustandState.project.removeProjectCollection).toHaveBeenCalledTimes(1)
          expect(zustandState.project.removeProjectCollection).toHaveBeenCalledWith('collectionId')

          expect(props.onSetActivePanel).toHaveBeenCalledTimes(1)
          expect(props.onSetActivePanel).toHaveBeenCalledWith('1.0.0')
        })
      })
    })
  })

  describe('when clicking Toggle Visibility', () => {
    test('calls toggleCollectionVisibility', async () => {
      const { user, zustandState } = setup()

      const moreActionsButton = screen.getByRole('button', { name: 'More actions' })
      await user.click(moreActionsButton)

      const button = screen.getByRole('button', { name: 'Toggle Visibility' })
      await user.click(button)

      expect(zustandState.project.toggleCollectionVisibility).toHaveBeenCalledTimes(1)
      expect(zustandState.project.toggleCollectionVisibility).toHaveBeenCalledWith('collectionId')
    })
  })

  describe('when clicking Collection Details', () => {
    test('calls viewCollectionDetails', async () => {
      const { user, zustandState } = setup()

      const moreActionsButton = screen.getByRole('button', { name: 'More actions' })
      await user.click(moreActionsButton)

      const button = screen.getByRole('button', { name: 'Collection Details' })
      await user.click(button)

      expect(zustandState.collection.viewCollectionDetails).toHaveBeenCalledTimes(1)
      expect(zustandState.collection.viewCollectionDetails).toHaveBeenCalledWith('collectionId')
    })
  })

  describe('when clicking View Granules', () => {
    test('calls viewCollectionGranules', async () => {
      const { user, zustandState } = setup()

      const moreActionsButton = screen.getByRole('button', { name: 'More actions' })
      await user.click(moreActionsButton)

      const button = screen.getByRole('button', { name: 'View Granules' })
      await user.click(button)

      expect(zustandState.collection.viewCollectionGranules).toHaveBeenCalledTimes(1)
      expect(zustandState.collection.viewCollectionGranules).toHaveBeenCalledWith('collectionId')
    })
  })

  describe('when clicking Edit options', () => {
    test('calls onSetActivePanelSection and setCollectionId and onTogglePanels', async () => {
      const { props, user, zustandState } = setup()

      const button = screen.getByRole('button', { name: 'Edit options' })
      await user.click(button)

      expect(props.onSetActivePanelSection).toHaveBeenCalledTimes(1)
      expect(props.onSetActivePanelSection).toHaveBeenCalledWith('0')

      expect(zustandState.collection.setCollectionId).toHaveBeenCalledTimes(1)
      expect(zustandState.collection.setCollectionId).toHaveBeenCalledWith('collectionId')

      expect(props.onTogglePanels).toHaveBeenCalledTimes(1)
      expect(props.onTogglePanels).toHaveBeenCalledWith(true)
    })
  })

  describe('when clicking the collection title', () => {
    test('calls onTogglePanels setCollectionId and onSetActivePanelSection', async () => {
      const { props, user, zustandState } = setup()

      const title = screen.getByRole('heading', { name: 'Collection Title' })
      await user.click(title)

      expect(props.onTogglePanels).toHaveBeenCalledTimes(1)
      expect(props.onTogglePanels).toHaveBeenCalledWith(true)

      expect(zustandState.collection.setCollectionId).toHaveBeenCalledTimes(1)
      expect(zustandState.collection.setCollectionId).toHaveBeenCalledWith('collectionId')

      expect(props.onSetActivePanelSection).toHaveBeenCalledTimes(1)
      expect(props.onSetActivePanelSection).toHaveBeenCalledWith('1')
    })
  })

  describe('validity icon', () => {
    test('shows invalid by default', () => {
      setup()

      expect(EDSCIcon).toHaveBeenCalledTimes(4)
      expect(EDSCIcon).toHaveBeenNthCalledWith(2, {
        className: 'project-collections-item__status project-collections-item__status--invalid',
        icon: AlertMediumPriority
      }, {})
    })

    test('removes icon with a valid project collection', () => {
      setup({
        overrideProps: {
          projectCollection: {
            accessMethods: {
              download: {
                isValid: true,
                type: 'download'
              }
            },
            selectedAccessMethod: 'download',
            granules: {
              count: 4,
              isLoading: false,
              isLoaded: true,
              totalSize: {
                size: '4.0',
                unit: 'MB'
              },
              singleGranuleSize: 1
            }
          }
        }
      })

      expect(EDSCIcon).not.toHaveBeenCalledWith({
        className: 'project-collections-item__status project-collections-item__status--invalid',
        icon: AlertMediumPriority
      }, {})
    })
  })
})
