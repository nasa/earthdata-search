import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import { RelatedCollection } from '../RelatedCollection'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    onFocusedCollectionChange: jest.fn(),
    onMetricsRelatedCollection: jest.fn(),
    relatedCollection: {
      doi: '1.TEST.DOI',
      id: 'TEST_COLLECTION_1',
      relationships: [
        {
          relationshipType: 'relatedUrl'
        }
      ],
      title: 'Test Title 1'
    },
    location: {
      pathname: '/search/granules/collection-details',
      search: '?p=TEST_COLLECTION_0',
      hash: '',
      key: '1234'
    },
    ...overrideProps
  }
  const enzymeWrapper = shallow(<RelatedCollection {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('Related Collections', () => {
  test('renders the links', () => {
    const { enzymeWrapper } = setup({
      className: 'related-collections-list',
      relatedCollection: {
        doi: '1.TEST.DOI',
        id: 'TEST_COLLECTION_1',
        relationships: [
          {
            relationshipType: 'relatedUrl'
          }
        ],
        title: 'Test Title 1'
      },
      location: {
        pathname: '/search/granules/collection-details',
        search: '?p=TEST_COLLECTION_0',
        hash: '',
        key: '1234'
      }
    })

    expect(enzymeWrapper.find('.related-collections-list')).toBeDefined()
  })

  describe('when clicking a related collection', () => {
    test('navigates to the correct collection', () => {
      const { enzymeWrapper, props } = setup()

      const relatedCollectionLinkProps = enzymeWrapper.props()

      enzymeWrapper.simulate('click')

      expect(props.onFocusedCollectionChange).toHaveBeenCalledTimes(1)
      expect(props.onFocusedCollectionChange).toHaveBeenCalledWith('TEST_COLLECTION_1')
      expect(relatedCollectionLinkProps.to).toEqual({
        pathname: '/search/granules',
        search: '?p=TEST_COLLECTION_1'
      })
    })

    test('fires a metrics event', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.simulate('click')

      expect(props.onMetricsRelatedCollection).toHaveBeenCalledTimes(1)
      expect(props.onMetricsRelatedCollection).toHaveBeenCalledWith({
        type: 'view',
        collectionId: 'TEST_COLLECTION_1'
      })
    })
  })
})
