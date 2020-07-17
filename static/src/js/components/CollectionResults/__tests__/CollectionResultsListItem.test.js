import React from 'react'
import Enzyme, { mount, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import CollectionResultsItem from '../CollectionResultsItem'
import CollectionResultsListItem from '../CollectionResultsListItem'

Enzyme.configure({ adapter: new Adapter() })

const defaultProps = {
  data: {
    collections: [{
      collectionId: 'collectionId1',
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
      isCwic: false,
      isLast: false,
      isNrt: false,
      shortName: 'cId1',
      thumbnail: 'http://some.test.com/thumbnail/url.jpg',
      temporalRange: '2010-10-10 to 2011-10-10',
      versionId: '2'
    }],
    isItemLoaded: jest.fn(() => true),
    loadMoreItems: jest.fn(),
    onAddProjectCollection: jest.fn(),
    onRemoveCollectionFromProject: jest.fn(),
    onViewCollectionDetails: jest.fn(),
    onViewCollectionGranules: jest.fn(),
    portal: {
      features: {
        authentication: true
      }
    },
    setSize: jest.fn(),
    windowWidth: 800
  },
  index: 0,
  style: {
    top: 100,
    position: 'absolute'
  }
}

function setup(mountType, propsOverride) {
  const props = {
    ...defaultProps,
    ...propsOverride
  }

  const enzymeWrapper = mountType(<CollectionResultsListItem {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('CollectionResultsList component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('when a collection is loaded', () => {
    test('renders itself correctly', () => {
      const { enzymeWrapper } = setup(shallow)

      expect(enzymeWrapper.find(CollectionResultsItem).length).toEqual(1)
    })

    test('sets the element size', () => {
      const getBoundingClientRectMock = jest.fn(() => ({ height: 10 }))
      const { enzymeWrapper, props } = setup(mount)

      enzymeWrapper.find('CollectionResultsItem').getElement().ref.current.getBoundingClientRect = getBoundingClientRectMock

      enzymeWrapper.setProps({
        data: {
          ...defaultProps.data,
          windowWidth: 700
        }
      })

      enzymeWrapper.update()

      expect(props.data.setSize).toHaveBeenCalledTimes(1)
      expect(props.data.setSize.mock.calls[0]).toEqual([0, 10])
    })
  })

  describe('when a collection is not loaded', () => {
    test('shows the loading state', () => {
      const { enzymeWrapper } = setup(shallow, {
        data: {
          ...defaultProps.data,
          collections: [],
          isItemLoaded: jest.fn(() => false)
        },
        index: 1
      })

      expect(enzymeWrapper.hasClass('collection-results-list-item--loading')).toEqual(true)
    })
  })
})
