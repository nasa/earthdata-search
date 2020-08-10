
export const echoOrder = {
  id: 84,
  jsondata: {
    source: '?p=!C194001243-LPDAAC_ECS&pg[1][v]=t&m=219.36362750573883!-493.59375!0!1!0!0%2C2&ff=Customizable&tl=1536100540!3!!'
  },
  environment: 'prod',
  access_method: {
    type: 'ECHO ORDERS',
    is_valid: true,
    order: {
      order_status: 'not_validated'
    }
  },
  collection_id: 'C194001243-LPDAAC_ECS',
  collection_metadata: {
    id: 'C194001243-LPDAAC_ECS',
    tags: {
      edsc_extra_gibs: {
        data: [
          {
            geo: true,
            group: 'overlays',
            match: {
              time_start: '>=2000-03-05T00:00:00Z'
            },
            title: 'Vegetation Index (L3, 16-Day)',
            arctic: false,
            format: 'png',
            source: 'Terra / MODIS',
            product: 'MODIS_Terra_L3_NDVI_16Day',
            antarctic: false,
            resolution: '250m',
            geo_resolution: '250m',
            max_native_zoom: 5,
            arctic_resolution: null,
            antarctic_resolution: null
          },
          {
            geo: true,
            group: 'overlays',
            match: {
              time_start: '>=2000-03-05T00:00:00Z'
            },
            title: 'Enhanced Vegetation Index (L3, 16-Day)',
            arctic: false,
            format: 'png',
            source: 'Terra / MODIS',
            product: 'MODIS_Terra_L3_EVI_16Day',
            antarctic: false,
            resolution: '250m',
            geo_resolution: '250m',
            max_native_zoom: 5,
            arctic_resolution: null,
            antarctic_resolution: null
          }
        ]
      },
      'edsc.extra.serverless.gibs': {
        data: [
          {
            group: 'overlays',
            match: {
              time_start: '>=2000-03-05T00:00:00Z'
            },
            title: 'Vegetation Index (L3, 16-Day)',
            arctic: false,
            format: 'png',
            source: 'Terra / MODIS',
            product: 'MODIS_Terra_L3_NDVI_16Day',
            antarctic: false,
            geographic: true,
            arctic_resolution: null,
            antarctic_resolution: null,
            geographic_resolution: '250m'
          },
          {
            group: 'overlays',
            match: {
              time_start: '>=2000-03-05T00:00:00Z'
            },
            title: 'Enhanced Vegetation Index (L3, 16-Day)',
            arctic: false,
            format: 'png',
            source: 'Terra / MODIS',
            product: 'MODIS_Terra_L3_EVI_16Day',
            antarctic: false,
            geographic: true,
            arctic_resolution: null,
            antarctic_resolution: null,
            geographic_resolution: '250m'
          }
        ]
      },
      edsc_extra_subset_service_esi: {
        data: [
          'S1568897222-LPDAAC_ECS'
        ]
      },
      org_ceos_wgiss_cwic_granules_prod: {},
      'edsc.extra.serverless.subset_service.esi': {
        data: {
          id: 'S1568897222-LPDAAC_ECS',
          url: 'https://e5eil01.cr.usgs.gov/ops/egi/request',
          type: 'ESI',
          updated_at: '2019-07-08T21:01:29.509Z'
        }
      },
      'edsc.extra.serverless.collection_capabilities': {
        data: {
          cloud_cover: true,
          day_night_flag: true,
          granule_online_access_flag: true
        }
      },
      'edsc.extra.serverless.subset_service.echo_orders': {
        data: {
          id: 'S1568897323-LPDAAC_ECS',
          url: 'https://e5eil01.cr.usgs.gov/ops/egi/request',
          type: 'ECHO ORDERS',
          updated_at: '2019-07-08T21:01:19.190Z',
          option_definitions: [
            {
              id: 'EC7AA66E-00D6-ED42-3043-B2F1534AA85A',
              name: 'Delivery Option'
            }
          ]
        }
      }
    },
    boxes: [
      '-90 -180 90 180'
    ],
    links: [
      {
        rel: 'http://esipfed.org/ns/fedsearch/1.1/metadata#',
        href: 'https://doi.org/10.5067/MODIS/MOD13Q1.006',
        hreflang: 'en-US'
      },
      {
        rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
        href: 'https://e4ftl01.cr.usgs.gov/MOLT/MOD13Q1.006/',
        hreflang: 'en-US'
      },
      {
        rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
        href: 'http://earthexplorer.usgs.gov/',
        hreflang: 'en-US'
      },
      {
        rel: 'http://esipfed.org/ns/fedsearch/1.1/metadata#',
        href: 'https://lpdaac.usgs.gov/',
        hreflang: 'en-US'
      },
      {
        rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
        href: 'https://search.earthdata.nasa.gov/search?q=MOD13Q1+V006',
        hreflang: 'en-US'
      },
      {
        rel: 'http://esipfed.org/ns/fedsearch/1.1/metadata#',
        href: 'https://opendap.cr.usgs.gov/opendap/hyrax/MOD13Q1.006/contents.html',
        hreflang: 'en-US'
      },
      {
        rel: 'http://esipfed.org/ns/fedsearch/1.1/documentation#',
        href: 'https://lpdaac.usgs.gov/documents/103/MOD13_User_Guide_V6.pdf',
        hreflang: 'en-US'
      },
      {
        rel: 'http://esipfed.org/ns/fedsearch/1.1/documentation#',
        href: 'https://lpdaac.usgs.gov/documents/104/MOD13_ATBD.pdf',
        hreflang: 'en-US'
      },
      {
        rel: 'http://esipfed.org/ns/fedsearch/1.1/documentation#',
        href: 'https://ladsweb.modaps.eosdis.nasa.gov/filespec/MODIS/6/MOD13Q1',
        hreflang: 'en-US'
      },
      {
        rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
        href: 'https://lpdaac.usgs.gov/tools/appeears/',
        hreflang: 'en-US'
      },
      {
        rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#',
        href: 'https://e4ftl01.cr.usgs.gov//WORKING/BRWS/Browse.001/2019.06.19/BROWSE.MYD13Q1.A2019153.h19v04.006.2019170000840.1.jpg?_ga=2.74343506.116070394.1561987039-1109527761.1561753117',
        hreflang: 'en-US'
      }
    ],
    title: 'MODIS/Terra Vegetation Indices 16-Day L3 Global 250m SIN Grid V006',
    isCwic: false,
    summary: 'The Terra Moderate Resolution Imaging Spectroradiometer (MODIS) Vegetation Indices (MOD13Q1) Version 6 data are generated every 16 days at 250 meter (m) spatial resolution as a Level 3 product. The MOD13Q1 product provides two primary vegetation layers. The first is the Normalized Difference Vegetation Index (NDVI) which is referred to as the continuity index to the existing National Oceanic and Atmospheric Administration-Advanced Very High Resolution Radiometer (NOAA-AVHRR) derived NDVI. The second vegetation layer is the Enhanced Vegetation Index (EVI), which has improved sensitivity over high biomass regions. The algorithm chooses the best available pixel value from all the acquisitions from the 16 day period. The criteria used is low clouds, low view angle, and the highest NDVI/EVI value.\r\n\r\nAlong with the vegetation layers and the two quality layers, the HDF file will have MODIS reflectance bands 1 (red), 2 (near-infrared), 3 (blue), and 7 (mid-infrared), as well as four observation layers. \r\n\r\nImprovements/Changes from Previous Versions\r\n\r\n* The 16-day composite VI is generated using the two 8-day composite surface reflectance granules (MOD09A1) (https://doi.org/10.5067/MODIS/MOD09A1.006) in the 16-day period.\r\n* This surface reflectance input is based on the minimum blue compositing approach used to generate the 8-day surface reflectance product.\r\n* The product format is consistent with the Version 5 product generated using the Level 2 gridded daily surface reflectance product. \r\n* A frequently updated long-term global Climate Modeling Grid (CMG) Average Vegetation Index product database is used to fill the gaps in the CMG product suite.',
    updated: '2015-09-30T10:47:59.761Z',
    thumbnail: 'https://cmr.earthdata.nasa.gov/browse-scaler/browse_images/datasets/C194001243-LPDAAC_ECS?h=85&w=85',
    dataset_id: 'MODIS/Terra Vegetation Indices 16-Day L3 Global 250m SIN Grid V006',
    short_name: 'MOD13Q1',
    time_start: '2000-02-18T00:00:00.000Z',
    version_id: '006',
    browse_flag: true,
    data_center: 'LPDAAC_ECS',
    has_formats: false,
    associations: {
      services: [
        'S1568897222-LPDAAC_ECS',
        'S1568897323-LPDAAC_ECS',
        'S1609932007-LPDAAC_ECS'
      ]
    },
    has_granules: true,
    granule_count: 129486,
    has_variables: true,
    organizations: [
      'LP DAAC',
      'NASA/GSFC/SED/ESD/TISL/MODAPS'
    ],
    archive_center: 'LP DAAC',
    has_transforms: true,
    has_map_imagery: true,
    original_format: 'UMM_JSON',
    orbit_parameters: {},
    coordinate_system: 'CARTESIAN',
    online_access_flag: true,
    processing_level_id: '3',
    has_spatial_subsetting: true,
    has_temporal_subsetting: true
  },
  granule_params: {
    page_num: 1,
    sort_key: '-start_date',
    temporal: '',
    page_size: 20,
    echo_collection_id: 'C194001243-LPDAAC_ECS',
    two_d_coordinate_system: ''
  },
  granule_count: 129486
}

