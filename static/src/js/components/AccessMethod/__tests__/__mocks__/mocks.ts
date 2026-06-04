import {
  DerivedHarmonyState,
  HarmonyCapabilitiesDocument
} from '../../../../util/getDerivedHarmonyState/getDerivedHarmonyState'
import { HarmonyAccessMethod, OpendapAccessMethod } from '../../../../zustand/types'

export const echoForm = '<form xmlns="http://echo.nasa.gov/v9/echoforms" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> <model> <instance> <ecs:options xmlns:ecs="http://ecs.nasa.gov/options"> <!-- ECS distribution options example --> <ecs:distribution> <ecs:mediatype> <ecs:value>FtpPull</ecs:value> </ecs:mediatype> <ecs:mediaformat> <ecs:ftppull-format> <ecs:value>FILEFORMAT</ecs:value> </ecs:ftppull-format> </ecs:mediaformat> </ecs:distribution> <ecs:do-ancillaryprocessing>true</ecs:do-ancillaryprocessing> <ecs:ancillary> <ecs:orderQA/> <ecs:orderPH/> <ecs:orderBrowse/> </ecs:ancillary> </ecs:options> </instance> </model> <ui> <group id="mediaOptionsGroup" label="Media Options" ref="ecs:distribution"> <output id="MediaTypeOutput" label="Media Type:" relevant="ecs:mediatype/ecs:value =\'FtpPull\'" type="xsd:string" value="\'HTTPS Pull\'"/> <output id="FtpPullMediaFormatOutput" label="Media Format:" relevant="ecs:mediaformat/ecs:ftppull-format/ecs:value=\'FILEFORMAT\'" type="xsd:string" value="\'File\'"/> </group> <group id="checkancillaryoptions" label="Additional file options:" ref="ecs:ancillary" relevant="//ecs:do-ancillaryprocessing = \'true\'"> <input label="Include associated Browse file in order" ref="ecs:orderBrowse" type="xsd:boolean"/> <input label="Include associated Quality Assurance file in order" ref="ecs:orderQA" type="xsd:boolean"/> <input label="Include associated Production History file in order" ref="ecs:orderPH" type="xsd:boolean"/> </group> </ui> </form>'

export const rawModel = '<model> <instance> <ecs:options xmlns:ecs="http://ecs.nasa.gov/options"> <!-- ECS distribution options example --> <ecs:distribution> <ecs:mediatype> <ecs:value>FtpPull</ecs:value> </ecs:mediatype> <ecs:mediaformat> <ecs:ftppull-format> <ecs:value>FILEFORMAT</ecs:value> </ecs:ftppull-format> </ecs:mediaformat> </ecs:distribution> <ecs:do-ancillaryprocessing>true</ecs:do-ancillaryprocessing> <ecs:ancillary> <ecs:orderQA/> <ecs:orderPH/> <ecs:orderBrowse/> </ecs:ancillary> </ecs:options> </instance> </model>'

const harmonyCapabilitiesDocument: HarmonyCapabilitiesDocument = {
  conceptId: 'C100000-EDSC',
  shortName: 'MOCK_SHORT_NAME',
  summary: {
    subsetting: {
      bbox: true,
      shape: false, // Changed to false to match supportsShapefileSubsetting: false
      temporal: true,
      variable: true
    },
    reprojection: {
      // Added projection to match the access method
      supportedProjections: [
        {
          name: 'Geographic',
          crs: 'EPGS:4313'
        }
      ]
    },
    concatenation: false,
    // Added output format to match the access method
    outputFormats: [
      {
        name: 'NETCDF-4',
        mimeType: 'application/netcdf'
      }
    ]
  },
  services: [
    {
      name: 'giovanni-time-series-adapter',
      capabilities: {
        subsetting: {
          bbox: true,
          shape: false, // Changed to false
          temporal: true,
          variable: true
        },
        concatenation: false,
        reprojection: {
          supportedProjections: [
            {
              name: 'Geographic',
              crs: 'EPGS:4313'
            }
          ]
        },
        outputFormats: [
          {
            name: 'NETCDF-4',
            mimeType: 'application/netcdf'
          }
        ]
      },
      href: ''
    }
  ],
  variables: [
    {
      name: 'mock_variable',
      href: 'https://cmr.example.com/search/concepts/V100000-EDSC',
      scienceKeywords: [],
      longName: '',
      units: ''
    }
  ]
}

