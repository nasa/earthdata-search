import { HarmonyCapabilitiesDocument } from '../../getDerivedHarmonyState'

export const mockHarmonyCapabilitiesDocument: HarmonyCapabilitiesDocument = {
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
      supportedProjections: []
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
          supportedProjections: []
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
          shape: true,
          variable: true
        },
        reprojection: {
          supportedProjections: []
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
          supportedProjections: []
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

export const mockHarmonyCapabiltiesDocumentWithReprojection: HarmonyCapabilitiesDocument = {
  conceptId: 'C2949811996-POCLOUD',
  shortName: 'OPERA_L3_DSWX-S1_V1',
  summary: {
    subsetting: {
      bbox: true,
      shape: true,
      temporal: true,
      variable: true
    },
    reprojection: {
      supportedProjections: [
        {
          name: 'Geographic',
          crs: 'EPSG:4326'
        },
        {
          name: 'NSIDC Sea Ice Polar Stereographic North',
          crs: 'EPSG:3413'
        },
        {
          name: 'WGS 84 / Antarctic Polar Stereographic',
          crs: 'EPSG:3031'
        }
      ]
    },
    concatenation: true,
    outputFormats: [
      {
        name: 'JPEG',
        mimeType: 'image/jpeg'
      },
      {
        name: 'PNG',
        mimeType: 'image/png'
      },
      {
        name: 'GIF',
        mimeType: 'image/GIF'
      }
    ]
  },
  services: [
    {
      name: 'output format of PNG disables all but reprojection',
      href: 'https://cmr.earthdata.nasa.gov/search/concepts/S2697183066-XYZ_PROV',
      capabilities: {
        subsetting: {
          bbox: false,
          shape: false,
          temporal: false,
          variable: false
        },
        reprojection: {
          supportedProjections: [
            {
              name: 'Geographic',
              crs: 'EPSG:4326'
            },
            {
              name: 'NSIDC Sea Ice Polar Stereographic North',
              crs: 'EPSG:3413'
            },
            {
              name: 'WGS 84 / Antarctic Polar Stereographic',
              crs: 'EPSG:3031'
            }
          ]
        },
        concatenation: false,
        outputFormats: [
          {
            name: 'PNG',
            mimeType: 'image/png'
          }
        ]
      }
    },
    {
      name: 'output format of JPEG disables all but one reprojection, geographic',
      href: 'https://cmr.earthdata.nasa.gov/search/concepts/S2697183066-XYZ_PROV',
      capabilities: {
        subsetting: {
          bbox: false,
          shape: false,
          temporal: false,
          variable: false
        },
        reprojection: {
          supportedProjections: [
            {
              name: 'Geographic',
              crs: 'EPSG:4326'
            }
          ]
        },
        concatenation: false,
        outputFormats: [
          {
            name: 'JPEG',
            mimeType: 'image/jpeg'
          }
        ]
      }
    },
    {
      name: 'selecting NSIDC Sea Ice Polar Stereographic North reprojection limits output to GIF',
      href: 'https://cmr.earthdata.nasa.gov/search/concepts/S2697183066-XYZ_PROV',
      capabilities: {
        subsetting: {
          bbox: true,
          shape: true,
          temporal: true,
          variable: true
        },
        reprojection: {
          supportedProjections: [
            {
              name: 'NSIDC Sea Ice Polar Stereographic North',
              crs: 'EPSG:3413'
            }
          ]
        },
        concatenation: true,
        outputFormats: [
          {
            name: 'GIF',
            mimeType: 'image/GIF'
          }
        ]
      }
    }
  ],
  variables: []
}

export const mockNoOutputFormatService: HarmonyCapabilitiesDocument = {
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
      supportedProjections: []
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
          supportedProjections: []
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
          supportedProjections: []
        },
        concatenation: false,
        outputFormats: []
      }
    }
  ]
}
