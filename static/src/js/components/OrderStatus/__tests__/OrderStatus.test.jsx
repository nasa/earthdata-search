import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import { Helmet } from 'react-helmet'

import setupTest from '../../../../../../jestConfigs/setupTest'

import * as config from '../../../../../../sharedUtils/config'
import { retrievalStatus } from './mocks'

import OrderStatus from '../OrderStatus'
import Skeleton from '../../Skeleton/Skeleton'
import OrderStatusList from '../OrderStatusList'

import GET_RETRIEVAL from '../../../operations/queries/getRetrieval'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Preserve other exports
  useParams: jest.fn().mockReturnValue({
    id: '7'
  })
}))

jest.mock('../OrderStatusList', () => jest.fn(() => <div />))
jest.mock('../../Skeleton/Skeleton', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: OrderStatus,
  defaultApolloClientMocks: [{
    request: {
      query: GET_RETRIEVAL,
      variables: {
        obfuscatedId: '7'
      }
    },
    result: {
      data: retrievalStatus
    }
  }],
  defaultProps: {
    onMetricsRelatedCollection: jest.fn(),
    onToggleAboutCSDAModal: jest.fn(),
    onChangePath: jest.fn()
  },
  defaultZustandState: {
    user: {
      edlToken: 'testToken'
    }
  },
  withApolloClient: true,
  withRedux: true,
  withRouter: true
})

beforeEach(() => {
  jest.spyOn(config, 'getEnvironmentConfig').mockImplementation(() => ({ edscHost: 'https://search.earthdata.nasa.gov' }))
})

