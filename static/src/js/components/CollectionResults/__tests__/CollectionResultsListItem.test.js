import React from 'react'
import { Provider } from 'react-redux'
import Enzyme, { mount, shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import CollectionResultsItem from '../CollectionResultsItem'
import CollectionResultsListItem from '../CollectionResultsListItem'
import configureStore from '../../../store/configureStore'

Enzyme.configure({ adapter: new Adapter() })

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
    setSize: jest.fn(),
    windowWidth: 800
  },
  index: 0,
  style: {
    top: 100,
    position: 'absolute'
  }
}

const store = configureStore()

function setup(mountType, propsOverride) {
  const props = {
    ...defaultProps,
    ...propsOverride
  }

  let enzymeWrapper

  if (mountType === shallow) {
    enzymeWrapper = shallow(<CollectionResultsListItem {...props} />)
  } else {
    enzymeWrapper = mount(
      <Provider store={store}>
        <CollectionResultsListItem {...props} />
      </Provider>
    )
  }

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
      const originalBoundingRect = Element.prototype.getBoundingClientRect
      Element.prototype.getBoundingClientRect = jest.fn()
        .mockReturnValue({ height: 10 })
        .mockReturnValueOnce({ height: 10 })

      const { enzymeWrapper, props } = setup(mount)

      enzymeWrapper.setProps({
        data: {
          ...defaultProps.data,
          windowWidth: 700
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
      const { enzymeWrapper } = setup(shallow, {
        data: {
          ...defaultProps.data,
          collectionsMetadata: [],
          isItemLoaded: jest.fn(() => false)
        },
        index: 1
      })

      expect(enzymeWrapper.hasClass('collection-results-list-item--loading')).toEqual(true)
    })
  })
})
