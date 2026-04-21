export const mockServices = [
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

export const mockNoOutputFormatService = [
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
        bbox: true,
        dimension: true,
        shape: true,
        variable: true
      }
    }
  }
]

export const mockUserSelectionsTemporal = {
  spatialSubset: false,
  temporalSubset: true,
  concatenate: false,
  outputFormatSelection: undefined
}

export const mockUserSelectionsSpatial = {
  spatialSubset: true,
  temporalSubset: false,
  concatenate: false,
  outputFormatSelection: undefined
}

export const mockUserSelectionsOutputFormat = {
  spatialSubset: false,
  temporalSubset: false,
  concatenate: false,
  outputFormatSelection: 'text/csv'
}

export const mockUserSelectionsOutputFormatandSubsetting = {
  spatialSubset: true,
  temporalSubset: false,
  concatenate: false,
  outputFormatSelection: 'application/x-netcdf4'
}
