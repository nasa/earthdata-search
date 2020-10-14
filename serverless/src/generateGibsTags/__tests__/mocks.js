export const gibsResponse = {
  layers: {
    MODIS_Aqua_L3_SST_MidIR_4km_Night_Daily: {
      startDate: '2002-07-04T00:00:00Z',
      palette: {
        id: 'MODIS_Aqua_L3_SST_MidIR_4km_Night_Daily'
      },
      description: 'modis/aqua/MODIS_Aqua_L3_SST_MidIR_4km_Night_Daily',
      format: 'image/png',
      title: 'Sea Surface Temperature (L3, Night, Daily, Mid Infrared, 4 km)',
      period: 'daily',
      layergroup: [
        'modis',
        'modis_aqua'
      ],
      group: 'overlays',
      dateRanges: [
        {
          startDate: '2002-07-04T00:00:00Z',
          dateInterval: '1',
          endDate: '2019-05-06T00:00:00Z'
        }
      ],
      projections: {
        geographic: {
          source: 'GIBS:geographic',
          matrixSet: '2km'
        }
      },
      subtitle: 'Aqua / MODIS',
      product: 'MODIS_AQUA_L3_SST_MID-IR_DAILY_4KM_NIGHTTIME_V2014.0',
      type: 'wmts',
      id: 'MODIS_Aqua_L3_SST_MidIR_4km_Night_Daily',
      tags: 'ssc podaac PO.DAAC'
    },
    OrbitTracks_Terra_Ascending: {
      startDate: '2000-02-24',
      palette: {
        id: 'OrbitTracks_Terra_Ascending',
        immutable: true
      },
      group: 'overlays',
      description: 'reference/orbits/OrbitTracks_Terra_Ascending',
      format: 'image/png',
      track: 'ascending',
      daynight: 'night',
      title: 'Terra Orbital Track & Overpass Time (Ascending/Night)',
      period: 'daily',
      layergroup: [
        'reference',
        'reference_orbits'
      ],
      tileSize: [
        512,
        512
      ],
      projections: {
        antarctic: {
          source: 'GIBS:wms:antarctic'
        },
        geographic: {
          source: 'GIBS:wms'
        },
        arctic: {
          source: 'GIBS:wms:arctic'
        }
      },
      subtitle: 'Terra / Space-Track.org',
      type: 'wms',
      id: 'OrbitTracks_Terra_Ascending',
      tags: 'tracks'
    },
    CERES_Combined_TOA_Window_Region_Flux_All_Sky_Monthly: {
      startDate: '2002-07-01T00:00:00Z',
      palette: {
        id: 'CERES_Combined_TOA_Window_Region_Flux_All_Sky_Monthly'
      },
      group: 'overlays',
      endDate: '2018-04-01T00:00:00Z',
      description: 'ceres/CERES_Combined_TOA_Window_Region_Flux_All_Sky_Monthly',
      format: 'image/png',
      title: 'TOA Window-Region Flux (Monthly, All-Sky)',
      period: 'monthly',
      layergroup: [
        'ceres'
      ],
      wrapadjacentdays: true,
      dateRanges: [
        {
          startDate: '2002-07-01T00:00:00Z',
          dateInterval: '1',
          endDate: '2018-03-01T00:00:00Z'
        }
      ],
      inactive: true,
      projections: {
        geographic: {
          source: 'GIBS:geographic',
          matrixSet: '2km'
        }
      },
      subtitle: 'Terra and Aqua/CERES',
      product: '',
      type: 'wmts',
      id: 'CERES_Combined_TOA_Window_Region_Flux_All_Sky_Monthly',
      tags: 'top of atmosphere, cloud radiative effect'
    },
    ExcludedProjection_Value: {
      startDate: '2002-07-01T00:00:00Z',
      palette: {
        id: 'CERES_Combined_TOA_Window_Region_Flux_All_Sky_Monthly'
      },
      group: 'overlays',
      endDate: '2018-04-01T00:00:00Z',
      description: 'ceres/CERES_Combined_TOA_Window_Region_Flux_All_Sky_Monthly',
      format: 'image/png',
      title: 'TOA Window-Region Flux (Monthly, All-Sky)',
      period: 'monthly',
      layergroup: [
        'ceres'
      ],
      wrapadjacentdays: true,
      dateRanges: [
        {
          startDate: '2002-07-01T00:00:00Z',
          dateInterval: '1',
          endDate: '2018-03-01T00:00:00Z'
        }
      ],
      inactive: true,
      projections: {
        edsc: {
          source: 'ESDC:projection',
          matrixSet: '2km'
        }
      },
      subtitle: 'Terra and Aqua/CERES',
      product: 'ExcludedProjection_Value',
      type: 'wmts',
      id: 'CERES_Combined_TOA_Window_Region_Flux_All_Sky_Monthly',
      tags: 'top of atmosphere, cloud radiative effect'
    },
    MissingProjection_Value: {
      startDate: '2002-07-01T00:00:00Z',
      palette: {
        id: 'CERES_Combined_TOA_Window_Region_Flux_All_Sky_Monthly'
      },
      group: 'overlays',
      endDate: '2018-04-01T00:00:00Z',
      description: 'ceres/CERES_Combined_TOA_Window_Region_Flux_All_Sky_Monthly',
      format: 'image/png',
      title: 'TOA Window-Region Flux (Monthly, All-Sky)',
      period: 'monthly',
      layergroup: [
        'ceres'
      ],
      wrapadjacentdays: true,
      dateRanges: [
        {
          startDate: '2002-07-01T00:00:00Z',
          dateInterval: '1',
          endDate: '2018-03-01T00:00:00Z'
        }
      ],
      inactive: true,
      subtitle: 'Terra and Aqua/CERES',
      product: 'MissingProjection_Value',
      type: 'wmts',
      id: 'CERES_Combined_TOA_Window_Region_Flux_All_Sky_Monthly',
      tags: 'top of atmosphere, cloud radiative effect'
    }
  },
  products: {
    'MODIS_AQUA_L3_SST_MID-IR_DAILY_4KM_NIGHTTIME_V2014.0': {
      query: {
        shortName: 'MODIS_AQUA_L3_SST_MID-IR_DAILY_4KM_NIGHTTIME_V2014.0',
        dayNightFlag: 'NIGHT'
      },
      handler: 'List',
      name: 'PODAAC-MODAM-1D4N4'
    },
    ExcludedProjection_Value: {
      query: {
        shortName: 'SOME_VALID_SHORTNAME'
      }
    },
    MissingProjection_Value: {
      query: {
        shortName: 'SOME_VALID_SHORTNAME.1'
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

export const matrixLimits = {
  '2km': {
    0: {
      matrixHeight: 1,
      matrixWidth: 2
    },
    1: {
      matrixHeight: 2,
      matrixWidth: 3
    },
    2: {
      matrixHeight: 3,
      matrixWidth: 5
    }
  }
}
