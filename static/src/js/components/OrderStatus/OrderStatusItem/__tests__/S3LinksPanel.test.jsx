import React from 'react'
import { screen } from '@testing-library/react'

import setupTest from '../../../../../../../jestConfigs/setupTest'

import S3LinksPanel from '../S3LinksPanel'
import TextWindowActions from '../../../TextWindowActions/TextWindowActions'
import CopyableText from '../../../CopyableText/CopyableText'

jest.mock('../../../TextWindowActions/TextWindowActions', () => jest.fn(({ children }) => <div>{children}</div>))
jest.mock('../../../CopyableText/CopyableText', () => jest.fn(() => <div />))

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

  describe('when panel is provided some s3 links', () => {
    test('renders a TextWindowActions component', () => {
      setup({
        overrideProps: {
          granuleLinksIsLoading: true,
          s3Links: ['s3://search.earthdata.nasa.gov', 's3://cmr.earthdata.nasa.gov']
        }
      })

      expect(screen.getByText('Direct cloud access for this collection is available in the aws-region region in AWS S3.')).toBeInTheDocument()
      expect(screen.getByText('Retrieving objects for 100 granules...')).toBeInTheDocument()

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

  describe('when panel is provided all s3 links', () => {
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

  describe('when s3BucketAndObjectPrefixNames are provided', () => {
    test('renders a CopyableText component for each bucket and object prefix', () => {
      setup({
        overrideProps: {
          directDistributionInformation: {
            region: 'aws-region',
            s3BucketAndObjectPrefixNames: ['bucket1/prefix1', 'bucket2/prefix2']
          },
          s3Links: ['s3://search.earthdata.nasa.gov', 's3://cmr.earthdata.nasa.gov']
        }
      })

      expect(CopyableText).toHaveBeenCalledTimes(5)
      expect(CopyableText).toHaveBeenNthCalledWith(1, {
        className: 'order-status-item__direct-distribution-item-value',
        failureMessage: 'Could not copy the AWS S3 region',
        label: 'Copy to clipboard',
        successMessage: 'Copied the AWS S3 region',
        text: 'aws-region'
      }, {})

      expect(CopyableText).toHaveBeenNthCalledWith(2, {
        className: 'order-status-item__direct-distribution-item-value',
        failureMessage: 'Could not copy the AWS S3 Bucket/Object Prefix',
        label: 'Copy to clipboard',
        successMessage: 'Copied the AWS S3 Bucket/Object Prefix',
        text: 'bucket1/prefix1'
      }, {})

      expect(CopyableText).toHaveBeenNthCalledWith(3, {
        className: 'order-status-item__direct-distribution-item-value',
        failureMessage: 'Could not copy the AWS S3 Bucket/Object Prefix',
        label: 'Copy to clipboard',
        successMessage: 'Copied the AWS S3 Bucket/Object Prefix',
        text: 'bucket2/prefix2'
      }, {})

      expect(CopyableText).toHaveBeenNthCalledWith(4, {
        failureMessage: 'Could not copy AWS S3 path for: search.earthdata.nasa.gov',
        label: 'Copy AWS S3 path to clipboard',
        successMessage: 'Copied AWS S3 path for: search.earthdata.nasa.gov',
        text: 's3://search.earthdata.nasa.gov'
      }, {})

      expect(CopyableText).toHaveBeenNthCalledWith(5, {
        failureMessage: 'Could not copy AWS S3 path for: cmr.earthdata.nasa.gov',
        label: 'Copy AWS S3 path to clipboard',
        successMessage: 'Copied AWS S3 path for: cmr.earthdata.nasa.gov',
        text: 's3://cmr.earthdata.nasa.gov'
      }, {})
    })
  })
})
