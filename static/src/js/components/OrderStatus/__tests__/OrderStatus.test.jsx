import {
  screen,
  waitFor,
  within
} from '@testing-library/react'
import { Helmet } from 'react-helmet'

import setupTest from '../../../../../../jestConfigs/setupTest'

import { retrievalStatusProps } from './mocks'
import { OrderStatus } from '../OrderStatus'
import * as config from '../../../../../../sharedUtils/config'

const setup = setupTest({
  Component: OrderStatus,
  defaultProps: retrievalStatusProps,
  withRedux: true,
  withRouter: true
})

beforeEach(() => {
  jest.spyOn(config, 'getEnvironmentConfig').mockImplementation(() => ({ edscHost: 'https://search.earthdata.nasa.gov' }))
})

describe('OrderStatus component', () => {
  test('renders itself correctly', () => {
    setup()

    expect(screen.getByText('Download Status')).toBeInTheDocument()
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
    })

    test('download status link has correct href when earthdataEnvironment is different than the deployed environment', () => {
      jest.spyOn(config, 'getApplicationConfig').mockImplementation(() => ({
        defaultPortal: 'edsc',
        env: 'uat'
      }))

      setup()

      const link = screen.getByRole('link', { name: 'http://localhost/downloads/7?ee=prod' })
      expect(link).toBeInTheDocument()
    })

    test('status link has correct href', () => {
      setup()

      const link = screen.getByRole('link', { name: 'Download Status and History' })
      expect(link.href).toEqual('http://localhost/downloads')
    })

    test('status link has correct href when earthdataEnvironment is different than the deployed environment', () => {
      jest.spyOn(config, 'getApplicationConfig').mockImplementation(() => ({
        defaultPortal: 'edsc',
        env: 'uat'
      }))

      setup()

      const link = screen.getByRole('link', { name: 'Download Status and History' })
      expect(link.href).toEqual('http://localhost/downloads?ee=prod')
    })
  })

  describe('data links', () => {
    test('renders data links in a list', () => {
      setup()

      expect(screen.getByRole('link', { name: 'http://linkurl.com/test' })).toBeInTheDocument()
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
    })
  })
})