describe('OrderStatus component', () => {
  describe('when the retrieval is loading', () => {
    test('renders skeletons', () => {
      setup()

      expect(screen.getByText('https://search.earthdata.nasa.gov/downloads/7')).toBeInTheDocument()
      expect(Skeleton).toHaveBeenCalledTimes(2)
      expect(Skeleton).toHaveBeenNthCalledWith(1, {
        className: 'order-status__item-skeleton',
        containerStyle: {
          display: 'inline-block',
          height: '175px',
          width: '100%'
        },
        shapes: [{
          height: 18,
          left: 0,
          radius: 2,
          shape: 'rectangle',
          top: 2,
          width: 200
        }, {
          height: 14,
          left: 0,
          radius: 2,
          shape: 'rectangle',
          top: 31,
          width: '80%'
        }, {
          height: 96,
          left: 0,
          radius: 2,
          shape: 'rectangle',
          top: 60,
          width: '100%'
        }]
      }, {})

      expect(Skeleton).toHaveBeenNthCalledWith(2, {
        className: 'order-status__item-skeleton',
        containerStyle: {
          display: 'inline-block',
          height: '175px',
          width: '100%'
        },
        shapes: [{
          height: 16,
          left: 0,
          radius: 2,
          shape: 'rectangle',
          top: 2,
          width: '60%'
        }, {
          height: 14,
          left: 20,
          radius: 2,
          shape: 'rectangle',
          top: 31,
          width: '50%'
        }, {
          height: 14,
          left: 20,
          radius: 2,
          shape: 'rectangle',
          top: 55,
          width: '57%'
        }]
      }, {})
    })
  })

  describe('when the retrieval has loaded', () => {
    test('renders and OrderStatusList', async () => {
      const { props } = setup()

      expect(await screen.findByText('Download Status')).toBeInTheDocument()

      expect(OrderStatusList).toHaveBeenCalledTimes(1)
      expect(OrderStatusList).toHaveBeenCalledWith({
        onToggleAboutCSDAModal: props.onToggleAboutCSDAModal,
        retrievalCollections: [{
          collectionId: 'TEST_COLLECTION_111',
          collectionMetadata: {
            datasetId: 'Test Dataset ID',
            id: 'TEST_COLLECTION_111',
            relatedCollections: {
              count: 3,
              items: [{
                doi: '1.TEST.DOI',
                id: 'TEST_COLLECTION_1_1',
                relationships: [{ relationshipType: 'relatedUrl' }],
                title: 'Test Title 1_1'
              }, {
                doi: '2.TEST.DOI',
                id: 'TEST_COLLECTION_2_1',
                relationships: [{ relationshipType: 'relatedUrl' }],
                title: 'Test Title 2_1'
              }, {
                doi: '3.TEST.DOI',
                id: 'TEST_COLLECTION_3_1',
                relationships: [{ relationshipType: 'relatedUrl' }],
                title: 'Test Title 3_1'
              }]
            }
          },
          links: [{
            links: [{
              type: 'HOME PAGE',
              url: 'http://linkurl.com/test'
            }],
            title: 'Test Dataset ID'
          }],
          obfuscatedId: '12345'
        }, {
          collectionId: 'TEST_COLLECTION_222',
          collectionMetadata: {
            datasetId: 'Test Dataset ID',
            id: 'TEST_COLLECTION_222',
            relatedCollections: {
              count: 2,
              items: [{
                doi: '1.TEST.DOI',
                id: 'TEST_COLLECTION_1_2',
                relationships: [{ relationshipType: 'relatedUrl' }],
                title: 'Test Title 1_2'
              }, {
                doi: '2.TEST.DOI',
                id: 'TEST_COLLECTION_2_2',
                relationships: [{ relationshipType: 'relatedUrl' }],
                title: 'Test Title 2_2'
              }]
            }
          },
          links: null,
          obfuscatedId: '98765'
        }],
        retrievalId: '7'
      }, {})
    })

    test('renders Additional Resources and Documentation', async () => {
      setup()

      expect(await screen.findByText('Test Dataset ID')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'HOME PAGE' })).toHaveAttribute('href', 'http://linkurl.com/test')
    })

    test('renders related collections', async () => {
      setup()

      expect(await screen.findByText('Test Dataset ID')).toBeInTheDocument()

      // Shows 3 links
      expect(screen.getAllByRole('link', { name: /Test Title/ })).toHaveLength(3)
    })
  })

  test('renders the correct Helmet meta information', async () => {
    setup()

    await waitFor(() => expect(document.title).toEqual('Download Status'))

    const helmet = Helmet.peek()

    const title = helmet.metaTags.find((tag) => tag.name === 'title')
    expect(title).toBeDefined()
    expect(title.content).toBe('Download Status')

    const robots = helmet.metaTags.find((tag) => tag.name === 'robots')
    expect(robots).toBeDefined()
    expect(robots.content).toBe('noindex, nofollow')

    const canonicalLink = helmet.linkTags.find((tag) => tag.rel === 'canonical')
    expect(canonicalLink).toBeDefined()
    expect(canonicalLink.href).toBe('https://search.earthdata.nasa.gov/downloads')
  })

  describe('Order Status page', () => {
    beforeEach(() => {
      jest.spyOn(config, 'getEnvironmentConfig').mockImplementation(() => ({ edscHost: 'http://localhost' }))
      jest.spyOn(config, 'getApplicationConfig').mockImplementation(() => ({
        defaultPortal: 'edsc',
        env: 'prod'
      }))
    })

    test('displays the correct text', () => {
      setup()

      expect(screen.getByText(/This page will automatically update as your orders are processed. The Download Status page can be accessed later by visiting/))
        .toBeInTheDocument()

      expect(screen.getByText('http://localhost/downloads/7')).toBeInTheDocument()
      expect(screen.getByText('Download Status and History')).toBeInTheDocument()
      expect(screen.getByText(/or the.*page./)).toBeInTheDocument()
    })

    test('download status link has correct href', async () => {
      setup()

      const link = await screen.findByRole('link', { name: 'http://localhost/downloads/7' })
      expect(link).toBeInTheDocument()
    })

    test('download status link has correct href when earthdataEnvironment is different than the deployed environment', async () => {
      jest.spyOn(config, 'getApplicationConfig').mockImplementation(() => ({
        defaultPortal: 'edsc',
        env: 'uat'
      }))

      setup()

      const link = await screen.findByRole('link', { name: 'http://localhost/downloads/7?ee=prod' })
      expect(link).toBeInTheDocument()
    })

    test('status link has correct href', async () => {
      setup()

      const link = await screen.findByRole('link', { name: 'Download Status and History' })
      expect(link.href).toEqual('http://localhost/downloads')
    })

    test('status link has correct href when earthdataEnvironment is different than the deployed environment', async () => {
      jest.spyOn(config, 'getApplicationConfig').mockImplementation(() => ({
        defaultPortal: 'edsc',
        env: 'uat'
      }))

      setup()

      const link = await screen.findByRole('link', { name: 'Download Status and History' })
      expect(link.href).toEqual('http://localhost/downloads?ee=prod')
    })
  })

  describe('footer links', () => {
    test('calls onChangePath when the Back to Earthdata Search Results link is clicked', async () => {
      const { props, user } = setup()

      const backToSearchLink = screen.getByRole('link', { name: 'Back to Earthdata Search Results' })
      await user.click(backToSearchLink)

      expect(props.onChangePath).toHaveBeenCalledTimes(1)
      expect(props.onChangePath).toHaveBeenCalledWith('/search?test=source_link')
    })

    test('calls onChangePath when the Start a New Earthdata Search Session link is clicked', async () => {
      const { props, user } = setup()

      const backToSearchLink = screen.getByRole('link', { name: 'Start a New Earthdata Search Session' })
      await user.click(backToSearchLink)

      expect(props.onChangePath).toHaveBeenCalledTimes(1)
      expect(props.onChangePath).toHaveBeenCalledWith('/search')
    })
  })
})
