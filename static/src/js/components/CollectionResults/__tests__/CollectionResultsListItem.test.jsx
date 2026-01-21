import React from 'react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import { CollectionResultsItem } from '../CollectionResultsItem'
import CollectionResultsListItem from '../CollectionResultsListItem'
import Skeleton from '../../Skeleton/Skeleton'

vi.mock('../CollectionResultsItem', async () => {
  const { forwardRef } = await vi.importActual('react')

  const Component = vi.fn((_props, ref) => <div ref={ref} />)

  return {
    __esModule: true,
    default: forwardRef(Component),
    CollectionResultsItem: Component // Export the mock function for testing
  }
})

vi.mock('../../Skeleton/Skeleton', () => ({ default: vi.fn(() => <div />) }))

const defaultProps = {
  data: {
    collectionsMetadata: [{
      collectionId: 'collectionId1',
      consortiums: [],
      datasetId: 'Test Collection',
      description: 'This is a short summary.',
      displayOrganization: 'TESTORG',
      granuleCount: 10,
      hasFormats: false,
      hasSpatialSubsetting: false,
      hasTemporalSubsetting: false,
      hasTransforms: false,
      hasVariables: false,
      isCollectionInProject: false,
      isOpenSearch: false,
      isLast: false,
      isNrt: false,
      shortName: 'cId1',
      isDefaultImage: true,
      thumbnail: 'http://some.test.com/thumbnail/url.jpg',
      temporalRange: '2010-10-10 to 2011-10-10',
      versionId: '2'
    }],
    isItemLoaded: vi.fn(() => true),
    loadMoreItems: vi.fn(),
    setSize: vi.fn(),
    windowWidth: 800
  },
  index: 0,
  style: {
    top: 100,
    position: 'absolute'
  }
}

const setup = setupTest({
  Component: CollectionResultsListItem,
  defaultProps
})

describe('CollectionResultsList component', () => {
  describe('when a collection is loaded', () => {
    test('renders a CollectionResultsItem', () => {
      setup()

      expect(CollectionResultsItem).toHaveBeenCalledTimes(1)
      expect(CollectionResultsItem).toHaveBeenCalledWith(
        {
          collectionMetadata: {
            collectionId: 'collectionId1',
            consortiums: [],
            datasetId: 'Test Collection',
            description: 'This is a short summary.',
            displayOrganization: 'TESTORG',
            granuleCount: 10,
            hasFormats: false,
            hasSpatialSubsetting: false,
            hasTemporalSubsetting: false,
            hasTransforms: false,
            hasVariables: false,
            isCollectionInProject: false,
            isOpenSearch: false,
            isLast: false,
            isNrt: false,
            shortName: 'cId1',
            isDefaultImage: true,
            thumbnail: 'http://some.test.com/thumbnail/url.jpg',
            temporalRange: '2010-10-10 to 2011-10-10',
            versionId: '2'
          }
        },
        {
          current: expect.any(Object)
        }
      )
    })

    test('sets the element size', () => {
      const originalBoundingRect = Element.prototype.getBoundingClientRect
      Element.prototype.getBoundingClientRect = vi.fn()
        .mockReturnValue({ height: 10 })
        .mockReturnValueOnce({ height: 10 })

      const { props } = setup({
        overrideProps: {
          data: {
            ...defaultProps.data,
            windowWidth: 700
          }
        }
      })

      // Set size runs once on initial render, and once when the width is updated
      expect(props.data.setSize).toHaveBeenCalledTimes(2)
      expect(props.data.setSize.mock.calls[0]).toEqual([0, 10])
      expect(props.data.setSize.mock.calls[1]).toEqual([0, 10])

      Element.prototype.getBoundingClientRect = originalBoundingRect
    })
  })

  describe('when a collection is not loaded', () => {
    test('shows the loading state', () => {
      setup({
        overrideProps: {
          data: {
            ...defaultProps.data,
            isItemLoaded: vi.fn(() => false)
          },
          index: 1
        }
      })

      expect(Skeleton).toHaveBeenCalledTimes(1)
      expect(Skeleton).toHaveBeenCalledWith(
        {
          containerStyle: {
            height: '140px',
            width: '100%',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: '#dcdee0'
          },
          shapes: expect.any(Array)
        },
        {}
      )
    })
  })
})
