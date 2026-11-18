import {
  DerivedHarmonyState,
  HarmonyCapabilitiesDocument
} from '../../../../util/getDerivedHarmonyState/derivedHarmonyStateTypes'
import { HarmonyAccessMethod } from '../../../../zustand/types'

const harmonyCapabilitiesDocument: HarmonyCapabilitiesDocument = {
  conceptId: 'C100000-EDSC',
  shortName: 'MOCK_SHORT_NAME',
  summary: {
    subsetting: {
      bbox: true,
      shape: false,
      temporal: true,
      variable: true
    },
    reprojection: {
      supportedProjections: [
        {
          name: 'Geographic',
          crs: 'EPGS:4313'
        }
      ]
    },
    concatenation: false,
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
          shape: false,
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
      disabled: false,
      outputFormatAvailability: {
        'NETCDF-4': true
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
      disabled: false,
      outputProjectionAvailability: {
        'EPGS:4313': true
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
      shapeDisabled: true,
      bboxDisabled: false,
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
  supportsShapefileSubsetting: true,
  supportsBoundingBoxSubsetting: true,
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
