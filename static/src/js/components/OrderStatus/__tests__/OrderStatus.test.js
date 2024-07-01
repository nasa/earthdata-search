import React from 'react'
import { Provider } from 'react-redux'
import {
  render,
  screen,
  waitFor,
  within
} from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'

import { StaticRouter } from 'react-router'

import { retrievalStatusProps } from './mocks'

import { OrderStatus } from '../OrderStatus'

import configureStore from '../../../store/configureStore'

import * as config from '../../../../../../sharedUtils/config'

const store = configureStore()

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(config, 'getEnvironmentConfig').mockImplementation(() => ({ edscHost: 'https://search.earthdata.nasa.gov' }))
})

const setup = () => {
  const props = retrievalStatusProps

  const { onFetchRetrieval, onChangePath } = props
  render(
    <Provider store={store}>
      <StaticRouter>
        <OrderStatus {...props} />
      </StaticRouter>
    </Provider>
  )

  return {
    onChangePath,
    onFetchRetrieval
  }
}

describe('OrderStatus component', () => {
  test('renders itself correctly', () => {
    setup()
    expect(screen.getByText('Download Status'))
  })

  test('renders the correct Helmet meta information', async () => {
    setup()

    await waitFor(() => expect(document.title).toEqual('Download Status'))

    const metaTitleElement = document.querySelector('meta[name="title"]')
    const robotsMetaElement = document.querySelector('meta[name="robots"]')
    expect(metaTitleElement.content).toEqual('Download Status')
    expect(robotsMetaElement.content).toEqual('noindex, nofollow')

    const linkTag = document.querySelector('link')
    expect(linkTag.href).toEqual('https://search.earthdata.nasa.gov/downloads')
    expect(linkTag.rel).toEqual('canonical')
  })

  test('calls onFetchRetrieval when mounted', () => {
    const { onFetchRetrieval } = setup()
    expect(onFetchRetrieval).toHaveBeenCalledTimes(1)
    expect(onFetchRetrieval).toHaveBeenCalledWith('7', 'testToken')
  })

  // TODO idk what this describe block means
  describe('introduction', () => {
    beforeEach(() => {
      jest.spyOn(config, 'getEnvironmentConfig').mockImplementation(() => ({ edscHost: 'http://localhost' }))
      jest.spyOn(config, 'getApplicationConfig').mockImplementation(() => ({
        defaultPortal: 'edsc',
        env: 'prod'
      }))
    })

    test('displays the correct text', () => {
      setup()
      // http://localhost/downloads/7 or the Download Status and History page.
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

    // TODO I'm not positive this is the same thing
    test('status link has correct href', () => {
      setup()
      const link = screen.getByRole('link', { name: 'Download Status and History' })
      expect(link.href).toEqual('http://localhost/downloads?portal=')
    })

    test('status link has correct href when earthdataEnvironment is different than the deployed environment', () => {
      jest.spyOn(config, 'getApplicationConfig').mockImplementation(() => ({
        defaultPortal: 'edsc',
        env: 'uat'
      }))

      setup()
      const link = screen.getByRole('link', { name: 'Download Status and History' })
      expect(link.href).toEqual('http://localhost/downloads?ee=prod&portal=')
    })
  })

  describe('data links', () => {
    test('renders data links in a list', () => {
      setup()
      // TODO there is only one link with the url but, there are other link attributes in the document
      screen.getByRole('link', { name: 'http://linkurl.com/test' })
    })
  })

  describe('related collection links', () => {
    test('renders related collections', () => {
      setup()
      const relatedCollectionsHeading = screen.getByRole('heading', { name: 'You might also be interested in...' })
      expect(relatedCollectionsHeading).toBeInTheDocument()
      const listElements = screen.getAllByRole('list')
      console.log('size of list', listElements.length)
      const relatedColList = listElements[3]

      // Expect(within(relatedCollections).getByRole('link', { name: 'Test Title 1' })).toBeInTheDocument()
      const relatedCollections = within(relatedColList).getAllByRole('listitem')

      expect(relatedCollections.length).toEqual(3)
      console.log('🚀 ~ file: OrderStatusRTL.test.js:203 ~ test ~ relatedCollections:', relatedCollections[0])

      expect(within(relatedCollections[0]).getByRole('link', { key: 'related-collection-TEST_COLLECTION_3_111' })).toBeInTheDocument()
      expect(within(relatedCollections[1]).getByRole('link', { key: 'related-collection-TEST_COLLECTION_2_111' })).toBeInTheDocument()
      expect(within(relatedCollections[2]).getByRole('link', { key: 'related-collection-TEST_COLLECTION_1_111' })).toBeInTheDocument()
      // Expect(within(relatedCollections[2]).getByText('Test Title 2'))
      // expect(within(relatedCollections[1]).getByText('Test Title 3'))
      // TODO for some reason this next one is failing but, I can see on the `screen its there for relatedCollections[3]
      // expect(within(relatedCollections[2]).getByText('Test Title 3'))latedCollections[1])

      // Console.log('🚀 ~ file: OrderStausRTL.test.js:194 ~ test ~ relatedCollections:', relatedCollections)
      // expect(within(relatedCollections[1]).getByText('Test Title 1'))

      // Expect(within(relatedCollections[0]).getByRole('link', { name: 'Test Title 1' })).toBeInTheDocument()
      // expect(within(relatedCollections[1]).getByRole('link', { name: 'Test Title 2' })).toBeInTheDocument()
      // expect(within(relatedCollections[2]).getByRole('link', { name: 'Test Title 3' })).toBeInTheDocument()

      // Expect(within(relatedCollections).getByRole('link', { name: 'Test Title 2' })).toBeInTheDocument()
      // expect(within(relatedCollections).getByRole('link', { name: 'Test Title 3' })).toBeInTheDocument()

      // Console.log('🚀 ~ file: OrderStatusRTL.test.js:168 ~ test ~ relatedCollections:', relatedCollections)
      // screen.getByRole(relatedCollections, 'listItem', { name: 'Test Title 1' })
      // screen.getByRole(relatedCollections, 'link', { name: 'Test Title 1' })

      // console.log('🚀 ~ file: OrderStatusRTL.test.js:167 ~ test ~ relatedCollections:', relatedCollections)

      // Screen.getByRole('link', { name: 'Test Title 1' })
      // screen.getByRole('link', { name: 'Test Title 2' })
      // screen.getByRole('link', { name: 'Test Title 3' })
      screen.debug()
    })
  })

  describe('footer links', () => {
    test('calls onChangePath when the search link is clicked', async () => {
      const user = userEvent.setup()
      const { onChangePath } = setup()

      const backToSearchLink = screen.getByRole('link', { name: 'Back to Earthdata Search Results' })
      user.click(backToSearchLink)

      await waitFor(() => {
        expect(onChangePath).toHaveBeenCalledTimes(1)
        expect(onChangePath).toHaveBeenCalledWith('/search?test=source_link')
      })
    })
  })
})
