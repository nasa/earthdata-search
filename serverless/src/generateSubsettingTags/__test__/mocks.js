export const cmrServiceResponse = [
  {
    meta: {
      'concept-id': 'S00000001-EDSC'
    },
    umm: {
      Type: 'ESI',
      RelatedURLs: [
        {
          Description: 'Access the ACADIS EOL Map Service.',
          URLContentType: 'DistributionURL',
          Type: 'GET SERVICE',
          Subtype: 'ACCESS MAP VIEWER',
          URL: 'http://mapserver.eol.ucar.edu/acadis/'
        }, {
          URLContentType: 'DataCenterURL',
          Type: 'HOME PAGE',
          URL: 'https://search.earthdata.nasa.gov/'
        }
      ]
    }
  }, {
    meta: {
      'concept-id': 'S00000002-EDSC'
    },
    umm: {
      Type: 'ESI'
    }
  }, {
    meta: {
      'concept-id': 'S00000003-EDSC'
    },
    umm: {
      Type: 'ECHO ORDERS',
      RelatedURLs: [
        {
          Description: 'Access the ACADIS EOL Map Service.',
          URLContentType: 'DistributionURL',
          Type: 'GET SERVICE',
          Subtype: 'ACCESS MAP VIEWER',
          URL: 'http://mapserver.eol.ucar.edu/acadis/'
        }, {
          Description: 'Access the ACADIS EOL Map Service.',
          URLContentType: 'DistributionURL',
          Type: 'GET SERVICE',
          Subtype: 'ACCESS MAP VIEWER',
          URL: 'http://mapserver.eol.ucar.edu/acadis/'
        }
      ]
    }
  }, {
    meta: {
      'concept-id': 'S00000004-EDSC'
    },
    umm: {
      Type: 'WEB SERVICES',
      RelatedURLs: [
        {
          Description: 'Access the ACADIS EOL Map Service.',
          URLContentType: 'DistributionURL',
          Type: 'GET SERVICE',
          Subtype: 'ACCESS MAP VIEWER',
          URL: 'http://mapserver.eol.ucar.edu/acadis/'
        }, {
          Description: 'Access the ACADIS EOL Map Service.',
          URLContentType: 'DistributionURL',
          Type: 'GET SERVICE',
          Subtype: 'ACCESS MAP VIEWER',
          URL: 'http://mapserver.eol.ucar.edu/acadis/'
        }
      ]
    }
  }, {
    meta: {
      'concept-id': 'S00000005-EDSC'
    },
    umm: {
      Type: 'OPeNDAP',
      RelatedURLs: [
        {
          Description: 'Access the ACADIS EOL Map Service.',
          URLContentType: 'DistributionURL',
          Type: 'GET SERVICE',
          Subtype: 'ACCESS MAP VIEWER',
          URL: 'http://mapserver.eol.ucar.edu/acadis/'
        }, {
          Description: 'Access the ACADIS EOL Map Service.',
          URLContentType: 'DistributionURL',
          Type: 'GET SERVICE',
          Subtype: 'ACCESS MAP VIEWER',
          URL: 'http://mapserver.eol.ucar.edu/acadis/'
        }
      ]
    }
  }
]

export const relevantServices = {
  'S00000001-EDSC':
  {
    collections: [],
    tagData: {
      id: 'S00000001-EDSC',
      type: 'ESI',
      url: 'http://mapserver.eol.ucar.edu/acadis/'
    }
  },
  'S00000002-EDSC':
  {
    collections: [],
    tagData: { id: 'S00000002-EDSC', type: 'ESI' }
  },
  'S00000003-EDSC':
  {
    collections: [],
    tagData: {
      id: 'S00000003-EDSC',
      type: 'ECHO ORDERS',
      url: 'http://mapserver.eol.ucar.edu/acadis/'
    }
  },
  'S00000005-EDSC':
  {
    collections: [],
    tagData: { id: 'S00000005-EDSC', type: 'OPeNDAP' }
  }
}

export const relevantServiceCollections = [
  {
    id: 'C00000001-EDSC',
    associations: {
      services: ['S00000001-EDSC']
    }
  }, {
    id: 'C00000002-EDSC',
    associations: {
      services: ['S00000002-EDSC']
    }
  }, {
    id: 'C00000003-EDSC',
    associations: {
      services: [
        'S00000002-EDSC',
        'S00000004-EDSC'
      ]
    }
  }, {
    id: 'C00000005-EDSC',
    associations: {
      services: [
        'S00000005-EDSC'
      ]
    }
  }, {
    id: 'C00000009-EDSC',
    associations: {
      services: [
        'S00000003-EDSC'
      ]
    }
  }
]