export const esiOrder = {
  id: 84,
  jsondata: {
    source: '?p=!C194001243-LPDAAC_ECS&pg[1][v]=t&m=219.36362750573883!-493.59375!0!1!0!0%2C2&ff=Customizable&tl=1536100540!3!!'
  },
  environment: 'prod',
  access_method: {
    type: 'ESI',
    is_valid: true,
    order: {
      order_status: 'in progress',
      order_id: [
        '5000000333461',
        '5000000333462'
      ],
      service_options: {
        total_orders: 2,
        total_number: 181,
        total_complete: 1,
        total_processed: 81,
        download_urls: [
          'https://n5eil02u.ecs.nsidc.org/esir/5000000333461.html',
          'https://n5eil02u.ecs.nsidc.org/esir/5000000333461.zip'
        ],
        orders: [
          {
            download_urls: [
              'https://n5eil02u.ecs.nsidc.org/esir/5000000333461.html',
              'https://n5eil02u.ecs.nsidc.org/esir/5000000333461.zip'
            ],
            order_id: '5000000333461',
            order_status: 'complete',
            total_number: 81,
            total_processed: 81,
            contact: {
              name: 'NSIDC User Services',
              email: 'nsidc@nsidc.org'
            }
          },
          {
            download_urls: [
              'https://n5eil02u.ecs.nsidc.org/esir/5000000333462.html',
              'https://n5eil02u.ecs.nsidc.org/esir/5000000333462.zip'
            ],
            order_id: '5000000333462',
            order_status: 'in_progress',
            total_number: 100,
            total_processed: 13,
            contact: {
              name: 'NSIDC User Services',
              email: 'nsidc@nsidc.org'
            }
          }
        ]
      }
    }
  },
  collection_id: 'C194001243-LPDAAC_ECS',
  collection_metadata: {
    id: 'C194001243-LPDAAC_ECS',
    tags: {
      edsc_extra_gibs: {
        data: [
          {
            geo: true,
            group: 'overlays',
            match: {
              time_start: '>=2000-03-05T00:00:00Z'
            },
            title: 'Vegetation Index (L3, 16-Day)',
            arctic: false,
            format: 'png',
            source: 'Terra / MODIS',
            product: 'MODIS_Terra_L3_NDVI_16Day',
            antarctic: false,
            resolution: '250m',
            geo_resolution: '250m',
            max_native_zoom: 5,
            arctic_resolution: null,
            antarctic_resolution: null
          },
          {
            geo: true,
            group: 'overlays',
            match: {
              time_start: '>=2000-03-05T00:00:00Z'
            },
            title: 'Enhanced Vegetation Index (L3, 16-Day)',
            arctic: false,
            format: 'png',
            source: 'Terra / MODIS',
            product: 'MODIS_Terra_L3_EVI_16Day',
            antarctic: false,
            resolution: '250m',
            geo_resolution: '250m',
            max_native_zoom: 5,
            arctic_resolution: null,
            antarctic_resolution: null
          }
        ]
      },
      'edsc.extra.serverless.gibs': {
        data: [
          {
            group: 'overlays',
            match: {
              time_start: '>=2000-03-05T00:00:00Z'
            },
            title: 'Vegetation Index (L3, 16-Day)',
            arctic: false,
            format: 'png',
            source: 'Terra / MODIS',
            product: 'MODIS_Terra_L3_NDVI_16Day',
            antarctic: false,
            geographic: true,
            arctic_resolution: null,
            antarctic_resolution: null,
            geographic_resolution: '250m'
          },
          {
            group: 'overlays',
            match: {
              time_start: '>=2000-03-05T00:00:00Z'
            },
            title: 'Enhanced Vegetation Index (L3, 16-Day)',
            arctic: false,
            format: 'png',
            source: 'Terra / MODIS',
            product: 'MODIS_Terra_L3_EVI_16Day',
            antarctic: false,
            geographic: true,
            arctic_resolution: null,
            antarctic_resolution: null,
            geographic_resolution: '250m'
          }
        ]
      },
      edsc_extra_subset_service_esi: {
        data: [
          'S1568897222-LPDAAC_ECS'
        ]
      },
      org_ceos_wgiss_cwic_granules_prod: {},
      'edsc.extra.serverless.subset_service.esi': {
        data: {
          id: 'S1568897222-LPDAAC_ECS',
          url: 'https://e5eil01.cr.usgs.gov/ops/egi/request',
          type: 'ESI',
          updated_at: '2019-07-08T21:01:29.509Z'
        }
      },
      'edsc.extra.serverless.collection_capabilities': {
        data: {
          cloud_cover: true,
          day_night_flag: true,
          granule_online_access_flag: true
        }
      },
      'edsc.extra.serverless.subset_service.echo_orders': {
        data: {
          id: 'S1568897323-LPDAAC_ECS',
          url: 'https://e5eil01.cr.usgs.gov/ops/egi/request',
          type: 'ECHO ORDERS',
          updated_at: '2019-07-08T21:01:19.190Z',
          option_definitions: [
            {
              id: 'EC7AA66E-00D6-ED42-3043-B2F1534AA85A',
              name: 'Delivery Option'
            }
          ]
        }
      }
    },
    boxes: [
      '-90 -180 90 180'
    ],
    links: [
      {
        rel: 'http://esipfed.org/ns/fedsearch/1.1/metadata#',
        href: 'https://doi.org/10.5067/MODIS/MOD13Q1.006',
        hreflang: 'en-US'
      },
      {
        rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
        href: 'https://e4ftl01.cr.usgs.gov/MOLT/MOD13Q1.006/',
        hreflang: 'en-US'
      },
      {
        rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
        href: 'http://earthexplorer.usgs.gov/',
        hreflang: 'en-US'
      },
      {
        rel: 'http://esipfed.org/ns/fedsearch/1.1/metadata#',
        href: 'https://lpdaac.usgs.gov/',
        hreflang: 'en-US'
      },
      {
        rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
        href: 'https://search.earthdata.nasa.gov/search?q=MOD13Q1+V006',
        hreflang: 'en-US'
      },
      {
        rel: 'http://esipfed.org/ns/fedsearch/1.1/metadata#',
        href: 'https://opendap.cr.usgs.gov/opendap/hyrax/MOD13Q1.006/contents.html',
        hreflang: 'en-US'
      },
      {
        rel: 'http://esipfed.org/ns/fedsearch/1.1/documentation#',
        href: 'https://lpdaac.usgs.gov/documents/103/MOD13_User_Guide_V6.pdf',
        hreflang: 'en-US'
      },
      {
        rel: 'http://esipfed.org/ns/fedsearch/1.1/documentation#',
        href: 'https://lpdaac.usgs.gov/documents/104/MOD13_ATBD.pdf',
        hreflang: 'en-US'
      },
      {
        rel: 'http://esipfed.org/ns/fedsearch/1.1/documentation#',
        href: 'https://ladsweb.modaps.eosdis.nasa.gov/filespec/MODIS/6/MOD13Q1',
        hreflang: 'en-US'
      },
      {
        rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
        href: 'https://lpdaac.usgs.gov/tools/appeears/',
        hreflang: 'en-US'
      },
      {
        rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#',
        href: 'https://e4ftl01.cr.usgs.gov//WORKING/BRWS/Browse.001/2019.06.19/BROWSE.MYD13Q1.A2019153.h19v04.006.2019170000840.1.jpg?_ga=2.74343506.116070394.1561987039-1109527761.1561753117',
        hreflang: 'en-US'
      }
    ],
    title: 'MODIS/Terra Vegetation Indices 16-Day L3 Global 250m SIN Grid V006',
    isCwic: false,
    summary: 'The Terra Moderate Resolution Imaging Spectroradiometer (MODIS) Vegetation Indices (MOD13Q1) Version 6 data are generated every 16 days at 250 meter (m) spatial resolution as a Level 3 product. The MOD13Q1 product provides two primary vegetation layers. The first is the Normalized Difference Vegetation Index (NDVI) which is referred to as the continuity index to the existing National Oceanic and Atmospheric Administration-Advanced Very High Resolution Radiometer (NOAA-AVHRR) derived NDVI. The second vegetation layer is the Enhanced Vegetation Index (EVI), which has improved sensitivity over high biomass regions. The algorithm chooses the best available pixel value from all the acquisitions from the 16 day period. The criteria used is low clouds, low view angle, and the highest NDVI/EVI value.\r\n\r\nAlong with the vegetation layers and the two quality layers, the HDF file will have MODIS reflectance bands 1 (red), 2 (near-infrared), 3 (blue), and 7 (mid-infrared), as well as four observation layers. \r\n\r\nImprovements/Changes from Previous Versions\r\n\r\n* The 16-day composite VI is generated using the two 8-day composite surface reflectance granules (MOD09A1) (https://doi.org/10.5067/MODIS/MOD09A1.006) in the 16-day period.\r\n* This surface reflectance input is based on the minimum blue compositing approach used to generate the 8-day surface reflectance product.\r\n* The product format is consistent with the Version 5 product generated using the Level 2 gridded daily surface reflectance product. \r\n* A frequently updated long-term global Climate Modeling Grid (CMG) Average Vegetation Index product database is used to fill the gaps in the CMG product suite.',
    updated: '2015-09-30T10:47:59.761Z',
    thumbnail: 'https://cmr.earthdata.nasa.gov/browse-scaler/browse_images/datasets/C194001243-LPDAAC_ECS?h=85&w=85',
    dataset_id: 'MODIS/Terra Vegetation Indices 16-Day L3 Global 250m SIN Grid V006',
    short_name: 'MOD13Q1',
    time_start: '2000-02-18T00:00:00.000Z',
    version_id: '006',
    browse_flag: true,
    data_center: 'LPDAAC_ECS',
    has_formats: false,
    associations: {
      services: [
        'S1568897222-LPDAAC_ECS',
        'S1568897323-LPDAAC_ECS',
        'S1609932007-LPDAAC_ECS'
      ]
    },
    has_granules: true,
    granule_count: 129486,
    has_variables: true,
    organizations: [
      'LP DAAC',
      'NASA/GSFC/SED/ESD/TISL/MODAPS'
    ],
    archive_center: 'LP DAAC',
    has_transforms: true,
    has_map_imagery: true,
    original_format: 'UMM_JSON',
    orbit_parameters: {},
    coordinate_system: 'CARTESIAN',
    online_access_flag: true,
    processing_level_id: '3',
    has_spatial_subsetting: true,
    has_temporal_subsetting: true
  },
  granule_params: {
    page_num: 1,
    sort_key: '-start_date',
    temporal: '',
    page_size: 20,
    echo_collection_id: 'C194001243-LPDAAC_ECS',
    two_d_coordinate_system: ''
  },
  granule_count: 129486
}
