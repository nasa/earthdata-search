import React from 'react'
import { screen } from '@testing-library/react'
import ProgressBar from 'react-bootstrap/ProgressBar'

import setupTest from '../../../../../../../vitestConfigs/setupTest'

import BrowseLinksPanel from '../BrowseLinksPanel'
import TextWindowActions from '../../../TextWindowActions/TextWindowActions'

vi.mock('../../../TextWindowActions/TextWindowActions', () => ({ default: vi.fn(() => <div />) }))
vi.mock('react-bootstrap/ProgressBar', () => ({ default: vi.fn(() => <div />) }))

vi.useFakeTimers()

const setup = setupTest({
  Component: BrowseLinksPanel,
  defaultProps: {
    accessMethodType: 'download',
    browseUrls: [],
    granuleCount: 100,
    granuleLinksIsLoading: false,
    percentDoneDownloadLinks: '0',
    retrievalId: '1',
    showTextWindowActions: true
  }
})

describe('BrowseLinksPanel', () => {
  describe('when panel is not provided granule links', () => {
    test('renders placeholder message', () => {
      setup()

      expect(screen.getByText('The browse imagery links will become available once the order has finished processing.')).toBeInTheDocument()
    })
  })

  describe('when panel is provided all of the granule links', () => {
    test('renders a TextWindowActions component', () => {
      setup({
        overrideProps: {
          browseUrls: ['http://search.earthdata.nasa.gov', 'http://cmr.earthdata.nasa.gov'],
          granuleCount: 2,
          granuleLinksIsLoading: false,
          percentDoneDownloadLinks: '100'
        }
      })

      expect(screen.getByText('Retrieved 2 files for 2 granules')).toBeInTheDocument()

      expect(ProgressBar).toHaveBeenCalledTimes(1)
      expect(ProgressBar).toHaveBeenCalledWith({
        label: '100%',
        now: '100'
      }, {})

      expect(TextWindowActions).toHaveBeenCalledTimes(1)
      expect(TextWindowActions).toHaveBeenCalledWith({
        children: expect.any(Object),
        clipboardContents: 'http://search.earthdata.nasa.gov\nhttp://cmr.earthdata.nasa.gov',
        disableCopy: false,
        disableSave: false,
        fileContents: 'http://search.earthdata.nasa.gov\nhttp://cmr.earthdata.nasa.gov',
        fileName: '1-download-browse-imagery.txt',
        id: 'links-1',
        modalTitle: 'Browse Imagery Links'
      }, {})
    })
  })

  describe('when panel is provided some of the granule links', () => {
    test('renders a TextWindowActions component', () => {
      setup({
        overrideProps: {
          browseUrls: ['http://search.earthdata.nasa.gov', 'http://cmr.earthdata.nasa.gov'],
          granuleCount: 10,
          granuleLinksIsLoading: true,
          percentDoneDownloadLinks: '25'
        }
      })

      expect(screen.getByText('Retrieving files for 10 granules...')).toBeInTheDocument()

      expect(ProgressBar).toHaveBeenCalledTimes(1)
      expect(ProgressBar).toHaveBeenCalledWith({
        label: '25%',
        now: '25'
      }, {})

      expect(TextWindowActions).toHaveBeenCalledTimes(1)
      expect(TextWindowActions).toHaveBeenCalledWith({
        children: expect.any(Object),
        clipboardContents: 'http://search.earthdata.nasa.gov\nhttp://cmr.earthdata.nasa.gov',
        disableCopy: false,
        disableSave: false,
        fileContents: 'http://search.earthdata.nasa.gov\nhttp://cmr.earthdata.nasa.gov',
        fileName: '1-download-browse-imagery.txt',
        id: 'links-1',
        modalTitle: 'Browse Imagery Links'
      }, {})
    })
  })

  describe('when the text window actions are disabled', () => {
    test('hides the copy and save buttons', () => {
      setup({
        overrideProps: {
          browseUrls: ['http://search.earthdata.nasa.gov', 'http://cmr.earthdata.nasa.gov'],
          granuleCount: 10,
          granuleLinksIsLoading: true,
          percentDoneDownloadLinks: '25',
          showTextWindowActions: false
        }
      })

      expect(TextWindowActions).toHaveBeenCalledTimes(1)
      expect(TextWindowActions).toHaveBeenCalledWith({
        children: expect.any(Object),
        clipboardContents: 'http://search.earthdata.nasa.gov\nhttp://cmr.earthdata.nasa.gov',
        disableCopy: true,
        disableSave: true,
        fileContents: 'http://search.earthdata.nasa.gov\nhttp://cmr.earthdata.nasa.gov',
        fileName: '1-download-browse-imagery.txt',
        id: 'links-1',
        modalTitle: 'Browse Imagery Links'
      }, {})
    })
  })
})
