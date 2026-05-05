export const mockHarmonyCapabilitiesDocument = {
  bboxSubset: true,
  concatenate: false,
  conceptId: 'C1234567890-EEDTEST',
  reproject: false,
  outputFormats: [
    'text/csv',
    'application/netcdf',
    'application/x-netcdf4',
    'application/x-netcdf4;profile=opendap_url'
  ],
  shapeSubset: true,
  shortName: 'mock_collection',
  temporalSubset: true,
  variableSubset: true,
  variables: [
    {
      name: 'mock_variable',
      href: 'https://cmr.uat.earthdata.nasa.gov/search/concepts/V123456789-EEDTEST'
    }
  ],
  services: [
    {
      name: 'giovanni-time-series-adapter',
      href: 'https://cmr.uat.earthdata.nasa.gov/search/concepts/S1258984104-GES_DISC',
      capabilities: {
        subsetting: {
          temporal: true,
          variable: true,
          multiple_variable: false
        },
        output_formats: [
          'text/csv'
        ]
      }
    },
    {
      name: 'sds/HOSS-geographic',
      href: 'https://cmr.uat.earthdata.nasa.gov/search/concepts/S1240682712-EEDTEST',
      capabilities: {
        subsetting: {
          temporal: true,
          bbox: true,
          dimension: true,
          shape: true,
          variable: true
        },
        output_formats: [
          'application/netcdf',
          'application/x-netcdf4'
        ]
      }
    },
    {
      name: 'sds/hoss-opendap-url',
      href: 'https://cmr.uat.earthdata.nasa.gov/search/concepts/S1276836870-EEDTEST',
      capabilities: {
        subsetting: {
          bbox: true,
          variable: true
        },
        output_formats: [
          'application/x-netcdf4;profile=opendap_url'
        ]
      }
    }
  ]
}

export const mockNoOutputFormatService = {
  bboxSubset: true,
  concatenate: false,
  conceptId: 'C1234567890-EEDTEST-NoServices',
  reproject: false,
  outputFormats: [],
  services: [
    {
      name: 'giovanni-time-series-adapter',
      href: 'https://cmr.uat.earthdata.nasa.gov/search/concepts/S1258984104-GES_DISC',
      capabilities: {
        subsetting: {
          temporal: true,
          variable: true
        },
        output_formats: [
          'text/csv'
        ]
      }
    },
    {
      name: 'sds/HOSS-geographic',
      href: 'https://cmr.uat.earthdata.nasa.gov/search/concepts/S1240682712-EEDTEST',
      capabilities: {
        subsetting: {
          bbox: true,
          shape: true,
          variable: true
        }
      }
    }
  ],
  shapeSubset: true,
  shortName: 'mock_collection',
  temporalSubset: true,
  variableSubset: true,
  variables: []
}

export const mockUserSelectionsTemporal = {
  temporalSubset: true
}

export const mockUserSelectionsSpatial = {
  spatialSubset: true
}

export const mockUserSelectionsOutputFormat = {
  selectedOutputFormat: 'text/csv'
}

export const mockUserSelectionsOutputFormatandSubsetting = {
  spatialSubset: true,
  selectedOutputFormat: 'application/x-netcdf4'
}
