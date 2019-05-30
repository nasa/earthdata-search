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
    }
  },
  products: {
    'MODIS_AQUA_L3_SST_MID-IR_DAILY_4KM_NIGHTTIME_V2014.0': {
      query: {
        shortName: 'MODIS_AQUA_L3_SST_MID-IR_DAILY_4KM_NIGHTTIME_V2014.0'
      },
      handler: 'List',
      name: 'PODAAC-MODAM-1D4N4'
    }
  }
}

export default gibsResponse
