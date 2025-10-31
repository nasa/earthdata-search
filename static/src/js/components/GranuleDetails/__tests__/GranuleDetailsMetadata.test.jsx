import React from 'react'
import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import { granuleMetadata } from './mocks'

import Spinner from '../../Spinner/Spinner'
import GranuleDetailsMetadata from '../GranuleDetailsMetadata'

jest.mock('../../Spinner/Spinner', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: GranuleDetailsMetadata,
  defaultProps: {
    metadataUrls: {}
  }
})

describe('GranuleDetailsMetadata component', () => {
  describe('when the metadata is not provided', () => {
    test('renders a loading state', () => {
      setup()

      expect(Spinner).toHaveBeenCalledTimes(1)
      expect(Spinner).toHaveBeenCalledWith({
        className: 'granule-details-info__spinner',
        size: 'small',
        type: 'dots'
      }, {})
    })
  })

  describe('when the metadata has been provided', () => {
    test('renders itself correctly', () => {
      setup({
        overrideProps: {
          metadataUrls: granuleMetadata.metadataUrls
        }
      })

      expect(screen.getByText('Download Metadata:')).toBeInTheDocument()
    })

    describe('Metadata URL list', () => {
      test('renders the unauthenticated links correctly', () => {
        setup({
          overrideProps: {
            metadataUrls: granuleMetadata.metadataUrls
          }
        })

        expect(screen.getAllByRole('listitem')).toHaveLength(5)
        expect(screen.getByRole('link', { name: 'Native' })).toHaveAttribute('href', 'https://cmr.earthdata.nasa.gov/search/concepts/G1422858365-ORNL_DAAC')
        expect(screen.getByRole('link', { name: 'UMM-G' })).toHaveAttribute('href', 'https://cmr.earthdata.nasa.gov/search/concepts/G1422858365-ORNL_DAAC.umm_json')
        expect(screen.getByRole('link', { name: 'ATOM' })).toHaveAttribute('href', 'https://cmr.earthdata.nasa.gov/search/concepts/G1422858365-ORNL_DAAC.atom')
        expect(screen.getByRole('link', { name: 'ECHO 10' })).toHaveAttribute('href', 'https://cmr.earthdata.nasa.gov/search/concepts/G1422858365-ORNL_DAAC.echo10')
        expect(screen.getByRole('link', { name: 'ISO 19115' })).toHaveAttribute('href', 'https://cmr.earthdata.nasa.gov/search/concepts/G1422858365-ORNL_DAAC.iso19115')
      })

      test('renders the authenticated links correctly', () => {
        setup({
          overrideProps: {
            metadataUrls: granuleMetadata.metadataUrls
          },
          overrideZustandState: {
            user: {
              edlToken: 'token'
            }
          }
        })

        const granuleUrl = 'https://cmr.earthdata.nasa.gov/search/concepts/G1422858365-ORNL_DAAC'
        const tokenUrl = '?token=Bearer%20token'

        expect(screen.getAllByRole('listitem')).toHaveLength(5)
        expect(screen.getByRole('link', { name: 'Native' })).toHaveAttribute('href', `${granuleUrl}${tokenUrl}`)
        expect(screen.getByRole('link', { name: 'UMM-G' })).toHaveAttribute('href', `${granuleUrl}.umm_json${tokenUrl}`)
        expect(screen.getByRole('link', { name: 'ATOM' })).toHaveAttribute('href', `${granuleUrl}.atom${tokenUrl}`)
        expect(screen.getByRole('link', { name: 'ECHO 10' })).toHaveAttribute('href', `${granuleUrl}.echo10${tokenUrl}`)
        expect(screen.getByRole('link', { name: 'ISO 19115' })).toHaveAttribute('href', `${granuleUrl}.iso19115${tokenUrl}`)
      })
    })
  })
})
