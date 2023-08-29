import React from 'react'

import {
  act, render, screen
} from '@testing-library/react'

import {
  MapContainer,
  ImageOverlay
} from 'react-leaflet'

import '@testing-library/jest-dom'

import CollectionDetailsMinimap from '../CollectionDetailsMinimap'

// const mockedImageOverlay = jest.fn().mockImplementation(({ children }) => (
//   <mock-ImageOverlay data-testid="ImageOverlay">
//     {children}
//   </mock-ImageOverlay>
// ))

// const mockedM = jest.fn().mockImplementation(({ children }) => (
//   <mock-mockedMiniMap data-testid="ImageOverlay">
//     {children}
//   </mock-mockedMiniMap>
// ))

jest.mock('react-leaflet', () => (
  {
    createLayerComponent: jest.fn().mockImplementation(() => {}),
    MapContainer: jest.fn().mockImplementation(() => (<div />)),
    ImageOverlay: jest.fn().mockImplementation(() => (<div />))
  }))

jest.mock('react-leaflet/ImageOverlay')

jest.mock('../CollectionDetailsFeatureGroup', () => jest.fn(() => (
  <mock-MapContainer data-testid="MapContainer" />
)))

// https://react-leaflet.js.org/docs/start-introduction/
// React does not render Leaflet layers to the DOM, this rendering is done by Leaflet itself. React only renders a <div> element when rendering the MapContainer component and the contents of UI layers components.

//   //   MapContainer: () => {
//   //     mockedMiniMap()
//   //   },

// //   ImageOverlay: () => {
// //     mockedImageOverlay()
// //   }
// }))

// jest.mock('react-leaflet/MapContainer', () => jest.fn(({ children }) => (
//   <mock-MapContainer data-testid="MapContainer">
//     {children}
//   </mock-MapContainer>
// )))

// jest.mock('react-leaflet/ImageOverlay', () => jest.fn(({ children }) => (
//   <mock-ImageOverlay data-testid="ImageOverlay">
//     {children}
//   </mock-ImageOverlay>
// )))

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
    render(<CollectionDetailsMinimap {...props} />)
  })
}

describe('CollectionDetailsBody component', () => {
  describe('when the collection mini map is loaded with metadata', () => {
    test('calls leaflet to render map with correct props', () => {
      setup()
      expect(MapContainer).toHaveBeenCalledTimes(1)
    })
  })
})
