import React from 'react'

import {
  act, render
} from '@testing-library/react'

import { createLayerComponent } from '@react-leaflet/core'

import '@testing-library/jest-dom'

import CollectionDetailsFeatureGroup from '../CollectionDetailsFeatureGroup'

// Mock react-leaflet because it causes errors
jest.mock('react-leaflet/core', () => (
  {
    createLayerComponent: jest.fn().mockImplementation(() => {})
  }))

const setup = (overrides) => {
  const {
    overrideMetadata = {},
    overrideProps = {}
  } = overrides || {}

  const props = {
    metadata: {
      hasAllMetadata: true,
      dataCenters: [],
      directDistributionInformation: {},
      scienceKeywords: [],
      nativeDataFormats: [],
      urls: {
        html: {
          title: 'HTML',
          href: 'https://cmr.earthdata.nasa.gov/search/concepts/C179003620-ORNL_DAAC.html'
        },
        native: {
          title: 'Native',
          href: 'https://cmr.earthdata.nasa.gov/search/concepts/C179003620-ORNL_DAAC.native'
        },
        atom: {
          title: 'ATOM',
          href: 'https://cmr.earthdata.nasa.gov/search/concepts/C179003620-ORNL_DAAC.atom'
        },
        echo10: {
          title: 'ECHO10',
          href: 'https://cmr.earthdata.nasa.gov/search/concepts/C179003620-ORNL_DAAC.echo10'
        },
        iso19115: {
          title: 'ISO19115',
          href: 'https://cmr.earthdata.nasa.gov/search/concepts/C179003620-ORNL_DAAC.iso19115'
        },
        dif: {
          title: 'DIF',
          href: 'https://cmr.earthdata.nasa.gov/search/concepts/C179003620-ORNL_DAAC.dif'
        },
        osdd: {
          title: 'OSDD',
          href: 'https://cmr.earthdata.nasa.gov/opensearch/granules/descriptor_document.xml?clientId=edsc-prod&shortName=1860_1993_2050_NITROGEN_830&versionId=1&dataCenter=ORNL_DAAC'
        },
        granuleDatasource: {
          title: 'CMR',
          href: 'https://cmr.earthdata.nasa.gov/search/granules.json?echo_collection_id=C179003620-ORNL_DAAC'
        }
      },
      ...overrideMetadata
    },
    ...overrideProps
  }
  act(() => {
    render(<CollectionDetailsFeatureGroup {...props} />)
  })
}
// TODO failing test fix
describe('CollectionDetailsFeatureGroup component', () => {
  describe('when the feature group is loaded with metadata', () => {
    test.skip('calls leaflet to create the layer component', () => {
      setup()
      expect(createLayerComponent).toHaveBeenCalledTimes(1)
    })
  })
})
