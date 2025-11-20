import React from 'react'
import { screen } from '@testing-library/react'
import ProgressBar from 'react-bootstrap/ProgressBar'

import setupTest from '../../../../../../../jestConfigs/setupTest'

import DownloadFilesPanel from '../DownloadFilesPanel'
import TextWindowActions from '../../../TextWindowActions/TextWindowActions'

jest.mock('../../../TextWindowActions/TextWindowActions', () => jest.fn(() => <div />))
jest.mock('react-bootstrap/ProgressBar', () => jest.fn(() => <div />))

jest.useFakeTimers({ legacyFakeTimers: true })

const setup = setupTest({
  Component: DownloadFilesPanel,
  defaultProps: {
    accessMethodType: 'download',
    downloadLinks: [],
    retrievalId: '1',
    granuleCount: 100,
    granuleLinksIsLoading: false
  }
})

describe('DownloadFilesPanel', () => {
  describe('when panel is not provided granule links', () => {
    test('renders placeholder message', () => {
      setup()

      expect(screen.getByText('The download files will become available once the order has finished processing.')).toBeInTheDocument()
    })
  })

  describe('when panel is provided all of the granule links', () => {
    test('renders a TextWindowActions component', () => {
      setup({
        overrideProps: {
          downloadLinks: ['http://search.earthdata.nasa.gov', 'http://cmr.earthdata.nasa.gov'],
          granuleCount: 2,
          granuleLinksIsLoading: false,
          percentDoneDownloadLinks: '100' // 25
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
        disableEddInProgress: false,
        disableSave: false,
        eddLink: null,
        hideEdd: false,
        fileContents: 'http://search.earthdata.nasa.gov\nhttp://cmr.earthdata.nasa.gov',
        fileName: '1-download.txt',
        id: 'links-1',
        modalTitle: 'Download Files'
      }, {})
    })
  })

  describe('when panel is provided some of the granule links', () => {
    test('renders a TextWindowActions component', () => {
      setup({
        overrideProps: {
          downloadLinks: ['http://search.earthdata.nasa.gov', 'http://cmr.earthdata.nasa.gov'],
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
        disableEddInProgress: false,
        disableSave: false,
        eddLink: null,
        hideEdd: false,
        fileContents: 'http://search.earthdata.nasa.gov\nhttp://cmr.earthdata.nasa.gov',
        fileName: '1-download.txt',
        id: 'links-1',
        modalTitle: 'Download Files'
      }, {})
    })
  })

  describe('when the text window actions are disabled', () => {
    test('hides the copy and save buttons', () => {
      setup({
        overrideProps: {
          accessMethodType: 'ESI',
          downloadLinks: ['http://search.earthdata.nasa.gov', 'http://cmr.earthdata.nasa.gov'],
          granuleLinksIsLoading: true,
          showTextWindowActions: false
        }
      })

      expect(TextWindowActions).toHaveBeenCalledTimes(1)
      expect(TextWindowActions).toHaveBeenCalledWith({
        children: expect.any(Object),
        clipboardContents: 'http://search.earthdata.nasa.gov\nhttp://cmr.earthdata.nasa.gov',
        disableCopy: true,
        disableEddInProgress: false,
        disableSave: true,
        eddLink: null,
        hideEdd: false,
        fileContents: 'http://search.earthdata.nasa.gov\nhttp://cmr.earthdata.nasa.gov',
        fileName: '1-ESI.txt',
        id: 'links-1',
        modalTitle: 'Download Files'
      }, {})
    })

    test('hides the download button', () => {
      setup({
        overrideProps: {
          accessMethodType: 'ESI',
          collectionIsCSDA: true,
          downloadLinks: ['http://search.earthdata.nasa.gov', 'http://cmr.earthdata.nasa.gov'],
          granuleCount: 10,
          granuleLinksIsLoading: true,
          showTextWindowActions: true
        }
      })

      expect(TextWindowActions).toHaveBeenCalledTimes(1)
      expect(TextWindowActions).toHaveBeenCalledWith({
        children: expect.any(Object),
        clipboardContents: 'http://search.earthdata.nasa.gov\nhttp://cmr.earthdata.nasa.gov',
        disableCopy: false,
        disableEddInProgress: false,
        disableSave: false,
        eddLink: null,
        hideEdd: true,
        fileContents: 'http://search.earthdata.nasa.gov\nhttp://cmr.earthdata.nasa.gov',
        fileName: '1-ESI.txt',
        id: 'links-1',
        modalTitle: 'Download Files'
      }, {})
    })
  })
})
