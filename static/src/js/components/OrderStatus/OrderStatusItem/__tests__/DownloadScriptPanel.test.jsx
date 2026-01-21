import React from 'react'
import { screen } from '@testing-library/react'

import setupTest from '../../../../../../../vitestConfigs/setupTest'

import * as generateDownloadScript from '../../../../util/files/generateDownloadScript'

import DownloadScriptPanel from '../DownloadScriptPanel'
import TextWindowActions from '../../../TextWindowActions/TextWindowActions'

vi.mock('../../../TextWindowActions/TextWindowActions', () => ({ default: vi.fn(() => <div />) }))

vi.useFakeTimers()

const setup = setupTest({
  Component: DownloadScriptPanel,
  defaultProps: {
    accessMethodType: 'download',
    downloadLinks: [],
    retrievalCollection: {},
    retrievalId: '1',
    granuleCount: 0,
    granuleLinksIsLoading: false
  }
})

describe('DownloadScriptPanel', () => {
  describe('when panel is not provided granule links', () => {
    test('renders placeholder message', () => {
      setup()

      expect(screen.getByText('The download script will become available once the order has finished processing.')).toBeInTheDocument()
    })
  })

  describe('when panel is provided granule links', () => {
    test('renders a TextWindowActions component', () => {
      const generateDownloadScriptMock = vi.spyOn(generateDownloadScript, 'generateDownloadScript').mockReturnValue('mock script')

      setup({
        overrideProps: {
          downloadLinks: ['http://search.earthdata.nasa.gov', 'http://cmr.earthdata.nasa.gov'],
          granuleCount: 10,
          granuleLinksIsLoading: true
        }
      })

      expect(screen.getByText('Retrieving files for 10 granules...')).toBeInTheDocument()

      expect(TextWindowActions).toHaveBeenCalledTimes(1)
      expect(TextWindowActions).toHaveBeenCalledWith({
        children: expect.any(Object),
        clipboardContents: 'mock script',
        disableEdd: true,
        fileContents: 'mock script',
        fileName: '1-download.sh',
        id: 'script-1',
        modalTitle: 'Download Script'
      }, {})

      expect(generateDownloadScriptMock).toHaveBeenCalledTimes(1)
      expect(generateDownloadScriptMock).toHaveBeenCalledWith({
        earthdataEnvironment: 'prod',
        granuleLinks: ['http://search.earthdata.nasa.gov', 'http://cmr.earthdata.nasa.gov'],
        retrievalCollection: {},
        username: null
      })
    })
  })
})
