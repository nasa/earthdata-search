import React from 'react'

import {
  act, render, screen
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import RelatedUrlsModal from '../RelatedUrlsModal'

import '@testing-library/jest-dom'

const setup = (overrides) => {
  const {
    overrideMetadata = {},
    overrideProps = {}
  } = overrides || {}

  const onToggleRelatedUrlsModal = jest.fn()

  const props = {
    collectionMetadata: {
      hasAllMetadata: true,
      dataCenters: [],
      directDistributionInformation: {},
      scienceKeywords: [],
      nativeDataFormats: [],
      relatedUrls: [
        {
          content_type: 'CollectionURL',
          label: 'Collection URL',
          urls: [
            {
              description: 'Data set Landing Page DOI URL',
              urlContentType: 'CollectionURL',
              type: 'DATA SET LANDING PAGE',
              url: 'https://doi.org/10.3334/ORNLDAAC/830',
              subtype: ''
            }
          ]
        },
        {
          content_type: 'DistributionURL',
          label: 'Distribution URL',
          urls: [
            {
              description: 'This link allows direct data access via Earthdata login',
              urlContentType: 'DistributionURL',
              type: 'GET DATA',
              url: 'https://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/',
              subtype: ''
            },
            {
              description: 'Web Coverage Service for this collection.',
              urlContentType: 'DistributionURL',
              type: 'USE SERVICE API',
              subtype: 'WEB COVERAGE SERVICE (WCS)',
              url: 'https://webmap.ornl.gov/wcsdown/dataset.jsp?ds_id=830',
              get_service: {
                mimeType: 'application/gml+xml',
                protocol: 'Not provided',
                fullName: 'Not provided',
                dataId: 'NotProvided',
                dataType: 'Not provided'
              }
            }
          ]
        },
        {
          content_type: 'PublicationURL',
          label: 'Publication URL',
          urls: [
            {
              description: 'ORNL DAAC Data Set Documentation',
              urlContentType: 'PublicationURL',
              type: 'VIEW RELATED INFORMATION',
              subtype: 'GENERAL DOCUMENTATION',
              url: 'https://daac.ornl.gov/CLIMATE/guides/global_N_deposition_maps.html'
            },
            {
              description: 'Data Set Documentation',
              urlContentType: 'PublicationURL',
              type: 'VIEW RELATED INFORMATION',
              subtype: 'GENERAL DOCUMENTATION',
              url: 'https://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/comp/deposition_maps.jpg'
            },
            {
              description: 'Data Set Documentation',
              urlContentType: 'PublicationURL',
              type: 'VIEW RELATED INFORMATION',
              subtype: 'GENERAL DOCUMENTATION',
              url: 'https://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/comp/global_N_deposition_maps.pdf'
            },
            {
              description: 'Data Set Documentation',
              urlContentType: 'PublicationURL',
              type: 'VIEW RELATED INFORMATION',
              subtype: 'GENERAL DOCUMENTATION',
              url: 'https://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/comp/global_N_deposition_maps_readme.pdf'
            }
          ]
        },
        {
          content_type: 'VisualizationURL',
          label: 'Visualization URL',
          urls: [
            {
              description: 'Browse Image',
              urlContentType: 'VisualizationURL',
              type: 'GET RELATED VISUALIZATION',
              url: 'https://daac.ornl.gov/graphics/browse/sdat-tds/830_1_fit.png',
              subtype: ''
            }
          ]
        },
        {
          content_type: 'HighlightedURL',
          label: 'Highlighted URL',
          urls: [
            {
              description: 'Data set Landing Page DOI URL',
              urlContentType: 'CollectionURL',
              type: 'DATA SET LANDING PAGE',
              url: 'https://doi.org/10.3334/ORNLDAAC/830',
              highlightedType: 'Data Set Landing Page'
            }
          ]
        }
      ],
      ...overrideMetadata
    },
    isOpen: true,
    onToggleRelatedUrlsModal,
    ...overrideProps
  }
  act(() => {
    render(<RelatedUrlsModal {...props} />)
  })
  return {
    onToggleRelatedUrlsModal
  }
}

describe('CollectionDetailsBody component', () => {
  describe('when the relatedUrls Modal has relatedUrls', () => {
    test('calls leaflet to render map with correct props', () => {
      setup()
      expect(screen.getByText('Related URLs')).toBeInTheDocument()
    })
  })
  describe('when the isOpen prop for the Modal is off', () => {
    test('calls leaflet to render map with correct props', () => {
      setup({
        overrideProps: {
          isOpen: false
        }
      })
      expect(screen.queryByText('Related URLs')).not.toBeInTheDocument()
      expect(screen.queryAllByText('Related URLs').length).toEqual(0)
    })
  })
  describe('when the related urls is empty', () => {
    test('calls leaflet to render map with correct props', () => {
      setup({
        overrideMetadata: {
          relatedUrls: []
        }
      })
      const collectionDetailsrelatedUrlsList = screen.queryAllByRole('list')
      expect(collectionDetailsrelatedUrlsList.length).toEqual(0)
    })
  })
  describe('when the related urls is null', () => {
    test('calls leaflet to render map with correct props', () => {
      setup({
        overrideMetadata: {
          relatedUrls: null
        }
      })
      const collectionDetailsrelatedUrlsList = screen.queryAllByRole('list')
      expect(collectionDetailsrelatedUrlsList.length).toEqual(0)
    })
    describe('when the clicking the close button on the modal', () => {
      test('calls the `onToggleRelatedUrlsModal` function with false', async () => {
        const { onToggleRelatedUrlsModal } = setup()
        userEvent.setup()
        const closeButton = screen.getByRole('button')
        await userEvent.click(closeButton)
        expect(screen.getByText('Related URLs')).toBeInTheDocument()
        expect(onToggleRelatedUrlsModal).toHaveBeenCalledTimes(1)
      })
    })
  })
})
