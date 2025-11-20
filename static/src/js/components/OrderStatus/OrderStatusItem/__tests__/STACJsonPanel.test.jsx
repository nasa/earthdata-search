import React from 'react'
import { screen } from '@testing-library/react'

import setupTest from '../../../../../../../jestConfigs/setupTest'

import STACJsonPanel from '../STACJsonPanel'
import TextWindowActions from '../../../TextWindowActions/TextWindowActions'

jest.mock('../../../TextWindowActions/TextWindowActions', () => jest.fn(() => <div />))

jest.useFakeTimers({ legacyFakeTimers: true })

const setup = setupTest({
  Component: STACJsonPanel,
  defaultProps: {
    accessMethodType: 'Harmony',
    granuleCount: 100,
    stacLinksIsLoading: false,
    retrievalId: '1',
    stacLinks: []
  }
})

describe('STACJsonPanel', () => {
  describe('when panel is not provided stac links', () => {
    test('renders placeholder message', () => {
      setup()

      expect(screen.getByText('STAC links will become available once the order has finished processing.')).toBeInTheDocument()
    })
  })

  describe('when panel is provided some stac links', () => {
    test('renders a TextWindowActions component', () => {
      setup({
        overrideProps: {
          stacLinksIsLoading: true,
          stacLinks: ['https://example.com/link1', 'https://example.com/link2']
        }
      })

      expect(screen.getByText('Retrieving STAC links for 100 granules...')).toBeInTheDocument()

      expect(TextWindowActions).toHaveBeenCalledTimes(1)
      expect(TextWindowActions).toHaveBeenCalledWith({
        children: expect.any(Object),
        clipboardContents: 'https://example.com/link1\nhttps://example.com/link2',
        disableEdd: true,
        fileContents: 'https://example.com/link1\nhttps://example.com/link2',
        fileName: '1-Harmony-STAC.txt',
        id: 'links-1',
        modalTitle: 'STAC Links'
      }, {})
    })
  })

  describe('when panel is provided all stac links', () => {
    test('renders a TextWindowActions component', () => {
      setup({
        overrideProps: {
          stacLinks: ['https://example.com/link1', 'https://example.com/link2']
        }
      })

      expect(screen.getByText('Retrieved 2 STAC links for 100 granules')).toBeInTheDocument()

      expect(TextWindowActions).toHaveBeenCalledTimes(1)
      expect(TextWindowActions).toHaveBeenCalledWith({
        children: expect.any(Object),
        clipboardContents: 'https://example.com/link1\nhttps://example.com/link2',
        disableEdd: true,
        fileContents: 'https://example.com/link1\nhttps://example.com/link2',
        fileName: '1-Harmony-STAC.txt',
        id: 'links-1',
        modalTitle: 'STAC Links'
      }, {})
    })
  })
})