const derivedHarmonyState: DerivedHarmonyState = {
  capabilities: {
    concatenate: {
      disabled: true,
      supported: false
    },
    outputFormats: {
      disabled: false, // Changed to false because we now have a format
      outputFormatAvailability: {
        'NETCDF-4': true // Added to match access method
      },
      supported: [
        {
          name: 'NETCDF-4',
          mimeType: 'application/netcdf'
        }
      ],
      value: ''
    },
    reproject: {
      disabled: false, // Changed to false because we now have a projection
      outputProjectionAvailability: {
        'EPGS:4313': true // Added to match access method
      },
      supported: [
        {
          name: 'Geographic',
          crs: 'EPGS:4313'
        }
      ],
      value: ''
    },
    spatialSubset: {
      disabled: false,
      shapeDisabled: true, // true because shapefile is not supported
      supported: true
    },
    temporalSubset: {
      disabled: false,
      supported: true
    },
    variableSubset: {
      disabled: false,
      supported: true
    }
  },
  collectionId: 'C100000-EDSC',
  shortName: 'MOCK_SHORT_NAME',
  variables: [
    {
      name: 'mock_variable',
      href: 'https://cmr.example.com/search/concepts/V100000-EDSC',
      scienceKeywords: [],
      longName: '',
      units: ''
    }
  ]
}

export const harmonyAccessMethod: HarmonyAccessMethod = {
  outputFormatAvailability: { 'NETCDF-4': true },
  enableConcatenateDownload: false,
  enableSpatialSubsetting: false,
  enableTemporalSubsetting: false,
  harmonyCapabilitiesDocument,
  derivedHarmonyState,
  harmonyUserSelections: {},
  hierarchyMappings: [
    {
      id: 'V100000-EDSC'
    }
  ],
  id: 'C100000-EDSC',
  isConcatenationDisabled: true,
  isShapeSubsettingDisabled: false,
  isSpatialSubsettingDisabled: false,
  isTemporalSubsettingDisabled: false,
  isValid: true,
  isVariableSubsettingDisabled: false,
  keywordMappings: [],
  outputProjectionAvailability: { Geographic: true },
  selectedOutputFormat: undefined,
  selectedOutputProjection: undefined,
  selectedVariables: [],
  shortName: 'MOCK_SHORT_NAME',
  supportedOutputFormats: [
    {
      name: 'NETCDF-4',
      mimeType: 'application/netcdf'
    }
  ],
  supportedOutputProjections: [
    {
      name: 'Geographic',
      crs: 'EPGS:4313'
    }
  ],
  supportsConcatenation: false,
  supportsShapefileSubsetting: false,
  supportsSpatialSubsetting: true,
  supportsTemporalSubsetting: true,
  supportsVariableSubsetting: true,
  type: 'Harmony',
  url: 'https://harmony.earthdata.nasa.gov',
  variables: {
    'V100000-EDSC': {
      href: 'https://cmr.example.com/search/concepts/V100000-EDSC',
      longName: '',
      name: 'mock_variable',
      scienceKeywords: [],
      units: ''
    }
  }
}

export const opendapAccessMethod: OpendapAccessMethod = {
  hierarchyMappings: [
    {
      id: 'V1233612363-E2E_18_4'
    }
  ],
  id: 'S1224238025-E2E_18_4',
  isValid: false,
  keywordMappings: [
    {
      children: [
        {
          id: 'V1233612363-E2E_18_4'
        }
      ],
      label: 'METHANE'
    }
  ],
  type: 'OPeNDAP',
  longName: 'AIRS/Aqua L3 Daily Standard Physical Retrieval (AIRS+AMSU) 1 degree x 1 degree V006 (AIRX3STD) at GES DISC',
  name: 'AIRX3STD.006',
  supportedOutputFormats: [
    {
      name: 'NETCDF-4',
      mimeType: 'nc4'
    }
  ],
  supportsVariableSubsetting: true,
  variables: {
    'V1233612363-E2E_18_4': {
      conceptId: 'V1233612363-E2E_18_4',
      definition: 'definition',
      instanceInformation: null,
      longName: '',
      name: 'mock-variable',
      nativeId: 'variable123',
      scienceKeywords: [
        {
          category: 'EARTH SCIENCE'
        }
      ]
    }
  }
}
