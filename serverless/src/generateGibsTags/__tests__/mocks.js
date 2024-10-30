export const gibsResponse = {
  layers: {
    AMSR2_Cloud_Liquid_Water_Day: {
      id: 'AMSR2_Cloud_Liquid_Water_Day',
      type: 'wmts',
      format: 'image/png',
      layerPeriod: 'Daily',
      period: 'daily',
      startDate: '2015-06-07T00:00:00Z',
      endDate: '2020-06-10T00:00:00Z',
      dateRanges: [
        {
          startDate: '2015-06-07T00:00:00Z',
          endDate: '2020-06-10T00:00:00Z',
          dateInterval: '1'
        }
      ],
      projections: {
        geographic: {
          source: 'GIBS:geographic',
          matrixSet: '2km'
        }
      },
      palette: {
        id: 'AMSR2_Cloud_Liquid_Water_Day'
      },
      title: 'Columnar Cloud Liquid Water (Day, Historical)',
      subtitle: 'GCOM-W1 / AMSR2',
      description: 'amsr2/AMSR2_Cloud_Liquid_Water_Day',
      tags: 'amsr-2',
      inactive: true,
      group: 'overlays',
      layergroup: 'Cloud Liquid Water',
      product: 'A2_RainOcn_NRT',
      tracks: [
        'OrbitTracks_GCOM-W1_Ascending'
      ],
      daynight: [
        'day'
      ]
    },
    AMSRE_Surface_Rain_Rate_Night: {
      id: 'AMSRE_Surface_Rain_Rate_Night',
      type: 'wmts',
      format: 'image/png',
      layerPeriod: 'Daily',
      period: 'daily',
      startDate: '2002-06-01T00:00:00Z',
      endDate: '2011-10-04T00:00:00Z',
      dateRanges: [
        {
          startDate: '2002-06-01T00:00:00Z',
          endDate: '2011-10-04T00:00:00Z',
          dateInterval: '1'
        }
      ],
      projections: {
        geographic: {
          source: 'GIBS:geographic',
          matrixSet: '2km'
        }
      },
      palette: {
        id: 'AMSRE_Surface_Rain_Rate_Night'
      },
      conceptIds: [
        {
          title: 'AMSR-E/Aqua L2B Global Swath Surface Precipitation GSFC Profiling Algorithm V003',
          type: 'STD',
          value: 'C1000000001-EDSC',
          version: '3'
        }
      ],
      title: 'Surface Rain Rate (Night)',
      subtitle: 'Aqua / AMSR-E',
      description: 'amsre/AMSRE_Surface_Rain_Rate_Night',
      group: 'overlays',
      product: 'AE_Rain',
      layergroup: 'Precipitation Rate',
      inactive: true,
      tracks: [
        'OrbitTracks_Aqua_Descending'
      ],
      daynight: [
        'night'
      ]
    },
    AIRS_L2_Methane_400hPa_Volume_Mixing_Ratio_Day: {
      id: 'AIRS_L2_Methane_400hPa_Volume_Mixing_Ratio_Day',
      type: 'wmts',
      format: 'image/png',
      layerPeriod: 'Daily',
      period: 'daily',
      startDate: '2002-08-30T00:00:00Z',
      dateRanges: [
        {
          startDate: '2002-08-30T00:00:00Z',
          endDate: '2021-03-02T00:00:00Z',
          dateInterval: '1'
        }
      ],
      projections: {
        geographic: {
          source: 'GIBS:geographic',
          matrixSet: '2km'
        }
      },
      palette: {
        id: 'AIRS_Methane_Volume_Mixing_Ratio'
      },
      conceptIds: [
        {
          title: 'Aqua/AIRS L2 Near Real Time (NRT) Standard Physical Retrieval (AIRS-only) V7.0 at GES DISC',
          type: 'NRT',
          value: 'C1000000002-EDSC',
          version: '7.0'
        },
        {
          title: 'AIRS/Aqua L2 Standard Physical Retrieval (AIRS-only) V006 (AIRS2RET) at GES DISC',
          type: 'STD',
          value: 'C1000000003-EDSC',
          version: '006'
        }
      ],
      title: 'Methane (L2, 400 hPa, Day)',
      subtitle: 'Aqua / AIRS',
      description: 'airs/AIRS_L2_Methane_400hPa_Volume_Mixing_Ratio_Day',
      tags: 'CH4',
      group: 'overlays',
      product: 'AIRS2RET',
      layergroup: 'Methane',
      tracks: [
        'OrbitTracks_Aqua_Ascending'
      ],
      daynight: [
        'day'
      ]
    },
    TEMPO_L2_Ozone_Cloud_Fraction_Granule: {
      title: 'Ozone (L2, Cloud Fraction, Subdaily) (BETA)',
      subtitle: 'TEMPO',
      ongoing: true,
      daynight: [
        'unspecified'
      ],
      conceptIds: [
        {
          type: 'STD',
          value: 'C1000000004-EDSC',
          shortName: 'TEMPO_O3TOT_L2',
          title: 'TEMPO ozone total column V03 (BETA)',
          version: 'V03',
          dataCenter: 'LARC_CLOUD'
        }
      ],
      layerPeriod: 'Subdaily',
      id: 'TEMPO_L2_Ozone_Cloud_Fraction_Granule',
      description: 'tempo/TEMPO_L2_Ozone_Cloud_Fraction_Granule',
      tags: '',
      group: 'overlays',
      layergroup: 'Ozone',
      type: 'granule',
      period: 'subdaily',
      count: 1,
      cmrAvailability: true,
      startDate: '2024-05-13T10:41:03Z',
      disableSnapshot: true,
      format: 'image/png',
      dateRanges: [
        {
          startDate: '2024-05-13T10:41:03Z',
          endDate: '2024-05-13T10:41:03Z',
          dateInterval: '6'
        },
        {
          startDate: '2024-05-13T10:47:43Z',
          endDate: '2024-05-13T10:47:43Z',
          dateInterval: '6'
        },
        {
          startDate: '2024-05-13T10:54:20Z',
          endDate: '2024-05-13T10:54:20Z',
          dateInterval: '6'
        }
      ],
      projections: {
        geographic: {
          source: 'GIBS:geographic',
          matrixSet: '1km'
        }
      },
      palette: {
        id: 'TEMPO_Ozone_Cloud_Fraction'
      }
    },
    breakPointLayer: {
      id: 'VIIRS_NOAA20_Thermal_Anomalies_375m_All',
      type: 'wms',
      format: 'image/png',
      breakPointType: 'max',
      projections: {
        geographic: {
          resolutionBreakPoint: 0.017578125,
          source: 'GIBS:wms'
        },
        arctic: {
          source: 'GIBS:wms:arctic',
          resolutionBreakPoint: 2048
        }
      }
    }
  }
}

