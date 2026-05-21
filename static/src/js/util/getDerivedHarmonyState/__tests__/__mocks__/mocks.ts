export const mockHarmonyCapabilitiesDocument = {
  conceptId: 'C1234567890-EEDTEST',
  shortName: 'mock_collection',
  summary: {
    subsetting: {
      bbox: true,
      shape: true,
      temporal: true,
      variable: true
    },
    reprojection: {
      supported: false,
      supportedProjections: [],
      interpolationMethods: []
    },
    concatenation: true,
    outputFormats: [
      {
        name: 'CSV',
        mimeType: 'text/csv'
      },
      {
        name: 'NetCDF',
        mimeType: 'application/netcdf'
      },
      {
        name: 'NetCDF-4',
        mimeType: 'application/x-netcdf4'
      },
      {
        name: 'OPeNDAP URL',
        mimeType: 'application/x-netcdf4;profile=opendap_url'
      }
    ]
  },
  variables: [
    {
      name: 'mock_variable',
      href: 'https://cmr.uat.earthdata.nasa.gov/search/concepts/V123456789-EEDTEST',
      scienceKeywords: []
    }
  ],
  services: [
    {
      name: 'giovanni-time-series-adapter',
      href: 'https://cmr.uat.earthdata.nasa.gov/search/concepts/S1258984104-GES_DISC',
      capabilities: {
        subsetting: {
          temporal: true,
          variable: false
        },
        reprojection: {
          supported: false,
          supportedProjections: [],
          interpolationMethods: []
        },
        concatenation: false,
        outputFormats: [
          {
            name: 'CSV',
            mimeType: 'text/csv'
          }
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
        reprojection: {
          supported: false,
          supportedProjections: [],
          interpolationMethods: []
        },
        concatenation: false,
        outputFormats: [
          {
            name: 'NetCDF',
            mimeType: 'application/netcdf'
          },
          {
            name: 'NetCDF-4',
            mimeType: 'application/x-netcdf4'
          }
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
        reprojection: {
          supported: false,
          supportedProjections: [],
          interpolationMethods: []
        },
        concatenation: true,
        outputFormats: [
          {
            name: 'OPeNDAP URL',
            mimeType: 'application/x-netcdf4;profile=opendap_url'
          }
        ]
      }
    }
  ]
}

export const mockNoOutputFormatService = {
  conceptId: 'C1234567890-EEDTEST-NoServices',
  shortName: 'mock_collection',
  summary: {
    subsetting: {
      bbox: true,
      shape: true,
      temporal: true,
      variable: true
    },
    reprojection: {
      supported: false,
      supportedProjections: [],
      interpolationMethods: []
    },
    concatenation: false,
    outputFormats: []
  },
  variables: [],
  services: [
    {
      name: 'giovanni-time-series-adapter',
      href: 'https://cmr.uat.earthdata.nasa.gov/search/concepts/S1258984104-GES_DISC',
      capabilities: {
        subsetting: {
          temporal: true,
          variable: true
        },
        reprojection: {
          supported: false,
          supportedProjections: [],
          interpolationMethods: []
        },
        concatenation: false,
        outputFormats: [
          {
            name: 'CSV',
            mimeType: 'text/csv'
          }
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
        },
        reprojection: {
          supported: false,
          supportedProjections: [],
          interpolationMethods: []
        },
        concatenation: false,
        outputFormats: []
      }
    }
  ]
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

export const mockUserSelectionsConcatenateSubsetting = {
  concatenate: true
}

export const mockUserSelectionsVariablesSubsetting = {
  selectedVariables: ['mock-variable']
}
