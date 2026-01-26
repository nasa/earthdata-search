import React from 'react'
import { screen } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import { RelatedCollection } from '../RelatedCollection'
import PortalLinkContainer from '../../../containers/PortalLinkContainer/PortalLinkContainer'
import { metricsRelatedCollection } from '../../../util/metrics/metricsRelatedCollection'

vi.mock('../../../util/metrics/metricsRelatedCollection', () => ({
  metricsRelatedCollection: vi.fn()
}))

vi.mock('../../../containers/PortalLinkContainer/PortalLinkContainer', () => ({
  // eslint-disable-next-line react/jsx-props-no-spreading
  default: vi.fn((props) => <div {...props} />)
}))

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')), // Preserve other exports
  useLocation: vi.fn().mockReturnValue({
    pathname: '/search/granules/collection-details',
    search: '?p=TEST_COLLECTION_0',
    hash: '',
    state: null,
    key: '1234'
  })
}))

const setup = setupTest({
  Component: RelatedCollection,
  defaultProps: {
    relatedCollection: {
      doi: '1.TEST.DOI',
      id: 'TEST_COLLECTION_1',
      relationships: [
        {
          relationshipType: 'relatedUrl'
        }
      ],
      title: 'Test Title 1'
    }
  },
  defaultZustandState: {
    collection: {
      setCollectionId: vi.fn()
    }
  }
})

describe('Related Collections', () => {
  test('renders the links', () => {
    setup()

    expect(PortalLinkContainer).toHaveBeenCalledTimes(1)
    expect(PortalLinkContainer).toHaveBeenCalledWith({
      children: 'Test Title 1',
      className: '',
      onClick: expect.any(Function),
      to: {
        pathname: '/search/granules',
        search: '?p=TEST_COLLECTION_1'
      },
      type: 'link'
    }, {})
  })

  describe('when clicking a related collection', () => {
    test('calls metricsRelatedCollection and setCollectionId', async () => {
      const { user, zustandState } = setup()

      const button = screen.getByText('Test Title 1')
      await user.click(button)

      expect(metricsRelatedCollection).toHaveBeenCalledTimes(1)
      expect(metricsRelatedCollection).toHaveBeenCalledWith({
        type: 'view',
        collectionId: 'TEST_COLLECTION_1'
      })

      expect(zustandState.collection.setCollectionId).toHaveBeenCalledTimes(1)
      expect(zustandState.collection.setCollectionId).toHaveBeenCalledWith('TEST_COLLECTION_1')
    })
  })
})