export const capabilitiesResponse = `<Capabilities
  xmlns="http://www.opengis.net/wmts/1.0"
  xmlns:ows="http://www.opengis.net/ows/1.1"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:gml="http://www.opengis.net/gml" xsi:schemaLocation="http://www.opengis.net/wmts/1.0 http://schemas.opengis.net/wmts/1.0/wmtsGetCapabilities_response.xsd" version="1.0.0">
  <Contents>
      <TileMatrixSet>
          <ows:Identifier>2km</ows:Identifier>
          <ows:SupportedCRS>urn:ogc:def:crs:OGC:1.3:CRS84</ows:SupportedCRS>
          <TileMatrix>
              <ows:Identifier>0</ows:Identifier>
              <ScaleDenominator>223632905.6114871</ScaleDenominator>
              <TopLeftCorner>-180 90</TopLeftCorner>
              <TileWidth>512</TileWidth>
              <TileHeight>512</TileHeight>
              <MatrixWidth>2</MatrixWidth>
              <MatrixHeight>1</MatrixHeight>
          </TileMatrix>
          <TileMatrix>
              <ows:Identifier>1</ows:Identifier>
              <ScaleDenominator>111816452.8057436</ScaleDenominator>
              <TopLeftCorner>-180 90</TopLeftCorner>
              <TileWidth>512</TileWidth>
              <TileHeight>512</TileHeight>
              <MatrixWidth>3</MatrixWidth>
              <MatrixHeight>2</MatrixHeight>
          </TileMatrix>
          <TileMatrix>
              <ows:Identifier>2</ows:Identifier>
              <ScaleDenominator>55908226.40287178</ScaleDenominator>
              <TopLeftCorner>-180 90</TopLeftCorner>
              <TileWidth>512</TileWidth>
              <TileHeight>512</TileHeight>
              <MatrixWidth>5</MatrixWidth>
              <MatrixHeight>3</MatrixHeight>
          </TileMatrix>
      </TileMatrixSet>
  </Contents>
  <ServiceMetadataURL xlink:href="https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/1.0.0/WMTSCapabilities.xml"/>
</Capabilities>`
