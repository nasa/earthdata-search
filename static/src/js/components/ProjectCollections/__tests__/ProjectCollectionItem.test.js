import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import Skeleton from '../../Skeleton/Skeleton'
import ProjectCollectionItem from '../ProjectCollectionItem'
import projections from '../../../util/map/projections'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    activePanelSection: '0',
    collectionId: 'collectionId',
    collectionCount: 1,
    collectionMetadata: {
      title: 'Collection Title',
      granule_count: 4
    },
    collectionsQuery: {
      byId: {
        collectionId: {
          excludedGranuleIds: [
            'G10000001-EDSC'
          ]
        }
      },
      pageNum: 1
    },
    color: 'color',
    map: {
      projection: projections.geographic
    },
    index: 0,
    isPanelActive: false,
    onRemoveCollectionFromProject: jest.fn(),
    onToggleCollectionVisibility: jest.fn(),
    onTogglePanels: jest.fn(),
    onSetActivePanel: jest.fn(),
    onSetActivePanelSection: jest.fn(),
    onUpdateFocusedCollection: jest.fn(),
    onViewCollectionDetails: jest.fn(),
    onViewCollectionGranules: jest.fn(),
    projectCollection: {
      accessMethods: {},
      granules: {
        hits: 4,
        isLoading: false,
        isLoaded: true,
        totalSize: {
          size: '4.0',
          unit: 'MB'
        },
        singleGranuleSize: 1
      }
    },
    collectionSearch: {},
    ...overrideProps
  }

  const enzymeWrapper = shallow(<ProjectCollectionItem {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('ProjectCollectionItem component', () => {
  describe('renders itself correctly', () => {
    test('when the title and metadata are loading', () => {
      const { enzymeWrapper } = setup({
        collectionMetadata: {}
      })

      expect(enzymeWrapper.find(Skeleton).length).toEqual(1)
      expect(enzymeWrapper.find('.project-collections-item__more-options-button').length).toEqual(1)
    })

    test('when the metadata is loading', () => {
      const { enzymeWrapper } = setup({
        collectionMetadata: {
          title: 'Collection Title',
          granule_count: 4
        }
      })

      expect(enzymeWrapper.find('h3').text()).toEqual('Collection Title')
      expect(enzymeWrapper.find(Skeleton).length).toEqual(0)
      expect(enzymeWrapper.find('.project-collections-item__more-options-button').length).toEqual(1)
    })

    test('when fully loaded', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find('h3').text()).toEqual('Collection Title')
      expect(enzymeWrapper.find('.project-collections-item__stats-item--granule-count').text()).toEqual('4 Granules')
      expect(enzymeWrapper.find('.project-collections-item__stats-item--total-size').text()).toEqual('Est. Size 4.0 MB')
      expect(enzymeWrapper.find('.project-collections-item__more-options-button').length).toEqual(1)
    })
  })

  describe('clicking onRemoveCollectionFromProject', () => {
    test('removes collection from project and updates the active panel', () => {
      const { enzymeWrapper, props } = setup()

      const button = enzymeWrapper.find('.project-collections-item__more-actions-remove')

      button.simulate('click')
      expect(props.onRemoveCollectionFromProject).toHaveBeenCalledTimes(1)
      expect(props.onRemoveCollectionFromProject).toHaveBeenCalledWith('collectionId')

      expect(props.onSetActivePanel).toHaveBeenCalledTimes(1)
      expect(props.onSetActivePanel).toHaveBeenCalledWith('0.0.0')
    })

    describe('when any collection but the first in the project is removed', () => {
      test('removes collection from project and updates the active panel to be the one listed above the removed collection', () => {
        const { enzymeWrapper, props } = setup({
          index: 2
        })

        const button = enzymeWrapper.find('.project-collections-item__more-actions-remove')

        button.simulate('click')
        expect(props.onRemoveCollectionFromProject).toHaveBeenCalledTimes(1)
        expect(props.onRemoveCollectionFromProject).toHaveBeenCalledWith('collectionId')

        expect(props.onSetActivePanel).toHaveBeenCalledTimes(1)
        expect(props.onSetActivePanel).toHaveBeenCalledWith('0.1.0')
      })
    })

    describe('when the user is looking at a non default panel section and a project is removed', () => {
      describe('if the project only contains one collection', () => {
        test('removes collection from project and updates the active panel, resetting it to 0', () => {
          const { enzymeWrapper, props } = setup({
            activePanelSection: '1'
          })

          const button = enzymeWrapper.find('.project-collections-item__more-actions-remove')

          button.simulate('click')
          expect(props.onRemoveCollectionFromProject).toHaveBeenCalledTimes(1)
          expect(props.onRemoveCollectionFromProject).toHaveBeenCalledWith('collectionId')

          expect(props.onSetActivePanel).toHaveBeenCalledTimes(1)
          expect(props.onSetActivePanel).toHaveBeenCalledWith('0.0.0')
        })
      })

      describe('if the project contains multiple collections', () => {
        test('removes collection from project and updates the active panel ensuring the same panel section is displayed', () => {
          const { enzymeWrapper, props } = setup({
            activePanelSection: '1',
            collectionCount: 2
          })

          const button = enzymeWrapper.find('.project-collections-item__more-actions-remove')

          button.simulate('click')
          expect(props.onRemoveCollectionFromProject).toHaveBeenCalledTimes(1)
          expect(props.onRemoveCollectionFromProject).toHaveBeenCalledWith('collectionId')

          expect(props.onSetActivePanel).toHaveBeenCalledTimes(1)
          expect(props.onSetActivePanel).toHaveBeenCalledWith('1.0.0')
        })
      })
    })
  })

  test('Toggle visibility button calls onToggleCollectionVisibility', () => {
    const { enzymeWrapper, props } = setup()

    const button = enzymeWrapper.find('.project-collections-item__more-actions-vis')

    button.simulate('click', { preventDefault: jest.fn() })
    expect(props.onToggleCollectionVisibility).toHaveBeenCalledTimes(1)
    expect(props.onToggleCollectionVisibility).toHaveBeenCalledWith('collectionId')
  })

  test('View collection details button calls onViewCollectionDetails', () => {
    const { enzymeWrapper, props } = setup()

    const button = enzymeWrapper.find('.project-collections-item__more-actions-collection-details')

    button.simulate('click', { preventDefault: jest.fn() })
    expect(props.onViewCollectionDetails).toHaveBeenCalledTimes(1)
    expect(props.onViewCollectionDetails).toHaveBeenCalledWith('collectionId')
  })

  test('View collection details button calls onViewCollectionGranules', () => {
    const { enzymeWrapper, props } = setup()

    const button = enzymeWrapper.find('.project-collections-item__more-actions-granules')

    button.simulate('click', { preventDefault: jest.fn() })
    expect(props.onViewCollectionGranules).toHaveBeenCalledTimes(1)
    expect(props.onViewCollectionGranules).toHaveBeenCalledWith('collectionId')
  })

  describe('validity icon', () => {
    test('shows invalid by default', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find('.project-collections-item__status--invalid').length).toEqual(1)
    })

    test('removes icon with a valid project collection', () => {
      const { enzymeWrapper } = setup()
      enzymeWrapper.setProps({
        projectCollection: {
          accessMethods: {
            download: {
              isValid: true,
              type: 'download'
            }
          },
          selectedAccessMethod: 'download',
          granules: {
            hits: 4,
            isLoading: false,
            isLoaded: true,
            totalSize: {
              size: '4.0',
              unit: 'MB'
            },
            singleGranuleSize: 1
          }
        }
      })
      expect(enzymeWrapper.find('.project-collections-item__status--invalid').length).toEqual(0)
    })
  })
})
