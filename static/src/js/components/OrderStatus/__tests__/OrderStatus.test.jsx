import {
  screen,
  waitFor,
  within
} from '@testing-library/react'
import React from 'react'
import { Helmet } from 'react-helmet'

import setupTest from '../../../../../../jestConfigs/setupTest'

import { initalizedRetrievalStatusProps, retrievalStatusProps } from './mocks'
import { OrderStatus } from '../OrderStatus'
import Skeleton from '../../Skeleton/Skeleton'
import * as config from '../../../../../../sharedUtils/config'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Preserve other exports
  useParams: jest.fn().mockReturnValue({
    id: '7'
  })
}))

jest.mock('../../Skeleton/Skeleton', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: OrderStatus,
  defaultProps: retrievalStatusProps,
  defaultZustandState: {
    user: {
      edlToken: 'testToken'
    }
  },
  withRedux: true,
  withRouter: true
})

beforeEach(() => {
  jest.spyOn(config, 'getEnvironmentConfig').mockImplementation(() => ({ edscHost: 'https://search.earthdata.nasa.gov' }))
})

describe('OrderStatus component', () => {
  test('renders itself correclty upon page load', () => {
    setup({
      overrideProps: initalizedRetrievalStatusProps
    })

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

  test('renders itself correctly after initial page load', () => {
    setup()

    expect(screen.getByText('Download Status')).toBeInTheDocument()
    expect(Skeleton).toHaveBeenCalledTimes(0)
  })

  test('renders the correct Helmet meta information', async () => {
    setup()

    await waitFor(() => expect(document.title).toEqual('Download Status'))

    expect(Skeleton).toHaveBeenCalledTimes(0)

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

  test('calls onFetchRetrieval when mounted', () => {
    const { props } = setup()

    expect(props.onFetchRetrieval).toHaveBeenCalledTimes(1)
    expect(props.onFetchRetrieval).toHaveBeenCalledWith('7', 'testToken')
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

    test('download status link has correct href', () => {
      setup()

      const link = screen.getByRole('link', { name: 'http://localhost/downloads/7' })
      expect(link).toBeInTheDocument()
      expect(Skeleton).toHaveBeenCalledTimes(0)
    })

    test('download status link has correct href when earthdataEnvironment is different than the deployed environment', () => {
      jest.spyOn(config, 'getApplicationConfig').mockImplementation(() => ({
        defaultPortal: 'edsc',
        env: 'uat'
      }))

      setup()

      const link = screen.getByRole('link', { name: 'http://localhost/downloads/7?ee=prod' })
      expect(link).toBeInTheDocument()
      expect(Skeleton).toHaveBeenCalledTimes(0)
    })

    test('status link has correct href', () => {
      setup()

      const link = screen.getByRole('link', { name: 'Download Status and History' })
      expect(link.href).toEqual('http://localhost/downloads')
      expect(Skeleton).toHaveBeenCalledTimes(0)
    })

    test('status link has correct href when earthdataEnvironment is different than the deployed environment', () => {
      jest.spyOn(config, 'getApplicationConfig').mockImplementation(() => ({
        defaultPortal: 'edsc',
        env: 'uat'
      }))

      setup()

      const link = screen.getByRole('link', { name: 'Download Status and History' })
      expect(link.href).toEqual('http://localhost/downloads?ee=prod')
      expect(Skeleton).toHaveBeenCalledTimes(0)
    })
  })

  describe('data links', () => {
    test('renders data links in a list', () => {
      setup()

      expect(screen.getByRole('link', { name: 'http://linkurl.com/test' })).toBeInTheDocument()
      expect(Skeleton).toHaveBeenCalledTimes(0)
    })
  })

  describe('related collection links', () => {
    test('renders related collections', () => {
      setup()

      const relatedCollectionsHeading = screen.getByRole('heading', { name: 'You might also be interested in...' })
      expect(relatedCollectionsHeading).toBeInTheDocument()
      const listElements = screen.getAllByRole('list')
      const relatedColList = listElements[3]

      const relatedCollections = within(relatedColList).getAllByRole('listitem')

      expect(relatedCollections.length).toEqual(3)
      expect(within(relatedCollections[0]).getByRole('link', { key: 'related-collection-TEST_COLLECTION_3_111' })).toBeInTheDocument()
      expect(within(relatedCollections[1]).getByRole('link', { key: 'related-collection-TEST_COLLECTION_2_111' })).toBeInTheDocument()
      expect(within(relatedCollections[2]).getByRole('link', { key: 'related-collection-TEST_COLLECTION_1_111' })).toBeInTheDocument()
      expect(Skeleton).toHaveBeenCalledTimes(0)
    })
  })

  describe('footer links', () => {
    test('calls onChangePath when the search link is clicked', async () => {
      const { props, user } = setup()

      const backToSearchLink = screen.getByRole('link', { name: 'Back to Earthdata Search Results' })
      user.click(backToSearchLink)

      await waitFor(() => {
        expect(props.onChangePath).toHaveBeenCalledTimes(1)
      })

      expect(props.onChangePath).toHaveBeenCalledWith('/search?test=source_link')
      expect(Skeleton).toHaveBeenCalledTimes(0)
    })
  })
})
