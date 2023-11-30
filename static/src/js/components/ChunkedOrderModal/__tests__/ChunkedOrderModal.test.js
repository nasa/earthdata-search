import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { Router } from 'react-router'
import { Provider } from 'react-redux'
import { createMemoryHistory } from 'history'

import nock from 'nock'

import ChunkedOrderModal from '../ChunkedOrderModal'

import configureStore from '../../../store/configureStore'

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

const store = configureStore()

function setup(overrideProps = {}) {
  const props = {
    isOpen: true,
    location: {
      search: '?p=C100005-EDSC!C100005-EDSC&pg[1][v]=t'
    },
    projectCollectionsMetadata: {
      'C100005-EDSC': {
        title: 'collection title'
      }
    },
    projectCollectionsRequiringChunking: {
      'C100005-EDSC': {
        granules: {
          hits: 9001
        }
      }
    },
    onSubmitRetrieval: jest.fn(),
    onToggleChunkedOrderModal: jest.fn(),
    ...overrideProps
  }

  const history = createMemoryHistory()

  render(
    <Provider store={store}>
      <Router history={history} location={props.location}>
        <ChunkedOrderModal {...props} />
      </Router>
    </Provider>
  )

  return {
    history,
    onSubmitRetrieval: props.onSubmitRetrieval,
    onToggleChunkedOrderModal: props.onToggleChunkedOrderModal
  }
}

describe('ChunkedOrderModal component', () => {
  test('should render a title', () => {
    setup()

    expect(screen.getByTestId('edsc-modal__title')).toHaveTextContent('Per-order Granule Limit Exceeded')
  })

  test('should render instructions', () => {
    setup()

    expect(screen.getByTestId('chunked_order_message-0')).toHaveTextContent('The collection collection title contains 9,001 granules which exceeds the 2,000 granule limit configured by the provider. When submitted, the order will automatically be split into 5 orders.')
  })

  test('should render instructions when the maxItemsPerOrder is less than 2000', () => {
    setup({
      projectCollectionsRequiringChunking: {
        'C100005-EDSC': {
          accessMethods: {
            echoOrder0: {
              maxItemsPerOrder: 1000
            }
          },
          granules: {
            hits: 9001
          },
          selectedAccessMethod: 'echoOrder0'
        }
      }
    })

    expect(screen.getByTestId('chunked_order_message-0')).toHaveTextContent('The collection collection title contains 9,001 granules which exceeds the 1,000 granule limit configured by the provider. When submitted, the order will automatically be split into 10 orders.')
  })

  test.only('should render a \'Refine your search\' link that keeps the project params intact and removes the focused collection', async () => {
    const user = userEvent.setup()
    const { history } = setup()

    nock(/cmr/)
      .post(/collections/)
      .reply(200, {
        feed: {
          updated: '2019-03-27T20:21:14.705Z',
          id: 'https://cmr.earthdata.nasa.gov:443/search/collections.json?has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Corg.ceos.wgiss.cwic.granules.prod&keyword=&options[temporal][limit_to_granules]=true&page_num=1&page_size=20&sort_key=has_granules_or_cwic',
          title: 'ECHO dataset metadata',
          entry: [{
            mockCollectionData: 'goes here'
          }],
          facets: {}
        }
      }, {
        'cmr-hits': 1
      })
      .post(/granules/)
      .reply(200, {
        feed: {
          entry: [{
            id: 'G10000005-EDSC'
          }]
        }
      })

    nock(/localhost/)
      .post(/saved_access_configs/)
      .reply(200, {})

    nock(/graphql/)
      .post(/api/)
      .reply(200, {
        data: {
          collections: {
            count: 2,
            cursor: 'mock-cursor',
            items: []
          }
        }
      })
      .post(/api/)
      .reply(200, { data: { subscriptions: { items: [] } } })

    await user.click(screen.getByRole('button', { name: 'Refine your search' }))

    expect(history.location.pathname).toEqual('/search')
    expect(decodeURIComponent(history.location.search)).toContain('?p=!C100005-EDSC&pg[1][v]=t')
  })

  describe('modal actions', () => {
    test.only('\'Refine your search\' button should trigger onToggleChunkedOrderModal', async () => {
      const user = userEvent.setup()
      const { onToggleChunkedOrderModal } = setup()

      nock(/cmr/)
        .post(/collections/)
        .reply(200, {
          feed: {
            updated: '2019-03-27T20:21:14.705Z',
            id: 'https://cmr.earthdata.nasa.gov:443/search/collections.json?has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Corg.ceos.wgiss.cwic.granules.prod&keyword=&options[temporal][limit_to_granules]=true&page_num=1&page_size=20&sort_key=has_granules_or_cwic',
            title: 'ECHO dataset metadata',
            entry: [{
              mockCollectionData: 'goes here'
            }],
            facets: {}
          }
        }, {
          'cmr-hits': 1
        })

      nock(/cmr/)
        .post(/granules/)
        .reply(200, {
          feed: {
            entry: [{
              id: 'G10000005-EDSC'
            }]
          }
        })

      nock(/localhost/)
        .post(/saved_access_configs/)
        .reply(200, {})

      nock(/graphql/)
        .post(/api/)
        .reply(200, {
          data: {
            collections: {
              count: 2,
              cursor: 'mock-cursor',
              items: [],
              hasGranules: true
            }
          }
        })

      await user.click(screen.getByRole('button', { name: 'Refine your search' }))

      expect(onToggleChunkedOrderModal).toHaveBeenCalledTimes(1)
      expect(onToggleChunkedOrderModal).toHaveBeenCalledWith(false)
    })

    test('\'Change access methods\' button should trigger onToggleChunkedOrderModal', async () => {
      const user = userEvent.setup()
      const { onToggleChunkedOrderModal } = setup()

      await user.click(screen.getByRole('button', { name: 'Change access methods' }))

      expect(onToggleChunkedOrderModal).toHaveBeenCalledTimes(1)
      expect(onToggleChunkedOrderModal).toHaveBeenCalledWith(false)
    })

    test('\'Continue\' button should trigger onToggleChunkedOrderModal', async () => {
      const user = userEvent.setup()
      const { onSubmitRetrieval, onToggleChunkedOrderModal } = setup()

      await user.click(screen.getByRole('button', { name: 'Continue' }))

      expect(onToggleChunkedOrderModal).toHaveBeenCalledTimes(1)
      expect(onToggleChunkedOrderModal).toHaveBeenCalledWith(false)

      expect(onSubmitRetrieval).toHaveBeenCalledTimes(1)
    })
  })
})
