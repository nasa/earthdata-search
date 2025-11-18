import React from 'react'
import { screen } from '@testing-library/react'

import setupTest from '../../../../../../../jestConfigs/setupTest'

import S3LinksPanel from '../S3LinksPanel'
import TextWindowActions from '../../../TextWindowActions/TextWindowActions'

jest.mock('../../../TextWindowActions/TextWindowActions', () => jest.fn(() => <div />))

jest.useFakeTimers({ legacyFakeTimers: true })

const setup = setupTest({
  Component: S3LinksPanel,
  defaultProps: {
    accessMethodType: 'download',
    directDistributionInformation: {
      region: 'aws-region'
    },
    granuleCount: 100,
    granuleLinksIsLoading: false,
    retrievalId: '1',
    s3Links: [],
    showTextWindowActions: true
  }
})

describe('S3LinksPanel', () => {
  describe('when panel is not provided s3 links', () => {
    test('renders placeholder message', () => {
      setup()

      expect(screen.getByText('The AWS S3 objects will become available once the order has finished processing.')).toBeInTheDocument()
    })
  })

  describe('when panel is provided granule links', () => {
    test('renders a TextWindowActions component', () => {
      setup({
        overrideProps: {
          s3Links: ['s3://search.earthdata.nasa.gov', 's3://cmr.earthdata.nasa.gov']
        }
      })

      expect(screen.getByText('Direct cloud access for this collection is available in the aws-region region in AWS S3.')).toBeInTheDocument()
      expect(screen.getByText('Retrieved 2 objects for 100 granules')).toBeInTheDocument()

      expect(TextWindowActions).toHaveBeenCalledTimes(1)
      expect(TextWindowActions).toHaveBeenCalledWith({
        children: expect.any(Object),
        clipboardContents: 's3://search.earthdata.nasa.gov\ns3://cmr.earthdata.nasa.gov',
        disableCopy: false,
        disableEdd: true,
        disableSave: false,
        fileContents: 's3://search.earthdata.nasa.gov\ns3://cmr.earthdata.nasa.gov',
        fileName: '1-download-s3.txt',
        id: 'links-1',
        modalTitle: 'AWS S3 Access'
      }, {})
    })
  })
})
