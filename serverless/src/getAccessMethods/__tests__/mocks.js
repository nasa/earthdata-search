export const variablesResponse = {
  hits: 22,
  took: 67,
  items: [
    {
      meta: {
        'revision-id': 6,
        deleted: false,
        format: 'application/vnd.nasa.cmr.umm+json',
        'provider-id': 'E2E_18_4',
        'user-id': 'mmorahan',
        'native-id': 'uvg_Dust_Score_A',
        'concept-id': 'V1200279034-E2E_18_4',
        'revision-date': '2018-10-02T19:28:03Z',
        'concept-type': 'variable'
      },
      umm: {
        VariableType: 'SCIENCE_VARIABLE',
        DataType: 'float32',
        Offset: 0,
        ScienceKeywords: [
          {
            Category: 'EARTH SCIENCE',
            Topic: 'LAND SURFACE',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'POINT BAR'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'POINT BAR'
          }
        ],
        Scale: 1,
        Characteristics: {
          IndexRanges: {
            LatRange: [
              0,
              0
            ],
            LonRange: [
              0,
              0
            ]
          }
        },
        FillValues: [
          {
            Value: -9999,
            Type: 'ANCILLARY_FILLVALUE'
          }
        ],
        Sets: [
          {
            Name: 'Data_Fields',
            Type: 'Ascending',
            Size: 76,
            Index: 2
          }
        ],
        Dimensions: [
          {
            Name: 'DustTest',
            Size: 9,
            Type: 'OTHER'
          },
          {
            Name: 'Latitude',
            Size: 180,
            Type: 'LATITUDE_DIMENSION'
          },
          {
            Name: 'Longitude',
            Size: 360,
            Type: 'LONGITUDE_DIMENSION'
          }
        ],
        Definition: ' 32-bit DustTest (9) Fraction of obs with each floating dust test triggered. [0.0, 1.0] point Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
        Name: 'Dust_Score_A',
        AcquisitionSourceName: 'Not Provided',
        Units: 'level',
        LongName: 'Dust_Score_A'
      },
      associations: {
        collections: [
          {
            'concept-id': 'C1200278964-E2E_18_4'
          },
          {
            'concept-id': 'C1200278965-E2E_18_4'
          },
          {
            'concept-id': 'C1200278966-E2E_18_4'
          },
          {
            'concept-id': 'C1200278971-E2E_18_4'
          },
          {
            'concept-id': 'C1200278972-E2E_18_4'
          },
          {
            'concept-id': 'C1200278974-E2E_18_4'
          }
        ]
      }
    },
    {
      meta: {
        'revision-id': 6,
        deleted: false,
        format: 'application/vnd.nasa.cmr.umm+json',
        'provider-id': 'E2E_18_4',
        'user-id': 'mmorahan',
        'native-id': 'uvg_Dust_Score_A_ct',
        'concept-id': 'V1200279045-E2E_18_4',
        'revision-date': '2018-10-02T19:28:10Z',
        'concept-type': 'variable'
      },
      umm: {
        VariableType: 'SCIENCE_VARIABLE',
        DataType: 'int16',
        Offset: 0,
        ScienceKeywords: [
          {
            Category: 'EARTH SCIENCE',
            Topic: 'LAND SURFACE',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'POINT BAR'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'POINT BAR'
          }
        ],
        Scale: 1,
        Characteristics: {
          IndexRanges: {
            LatRange: [
              0,
              0
            ],
            LonRange: [
              0,
              0
            ]
          }
        },
        FillValues: [
          {
            Value: 0,
            Type: 'ANCILLARY_FILLVALUE'
          }
        ],
        Sets: [
          {
            Name: 'Dust_Score_A',
            Type: 'Ascending',
            Size: 4,
            Index: 1
          }
        ],
        Dimensions: [
          {
            Name: 'DustTest',
            Size: 9,
            Type: 'OTHER'
          },
          {
            Name: 'Latitude',
            Size: 180,
            Type: 'LATITUDE_DIMENSION'
          },
          {
            Name: 'Longitude',
            Size: 360,
            Type: 'LONGITUDE_DIMENSION'
          }
        ],
        Definition: 'Input count of 32-bit DustTest (9) Fraction of obs with each floating dust test triggered. [0.0, 1.0] point Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
        Name: 'Dust_Score_A_ct',
        AcquisitionSourceName: 'Not Provided',
        Units: 'level',
        LongName: 'Dust_Score_A_ct'
      },
      associations: {
        collections: [
          {
            'concept-id': 'C1200278964-E2E_18_4'
          },
          {
            'concept-id': 'C1200278965-E2E_18_4'
          },
          {
            'concept-id': 'C1200278966-E2E_18_4'
          },
          {
            'concept-id': 'C1200278971-E2E_18_4'
          },
          {
            'concept-id': 'C1200278972-E2E_18_4'
          },
          {
            'concept-id': 'C1200278974-E2E_18_4'
          }
        ]
      }
    },
    {
      meta: {
        'revision-id': 6,
        deleted: false,
        format: 'application/vnd.nasa.cmr.umm+json',
        'provider-id': 'E2E_18_4',
        'user-id': 'mmorahan',
        'native-id': 'uvg_Dust_Score_A_max',
        'concept-id': 'V1200279072-E2E_18_4',
        'revision-date': '2018-10-02T19:28:25Z',
        'concept-type': 'variable'
      },
      umm: {
        VariableType: 'SCIENCE_VARIABLE',
        DataType: 'float32',
        Offset: 0,
        ScienceKeywords: [
          {
            Category: 'EARTH SCIENCE',
            Topic: 'LAND SURFACE',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'POINT BAR'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'POINT BAR'
          }
        ],
        Scale: 1,
        Characteristics: {
          IndexRanges: {
            LatRange: [
              0,
              0
            ],
            LonRange: [
              0,
              0
            ]
          }
        },
        FillValues: [
          {
            Value: -9999,
            Type: 'ANCILLARY_FILLVALUE'
          }
        ],
        Sets: [
          {
            Name: 'Dust_Score_A',
            Type: 'Ascending',
            Size: 4,
            Index: 4
          }
        ],
        Dimensions: [
          {
            Name: 'DustTest',
            Size: 9,
            Type: 'OTHER'
          },
          {
            Name: 'Latitude',
            Size: 180,
            Type: 'LATITUDE_DIMENSION'
          },
          {
            Name: 'Longitude',
            Size: 360,
            Type: 'LONGITUDE_DIMENSION'
          }
        ],
        Definition: 'Maximum value of 32-bit DustTest (9) Fraction of obs with each floating dust test triggered. [0.0, 1.0] point Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
        Name: 'Dust_Score_A_max',
        AcquisitionSourceName: 'Not Provided',
        Units: 'level',
        LongName: 'Dust_Score_A_max'
      },
      associations: {
        collections: [
          {
            'concept-id': 'C1200278964-E2E_18_4'
          },
          {
            'concept-id': 'C1200278965-E2E_18_4'
          },
          {
            'concept-id': 'C1200278966-E2E_18_4'
          },
          {
            'concept-id': 'C1200278971-E2E_18_4'
          },
          {
            'concept-id': 'C1200278972-E2E_18_4'
          },
          {
            'concept-id': 'C1200278974-E2E_18_4'
          }
        ]
      }
    },
    {
      meta: {
        'revision-id': 6,
        deleted: false,
        format: 'application/vnd.nasa.cmr.umm+json',
        'provider-id': 'E2E_18_4',
        'user-id': 'mmorahan',
        'native-id': 'uvg_Dust_Score_A_min',
        'concept-id': 'V1200279069-E2E_18_4',
        'revision-date': '2018-10-02T19:28:25Z',
        'concept-type': 'variable'
      },
      umm: {
        VariableType: 'SCIENCE_VARIABLE',
        DataType: 'float32',
        Offset: 0,
        ScienceKeywords: [
          {
            Category: 'EARTH SCIENCE',
            Topic: 'LAND SURFACE',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'POINT BAR'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'POINT BAR'
          }
        ],
        Scale: 1,
        Characteristics: {
          IndexRanges: {
            LatRange: [
              0,
              0
            ],
            LonRange: [
              0,
              0
            ]
          }
        },
        FillValues: [
          {
            Value: -9999,
            Type: 'ANCILLARY_FILLVALUE'
          }
        ],
        Sets: [
          {
            Name: 'Dust_Score_A',
            Type: 'Ascending',
            Size: 4,
            Index: 3
          }
        ],
        Dimensions: [
          {
            Name: 'DustTest',
            Size: 9,
            Type: 'OTHER'
          },
          {
            Name: 'Latitude',
            Size: 180,
            Type: 'LATITUDE_DIMENSION'
          },
          {
            Name: 'Longitude',
            Size: 360,
            Type: 'LONGITUDE_DIMENSION'
          }
        ],
        Definition: 'Minimum value of 32-bit DustTest (9) Fraction of obs with each floating dust test triggered. [0.0, 1.0] point Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
        Name: 'Dust_Score_A_min',
        AcquisitionSourceName: 'Not Provided',
        Units: 'level',
        LongName: 'Dust_Score_A_min'
      },
      associations: {
        collections: [
          {
            'concept-id': 'C1200278964-E2E_18_4'
          },
          {
            'concept-id': 'C1200278965-E2E_18_4'
          },
          {
            'concept-id': 'C1200278966-E2E_18_4'
          },
          {
            'concept-id': 'C1200278971-E2E_18_4'
          },
          {
            'concept-id': 'C1200278972-E2E_18_4'
          },
          {
            'concept-id': 'C1200278974-E2E_18_4'
          }
        ]
      }
    },
    {
      meta: {
        'revision-id': 6,
        deleted: false,
        format: 'application/vnd.nasa.cmr.umm+json',
        'provider-id': 'E2E_18_4',
        'user-id': 'mmorahan',
        'native-id': 'uvg_Dust_Score_A_sdev',
        'concept-id': 'V1200279068-E2E_18_4',
        'revision-date': '2018-10-02T19:28:23Z',
        'concept-type': 'variable'
      },
      umm: {
        VariableType: 'SCIENCE_VARIABLE',
        DataType: 'float32',
        Offset: 0,
        ScienceKeywords: [
          {
            Category: 'EARTH SCIENCE',
            Topic: 'LAND SURFACE',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'POINT BAR'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'POINT BAR'
          }
        ],
        Scale: 1,
        Characteristics: {
          IndexRanges: {
            LatRange: [
              0,
              0
            ],
            LonRange: [
              0,
              0
            ]
          }
        },
        FillValues: [
          {
            Value: -9999,
            Type: 'ANCILLARY_FILLVALUE'
          }
        ],
        Sets: [
          {
            Name: 'Dust_Score_A',
            Type: 'Ascending',
            Size: 4,
            Index: 2
          }
        ],
        Dimensions: [
          {
            Name: 'DustTest',
            Size: 9,
            Type: 'OTHER'
          },
          {
            Name: 'Latitude',
            Size: 180,
            Type: 'LATITUDE_DIMENSION'
          },
          {
            Name: 'Longitude',
            Size: 360,
            Type: 'LONGITUDE_DIMENSION'
          }
        ],
        Definition: 'Standard deviation of 32-bit DustTest (9) Fraction of obs with each floating dust test triggered. [0.0, 1.0] point Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
        Name: 'Dust_Score_A_sdev',
        AcquisitionSourceName: 'Not Provided',
        Units: 'level',
        LongName: 'Dust_Score_A_sdev'
      },
      associations: {
        collections: [
          {
            'concept-id': 'C1200278964-E2E_18_4'
          },
          {
            'concept-id': 'C1200278965-E2E_18_4'
          },
          {
            'concept-id': 'C1200278966-E2E_18_4'
          },
          {
            'concept-id': 'C1200278971-E2E_18_4'
          },
          {
            'concept-id': 'C1200278972-E2E_18_4'
          },
          {
            'concept-id': 'C1200278974-E2E_18_4'
          }
        ]
      }
    },
    {
      meta: {
        'revision-id': 6,
        deleted: false,
        format: 'application/vnd.nasa.cmr.umm+json',
        'provider-id': 'E2E_18_4',
        'user-id': 'mmorahan',
        'native-id': 'uvg_SO2_Indicator_A',
        'concept-id': 'V1200279065-E2E_18_4',
        'revision-date': '2018-10-02T19:28:23Z',
        'concept-type': 'variable'
      },
      umm: {
        VariableType: 'SCIENCE_VARIABLE',
        DataType: 'float32',
        Offset: 0,
        ScienceKeywords: [
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE TENDENCY'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'BIOSPHERE',
            Term: 'ECOLOGICAL DYNAMICS',
            VariableLevel1: 'INDICATOR SPECIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'HIGHER MAXIMUM DAYTIME TEMPERATURES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'HIGHER MINIMUM NIGHTIME TEMPERATURES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'STRATOSPHERIC TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE TRENDS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE VARIABILITY'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TROPOSPHERIC TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE INDICATORS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'COMMON SENSE CLIMATE INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'COOLING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'FREEZING INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'GROWING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'HEATING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'RESIDENTIAL ENERGY DEMAND TEMPERATURE INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE CONCENTRATION INDEX (TCI)'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'THAWING INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE INDICES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'BIOSPHERIC INDICATORS',
            VariableLevel1: 'INDICATOR SPECIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'PALEOCLIMATE INDICATORS',
            VariableLevel1: 'VOLCANIC DEPOSITS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'PALEOCLIMATE INDICATORS',
            VariableLevel1: 'VOLCANIC DEPOSITS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'PALEOCLIMATE INDICATORS',
            VariableLevel1: 'VOLCANIC FORCING'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'HUMAN DIMENSIONS',
            Term: 'NATURAL HAZARDS',
            VariableLevel1: 'VOLCANIC ERUPTIONS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'LAND SURFACE',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'POINT BAR'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'LAND SURFACE',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'VOLCANO'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'PALEOCLIMATE',
            Term: 'ICE CORE RECORDS',
            VariableLevel1: 'VOLCANIC DEPOSITS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'PALEOCLIMATE',
            Term: 'LAND RECORDS',
            VariableLevel1: 'VOLCANIC DEPOSITS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'POINT BAR'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'VOLCANO'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOTHERMAL DYNAMICS',
            VariableLevel1: 'TEMPERATURE GRADIENT'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOTHERMAL DYNAMICS',
            VariableLevel1: 'TEMPERATURE GRADIENT'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOTHERMAL DYNAMICS',
            VariableLevel1: 'TEMPERATURE PROFILES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SPECTRAL/ENGINEERING',
            Term: 'INFRARED WAVELENGTHS',
            VariableLevel1: 'BRIGHTNESS TEMPERATURE'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SPECTRAL/ENGINEERING',
            Term: 'MICROWAVE',
            VariableLevel1: 'BRIGHTNESS TEMPERATURE'
          }
        ],
        Scale: 1,
        Characteristics: {
          IndexRanges: {
            LatRange: [
              0,
              0
            ],
            LonRange: [
              0,
              0
            ]
          }
        },
        FillValues: [
          {
            Value: -9999,
            Type: 'ANCILLARY_FILLVALUE'
          }
        ],
        Sets: [
          {
            Name: 'Data_Fields',
            Type: 'Ascending',
            Size: 76,
            Index: 3
          }
        ],
        Dimensions: [
          {
            Name: 'Latitude',
            Size: 180,
            Type: 'LATITUDE_DIMENSION'
          },
          {
            Name: 'Longitude',
            Size: 360,
            Type: 'LONGITUDE_DIMENSION'
          }
        ],
        Definition: ' 32-bit None Brightness temperature floating difference Tb(1361.44 cm-1) point - Tb(1433.06 cm-1) used as an indicator of SO2 release from volcanoes. Values under -6 K have likely volcanic SO2. (L2 BT_diff_SO2) (Kelvins) Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
        Name: 'SO2_Indicator_A',
        AcquisitionSourceName: 'Not Provided',
        Units: 'None',
        LongName: 'SO2_Indicator_A'
      },
      associations: {
        collections: [
          {
            'concept-id': 'C1200278964-E2E_18_4'
          },
          {
            'concept-id': 'C1200278965-E2E_18_4'
          },
          {
            'concept-id': 'C1200278966-E2E_18_4'
          },
          {
            'concept-id': 'C1200278971-E2E_18_4'
          },
          {
            'concept-id': 'C1200278972-E2E_18_4'
          },
          {
            'concept-id': 'C1200278974-E2E_18_4'
          }
        ]
      }
    },
    {
      meta: {
        'revision-id': 6,
        deleted: false,
        format: 'application/vnd.nasa.cmr.umm+json',
        'provider-id': 'E2E_18_4',
        'user-id': 'mmorahan',
        'native-id': 'uvg_SO2_Indicator_A_ct',
        'concept-id': 'V1200279035-E2E_18_4',
        'revision-date': '2018-10-02T19:28:03Z',
        'concept-type': 'variable'
      },
      umm: {
        VariableType: 'SCIENCE_VARIABLE',
        DataType: 'int16',
        Offset: 0,
        ScienceKeywords: [
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE TENDENCY'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'BIOSPHERE',
            Term: 'ECOLOGICAL DYNAMICS',
            VariableLevel1: 'INDICATOR SPECIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'HIGHER MAXIMUM DAYTIME TEMPERATURES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'HIGHER MINIMUM NIGHTIME TEMPERATURES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'STRATOSPHERIC TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE TRENDS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE VARIABILITY'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TROPOSPHERIC TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE INDICATORS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'COMMON SENSE CLIMATE INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'COOLING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'FREEZING INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'GROWING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'HEATING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'RESIDENTIAL ENERGY DEMAND TEMPERATURE INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE CONCENTRATION INDEX (TCI)'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'THAWING INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE INDICES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'BIOSPHERIC INDICATORS',
            VariableLevel1: 'INDICATOR SPECIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'PALEOCLIMATE INDICATORS',
            VariableLevel1: 'VOLCANIC DEPOSITS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'PALEOCLIMATE INDICATORS',
            VariableLevel1: 'VOLCANIC DEPOSITS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'PALEOCLIMATE INDICATORS',
            VariableLevel1: 'VOLCANIC FORCING'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'HUMAN DIMENSIONS',
            Term: 'NATURAL HAZARDS',
            VariableLevel1: 'VOLCANIC ERUPTIONS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'LAND SURFACE',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'POINT BAR'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'LAND SURFACE',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'VOLCANO'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'PALEOCLIMATE',
            Term: 'ICE CORE RECORDS',
            VariableLevel1: 'VOLCANIC DEPOSITS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'PALEOCLIMATE',
            Term: 'LAND RECORDS',
            VariableLevel1: 'VOLCANIC DEPOSITS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'POINT BAR'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'VOLCANO'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOTHERMAL DYNAMICS',
            VariableLevel1: 'TEMPERATURE GRADIENT'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOTHERMAL DYNAMICS',
            VariableLevel1: 'TEMPERATURE GRADIENT'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOTHERMAL DYNAMICS',
            VariableLevel1: 'TEMPERATURE PROFILES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SPECTRAL/ENGINEERING',
            Term: 'INFRARED WAVELENGTHS',
            VariableLevel1: 'BRIGHTNESS TEMPERATURE'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SPECTRAL/ENGINEERING',
            Term: 'MICROWAVE',
            VariableLevel1: 'BRIGHTNESS TEMPERATURE'
          }
        ],
        Scale: 1,
        Characteristics: {
          IndexRanges: {
            LatRange: [
              0,
              0
            ],
            LonRange: [
              0,
              0
            ]
          }
        },
        FillValues: [
          {
            Value: 0,
            Type: 'ANCILLARY_FILLVALUE'
          }
        ],
        Sets: [
          {
            Name: 'SO2_Indicator_A',
            Type: 'Ascending',
            Size: 4,
            Index: 1
          }
        ],
        Dimensions: [
          {
            Name: 'Latitude',
            Size: 180,
            Type: 'LATITUDE_DIMENSION'
          },
          {
            Name: 'Longitude',
            Size: 360,
            Type: 'LONGITUDE_DIMENSION'
          }
        ],
        Definition: 'Input count of 32-bit None Brightness temperature floating difference Tb(1361.44 cm-1) point - Tb(1433.06 cm-1) used as an indicator of SO2 release from volcanoes. Values under -6 K have likely volcanic SO2. (L2 BT_diff_SO2) (Kelvins) Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
        Name: 'SO2_Indicator_A_ct',
        AcquisitionSourceName: 'Not Provided',
        Units: 'None',
        LongName: 'SO2_Indicator_A_ct'
      },
      associations: {
        collections: [
          {
            'concept-id': 'C1200278964-E2E_18_4'
          },
          {
            'concept-id': 'C1200278965-E2E_18_4'
          },
          {
            'concept-id': 'C1200278966-E2E_18_4'
          },
          {
            'concept-id': 'C1200278971-E2E_18_4'
          },
          {
            'concept-id': 'C1200278972-E2E_18_4'
          },
          {
            'concept-id': 'C1200278974-E2E_18_4'
          }
        ]
      }
    },
    {
      meta: {
        'revision-id': 6,
        deleted: false,
        format: 'application/vnd.nasa.cmr.umm+json',
        'provider-id': 'E2E_18_4',
        'user-id': 'mmorahan',
        'native-id': 'uvg_SO2_Indicator_A_max',
        'concept-id': 'V1200279049-E2E_18_4',
        'revision-date': '2018-10-02T19:28:11Z',
        'concept-type': 'variable'
      },
      umm: {
        VariableType: 'SCIENCE_VARIABLE',
        DataType: 'float32',
        Offset: 0,
        ScienceKeywords: [
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE TENDENCY'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'BIOSPHERE',
            Term: 'ECOLOGICAL DYNAMICS',
            VariableLevel1: 'INDICATOR SPECIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'HIGHER MAXIMUM DAYTIME TEMPERATURES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'HIGHER MINIMUM NIGHTIME TEMPERATURES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'STRATOSPHERIC TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE TRENDS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE VARIABILITY'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TROPOSPHERIC TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE INDICATORS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'COMMON SENSE CLIMATE INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'COOLING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'FREEZING INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'GROWING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'HEATING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'RESIDENTIAL ENERGY DEMAND TEMPERATURE INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE CONCENTRATION INDEX (TCI)'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'THAWING INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE INDICES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'BIOSPHERIC INDICATORS',
            VariableLevel1: 'INDICATOR SPECIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'PALEOCLIMATE INDICATORS',
            VariableLevel1: 'VOLCANIC DEPOSITS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'PALEOCLIMATE INDICATORS',
            VariableLevel1: 'VOLCANIC DEPOSITS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'PALEOCLIMATE INDICATORS',
            VariableLevel1: 'VOLCANIC FORCING'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'HUMAN DIMENSIONS',
            Term: 'NATURAL HAZARDS',
            VariableLevel1: 'VOLCANIC ERUPTIONS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'LAND SURFACE',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'POINT BAR'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'LAND SURFACE',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'VOLCANO'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'PALEOCLIMATE',
            Term: 'ICE CORE RECORDS',
            VariableLevel1: 'VOLCANIC DEPOSITS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'PALEOCLIMATE',
            Term: 'LAND RECORDS',
            VariableLevel1: 'VOLCANIC DEPOSITS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'POINT BAR'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'VOLCANO'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOTHERMAL DYNAMICS',
            VariableLevel1: 'TEMPERATURE GRADIENT'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOTHERMAL DYNAMICS',
            VariableLevel1: 'TEMPERATURE GRADIENT'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOTHERMAL DYNAMICS',
            VariableLevel1: 'TEMPERATURE PROFILES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SPECTRAL/ENGINEERING',
            Term: 'INFRARED WAVELENGTHS',
            VariableLevel1: 'BRIGHTNESS TEMPERATURE'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SPECTRAL/ENGINEERING',
            Term: 'MICROWAVE',
            VariableLevel1: 'BRIGHTNESS TEMPERATURE'
          }
        ],
        Scale: 1,
        Characteristics: {
          IndexRanges: {
            LatRange: [
              0,
              0
            ],
            LonRange: [
              0,
              0
            ]
          }
        },
        FillValues: [
          {
            Value: -9999,
            Type: 'ANCILLARY_FILLVALUE'
          }
        ],
        Sets: [
          {
            Name: 'SO2_Indicator_A',
            Type: 'Ascending',
            Size: 4,
            Index: 4
          }
        ],
        Dimensions: [
          {
            Name: 'Latitude',
            Size: 180,
            Type: 'LATITUDE_DIMENSION'
          },
          {
            Name: 'Longitude',
            Size: 360,
            Type: 'LONGITUDE_DIMENSION'
          }
        ],
        Definition: 'Maximum value of 32-bit None Brightness temperature floating difference Tb(1361.44 cm-1) point - Tb(1433.06 cm-1) used as an indicator of SO2 release from volcanoes. Values under -6 K have likely volcanic SO2. (L2 BT_diff_SO2) (Kelvins) Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
        Name: 'SO2_Indicator_A_max',
        AcquisitionSourceName: 'Not Provided',
        Units: 'None',
        LongName: 'SO2_Indicator_A_max'
      },
      associations: {
        collections: [
          {
            'concept-id': 'C1200278964-E2E_18_4'
          },
          {
            'concept-id': 'C1200278965-E2E_18_4'
          },
          {
            'concept-id': 'C1200278966-E2E_18_4'
          },
          {
            'concept-id': 'C1200278971-E2E_18_4'
          },
          {
            'concept-id': 'C1200278972-E2E_18_4'
          },
          {
            'concept-id': 'C1200278974-E2E_18_4'
          }
        ]
      }
    },
    {
      meta: {
        'revision-id': 6,
        deleted: false,
        format: 'application/vnd.nasa.cmr.umm+json',
        'provider-id': 'E2E_18_4',
        'user-id': 'mmorahan',
        'native-id': 'uvg_SO2_Indicator_A_min',
        'concept-id': 'V1200279041-E2E_18_4',
        'revision-date': '2018-10-02T19:28:08Z',
        'concept-type': 'variable'
      },
      umm: {
        VariableType: 'SCIENCE_VARIABLE',
        DataType: 'float32',
        Offset: 0,
        ScienceKeywords: [
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE TENDENCY'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'BIOSPHERE',
            Term: 'ECOLOGICAL DYNAMICS',
            VariableLevel1: 'INDICATOR SPECIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'HIGHER MAXIMUM DAYTIME TEMPERATURES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'HIGHER MINIMUM NIGHTIME TEMPERATURES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'STRATOSPHERIC TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE TRENDS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE VARIABILITY'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TROPOSPHERIC TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE INDICATORS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'COMMON SENSE CLIMATE INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'COOLING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'FREEZING INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'GROWING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'HEATING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'RESIDENTIAL ENERGY DEMAND TEMPERATURE INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE CONCENTRATION INDEX (TCI)'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'THAWING INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE INDICES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'BIOSPHERIC INDICATORS',
            VariableLevel1: 'INDICATOR SPECIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'PALEOCLIMATE INDICATORS',
            VariableLevel1: 'VOLCANIC DEPOSITS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'PALEOCLIMATE INDICATORS',
            VariableLevel1: 'VOLCANIC DEPOSITS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'PALEOCLIMATE INDICATORS',
            VariableLevel1: 'VOLCANIC FORCING'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'HUMAN DIMENSIONS',
            Term: 'NATURAL HAZARDS',
            VariableLevel1: 'VOLCANIC ERUPTIONS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'LAND SURFACE',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'POINT BAR'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'LAND SURFACE',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'VOLCANO'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'PALEOCLIMATE',
            Term: 'ICE CORE RECORDS',
            VariableLevel1: 'VOLCANIC DEPOSITS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'PALEOCLIMATE',
            Term: 'LAND RECORDS',
            VariableLevel1: 'VOLCANIC DEPOSITS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'POINT BAR'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'VOLCANO'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOTHERMAL DYNAMICS',
            VariableLevel1: 'TEMPERATURE GRADIENT'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOTHERMAL DYNAMICS',
            VariableLevel1: 'TEMPERATURE GRADIENT'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOTHERMAL DYNAMICS',
            VariableLevel1: 'TEMPERATURE PROFILES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SPECTRAL/ENGINEERING',
            Term: 'INFRARED WAVELENGTHS',
            VariableLevel1: 'BRIGHTNESS TEMPERATURE'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SPECTRAL/ENGINEERING',
            Term: 'MICROWAVE',
            VariableLevel1: 'BRIGHTNESS TEMPERATURE'
          }
        ],
        Scale: 1,
        Characteristics: {
          IndexRanges: {
            LatRange: [
              0,
              0
            ],
            LonRange: [
              0,
              0
            ]
          }
        },
        FillValues: [
          {
            Value: -9999,
            Type: 'ANCILLARY_FILLVALUE'
          }
        ],
        Sets: [
          {
            Name: 'SO2_Indicator_A',
            Type: 'Ascending',
            Size: 4,
            Index: 3
          }
        ],
        Dimensions: [
          {
            Name: 'Latitude',
            Size: 180,
            Type: 'LATITUDE_DIMENSION'
          },
          {
            Name: 'Longitude',
            Size: 360,
            Type: 'LONGITUDE_DIMENSION'
          }
        ],
        Definition: 'Minimum value of 32-bit None Brightness temperature floating difference Tb(1361.44 cm-1) point - Tb(1433.06 cm-1) used as an indicator of SO2 release from volcanoes. Values under -6 K have likely volcanic SO2. (L2 BT_diff_SO2) (Kelvins) Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
        Name: 'SO2_Indicator_A_min',
        AcquisitionSourceName: 'Not Provided',
        Units: 'None',
        LongName: 'SO2_Indicator_A_min'
      },
      associations: {
        collections: [
          {
            'concept-id': 'C1200278964-E2E_18_4'
          },
          {
            'concept-id': 'C1200278965-E2E_18_4'
          },
          {
            'concept-id': 'C1200278966-E2E_18_4'
          },
          {
            'concept-id': 'C1200278971-E2E_18_4'
          },
          {
            'concept-id': 'C1200278972-E2E_18_4'
          },
          {
            'concept-id': 'C1200278974-E2E_18_4'
          }
        ]
      }
    },
    {
      meta: {
        'revision-id': 6,
        deleted: false,
        format: 'application/vnd.nasa.cmr.umm+json',
        'provider-id': 'E2E_18_4',
        'user-id': 'mmorahan',
        'native-id': 'uvg_SO2_Indicator_A_sdev',
        'concept-id': 'V1200279073-E2E_18_4',
        'revision-date': '2018-10-02T19:28:27Z',
        'concept-type': 'variable'
      },
      umm: {
        VariableType: 'SCIENCE_VARIABLE',
        DataType: 'float32',
        Offset: 0,
        ScienceKeywords: [
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE TENDENCY'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'BIOSPHERE',
            Term: 'ECOLOGICAL DYNAMICS',
            VariableLevel1: 'INDICATOR SPECIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'HIGHER MAXIMUM DAYTIME TEMPERATURES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'HIGHER MINIMUM NIGHTIME TEMPERATURES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'STRATOSPHERIC TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE TRENDS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE VARIABILITY'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TROPOSPHERIC TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE INDICATORS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'COMMON SENSE CLIMATE INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'COOLING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'FREEZING INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'GROWING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'HEATING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'RESIDENTIAL ENERGY DEMAND TEMPERATURE INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE CONCENTRATION INDEX (TCI)'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'THAWING INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE INDICES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'BIOSPHERIC INDICATORS',
            VariableLevel1: 'INDICATOR SPECIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'PALEOCLIMATE INDICATORS',
            VariableLevel1: 'VOLCANIC DEPOSITS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'PALEOCLIMATE INDICATORS',
            VariableLevel1: 'VOLCANIC DEPOSITS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'PALEOCLIMATE INDICATORS',
            VariableLevel1: 'VOLCANIC FORCING'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'HUMAN DIMENSIONS',
            Term: 'NATURAL HAZARDS',
            VariableLevel1: 'VOLCANIC ERUPTIONS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'LAND SURFACE',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'POINT BAR'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'LAND SURFACE',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'VOLCANO'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'PALEOCLIMATE',
            Term: 'ICE CORE RECORDS',
            VariableLevel1: 'VOLCANIC DEPOSITS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'PALEOCLIMATE',
            Term: 'LAND RECORDS',
            VariableLevel1: 'VOLCANIC DEPOSITS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'POINT BAR'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'VOLCANO'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOTHERMAL DYNAMICS',
            VariableLevel1: 'TEMPERATURE GRADIENT'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOTHERMAL DYNAMICS',
            VariableLevel1: 'TEMPERATURE GRADIENT'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOTHERMAL DYNAMICS',
            VariableLevel1: 'TEMPERATURE PROFILES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SPECTRAL/ENGINEERING',
            Term: 'INFRARED WAVELENGTHS',
            VariableLevel1: 'BRIGHTNESS TEMPERATURE'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SPECTRAL/ENGINEERING',
            Term: 'MICROWAVE',
            VariableLevel1: 'BRIGHTNESS TEMPERATURE'
          }
        ],
        Scale: 1,
        Characteristics: {
          IndexRanges: {
            LatRange: [
              0,
              0
            ],
            LonRange: [
              0,
              0
            ]
          }
        },
        FillValues: [
          {
            Value: -9999,
            Type: 'ANCILLARY_FILLVALUE'
          }
        ],
        Sets: [
          {
            Name: 'SO2_Indicator_A',
            Type: 'Ascending',
            Size: 4,
            Index: 2
          }
        ],
        Dimensions: [
          {
            Name: 'Latitude',
            Size: 180,
            Type: 'LATITUDE_DIMENSION'
          },
          {
            Name: 'Longitude',
            Size: 360,
            Type: 'LONGITUDE_DIMENSION'
          }
        ],
        Definition: 'Standard deviation of 32-bit None Brightness temperature floating difference Tb(1361.44 cm-1) point - Tb(1433.06 cm-1) used as an indicator of SO2 release from volcanoes. Values under -6 K have likely volcanic SO2. (L2 BT_diff_SO2) (Kelvins) Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
        Name: 'SO2_Indicator_A_sdev',
        AcquisitionSourceName: 'Not Provided',
        Units: 'None',
        LongName: 'SO2_Indicator_A_sdev'
      },
      associations: {
        collections: [
          {
            'concept-id': 'C1200278964-E2E_18_4'
          },
          {
            'concept-id': 'C1200278965-E2E_18_4'
          },
          {
            'concept-id': 'C1200278966-E2E_18_4'
          },
          {
            'concept-id': 'C1200278971-E2E_18_4'
          },
          {
            'concept-id': 'C1200278972-E2E_18_4'
          },
          {
            'concept-id': 'C1200278974-E2E_18_4'
          }
        ]
      }
    },
    {
      meta: {
        'revision-id': 6,
        deleted: false,
        format: 'application/vnd.nasa.cmr.umm+json',
        'provider-id': 'E2E_18_4',
        'user-id': 'mmorahan',
        'native-id': 'uvg_TAirSup_A',
        'concept-id': 'V1200279057-E2E_18_4',
        'revision-date': '2018-10-02T19:28:19Z',
        'concept-type': 'variable'
      },
      umm: {
        VariableType: 'SCIENCE_VARIABLE',
        DataType: 'float32',
        Offset: 0,
        ScienceKeywords: [
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC RADIATION',
            VariableLevel1: 'ATMOSPHERIC HEATING'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'COMMON SENSE CLIMATE INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'COOLING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'FREEZING INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'GROWING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'HEAT INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'HEATING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'RESIDENTIAL ENERGY DEMAND TEMPERATURE INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE CONCENTRATION INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'THAWING INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'WIND CHILL INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'ATMOSPHERIC TEMPERATURE INDICES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE TENDENCY'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'HIGHER MAXIMUM DAYTIME TEMPERATURES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'HIGHER MINIMUM NIGHTIME TEMPERATURES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'STRATOSPHERIC TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE TRENDS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE VARIABILITY'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TROPOSPHERIC TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE INDICATORS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'COMMON SENSE CLIMATE INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'COOLING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'FREEZING INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'GROWING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'HEATING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'RESIDENTIAL ENERGY DEMAND TEMPERATURE INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE CONCENTRATION INDEX (TCI)'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'THAWING INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE INDICES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'LAND SURFACE',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'POINT BAR'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'POINT BAR'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOTHERMAL DYNAMICS',
            VariableLevel1: 'TEMPERATURE GRADIENT'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOTHERMAL DYNAMICS',
            VariableLevel1: 'TEMPERATURE GRADIENT'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOTHERMAL DYNAMICS',
            VariableLevel1: 'TEMPERATURE PROFILES'
          }
        ],
        Scale: 1,
        Characteristics: {
          IndexRanges: {
            LatRange: [
              0,
              0
            ],
            LonRange: [
              0,
              0
            ]
          }
        },
        FillValues: [
          {
            Value: -9999,
            Type: 'ANCILLARY_FILLVALUE'
          }
        ],
        Sets: [
          {
            Name: 'Data_Fields',
            Type: 'Ascending',
            Size: 76,
            Index: 4
          }
        ],
        Dimensions: [
          {
            Name: 'XtraPressureLev',
            Size: 100,
            Type: 'PRESSURE_DIMENSION'
          },
          {
            Name: 'Latitude',
            Size: 180,
            Type: 'LATITUDE_DIMENSION'
          },
          {
            Name: 'Longitude',
            Size: 360,
            Type: 'LONGITUDE_DIMENSION'
          }
        ],
        Definition: ' 32-bit XtraPressureLev Atmospheric temperature floating (100) (Kelvin) point Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
        Name: 'TAirSup_A',
        AcquisitionSourceName: 'Not Provided',
        Units: 'hPa',
        LongName: 'TAirSup_A'
      },
      associations: {
        collections: [
          {
            'concept-id': 'C1200278964-E2E_18_4'
          },
          {
            'concept-id': 'C1200278965-E2E_18_4'
          },
          {
            'concept-id': 'C1200278966-E2E_18_4'
          },
          {
            'concept-id': 'C1200278971-E2E_18_4'
          },
          {
            'concept-id': 'C1200278972-E2E_18_4'
          },
          {
            'concept-id': 'C1200278974-E2E_18_4'
          }
        ]
      }
    },
    {
      meta: {
        'revision-id': 6,
        deleted: false,
        format: 'application/vnd.nasa.cmr.umm+json',
        'provider-id': 'E2E_18_4',
        'user-id': 'mmorahan',
        'native-id': 'uvg_TAirSup_A_ct',
        'concept-id': 'V1200279064-E2E_18_4',
        'revision-date': '2018-10-02T19:28:21Z',
        'concept-type': 'variable'
      },
      umm: {
        VariableType: 'SCIENCE_VARIABLE',
        DataType: 'int16',
        Offset: 0,
        ScienceKeywords: [
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC RADIATION',
            VariableLevel1: 'ATMOSPHERIC HEATING'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'COMMON SENSE CLIMATE INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'COOLING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'FREEZING INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'GROWING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'HEAT INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'HEATING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'RESIDENTIAL ENERGY DEMAND TEMPERATURE INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE CONCENTRATION INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'THAWING INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'WIND CHILL INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'ATMOSPHERIC TEMPERATURE INDICES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE TENDENCY'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'HIGHER MAXIMUM DAYTIME TEMPERATURES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'HIGHER MINIMUM NIGHTIME TEMPERATURES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'STRATOSPHERIC TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE TRENDS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE VARIABILITY'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TROPOSPHERIC TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE INDICATORS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'COMMON SENSE CLIMATE INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'COOLING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'FREEZING INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'GROWING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'HEATING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'RESIDENTIAL ENERGY DEMAND TEMPERATURE INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE CONCENTRATION INDEX (TCI)'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'THAWING INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE INDICES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'LAND SURFACE',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'POINT BAR'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'POINT BAR'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOTHERMAL DYNAMICS',
            VariableLevel1: 'TEMPERATURE GRADIENT'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOTHERMAL DYNAMICS',
            VariableLevel1: 'TEMPERATURE GRADIENT'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOTHERMAL DYNAMICS',
            VariableLevel1: 'TEMPERATURE PROFILES'
          }
        ],
        Scale: 1,
        Characteristics: {
          IndexRanges: {
            LatRange: [
              0,
              0
            ],
            LonRange: [
              0,
              0
            ]
          }
        },
        FillValues: [
          {
            Value: 0,
            Type: 'ANCILLARY_FILLVALUE'
          }
        ],
        Sets: [
          {
            Name: 'TAirSup_A',
            Type: 'Ascending',
            Size: 5,
            Index: 1
          }
        ],
        Dimensions: [
          {
            Name: 'XtraPressureLev',
            Size: 100,
            Type: 'PRESSURE_DIMENSION'
          },
          {
            Name: 'Latitude',
            Size: 180,
            Type: 'LATITUDE_DIMENSION'
          },
          {
            Name: 'Longitude',
            Size: 360,
            Type: 'LONGITUDE_DIMENSION'
          }
        ],
        Definition: 'Input count of 32-bit XtraPressureLev Atmospheric temperature floating (100) (Kelvin) point Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
        Name: 'TAirSup_A_ct',
        AcquisitionSourceName: 'Not Provided',
        Units: 'hPa',
        LongName: 'TAirSup_A_ct'
      },
      associations: {
        collections: [
          {
            'concept-id': 'C1200278964-E2E_18_4'
          },
          {
            'concept-id': 'C1200278965-E2E_18_4'
          },
          {
            'concept-id': 'C1200278966-E2E_18_4'
          },
          {
            'concept-id': 'C1200278971-E2E_18_4'
          },
          {
            'concept-id': 'C1200278972-E2E_18_4'
          },
          {
            'concept-id': 'C1200278974-E2E_18_4'
          }
        ]
      }
    },
    {
      meta: {
        'revision-id': 6,
        deleted: false,
        format: 'application/vnd.nasa.cmr.umm+json',
        'provider-id': 'E2E_18_4',
        'user-id': 'mmorahan',
        'native-id': 'uvg_TAirSup_A_err',
        'concept-id': 'V1200279044-E2E_18_4',
        'revision-date': '2018-10-02T19:28:09Z',
        'concept-type': 'variable'
      },
      umm: {
        VariableType: 'SCIENCE_VARIABLE',
        DataType: 'float32',
        Offset: 0,
        ScienceKeywords: [
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC RADIATION',
            VariableLevel1: 'ATMOSPHERIC HEATING'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'COMMON SENSE CLIMATE INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'COOLING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'FREEZING INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'GROWING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'HEAT INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'HEATING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'RESIDENTIAL ENERGY DEMAND TEMPERATURE INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE CONCENTRATION INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'THAWING INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'WIND CHILL INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'ATMOSPHERIC TEMPERATURE INDICES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE TENDENCY'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'HIGHER MAXIMUM DAYTIME TEMPERATURES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'HIGHER MINIMUM NIGHTIME TEMPERATURES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'STRATOSPHERIC TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE TRENDS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE VARIABILITY'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TROPOSPHERIC TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE INDICATORS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'COMMON SENSE CLIMATE INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'COOLING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'FREEZING INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'GROWING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'HEATING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'RESIDENTIAL ENERGY DEMAND TEMPERATURE INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE CONCENTRATION INDEX (TCI)'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'THAWING INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE INDICES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'LAND SURFACE',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'POINT BAR'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'POINT BAR'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOTHERMAL DYNAMICS',
            VariableLevel1: 'TEMPERATURE GRADIENT'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOTHERMAL DYNAMICS',
            VariableLevel1: 'TEMPERATURE GRADIENT'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOTHERMAL DYNAMICS',
            VariableLevel1: 'TEMPERATURE PROFILES'
          }
        ],
        Scale: 1,
        Characteristics: {
          IndexRanges: {
            LatRange: [
              0,
              0
            ],
            LonRange: [
              0,
              0
            ]
          }
        },
        FillValues: [
          {
            Value: -9999,
            Type: 'ANCILLARY_FILLVALUE'
          }
        ],
        Sets: [
          {
            Name: 'TAirSup_A',
            Type: 'Ascending',
            Size: 5,
            Index: 5
          }
        ],
        Dimensions: [
          {
            Name: 'XtraPressureLev',
            Size: 100,
            Type: 'PRESSURE_DIMENSION'
          },
          {
            Name: 'Latitude',
            Size: 180,
            Type: 'LATITUDE_DIMENSION'
          },
          {
            Name: 'Longitude',
            Size: 360,
            Type: 'LONGITUDE_DIMENSION'
          }
        ],
        Definition: 'Standard error of 32-bit XtraPressureLev Atmospheric temperature floating (100) (Kelvin) point Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
        Name: 'TAirSup_A_err',
        AcquisitionSourceName: 'Not Provided',
        Units: 'hPa',
        LongName: 'TAirSup_A_err'
      },
      associations: {
        collections: [
          {
            'concept-id': 'C1200278964-E2E_18_4'
          },
          {
            'concept-id': 'C1200278965-E2E_18_4'
          },
          {
            'concept-id': 'C1200278966-E2E_18_4'
          },
          {
            'concept-id': 'C1200278971-E2E_18_4'
          },
          {
            'concept-id': 'C1200278972-E2E_18_4'
          },
          {
            'concept-id': 'C1200278974-E2E_18_4'
          }
        ]
      }
    },
    {
      meta: {
        'revision-id': 6,
        deleted: false,
        format: 'application/vnd.nasa.cmr.umm+json',
        'provider-id': 'E2E_18_4',
        'user-id': 'mmorahan',
        'native-id': 'uvg_TAirSup_A_max',
        'concept-id': 'V1200279052-E2E_18_4',
        'revision-date': '2018-10-02T19:28:16Z',
        'concept-type': 'variable'
      },
      umm: {
        VariableType: 'SCIENCE_VARIABLE',
        DataType: 'float32',
        Offset: 0,
        ScienceKeywords: [
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC RADIATION',
            VariableLevel1: 'ATMOSPHERIC HEATING'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'COMMON SENSE CLIMATE INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'COOLING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'FREEZING INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'GROWING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'HEAT INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'HEATING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'RESIDENTIAL ENERGY DEMAND TEMPERATURE INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE CONCENTRATION INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'THAWING INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'WIND CHILL INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'ATMOSPHERIC TEMPERATURE INDICES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE TENDENCY'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'HIGHER MAXIMUM DAYTIME TEMPERATURES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'HIGHER MINIMUM NIGHTIME TEMPERATURES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'STRATOSPHERIC TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE TRENDS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE VARIABILITY'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TROPOSPHERIC TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE INDICATORS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'COMMON SENSE CLIMATE INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'COOLING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'FREEZING INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'GROWING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'HEATING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'RESIDENTIAL ENERGY DEMAND TEMPERATURE INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE CONCENTRATION INDEX (TCI)'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'THAWING INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE INDICES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'LAND SURFACE',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'POINT BAR'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'POINT BAR'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOTHERMAL DYNAMICS',
            VariableLevel1: 'TEMPERATURE GRADIENT'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOTHERMAL DYNAMICS',
            VariableLevel1: 'TEMPERATURE GRADIENT'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOTHERMAL DYNAMICS',
            VariableLevel1: 'TEMPERATURE PROFILES'
          }
        ],
        Scale: 1,
        Characteristics: {
          IndexRanges: {
            LatRange: [
              0,
              0
            ],
            LonRange: [
              0,
              0
            ]
          }
        },
        FillValues: [
          {
            Value: -9999,
            Type: 'ANCILLARY_FILLVALUE'
          }
        ],
        Sets: [
          {
            Name: 'TAirSup_A',
            Type: 'Ascending',
            Size: 5,
            Index: 4
          }
        ],
        Dimensions: [
          {
            Name: 'XtraPressureLev',
            Size: 100,
            Type: 'PRESSURE_DIMENSION'
          },
          {
            Name: 'Latitude',
            Size: 180,
            Type: 'LATITUDE_DIMENSION'
          },
          {
            Name: 'Longitude',
            Size: 360,
            Type: 'LONGITUDE_DIMENSION'
          }
        ],
        Definition: 'Maximum value of 32-bit XtraPressureLev Atmospheric temperature floating (100) (Kelvin) point Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
        Name: 'TAirSup_A_max',
        AcquisitionSourceName: 'Not Provided',
        Units: 'hPa',
        LongName: 'TAirSup_A_max'
      },
      associations: {
        collections: [
          {
            'concept-id': 'C1200278964-E2E_18_4'
          },
          {
            'concept-id': 'C1200278965-E2E_18_4'
          },
          {
            'concept-id': 'C1200278966-E2E_18_4'
          },
          {
            'concept-id': 'C1200278971-E2E_18_4'
          },
          {
            'concept-id': 'C1200278972-E2E_18_4'
          },
          {
            'concept-id': 'C1200278974-E2E_18_4'
          }
        ]
      }
    },
    {
      meta: {
        'revision-id': 6,
        deleted: false,
        format: 'application/vnd.nasa.cmr.umm+json',
        'provider-id': 'E2E_18_4',
        'user-id': 'mmorahan',
        'native-id': 'uvg_TAirSup_A_min',
        'concept-id': 'V1200279061-E2E_18_4',
        'revision-date': '2018-10-02T19:28:21Z',
        'concept-type': 'variable'
      },
      umm: {
        VariableType: 'SCIENCE_VARIABLE',
        DataType: 'float32',
        Offset: 0,
        ScienceKeywords: [
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC RADIATION',
            VariableLevel1: 'ATMOSPHERIC HEATING'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'COMMON SENSE CLIMATE INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'COOLING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'FREEZING INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'GROWING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'HEAT INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'HEATING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'RESIDENTIAL ENERGY DEMAND TEMPERATURE INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE CONCENTRATION INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'THAWING INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'WIND CHILL INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'ATMOSPHERIC TEMPERATURE INDICES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE TENDENCY'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'HIGHER MAXIMUM DAYTIME TEMPERATURES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'HIGHER MINIMUM NIGHTIME TEMPERATURES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'STRATOSPHERIC TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE TRENDS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE VARIABILITY'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TROPOSPHERIC TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE INDICATORS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'COMMON SENSE CLIMATE INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'COOLING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'FREEZING INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'GROWING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'HEATING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'RESIDENTIAL ENERGY DEMAND TEMPERATURE INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE CONCENTRATION INDEX (TCI)'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'THAWING INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE INDICES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'LAND SURFACE',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'POINT BAR'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'POINT BAR'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOTHERMAL DYNAMICS',
            VariableLevel1: 'TEMPERATURE GRADIENT'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOTHERMAL DYNAMICS',
            VariableLevel1: 'TEMPERATURE GRADIENT'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOTHERMAL DYNAMICS',
            VariableLevel1: 'TEMPERATURE PROFILES'
          }
        ],
        Scale: 1,
        Characteristics: {
          IndexRanges: {
            LatRange: [
              0,
              0
            ],
            LonRange: [
              0,
              0
            ]
          }
        },
        FillValues: [
          {
            Value: -9999,
            Type: 'ANCILLARY_FILLVALUE'
          }
        ],
        Sets: [
          {
            Name: 'TAirSup_A',
            Type: 'Ascending',
            Size: 5,
            Index: 3
          }
        ],
        Dimensions: [
          {
            Name: 'XtraPressureLev',
            Size: 100,
            Type: 'PRESSURE_DIMENSION'
          },
          {
            Name: 'Latitude',
            Size: 180,
            Type: 'LATITUDE_DIMENSION'
          },
          {
            Name: 'Longitude',
            Size: 360,
            Type: 'LONGITUDE_DIMENSION'
          }
        ],
        Definition: 'Minimum value of 32-bit XtraPressureLev Atmospheric temperature floating (100) (Kelvin) point Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
        Name: 'TAirSup_A_min',
        AcquisitionSourceName: 'Not Provided',
        Units: 'hPa',
        LongName: 'TAirSup_A_min'
      },
      associations: {
        collections: [
          {
            'concept-id': 'C1200278964-E2E_18_4'
          },
          {
            'concept-id': 'C1200278965-E2E_18_4'
          },
          {
            'concept-id': 'C1200278966-E2E_18_4'
          },
          {
            'concept-id': 'C1200278971-E2E_18_4'
          },
          {
            'concept-id': 'C1200278972-E2E_18_4'
          },
          {
            'concept-id': 'C1200278974-E2E_18_4'
          }
        ]
      }
    },
    {
      meta: {
        'revision-id': 6,
        deleted: false,
        format: 'application/vnd.nasa.cmr.umm+json',
        'provider-id': 'E2E_18_4',
        'user-id': 'mmorahan',
        'native-id': 'uvg_TAirSup_A_sdev',
        'concept-id': 'V1200279039-E2E_18_4',
        'revision-date': '2018-10-02T19:28:06Z',
        'concept-type': 'variable'
      },
      umm: {
        VariableType: 'SCIENCE_VARIABLE',
        DataType: 'float32',
        Offset: 0,
        ScienceKeywords: [
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC RADIATION',
            VariableLevel1: 'ATMOSPHERIC HEATING'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'COMMON SENSE CLIMATE INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'COOLING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'FREEZING INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'GROWING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'HEAT INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'HEATING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'RESIDENTIAL ENERGY DEMAND TEMPERATURE INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE CONCENTRATION INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'THAWING INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'WIND CHILL INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'ATMOSPHERIC TEMPERATURE INDICES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE TENDENCY'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'HIGHER MAXIMUM DAYTIME TEMPERATURES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'HIGHER MINIMUM NIGHTIME TEMPERATURES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'STRATOSPHERIC TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE TRENDS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE VARIABILITY'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TROPOSPHERIC TEMPERATURE ANOMALIES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE INDICATORS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'COMMON SENSE CLIMATE INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'COOLING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'FREEZING INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'GROWING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'HEATING DEGREE DAYS'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'RESIDENTIAL ENERGY DEMAND TEMPERATURE INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE CONCENTRATION INDEX (TCI)'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'THAWING INDEX'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'CLIMATE INDICATORS',
            Term: 'ATMOSPHERIC/OCEAN INDICATORS',
            VariableLevel1: 'TEMPERATURE INDICES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'LAND SURFACE',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'POINT BAR'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
            VariableLevel1: 'POINT BAR'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOTHERMAL DYNAMICS',
            VariableLevel1: 'TEMPERATURE GRADIENT'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOTHERMAL DYNAMICS',
            VariableLevel1: 'TEMPERATURE GRADIENT'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'SOLID EARTH',
            Term: 'GEOTHERMAL DYNAMICS',
            VariableLevel1: 'TEMPERATURE PROFILES'
          }
        ],
        Scale: 1,
        Characteristics: {
          IndexRanges: {
            LatRange: [
              0,
              0
            ],
            LonRange: [
              0,
              0
            ]
          }
        },
        FillValues: [
          {
            Value: -9999,
            Type: 'ANCILLARY_FILLVALUE'
          }
        ],
        Sets: [
          {
            Name: 'TAirSup_A',
            Type: 'Ascending',
            Size: 5,
            Index: 2
          }
        ],
        Dimensions: [
          {
            Name: 'XtraPressureLev',
            Size: 100,
            Type: 'PRESSURE_DIMENSION'
          },
          {
            Name: 'Latitude',
            Size: 180,
            Type: 'LATITUDE_DIMENSION'
          },
          {
            Name: 'Longitude',
            Size: 360,
            Type: 'LONGITUDE_DIMENSION'
          }
        ],
        Definition: 'Standard deviation of 32-bit XtraPressureLev Atmospheric temperature floating (100) (Kelvin) point Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
        Name: 'TAirSup_A_sdev',
        AcquisitionSourceName: 'Not Provided',
        Units: 'hPa',
        LongName: 'TAirSup_A_sdev'
      },
      associations: {
        collections: [
          {
            'concept-id': 'C1200278964-E2E_18_4'
          },
          {
            'concept-id': 'C1200278965-E2E_18_4'
          },
          {
            'concept-id': 'C1200278966-E2E_18_4'
          },
          {
            'concept-id': 'C1200278971-E2E_18_4'
          },
          {
            'concept-id': 'C1200278972-E2E_18_4'
          },
          {
            'concept-id': 'C1200278974-E2E_18_4'
          }
        ]
      }
    },
    {
      meta: {
        'revision-id': 6,
        deleted: false,
        format: 'application/vnd.nasa.cmr.umm+json',
        'provider-id': 'E2E_18_4',
        'user-id': 'mmorahan',
        'native-id': 'uvg_Temp_dof_A',
        'concept-id': 'V1200279075-E2E_18_4',
        'revision-date': '2018-10-02T19:28:27Z',
        'concept-type': 'variable'
      },
      umm: {
        VariableType: 'SCIENCE_VARIABLE',
        DataType: 'float32',
        Offset: 0,
        ScienceKeywords: [
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'CLOUDS',
            VariableLevel1: 'CLOUD TOP TEMPERATURE'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'LAND SURFACE',
            Term: 'SURFACE THERMAL PROPERTIES',
            VariableLevel1: 'SKIN TEMPERATURE'
          }
        ],
        Scale: 1,
        Characteristics: {
          IndexRanges: {
            LatRange: [
              0,
              0
            ],
            LonRange: [
              0,
              0
            ]
          }
        },
        FillValues: [
          {
            Value: -9999,
            Type: 'ANCILLARY_FILLVALUE'
          }
        ],
        Sets: [
          {
            Name: 'Data_Fields',
            Type: 'Ascending',
            Size: 76,
            Index: 5
          }
        ],
        Dimensions: [
          {
            Name: 'Latitude',
            Size: 180,
            Type: 'LATITUDE_DIMENSION'
          },
          {
            Name: 'Longitude',
            Size: 360,
            Type: 'LONGITUDE_DIMENSION'
          }
        ],
        Definition: ' 32-bit None Degrees of freedom from floating the physical retrieval of point temperature (unitless) Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
        Name: 'Temp_dof_A',
        AcquisitionSourceName: 'Not Provided',
        Units: 'None',
        LongName: 'Temp_dof_A'
      },
      associations: {
        collections: [
          {
            'concept-id': 'C1200278964-E2E_18_4'
          },
          {
            'concept-id': 'C1200278965-E2E_18_4'
          },
          {
            'concept-id': 'C1200278966-E2E_18_4'
          },
          {
            'concept-id': 'C1200278971-E2E_18_4'
          },
          {
            'concept-id': 'C1200278972-E2E_18_4'
          },
          {
            'concept-id': 'C1200278974-E2E_18_4'
          }
        ]
      }
    },
    {
      meta: {
        'revision-id': 6,
        deleted: false,
        format: 'application/vnd.nasa.cmr.umm+json',
        'provider-id': 'E2E_18_4',
        'user-id': 'mmorahan',
        'native-id': 'uvg_Temp_dof_A_ct',
        'concept-id': 'V1200279048-E2E_18_4',
        'revision-date': '2018-10-02T19:28:11Z',
        'concept-type': 'variable'
      },
      umm: {
        VariableType: 'SCIENCE_VARIABLE',
        DataType: 'int16',
        Offset: 0,
        ScienceKeywords: [
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'CLOUDS',
            VariableLevel1: 'CLOUD TOP TEMPERATURE'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'LAND SURFACE',
            Term: 'SURFACE THERMAL PROPERTIES',
            VariableLevel1: 'SKIN TEMPERATURE'
          }
        ],
        Scale: 1,
        Characteristics: {
          IndexRanges: {
            LatRange: [
              0,
              0
            ],
            LonRange: [
              0,
              0
            ]
          }
        },
        FillValues: [
          {
            Value: 0,
            Type: 'ANCILLARY_FILLVALUE'
          }
        ],
        Sets: [
          {
            Name: 'Temp_dof_A',
            Type: 'Ascending',
            Size: 5,
            Index: 1
          }
        ],
        Dimensions: [
          {
            Name: 'Latitude',
            Size: 180,
            Type: 'LATITUDE_DIMENSION'
          },
          {
            Name: 'Longitude',
            Size: 360,
            Type: 'LONGITUDE_DIMENSION'
          }
        ],
        Definition: 'Input count of 32-bit None Degrees of freedom from floating the physical retrieval of point temperature (unitless) Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
        Name: 'Temp_dof_A_ct',
        AcquisitionSourceName: 'Not Provided',
        Units: 'None',
        LongName: 'Temp_dof_A_ct'
      },
      associations: {
        collections: [
          {
            'concept-id': 'C1200278964-E2E_18_4'
          },
          {
            'concept-id': 'C1200278965-E2E_18_4'
          },
          {
            'concept-id': 'C1200278966-E2E_18_4'
          },
          {
            'concept-id': 'C1200278971-E2E_18_4'
          },
          {
            'concept-id': 'C1200278972-E2E_18_4'
          },
          {
            'concept-id': 'C1200278974-E2E_18_4'
          }
        ]
      }
    },
    {
      meta: {
        'revision-id': 6,
        deleted: false,
        format: 'application/vnd.nasa.cmr.umm+json',
        'provider-id': 'E2E_18_4',
        'user-id': 'mmorahan',
        'native-id': 'uvg_Temp_dof_A_max',
        'concept-id': 'V1200279060-E2E_18_4',
        'revision-date': '2018-10-02T19:28:19Z',
        'concept-type': 'variable'
      },
      umm: {
        VariableType: 'SCIENCE_VARIABLE',
        DataType: 'float32',
        Offset: 0,
        ScienceKeywords: [
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'CLOUDS',
            VariableLevel1: 'CLOUD TOP TEMPERATURE'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'LAND SURFACE',
            Term: 'SURFACE THERMAL PROPERTIES',
            VariableLevel1: 'SKIN TEMPERATURE'
          }
        ],
        Scale: 1,
        Characteristics: {
          IndexRanges: {
            LatRange: [
              0,
              0
            ],
            LonRange: [
              0,
              0
            ]
          }
        },
        FillValues: [
          {
            Value: -9999,
            Type: 'ANCILLARY_FILLVALUE'
          }
        ],
        Sets: [
          {
            Name: 'Temp_dof_A',
            Type: 'Ascending',
            Size: 5,
            Index: 4
          }
        ],
        Dimensions: [
          {
            Name: 'Latitude',
            Size: 180,
            Type: 'LATITUDE_DIMENSION'
          },
          {
            Name: 'Longitude',
            Size: 360,
            Type: 'LONGITUDE_DIMENSION'
          }
        ],
        Definition: 'Maximum value of 32-bit None Degrees of freedom from floating the physical retrieval of point temperature (unitless) Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
        Name: 'Temp_dof_A_max',
        AcquisitionSourceName: 'Not Provided',
        Units: 'None',
        LongName: 'Temp_dof_A_max'
      },
      associations: {
        collections: [
          {
            'concept-id': 'C1200278964-E2E_18_4'
          },
          {
            'concept-id': 'C1200278965-E2E_18_4'
          },
          {
            'concept-id': 'C1200278966-E2E_18_4'
          },
          {
            'concept-id': 'C1200278971-E2E_18_4'
          },
          {
            'concept-id': 'C1200278972-E2E_18_4'
          },
          {
            'concept-id': 'C1200278974-E2E_18_4'
          }
        ]
      }
    },
    {
      meta: {
        'revision-id': 6,
        deleted: false,
        format: 'application/vnd.nasa.cmr.umm+json',
        'provider-id': 'E2E_18_4',
        'user-id': 'mmorahan',
        'native-id': 'uvg_Temp_dof_A_min',
        'concept-id': 'V1200279056-E2E_18_4',
        'revision-date': '2018-10-02T19:28:18Z',
        'concept-type': 'variable'
      },
      umm: {
        VariableType: 'SCIENCE_VARIABLE',
        DataType: 'float32',
        Offset: 0,
        ScienceKeywords: [
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'CLOUDS',
            VariableLevel1: 'CLOUD TOP TEMPERATURE'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'LAND SURFACE',
            Term: 'SURFACE THERMAL PROPERTIES',
            VariableLevel1: 'SKIN TEMPERATURE'
          }
        ],
        Scale: 1,
        Characteristics: {
          IndexRanges: {
            LatRange: [
              0,
              0
            ],
            LonRange: [
              0,
              0
            ]
          }
        },
        FillValues: [
          {
            Value: -9999,
            Type: 'ANCILLARY_FILLVALUE'
          }
        ],
        Sets: [
          {
            Name: 'Temp_dof_A',
            Type: 'Ascending',
            Size: 5,
            Index: 3
          }
        ],
        Dimensions: [
          {
            Name: 'Latitude',
            Size: 180,
            Type: 'LATITUDE_DIMENSION'
          },
          {
            Name: 'Longitude',
            Size: 360,
            Type: 'LONGITUDE_DIMENSION'
          }
        ],
        Definition: 'Minimum value of 32-bit None Degrees of freedom from floating the physical retrieval of point temperature (unitless) Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
        Name: 'Temp_dof_A_min',
        AcquisitionSourceName: 'Not Provided',
        Units: 'None',
        LongName: 'Temp_dof_A_min'
      },
      associations: {
        collections: [
          {
            'concept-id': 'C1200278964-E2E_18_4'
          },
          {
            'concept-id': 'C1200278965-E2E_18_4'
          },
          {
            'concept-id': 'C1200278966-E2E_18_4'
          },
          {
            'concept-id': 'C1200278971-E2E_18_4'
          },
          {
            'concept-id': 'C1200278972-E2E_18_4'
          },
          {
            'concept-id': 'C1200278974-E2E_18_4'
          }
        ]
      }
    },
    {
      meta: {
        'revision-id': 6,
        deleted: false,
        format: 'application/vnd.nasa.cmr.umm+json',
        'provider-id': 'E2E_18_4',
        'user-id': 'mmorahan',
        'native-id': 'uvg_Temp_dof_A_sdev',
        'concept-id': 'V1200279038-E2E_18_4',
        'revision-date': '2018-10-02T19:28:05Z',
        'concept-type': 'variable'
      },
      umm: {
        VariableType: 'SCIENCE_VARIABLE',
        DataType: 'float32',
        Offset: 0,
        ScienceKeywords: [
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'CLOUDS',
            VariableLevel1: 'CLOUD TOP TEMPERATURE'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'LAND SURFACE',
            Term: 'SURFACE THERMAL PROPERTIES',
            VariableLevel1: 'SKIN TEMPERATURE'
          }
        ],
        Scale: 1,
        Characteristics: {
          IndexRanges: {
            LatRange: [
              0,
              0
            ],
            LonRange: [
              0,
              0
            ]
          }
        },
        FillValues: [
          {
            Value: -9999,
            Type: 'ANCILLARY_FILLVALUE'
          }
        ],
        Sets: [
          {
            Name: 'Temp_dof_A',
            Type: 'Ascending',
            Size: 5,
            Index: 2
          }
        ],
        Dimensions: [
          {
            Name: 'Latitude',
            Size: 180,
            Type: 'LATITUDE_DIMENSION'
          },
          {
            Name: 'Longitude',
            Size: 360,
            Type: 'LONGITUDE_DIMENSION'
          }
        ],
        Definition: 'Standard deviation of 32-bit None Degrees of freedom from floating the physical retrieval of point temperature (unitless) Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
        Name: 'Temp_dof_A_sdev',
        AcquisitionSourceName: 'Not Provided',
        Units: 'None',
        LongName: 'Temp_dof_A_sdev'
      },
      associations: {
        collections: [
          {
            'concept-id': 'C1200278964-E2E_18_4'
          },
          {
            'concept-id': 'C1200278965-E2E_18_4'
          },
          {
            'concept-id': 'C1200278966-E2E_18_4'
          },
          {
            'concept-id': 'C1200278971-E2E_18_4'
          },
          {
            'concept-id': 'C1200278972-E2E_18_4'
          },
          {
            'concept-id': 'C1200278974-E2E_18_4'
          }
        ]
      }
    },
    {
      meta: {
        'revision-id': 10,
        deleted: false,
        format: 'application/vnd.nasa.cmr.umm+json',
        'provider-id': 'E2E_18_4',
        'user-id': 'jdfarley',
        'native-id': 'uvg_TotalCounts_A',
        'concept-id': 'V1200279053-E2E_18_4',
        'revision-date': '2018-11-01T17:52:41Z',
        'concept-type': 'variable'
      },
      umm: {
        VariableType: 'SCIENCE_VARIABLE',
        DataType: 'int16',
        Offset: 0,
        ScienceKeywords: [
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ALTITUDE',
            VariableLevel1: 'TROPOPAUSE'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC PRESSURE',
            VariableLevel1: 'SURFACE PRESSURE'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'AIR TEMPERATURE'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC TEMPERATURE',
            VariableLevel1: 'UPPER AIR TEMPERATURE'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC WATER VAPOR',
            VariableLevel1: 'TOTAL PRECIPITABLE WATER'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC WATER VAPOR',
            VariableLevel1: 'WATER VAPOR'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'CLOUDS',
            VariableLevel1: 'CLOUD HEIGHT'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'CLOUDS',
            VariableLevel1: 'CLOUD TOP PRESSURE'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'CLOUDS',
            VariableLevel1: 'CLOUD TOP TEMPERATURE'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'CLOUDS',
            VariableLevel1: 'CLOUD VERTICAL DISTRIBUTION'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'LAND SURFACE',
            Term: 'SURFACE RADIATIVE PROPERTIES',
            VariableLevel1: 'EMISSIVITY'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'OCEANS',
            Term: 'OCEAN TEMPERATURE',
            VariableLevel1: 'SEA SURFACE TEMPERATURE'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'LAND SURFACE',
            Term: 'SURFACE THERMAL PROPERTIES',
            VariableLevel1: 'SKIN TEMPERATURE'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'AIR QUALITY',
            VariableLevel1: 'CARBON MONOXIDE'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ALTITUDE',
            VariableLevel1: 'GEOPOTENTIAL HEIGHT'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC WATER VAPOR',
            VariableLevel1: 'HUMIDITY'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC WATER VAPOR',
            VariableLevel1: 'WATER VAPOR PROFILES'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'CLOUDS',
            VariableLevel1: 'CLOUD LIQUID WATER/ICE'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC RADIATION',
            VariableLevel1: 'OUTGOING LONGWAVE RADIATION'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC CHEMISTRY',
            VariableLevel1: 'METHANE'
          },
          {
            Category: 'EARTH SCIENCE',
            Topic: 'ATMOSPHERE',
            Term: 'ATMOSPHERIC CHEMISTRY',
            VariableLevel1: 'OZONE'
          }
        ],
        Scale: 1,
        Characteristics: {
          IndexRanges: {
            LatRange: [
              89.5,
              -89.5
            ],
            LonRange: [
              -179.5,
              179.5
            ]
          },
          GroupPath: '/TotalCounts_A'
        },
        FillValues: [
          {
            Value: 0,
            Type: 'ANCILLARY_FILLVALUE'
          }
        ],
        Sets: [
          {
            Name: 'TotalCounts_A',
            Type: 'General',
            Size: 778,
            Index: 1
          }
        ],
        Dimensions: [
          {
            Name: 'Latitude',
            Size: 180,
            Type: 'LATITUDE_DIMENSION'
          },
          {
            Name: 'Longitude',
            Size: 360,
            Type: 'LONGITUDE_DIMENSION'
          }
        ],
        Definition: '  Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
        Name: 'TotalCounts_A',
        AcquisitionSourceName: 'Not Provided',
        Units: 'None',
        LongName: 'TotalCounts Ascending'
      },
      associations: {
        collections: [
          {
            'concept-id': 'C1200278965-E2E_18_4'
          },
          {
            'concept-id': 'C1200278968-E2E_18_4'
          },
          {
            'concept-id': 'C1200278973-E2E_18_4'
          },
          {
            'concept-id': 'C1200278972-E2E_18_4'
          },
          {
            'concept-id': 'C1200278970-E2E_18_4'
          },
          {
            'concept-id': 'C1200278964-E2E_18_4'
          },
          {
            'concept-id': 'C1200278974-E2E_18_4'
          },
          {
            'concept-id': 'C1200278966-E2E_18_4'
          },
          {
            'concept-id': 'C1200278971-E2E_18_4'
          },
          {
            'concept-id': 'C1200278967-E2E_18_4'
          }
        ]
      }
    }
  ]
}

export const mockKeywordMappings = {
  'AIR TEMPERATURE': [
    'V1200279053-E2E_18_4'
  ],
  'ATMOSPHERIC HEATING': [
    'V1200279057-E2E_18_4',
    'V1200279064-E2E_18_4',
    'V1200279044-E2E_18_4',
    'V1200279052-E2E_18_4',
    'V1200279061-E2E_18_4',
    'V1200279039-E2E_18_4'
  ],
  'ATMOSPHERIC TEMPERATURE INDICES': [
    'V1200279057-E2E_18_4',
    'V1200279064-E2E_18_4',
    'V1200279044-E2E_18_4',
    'V1200279052-E2E_18_4',
    'V1200279061-E2E_18_4',
    'V1200279039-E2E_18_4'
  ],
  'BRIGHTNESS TEMPERATURE': [
    'V1200279065-E2E_18_4',
    'V1200279035-E2E_18_4',
    'V1200279049-E2E_18_4',
    'V1200279041-E2E_18_4',
    'V1200279073-E2E_18_4'
  ],
  'CARBON MONOXIDE': [
    'V1200279053-E2E_18_4'
  ],
  'CLOUD HEIGHT': [
    'V1200279053-E2E_18_4'
  ],
  'CLOUD LIQUID WATER/ICE': [
    'V1200279053-E2E_18_4'
  ],
  'CLOUD TOP PRESSURE': [
    'V1200279053-E2E_18_4'
  ],
  'CLOUD TOP TEMPERATURE': [
    'V1200279075-E2E_18_4',
    'V1200279048-E2E_18_4',
    'V1200279060-E2E_18_4',
    'V1200279056-E2E_18_4',
    'V1200279038-E2E_18_4',
    'V1200279053-E2E_18_4'
  ],
  'CLOUD VERTICAL DISTRIBUTION': [
    'V1200279053-E2E_18_4'
  ],
  'COMMON SENSE CLIMATE INDEX': [
    'V1200279065-E2E_18_4',
    'V1200279035-E2E_18_4',
    'V1200279049-E2E_18_4',
    'V1200279041-E2E_18_4',
    'V1200279073-E2E_18_4',
    'V1200279057-E2E_18_4',
    'V1200279064-E2E_18_4',
    'V1200279044-E2E_18_4',
    'V1200279052-E2E_18_4',
    'V1200279061-E2E_18_4',
    'V1200279039-E2E_18_4'
  ],
  'COOLING DEGREE DAYS': [
    'V1200279065-E2E_18_4',
    'V1200279035-E2E_18_4',
    'V1200279049-E2E_18_4',
    'V1200279041-E2E_18_4',
    'V1200279073-E2E_18_4',
    'V1200279057-E2E_18_4',
    'V1200279064-E2E_18_4',
    'V1200279044-E2E_18_4',
    'V1200279052-E2E_18_4',
    'V1200279061-E2E_18_4',
    'V1200279039-E2E_18_4'
  ],
  EMISSIVITY: [
    'V1200279053-E2E_18_4'
  ],
  'FREEZING INDEX': [
    'V1200279065-E2E_18_4',
    'V1200279035-E2E_18_4',
    'V1200279049-E2E_18_4',
    'V1200279041-E2E_18_4',
    'V1200279073-E2E_18_4',
    'V1200279057-E2E_18_4',
    'V1200279064-E2E_18_4',
    'V1200279044-E2E_18_4',
    'V1200279052-E2E_18_4',
    'V1200279061-E2E_18_4',
    'V1200279039-E2E_18_4'
  ],
  'GEOPOTENTIAL HEIGHT': [
    'V1200279053-E2E_18_4'
  ],
  'GROWING DEGREE DAYS': [
    'V1200279065-E2E_18_4',
    'V1200279035-E2E_18_4',
    'V1200279049-E2E_18_4',
    'V1200279041-E2E_18_4',
    'V1200279073-E2E_18_4',
    'V1200279057-E2E_18_4',
    'V1200279064-E2E_18_4',
    'V1200279044-E2E_18_4',
    'V1200279052-E2E_18_4',
    'V1200279061-E2E_18_4',
    'V1200279039-E2E_18_4'
  ],
  'HEAT INDEX': [
    'V1200279057-E2E_18_4',
    'V1200279064-E2E_18_4',
    'V1200279044-E2E_18_4',
    'V1200279052-E2E_18_4',
    'V1200279061-E2E_18_4',
    'V1200279039-E2E_18_4'
  ],
  'HEATING DEGREE DAYS': [
    'V1200279065-E2E_18_4',
    'V1200279035-E2E_18_4',
    'V1200279049-E2E_18_4',
    'V1200279041-E2E_18_4',
    'V1200279073-E2E_18_4',
    'V1200279057-E2E_18_4',
    'V1200279064-E2E_18_4',
    'V1200279044-E2E_18_4',
    'V1200279052-E2E_18_4',
    'V1200279061-E2E_18_4',
    'V1200279039-E2E_18_4'
  ],
  'HIGHER MAXIMUM DAYTIME TEMPERATURES': [
    'V1200279065-E2E_18_4',
    'V1200279035-E2E_18_4',
    'V1200279049-E2E_18_4',
    'V1200279041-E2E_18_4',
    'V1200279073-E2E_18_4',
    'V1200279057-E2E_18_4',
    'V1200279064-E2E_18_4',
    'V1200279044-E2E_18_4',
    'V1200279052-E2E_18_4',
    'V1200279061-E2E_18_4',
    'V1200279039-E2E_18_4'
  ],
  'HIGHER MINIMUM NIGHTIME TEMPERATURES': [
    'V1200279065-E2E_18_4',
    'V1200279035-E2E_18_4',
    'V1200279049-E2E_18_4',
    'V1200279041-E2E_18_4',
    'V1200279073-E2E_18_4',
    'V1200279057-E2E_18_4',
    'V1200279064-E2E_18_4',
    'V1200279044-E2E_18_4',
    'V1200279052-E2E_18_4',
    'V1200279061-E2E_18_4',
    'V1200279039-E2E_18_4'
  ],
  HUMIDITY: [
    'V1200279053-E2E_18_4'
  ],
  'INDICATOR SPECIES': [
    'V1200279065-E2E_18_4',
    'V1200279035-E2E_18_4',
    'V1200279049-E2E_18_4',
    'V1200279041-E2E_18_4',
    'V1200279073-E2E_18_4'
  ],
  METHANE: [
    'V1200279053-E2E_18_4'
  ],
  'OUTGOING LONGWAVE RADIATION': [
    'V1200279053-E2E_18_4'
  ],
  OZONE: [
    'V1200279053-E2E_18_4'
  ],
  'POINT BAR': [
    'V1200279034-E2E_18_4',
    'V1200279045-E2E_18_4',
    'V1200279072-E2E_18_4',
    'V1200279069-E2E_18_4',
    'V1200279068-E2E_18_4',
    'V1200279065-E2E_18_4',
    'V1200279035-E2E_18_4',
    'V1200279049-E2E_18_4',
    'V1200279041-E2E_18_4',
    'V1200279073-E2E_18_4',
    'V1200279057-E2E_18_4',
    'V1200279064-E2E_18_4',
    'V1200279044-E2E_18_4',
    'V1200279052-E2E_18_4',
    'V1200279061-E2E_18_4',
    'V1200279039-E2E_18_4'
  ],
  'RESIDENTIAL ENERGY DEMAND TEMPERATURE INDEX': [
    'V1200279065-E2E_18_4',
    'V1200279035-E2E_18_4',
    'V1200279049-E2E_18_4',
    'V1200279041-E2E_18_4',
    'V1200279073-E2E_18_4',
    'V1200279057-E2E_18_4',
    'V1200279064-E2E_18_4',
    'V1200279044-E2E_18_4',
    'V1200279052-E2E_18_4',
    'V1200279061-E2E_18_4',
    'V1200279039-E2E_18_4'
  ],
  'SEA SURFACE TEMPERATURE': [
    'V1200279053-E2E_18_4'
  ],
  'SKIN TEMPERATURE': [
    'V1200279075-E2E_18_4',
    'V1200279048-E2E_18_4',
    'V1200279060-E2E_18_4',
    'V1200279056-E2E_18_4',
    'V1200279038-E2E_18_4',
    'V1200279053-E2E_18_4'
  ],
  'STRATOSPHERIC TEMPERATURE ANOMALIES': [
    'V1200279065-E2E_18_4',
    'V1200279035-E2E_18_4',
    'V1200279049-E2E_18_4',
    'V1200279041-E2E_18_4',
    'V1200279073-E2E_18_4',
    'V1200279057-E2E_18_4',
    'V1200279064-E2E_18_4',
    'V1200279044-E2E_18_4',
    'V1200279052-E2E_18_4',
    'V1200279061-E2E_18_4',
    'V1200279039-E2E_18_4'
  ],
  'SURFACE PRESSURE': [
    'V1200279053-E2E_18_4'
  ],
  'TEMPERATURE ANOMALIES': [
    'V1200279065-E2E_18_4',
    'V1200279035-E2E_18_4',
    'V1200279049-E2E_18_4',
    'V1200279041-E2E_18_4',
    'V1200279073-E2E_18_4',
    'V1200279057-E2E_18_4',
    'V1200279064-E2E_18_4',
    'V1200279044-E2E_18_4',
    'V1200279052-E2E_18_4',
    'V1200279061-E2E_18_4',
    'V1200279039-E2E_18_4'
  ],
  'TEMPERATURE CONCENTRATION INDEX': [
    'V1200279057-E2E_18_4',
    'V1200279064-E2E_18_4',
    'V1200279044-E2E_18_4',
    'V1200279052-E2E_18_4',
    'V1200279061-E2E_18_4',
    'V1200279039-E2E_18_4'
  ],
  'TEMPERATURE CONCENTRATION INDEX (TCI)': [
    'V1200279065-E2E_18_4',
    'V1200279035-E2E_18_4',
    'V1200279049-E2E_18_4',
    'V1200279041-E2E_18_4',
    'V1200279073-E2E_18_4',
    'V1200279057-E2E_18_4',
    'V1200279064-E2E_18_4',
    'V1200279044-E2E_18_4',
    'V1200279052-E2E_18_4',
    'V1200279061-E2E_18_4',
    'V1200279039-E2E_18_4'
  ],
  'TEMPERATURE GRADIENT': [
    'V1200279065-E2E_18_4',
    'V1200279035-E2E_18_4',
    'V1200279049-E2E_18_4',
    'V1200279041-E2E_18_4',
    'V1200279073-E2E_18_4',
    'V1200279057-E2E_18_4',
    'V1200279064-E2E_18_4',
    'V1200279044-E2E_18_4',
    'V1200279052-E2E_18_4',
    'V1200279061-E2E_18_4',
    'V1200279039-E2E_18_4'
  ],
  'TEMPERATURE INDICATORS': [
    'V1200279065-E2E_18_4',
    'V1200279035-E2E_18_4',
    'V1200279049-E2E_18_4',
    'V1200279041-E2E_18_4',
    'V1200279073-E2E_18_4',
    'V1200279057-E2E_18_4',
    'V1200279064-E2E_18_4',
    'V1200279044-E2E_18_4',
    'V1200279052-E2E_18_4',
    'V1200279061-E2E_18_4',
    'V1200279039-E2E_18_4'
  ],
  'TEMPERATURE INDICES': [
    'V1200279065-E2E_18_4',
    'V1200279035-E2E_18_4',
    'V1200279049-E2E_18_4',
    'V1200279041-E2E_18_4',
    'V1200279073-E2E_18_4',
    'V1200279057-E2E_18_4',
    'V1200279064-E2E_18_4',
    'V1200279044-E2E_18_4',
    'V1200279052-E2E_18_4',
    'V1200279061-E2E_18_4',
    'V1200279039-E2E_18_4'
  ],
  'TEMPERATURE PROFILES': [
    'V1200279065-E2E_18_4',
    'V1200279035-E2E_18_4',
    'V1200279049-E2E_18_4',
    'V1200279041-E2E_18_4',
    'V1200279073-E2E_18_4',
    'V1200279057-E2E_18_4',
    'V1200279064-E2E_18_4',
    'V1200279044-E2E_18_4',
    'V1200279052-E2E_18_4',
    'V1200279061-E2E_18_4',
    'V1200279039-E2E_18_4'
  ],
  'TEMPERATURE TENDENCY': [
    'V1200279065-E2E_18_4',
    'V1200279035-E2E_18_4',
    'V1200279049-E2E_18_4',
    'V1200279041-E2E_18_4',
    'V1200279073-E2E_18_4',
    'V1200279057-E2E_18_4',
    'V1200279064-E2E_18_4',
    'V1200279044-E2E_18_4',
    'V1200279052-E2E_18_4',
    'V1200279061-E2E_18_4',
    'V1200279039-E2E_18_4'
  ],
  'TEMPERATURE TRENDS': [
    'V1200279065-E2E_18_4',
    'V1200279035-E2E_18_4',
    'V1200279049-E2E_18_4',
    'V1200279041-E2E_18_4',
    'V1200279073-E2E_18_4',
    'V1200279057-E2E_18_4',
    'V1200279064-E2E_18_4',
    'V1200279044-E2E_18_4',
    'V1200279052-E2E_18_4',
    'V1200279061-E2E_18_4',
    'V1200279039-E2E_18_4'
  ],
  'TEMPERATURE VARIABILITY': [
    'V1200279065-E2E_18_4',
    'V1200279035-E2E_18_4',
    'V1200279049-E2E_18_4',
    'V1200279041-E2E_18_4',
    'V1200279073-E2E_18_4',
    'V1200279057-E2E_18_4',
    'V1200279064-E2E_18_4',
    'V1200279044-E2E_18_4',
    'V1200279052-E2E_18_4',
    'V1200279061-E2E_18_4',
    'V1200279039-E2E_18_4'
  ],
  'THAWING INDEX': [
    'V1200279065-E2E_18_4',
    'V1200279035-E2E_18_4',
    'V1200279049-E2E_18_4',
    'V1200279041-E2E_18_4',
    'V1200279073-E2E_18_4',
    'V1200279057-E2E_18_4',
    'V1200279064-E2E_18_4',
    'V1200279044-E2E_18_4',
    'V1200279052-E2E_18_4',
    'V1200279061-E2E_18_4',
    'V1200279039-E2E_18_4'
  ],
  'TOTAL PRECIPITABLE WATER': [
    'V1200279053-E2E_18_4'
  ],
  TROPOPAUSE: [
    'V1200279053-E2E_18_4'
  ],
  'TROPOSPHERIC TEMPERATURE ANOMALIES': [
    'V1200279065-E2E_18_4',
    'V1200279035-E2E_18_4',
    'V1200279049-E2E_18_4',
    'V1200279041-E2E_18_4',
    'V1200279073-E2E_18_4',
    'V1200279057-E2E_18_4',
    'V1200279064-E2E_18_4',
    'V1200279044-E2E_18_4',
    'V1200279052-E2E_18_4',
    'V1200279061-E2E_18_4',
    'V1200279039-E2E_18_4'
  ],
  'UPPER AIR TEMPERATURE': [
    'V1200279053-E2E_18_4'
  ],
  'VOLCANIC DEPOSITS': [
    'V1200279065-E2E_18_4',
    'V1200279035-E2E_18_4',
    'V1200279049-E2E_18_4',
    'V1200279041-E2E_18_4',
    'V1200279073-E2E_18_4'
  ],
  'VOLCANIC ERUPTIONS': [
    'V1200279065-E2E_18_4',
    'V1200279035-E2E_18_4',
    'V1200279049-E2E_18_4',
    'V1200279041-E2E_18_4',
    'V1200279073-E2E_18_4'
  ],
  'VOLCANIC FORCING': [
    'V1200279065-E2E_18_4',
    'V1200279035-E2E_18_4',
    'V1200279049-E2E_18_4',
    'V1200279041-E2E_18_4',
    'V1200279073-E2E_18_4'
  ],
  VOLCANO: [
    'V1200279065-E2E_18_4',
    'V1200279035-E2E_18_4',
    'V1200279049-E2E_18_4',
    'V1200279041-E2E_18_4',
    'V1200279073-E2E_18_4'
  ],
  'WATER VAPOR': [
    'V1200279053-E2E_18_4'
  ],
  'WATER VAPOR PROFILES': [
    'V1200279053-E2E_18_4'
  ],
  'WIND CHILL INDEX': [
    'V1200279057-E2E_18_4',
    'V1200279064-E2E_18_4',
    'V1200279044-E2E_18_4',
    'V1200279052-E2E_18_4',
    'V1200279061-E2E_18_4',
    'V1200279039-E2E_18_4'
  ]
}

export const mockVariables = {
  'V1200279034-E2E_18_4': {
    meta: {
      'revision-id': 6,
      deleted: false,
      format: 'application/vnd.nasa.cmr.umm+json',
      'provider-id': 'E2E_18_4',
      'user-id': 'mmorahan',
      'native-id': 'uvg_Dust_Score_A',
      'concept-id': 'V1200279034-E2E_18_4',
      'revision-date': '2018-10-02T19:28:03Z',
      'concept-type': 'variable'
    },
    umm: {
      VariableType: 'SCIENCE_VARIABLE',
      DataType: 'float32',
      Offset: 0,
      ScienceKeywords: [
        {
          Category: 'EARTH SCIENCE',
          Topic: 'LAND SURFACE',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'POINT BAR'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'POINT BAR'
        }
      ],
      Scale: 1,
      Characteristics: {
        IndexRanges: {
          LatRange: [
            0,
            0
          ],
          LonRange: [
            0,
            0
          ]
        }
      },
      FillValues: [
        {
          Value: -9999,
          Type: 'ANCILLARY_FILLVALUE'
        }
      ],
      Sets: [
        {
          Name: 'Data_Fields',
          Type: 'Ascending',
          Size: 76,
          Index: 2
        }
      ],
      Dimensions: [
        {
          Name: 'DustTest',
          Size: 9,
          Type: 'OTHER'
        },
        {
          Name: 'Latitude',
          Size: 180,
          Type: 'LATITUDE_DIMENSION'
        },
        {
          Name: 'Longitude',
          Size: 360,
          Type: 'LONGITUDE_DIMENSION'
        }
      ],
      Definition: ' 32-bit DustTest (9) Fraction of obs with each floating dust test triggered. [0.0, 1.0] point Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
      Name: 'Dust_Score_A',
      AcquisitionSourceName: 'Not Provided',
      Units: 'level',
      LongName: 'Dust_Score_A'
    },
    associations: {
      collections: [
        {
          'concept-id': 'C1200278964-E2E_18_4'
        },
        {
          'concept-id': 'C1200278965-E2E_18_4'
        },
        {
          'concept-id': 'C1200278966-E2E_18_4'
        },
        {
          'concept-id': 'C1200278971-E2E_18_4'
        },
        {
          'concept-id': 'C1200278972-E2E_18_4'
        },
        {
          'concept-id': 'C1200278974-E2E_18_4'
        }
      ]
    }
  },
  'V1200279045-E2E_18_4': {
    meta: {
      'revision-id': 6,
      deleted: false,
      format: 'application/vnd.nasa.cmr.umm+json',
      'provider-id': 'E2E_18_4',
      'user-id': 'mmorahan',
      'native-id': 'uvg_Dust_Score_A_ct',
      'concept-id': 'V1200279045-E2E_18_4',
      'revision-date': '2018-10-02T19:28:10Z',
      'concept-type': 'variable'
    },
    umm: {
      VariableType: 'SCIENCE_VARIABLE',
      DataType: 'int16',
      Offset: 0,
      ScienceKeywords: [
        {
          Category: 'EARTH SCIENCE',
          Topic: 'LAND SURFACE',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'POINT BAR'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'POINT BAR'
        }
      ],
      Scale: 1,
      Characteristics: {
        IndexRanges: {
          LatRange: [
            0,
            0
          ],
          LonRange: [
            0,
            0
          ]
        }
      },
      FillValues: [
        {
          Value: 0,
          Type: 'ANCILLARY_FILLVALUE'
        }
      ],
      Sets: [
        {
          Name: 'Dust_Score_A',
          Type: 'Ascending',
          Size: 4,
          Index: 1
        }
      ],
      Dimensions: [
        {
          Name: 'DustTest',
          Size: 9,
          Type: 'OTHER'
        },
        {
          Name: 'Latitude',
          Size: 180,
          Type: 'LATITUDE_DIMENSION'
        },
        {
          Name: 'Longitude',
          Size: 360,
          Type: 'LONGITUDE_DIMENSION'
        }
      ],
      Definition: 'Input count of 32-bit DustTest (9) Fraction of obs with each floating dust test triggered. [0.0, 1.0] point Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
      Name: 'Dust_Score_A_ct',
      AcquisitionSourceName: 'Not Provided',
      Units: 'level',
      LongName: 'Dust_Score_A_ct'
    },
    associations: {
      collections: [
        {
          'concept-id': 'C1200278964-E2E_18_4'
        },
        {
          'concept-id': 'C1200278965-E2E_18_4'
        },
        {
          'concept-id': 'C1200278966-E2E_18_4'
        },
        {
          'concept-id': 'C1200278971-E2E_18_4'
        },
        {
          'concept-id': 'C1200278972-E2E_18_4'
        },
        {
          'concept-id': 'C1200278974-E2E_18_4'
        }
      ]
    }
  },
  'V1200279072-E2E_18_4': {
    meta: {
      'revision-id': 6,
      deleted: false,
      format: 'application/vnd.nasa.cmr.umm+json',
      'provider-id': 'E2E_18_4',
      'user-id': 'mmorahan',
      'native-id': 'uvg_Dust_Score_A_max',
      'concept-id': 'V1200279072-E2E_18_4',
      'revision-date': '2018-10-02T19:28:25Z',
      'concept-type': 'variable'
    },
    umm: {
      VariableType: 'SCIENCE_VARIABLE',
      DataType: 'float32',
      Offset: 0,
      ScienceKeywords: [
        {
          Category: 'EARTH SCIENCE',
          Topic: 'LAND SURFACE',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'POINT BAR'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'POINT BAR'
        }
      ],
      Scale: 1,
      Characteristics: {
        IndexRanges: {
          LatRange: [
            0,
            0
          ],
          LonRange: [
            0,
            0
          ]
        }
      },
      FillValues: [
        {
          Value: -9999,
          Type: 'ANCILLARY_FILLVALUE'
        }
      ],
      Sets: [
        {
          Name: 'Dust_Score_A',
          Type: 'Ascending',
          Size: 4,
          Index: 4
        }
      ],
      Dimensions: [
        {
          Name: 'DustTest',
          Size: 9,
          Type: 'OTHER'
        },
        {
          Name: 'Latitude',
          Size: 180,
          Type: 'LATITUDE_DIMENSION'
        },
        {
          Name: 'Longitude',
          Size: 360,
          Type: 'LONGITUDE_DIMENSION'
        }
      ],
      Definition: 'Maximum value of 32-bit DustTest (9) Fraction of obs with each floating dust test triggered. [0.0, 1.0] point Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
      Name: 'Dust_Score_A_max',
      AcquisitionSourceName: 'Not Provided',
      Units: 'level',
      LongName: 'Dust_Score_A_max'
    },
    associations: {
      collections: [
        {
          'concept-id': 'C1200278964-E2E_18_4'
        },
        {
          'concept-id': 'C1200278965-E2E_18_4'
        },
        {
          'concept-id': 'C1200278966-E2E_18_4'
        },
        {
          'concept-id': 'C1200278971-E2E_18_4'
        },
        {
          'concept-id': 'C1200278972-E2E_18_4'
        },
        {
          'concept-id': 'C1200278974-E2E_18_4'
        }
      ]
    }
  },
  'V1200279069-E2E_18_4': {
    meta: {
      'revision-id': 6,
      deleted: false,
      format: 'application/vnd.nasa.cmr.umm+json',
      'provider-id': 'E2E_18_4',
      'user-id': 'mmorahan',
      'native-id': 'uvg_Dust_Score_A_min',
      'concept-id': 'V1200279069-E2E_18_4',
      'revision-date': '2018-10-02T19:28:25Z',
      'concept-type': 'variable'
    },
    umm: {
      VariableType: 'SCIENCE_VARIABLE',
      DataType: 'float32',
      Offset: 0,
      ScienceKeywords: [
        {
          Category: 'EARTH SCIENCE',
          Topic: 'LAND SURFACE',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'POINT BAR'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'POINT BAR'
        }
      ],
      Scale: 1,
      Characteristics: {
        IndexRanges: {
          LatRange: [
            0,
            0
          ],
          LonRange: [
            0,
            0
          ]
        }
      },
      FillValues: [
        {
          Value: -9999,
          Type: 'ANCILLARY_FILLVALUE'
        }
      ],
      Sets: [
        {
          Name: 'Dust_Score_A',
          Type: 'Ascending',
          Size: 4,
          Index: 3
        }
      ],
      Dimensions: [
        {
          Name: 'DustTest',
          Size: 9,
          Type: 'OTHER'
        },
        {
          Name: 'Latitude',
          Size: 180,
          Type: 'LATITUDE_DIMENSION'
        },
        {
          Name: 'Longitude',
          Size: 360,
          Type: 'LONGITUDE_DIMENSION'
        }
      ],
      Definition: 'Minimum value of 32-bit DustTest (9) Fraction of obs with each floating dust test triggered. [0.0, 1.0] point Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
      Name: 'Dust_Score_A_min',
      AcquisitionSourceName: 'Not Provided',
      Units: 'level',
      LongName: 'Dust_Score_A_min'
    },
    associations: {
      collections: [
        {
          'concept-id': 'C1200278964-E2E_18_4'
        },
        {
          'concept-id': 'C1200278965-E2E_18_4'
        },
        {
          'concept-id': 'C1200278966-E2E_18_4'
        },
        {
          'concept-id': 'C1200278971-E2E_18_4'
        },
        {
          'concept-id': 'C1200278972-E2E_18_4'
        },
        {
          'concept-id': 'C1200278974-E2E_18_4'
        }
      ]
    }
  },
  'V1200279068-E2E_18_4': {
    meta: {
      'revision-id': 6,
      deleted: false,
      format: 'application/vnd.nasa.cmr.umm+json',
      'provider-id': 'E2E_18_4',
      'user-id': 'mmorahan',
      'native-id': 'uvg_Dust_Score_A_sdev',
      'concept-id': 'V1200279068-E2E_18_4',
      'revision-date': '2018-10-02T19:28:23Z',
      'concept-type': 'variable'
    },
    umm: {
      VariableType: 'SCIENCE_VARIABLE',
      DataType: 'float32',
      Offset: 0,
      ScienceKeywords: [
        {
          Category: 'EARTH SCIENCE',
          Topic: 'LAND SURFACE',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'POINT BAR'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'POINT BAR'
        }
      ],
      Scale: 1,
      Characteristics: {
        IndexRanges: {
          LatRange: [
            0,
            0
          ],
          LonRange: [
            0,
            0
          ]
        }
      },
      FillValues: [
        {
          Value: -9999,
          Type: 'ANCILLARY_FILLVALUE'
        }
      ],
      Sets: [
        {
          Name: 'Dust_Score_A',
          Type: 'Ascending',
          Size: 4,
          Index: 2
        }
      ],
      Dimensions: [
        {
          Name: 'DustTest',
          Size: 9,
          Type: 'OTHER'
        },
        {
          Name: 'Latitude',
          Size: 180,
          Type: 'LATITUDE_DIMENSION'
        },
        {
          Name: 'Longitude',
          Size: 360,
          Type: 'LONGITUDE_DIMENSION'
        }
      ],
      Definition: 'Standard deviation of 32-bit DustTest (9) Fraction of obs with each floating dust test triggered. [0.0, 1.0] point Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
      Name: 'Dust_Score_A_sdev',
      AcquisitionSourceName: 'Not Provided',
      Units: 'level',
      LongName: 'Dust_Score_A_sdev'
    },
    associations: {
      collections: [
        {
          'concept-id': 'C1200278964-E2E_18_4'
        },
        {
          'concept-id': 'C1200278965-E2E_18_4'
        },
        {
          'concept-id': 'C1200278966-E2E_18_4'
        },
        {
          'concept-id': 'C1200278971-E2E_18_4'
        },
        {
          'concept-id': 'C1200278972-E2E_18_4'
        },
        {
          'concept-id': 'C1200278974-E2E_18_4'
        }
      ]
    }
  },
  'V1200279065-E2E_18_4': {
    meta: {
      'revision-id': 6,
      deleted: false,
      format: 'application/vnd.nasa.cmr.umm+json',
      'provider-id': 'E2E_18_4',
      'user-id': 'mmorahan',
      'native-id': 'uvg_SO2_Indicator_A',
      'concept-id': 'V1200279065-E2E_18_4',
      'revision-date': '2018-10-02T19:28:23Z',
      'concept-type': 'variable'
    },
    umm: {
      VariableType: 'SCIENCE_VARIABLE',
      DataType: 'float32',
      Offset: 0,
      ScienceKeywords: [
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE TENDENCY'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'BIOSPHERE',
          Term: 'ECOLOGICAL DYNAMICS',
          VariableLevel1: 'INDICATOR SPECIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'HIGHER MAXIMUM DAYTIME TEMPERATURES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'HIGHER MINIMUM NIGHTIME TEMPERATURES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'STRATOSPHERIC TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE TRENDS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE VARIABILITY'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TROPOSPHERIC TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE INDICATORS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'COMMON SENSE CLIMATE INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'COOLING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'FREEZING INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'GROWING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'HEATING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'RESIDENTIAL ENERGY DEMAND TEMPERATURE INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE CONCENTRATION INDEX (TCI)'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'THAWING INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE INDICES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'BIOSPHERIC INDICATORS',
          VariableLevel1: 'INDICATOR SPECIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'PALEOCLIMATE INDICATORS',
          VariableLevel1: 'VOLCANIC DEPOSITS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'PALEOCLIMATE INDICATORS',
          VariableLevel1: 'VOLCANIC DEPOSITS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'PALEOCLIMATE INDICATORS',
          VariableLevel1: 'VOLCANIC FORCING'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'HUMAN DIMENSIONS',
          Term: 'NATURAL HAZARDS',
          VariableLevel1: 'VOLCANIC ERUPTIONS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'LAND SURFACE',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'POINT BAR'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'LAND SURFACE',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'VOLCANO'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'PALEOCLIMATE',
          Term: 'ICE CORE RECORDS',
          VariableLevel1: 'VOLCANIC DEPOSITS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'PALEOCLIMATE',
          Term: 'LAND RECORDS',
          VariableLevel1: 'VOLCANIC DEPOSITS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'POINT BAR'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'VOLCANO'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOTHERMAL DYNAMICS',
          VariableLevel1: 'TEMPERATURE GRADIENT'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOTHERMAL DYNAMICS',
          VariableLevel1: 'TEMPERATURE GRADIENT'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOTHERMAL DYNAMICS',
          VariableLevel1: 'TEMPERATURE PROFILES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SPECTRAL/ENGINEERING',
          Term: 'INFRARED WAVELENGTHS',
          VariableLevel1: 'BRIGHTNESS TEMPERATURE'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SPECTRAL/ENGINEERING',
          Term: 'MICROWAVE',
          VariableLevel1: 'BRIGHTNESS TEMPERATURE'
        }
      ],
      Scale: 1,
      Characteristics: {
        IndexRanges: {
          LatRange: [
            0,
            0
          ],
          LonRange: [
            0,
            0
          ]
        }
      },
      FillValues: [
        {
          Value: -9999,
          Type: 'ANCILLARY_FILLVALUE'
        }
      ],
      Sets: [
        {
          Name: 'Data_Fields',
          Type: 'Ascending',
          Size: 76,
          Index: 3
        }
      ],
      Dimensions: [
        {
          Name: 'Latitude',
          Size: 180,
          Type: 'LATITUDE_DIMENSION'
        },
        {
          Name: 'Longitude',
          Size: 360,
          Type: 'LONGITUDE_DIMENSION'
        }
      ],
      Definition: ' 32-bit None Brightness temperature floating difference Tb(1361.44 cm-1) point - Tb(1433.06 cm-1) used as an indicator of SO2 release from volcanoes. Values under -6 K have likely volcanic SO2. (L2 BT_diff_SO2) (Kelvins) Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
      Name: 'SO2_Indicator_A',
      AcquisitionSourceName: 'Not Provided',
      Units: 'None',
      LongName: 'SO2_Indicator_A'
    },
    associations: {
      collections: [
        {
          'concept-id': 'C1200278964-E2E_18_4'
        },
        {
          'concept-id': 'C1200278965-E2E_18_4'
        },
        {
          'concept-id': 'C1200278966-E2E_18_4'
        },
        {
          'concept-id': 'C1200278971-E2E_18_4'
        },
        {
          'concept-id': 'C1200278972-E2E_18_4'
        },
        {
          'concept-id': 'C1200278974-E2E_18_4'
        }
      ]
    }
  },
  'V1200279035-E2E_18_4': {
    meta: {
      'revision-id': 6,
      deleted: false,
      format: 'application/vnd.nasa.cmr.umm+json',
      'provider-id': 'E2E_18_4',
      'user-id': 'mmorahan',
      'native-id': 'uvg_SO2_Indicator_A_ct',
      'concept-id': 'V1200279035-E2E_18_4',
      'revision-date': '2018-10-02T19:28:03Z',
      'concept-type': 'variable'
    },
    umm: {
      VariableType: 'SCIENCE_VARIABLE',
      DataType: 'int16',
      Offset: 0,
      ScienceKeywords: [
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE TENDENCY'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'BIOSPHERE',
          Term: 'ECOLOGICAL DYNAMICS',
          VariableLevel1: 'INDICATOR SPECIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'HIGHER MAXIMUM DAYTIME TEMPERATURES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'HIGHER MINIMUM NIGHTIME TEMPERATURES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'STRATOSPHERIC TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE TRENDS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE VARIABILITY'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TROPOSPHERIC TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE INDICATORS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'COMMON SENSE CLIMATE INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'COOLING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'FREEZING INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'GROWING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'HEATING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'RESIDENTIAL ENERGY DEMAND TEMPERATURE INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE CONCENTRATION INDEX (TCI)'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'THAWING INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE INDICES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'BIOSPHERIC INDICATORS',
          VariableLevel1: 'INDICATOR SPECIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'PALEOCLIMATE INDICATORS',
          VariableLevel1: 'VOLCANIC DEPOSITS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'PALEOCLIMATE INDICATORS',
          VariableLevel1: 'VOLCANIC DEPOSITS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'PALEOCLIMATE INDICATORS',
          VariableLevel1: 'VOLCANIC FORCING'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'HUMAN DIMENSIONS',
          Term: 'NATURAL HAZARDS',
          VariableLevel1: 'VOLCANIC ERUPTIONS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'LAND SURFACE',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'POINT BAR'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'LAND SURFACE',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'VOLCANO'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'PALEOCLIMATE',
          Term: 'ICE CORE RECORDS',
          VariableLevel1: 'VOLCANIC DEPOSITS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'PALEOCLIMATE',
          Term: 'LAND RECORDS',
          VariableLevel1: 'VOLCANIC DEPOSITS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'POINT BAR'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'VOLCANO'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOTHERMAL DYNAMICS',
          VariableLevel1: 'TEMPERATURE GRADIENT'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOTHERMAL DYNAMICS',
          VariableLevel1: 'TEMPERATURE GRADIENT'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOTHERMAL DYNAMICS',
          VariableLevel1: 'TEMPERATURE PROFILES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SPECTRAL/ENGINEERING',
          Term: 'INFRARED WAVELENGTHS',
          VariableLevel1: 'BRIGHTNESS TEMPERATURE'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SPECTRAL/ENGINEERING',
          Term: 'MICROWAVE',
          VariableLevel1: 'BRIGHTNESS TEMPERATURE'
        }
      ],
      Scale: 1,
      Characteristics: {
        IndexRanges: {
          LatRange: [
            0,
            0
          ],
          LonRange: [
            0,
            0
          ]
        }
      },
      FillValues: [
        {
          Value: 0,
          Type: 'ANCILLARY_FILLVALUE'
        }
      ],
      Sets: [
        {
          Name: 'SO2_Indicator_A',
          Type: 'Ascending',
          Size: 4,
          Index: 1
        }
      ],
      Dimensions: [
        {
          Name: 'Latitude',
          Size: 180,
          Type: 'LATITUDE_DIMENSION'
        },
        {
          Name: 'Longitude',
          Size: 360,
          Type: 'LONGITUDE_DIMENSION'
        }
      ],
      Definition: 'Input count of 32-bit None Brightness temperature floating difference Tb(1361.44 cm-1) point - Tb(1433.06 cm-1) used as an indicator of SO2 release from volcanoes. Values under -6 K have likely volcanic SO2. (L2 BT_diff_SO2) (Kelvins) Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
      Name: 'SO2_Indicator_A_ct',
      AcquisitionSourceName: 'Not Provided',
      Units: 'None',
      LongName: 'SO2_Indicator_A_ct'
    },
    associations: {
      collections: [
        {
          'concept-id': 'C1200278964-E2E_18_4'
        },
        {
          'concept-id': 'C1200278965-E2E_18_4'
        },
        {
          'concept-id': 'C1200278966-E2E_18_4'
        },
        {
          'concept-id': 'C1200278971-E2E_18_4'
        },
        {
          'concept-id': 'C1200278972-E2E_18_4'
        },
        {
          'concept-id': 'C1200278974-E2E_18_4'
        }
      ]
    }
  },
  'V1200279049-E2E_18_4': {
    meta: {
      'revision-id': 6,
      deleted: false,
      format: 'application/vnd.nasa.cmr.umm+json',
      'provider-id': 'E2E_18_4',
      'user-id': 'mmorahan',
      'native-id': 'uvg_SO2_Indicator_A_max',
      'concept-id': 'V1200279049-E2E_18_4',
      'revision-date': '2018-10-02T19:28:11Z',
      'concept-type': 'variable'
    },
    umm: {
      VariableType: 'SCIENCE_VARIABLE',
      DataType: 'float32',
      Offset: 0,
      ScienceKeywords: [
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE TENDENCY'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'BIOSPHERE',
          Term: 'ECOLOGICAL DYNAMICS',
          VariableLevel1: 'INDICATOR SPECIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'HIGHER MAXIMUM DAYTIME TEMPERATURES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'HIGHER MINIMUM NIGHTIME TEMPERATURES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'STRATOSPHERIC TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE TRENDS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE VARIABILITY'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TROPOSPHERIC TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE INDICATORS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'COMMON SENSE CLIMATE INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'COOLING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'FREEZING INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'GROWING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'HEATING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'RESIDENTIAL ENERGY DEMAND TEMPERATURE INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE CONCENTRATION INDEX (TCI)'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'THAWING INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE INDICES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'BIOSPHERIC INDICATORS',
          VariableLevel1: 'INDICATOR SPECIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'PALEOCLIMATE INDICATORS',
          VariableLevel1: 'VOLCANIC DEPOSITS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'PALEOCLIMATE INDICATORS',
          VariableLevel1: 'VOLCANIC DEPOSITS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'PALEOCLIMATE INDICATORS',
          VariableLevel1: 'VOLCANIC FORCING'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'HUMAN DIMENSIONS',
          Term: 'NATURAL HAZARDS',
          VariableLevel1: 'VOLCANIC ERUPTIONS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'LAND SURFACE',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'POINT BAR'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'LAND SURFACE',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'VOLCANO'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'PALEOCLIMATE',
          Term: 'ICE CORE RECORDS',
          VariableLevel1: 'VOLCANIC DEPOSITS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'PALEOCLIMATE',
          Term: 'LAND RECORDS',
          VariableLevel1: 'VOLCANIC DEPOSITS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'POINT BAR'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'VOLCANO'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOTHERMAL DYNAMICS',
          VariableLevel1: 'TEMPERATURE GRADIENT'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOTHERMAL DYNAMICS',
          VariableLevel1: 'TEMPERATURE GRADIENT'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOTHERMAL DYNAMICS',
          VariableLevel1: 'TEMPERATURE PROFILES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SPECTRAL/ENGINEERING',
          Term: 'INFRARED WAVELENGTHS',
          VariableLevel1: 'BRIGHTNESS TEMPERATURE'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SPECTRAL/ENGINEERING',
          Term: 'MICROWAVE',
          VariableLevel1: 'BRIGHTNESS TEMPERATURE'
        }
      ],
      Scale: 1,
      Characteristics: {
        IndexRanges: {
          LatRange: [
            0,
            0
          ],
          LonRange: [
            0,
            0
          ]
        }
      },
      FillValues: [
        {
          Value: -9999,
          Type: 'ANCILLARY_FILLVALUE'
        }
      ],
      Sets: [
        {
          Name: 'SO2_Indicator_A',
          Type: 'Ascending',
          Size: 4,
          Index: 4
        }
      ],
      Dimensions: [
        {
          Name: 'Latitude',
          Size: 180,
          Type: 'LATITUDE_DIMENSION'
        },
        {
          Name: 'Longitude',
          Size: 360,
          Type: 'LONGITUDE_DIMENSION'
        }
      ],
      Definition: 'Maximum value of 32-bit None Brightness temperature floating difference Tb(1361.44 cm-1) point - Tb(1433.06 cm-1) used as an indicator of SO2 release from volcanoes. Values under -6 K have likely volcanic SO2. (L2 BT_diff_SO2) (Kelvins) Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
      Name: 'SO2_Indicator_A_max',
      AcquisitionSourceName: 'Not Provided',
      Units: 'None',
      LongName: 'SO2_Indicator_A_max'
    },
    associations: {
      collections: [
        {
          'concept-id': 'C1200278964-E2E_18_4'
        },
        {
          'concept-id': 'C1200278965-E2E_18_4'
        },
        {
          'concept-id': 'C1200278966-E2E_18_4'
        },
        {
          'concept-id': 'C1200278971-E2E_18_4'
        },
        {
          'concept-id': 'C1200278972-E2E_18_4'
        },
        {
          'concept-id': 'C1200278974-E2E_18_4'
        }
      ]
    }
  },
  'V1200279041-E2E_18_4': {
    meta: {
      'revision-id': 6,
      deleted: false,
      format: 'application/vnd.nasa.cmr.umm+json',
      'provider-id': 'E2E_18_4',
      'user-id': 'mmorahan',
      'native-id': 'uvg_SO2_Indicator_A_min',
      'concept-id': 'V1200279041-E2E_18_4',
      'revision-date': '2018-10-02T19:28:08Z',
      'concept-type': 'variable'
    },
    umm: {
      VariableType: 'SCIENCE_VARIABLE',
      DataType: 'float32',
      Offset: 0,
      ScienceKeywords: [
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE TENDENCY'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'BIOSPHERE',
          Term: 'ECOLOGICAL DYNAMICS',
          VariableLevel1: 'INDICATOR SPECIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'HIGHER MAXIMUM DAYTIME TEMPERATURES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'HIGHER MINIMUM NIGHTIME TEMPERATURES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'STRATOSPHERIC TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE TRENDS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE VARIABILITY'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TROPOSPHERIC TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE INDICATORS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'COMMON SENSE CLIMATE INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'COOLING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'FREEZING INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'GROWING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'HEATING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'RESIDENTIAL ENERGY DEMAND TEMPERATURE INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE CONCENTRATION INDEX (TCI)'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'THAWING INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE INDICES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'BIOSPHERIC INDICATORS',
          VariableLevel1: 'INDICATOR SPECIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'PALEOCLIMATE INDICATORS',
          VariableLevel1: 'VOLCANIC DEPOSITS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'PALEOCLIMATE INDICATORS',
          VariableLevel1: 'VOLCANIC DEPOSITS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'PALEOCLIMATE INDICATORS',
          VariableLevel1: 'VOLCANIC FORCING'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'HUMAN DIMENSIONS',
          Term: 'NATURAL HAZARDS',
          VariableLevel1: 'VOLCANIC ERUPTIONS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'LAND SURFACE',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'POINT BAR'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'LAND SURFACE',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'VOLCANO'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'PALEOCLIMATE',
          Term: 'ICE CORE RECORDS',
          VariableLevel1: 'VOLCANIC DEPOSITS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'PALEOCLIMATE',
          Term: 'LAND RECORDS',
          VariableLevel1: 'VOLCANIC DEPOSITS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'POINT BAR'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'VOLCANO'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOTHERMAL DYNAMICS',
          VariableLevel1: 'TEMPERATURE GRADIENT'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOTHERMAL DYNAMICS',
          VariableLevel1: 'TEMPERATURE GRADIENT'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOTHERMAL DYNAMICS',
          VariableLevel1: 'TEMPERATURE PROFILES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SPECTRAL/ENGINEERING',
          Term: 'INFRARED WAVELENGTHS',
          VariableLevel1: 'BRIGHTNESS TEMPERATURE'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SPECTRAL/ENGINEERING',
          Term: 'MICROWAVE',
          VariableLevel1: 'BRIGHTNESS TEMPERATURE'
        }
      ],
      Scale: 1,
      Characteristics: {
        IndexRanges: {
          LatRange: [
            0,
            0
          ],
          LonRange: [
            0,
            0
          ]
        }
      },
      FillValues: [
        {
          Value: -9999,
          Type: 'ANCILLARY_FILLVALUE'
        }
      ],
      Sets: [
        {
          Name: 'SO2_Indicator_A',
          Type: 'Ascending',
          Size: 4,
          Index: 3
        }
      ],
      Dimensions: [
        {
          Name: 'Latitude',
          Size: 180,
          Type: 'LATITUDE_DIMENSION'
        },
        {
          Name: 'Longitude',
          Size: 360,
          Type: 'LONGITUDE_DIMENSION'
        }
      ],
      Definition: 'Minimum value of 32-bit None Brightness temperature floating difference Tb(1361.44 cm-1) point - Tb(1433.06 cm-1) used as an indicator of SO2 release from volcanoes. Values under -6 K have likely volcanic SO2. (L2 BT_diff_SO2) (Kelvins) Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
      Name: 'SO2_Indicator_A_min',
      AcquisitionSourceName: 'Not Provided',
      Units: 'None',
      LongName: 'SO2_Indicator_A_min'
    },
    associations: {
      collections: [
        {
          'concept-id': 'C1200278964-E2E_18_4'
        },
        {
          'concept-id': 'C1200278965-E2E_18_4'
        },
        {
          'concept-id': 'C1200278966-E2E_18_4'
        },
        {
          'concept-id': 'C1200278971-E2E_18_4'
        },
        {
          'concept-id': 'C1200278972-E2E_18_4'
        },
        {
          'concept-id': 'C1200278974-E2E_18_4'
        }
      ]
    }
  },
  'V1200279073-E2E_18_4': {
    meta: {
      'revision-id': 6,
      deleted: false,
      format: 'application/vnd.nasa.cmr.umm+json',
      'provider-id': 'E2E_18_4',
      'user-id': 'mmorahan',
      'native-id': 'uvg_SO2_Indicator_A_sdev',
      'concept-id': 'V1200279073-E2E_18_4',
      'revision-date': '2018-10-02T19:28:27Z',
      'concept-type': 'variable'
    },
    umm: {
      VariableType: 'SCIENCE_VARIABLE',
      DataType: 'float32',
      Offset: 0,
      ScienceKeywords: [
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE TENDENCY'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'BIOSPHERE',
          Term: 'ECOLOGICAL DYNAMICS',
          VariableLevel1: 'INDICATOR SPECIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'HIGHER MAXIMUM DAYTIME TEMPERATURES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'HIGHER MINIMUM NIGHTIME TEMPERATURES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'STRATOSPHERIC TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE TRENDS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE VARIABILITY'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TROPOSPHERIC TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE INDICATORS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'COMMON SENSE CLIMATE INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'COOLING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'FREEZING INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'GROWING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'HEATING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'RESIDENTIAL ENERGY DEMAND TEMPERATURE INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE CONCENTRATION INDEX (TCI)'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'THAWING INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE INDICES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'BIOSPHERIC INDICATORS',
          VariableLevel1: 'INDICATOR SPECIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'PALEOCLIMATE INDICATORS',
          VariableLevel1: 'VOLCANIC DEPOSITS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'PALEOCLIMATE INDICATORS',
          VariableLevel1: 'VOLCANIC DEPOSITS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'PALEOCLIMATE INDICATORS',
          VariableLevel1: 'VOLCANIC FORCING'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'HUMAN DIMENSIONS',
          Term: 'NATURAL HAZARDS',
          VariableLevel1: 'VOLCANIC ERUPTIONS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'LAND SURFACE',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'POINT BAR'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'LAND SURFACE',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'VOLCANO'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'PALEOCLIMATE',
          Term: 'ICE CORE RECORDS',
          VariableLevel1: 'VOLCANIC DEPOSITS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'PALEOCLIMATE',
          Term: 'LAND RECORDS',
          VariableLevel1: 'VOLCANIC DEPOSITS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'POINT BAR'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'VOLCANO'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOTHERMAL DYNAMICS',
          VariableLevel1: 'TEMPERATURE GRADIENT'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOTHERMAL DYNAMICS',
          VariableLevel1: 'TEMPERATURE GRADIENT'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOTHERMAL DYNAMICS',
          VariableLevel1: 'TEMPERATURE PROFILES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SPECTRAL/ENGINEERING',
          Term: 'INFRARED WAVELENGTHS',
          VariableLevel1: 'BRIGHTNESS TEMPERATURE'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SPECTRAL/ENGINEERING',
          Term: 'MICROWAVE',
          VariableLevel1: 'BRIGHTNESS TEMPERATURE'
        }
      ],
      Scale: 1,
      Characteristics: {
        IndexRanges: {
          LatRange: [
            0,
            0
          ],
          LonRange: [
            0,
            0
          ]
        }
      },
      FillValues: [
        {
          Value: -9999,
          Type: 'ANCILLARY_FILLVALUE'
        }
      ],
      Sets: [
        {
          Name: 'SO2_Indicator_A',
          Type: 'Ascending',
          Size: 4,
          Index: 2
        }
      ],
      Dimensions: [
        {
          Name: 'Latitude',
          Size: 180,
          Type: 'LATITUDE_DIMENSION'
        },
        {
          Name: 'Longitude',
          Size: 360,
          Type: 'LONGITUDE_DIMENSION'
        }
      ],
      Definition: 'Standard deviation of 32-bit None Brightness temperature floating difference Tb(1361.44 cm-1) point - Tb(1433.06 cm-1) used as an indicator of SO2 release from volcanoes. Values under -6 K have likely volcanic SO2. (L2 BT_diff_SO2) (Kelvins) Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
      Name: 'SO2_Indicator_A_sdev',
      AcquisitionSourceName: 'Not Provided',
      Units: 'None',
      LongName: 'SO2_Indicator_A_sdev'
    },
    associations: {
      collections: [
        {
          'concept-id': 'C1200278964-E2E_18_4'
        },
        {
          'concept-id': 'C1200278965-E2E_18_4'
        },
        {
          'concept-id': 'C1200278966-E2E_18_4'
        },
        {
          'concept-id': 'C1200278971-E2E_18_4'
        },
        {
          'concept-id': 'C1200278972-E2E_18_4'
        },
        {
          'concept-id': 'C1200278974-E2E_18_4'
        }
      ]
    }
  },
  'V1200279057-E2E_18_4': {
    meta: {
      'revision-id': 6,
      deleted: false,
      format: 'application/vnd.nasa.cmr.umm+json',
      'provider-id': 'E2E_18_4',
      'user-id': 'mmorahan',
      'native-id': 'uvg_TAirSup_A',
      'concept-id': 'V1200279057-E2E_18_4',
      'revision-date': '2018-10-02T19:28:19Z',
      'concept-type': 'variable'
    },
    umm: {
      VariableType: 'SCIENCE_VARIABLE',
      DataType: 'float32',
      Offset: 0,
      ScienceKeywords: [
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC RADIATION',
          VariableLevel1: 'ATMOSPHERIC HEATING'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'COMMON SENSE CLIMATE INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'COOLING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'FREEZING INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'GROWING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'HEAT INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'HEATING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'RESIDENTIAL ENERGY DEMAND TEMPERATURE INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE CONCENTRATION INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'THAWING INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'WIND CHILL INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'ATMOSPHERIC TEMPERATURE INDICES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE TENDENCY'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'HIGHER MAXIMUM DAYTIME TEMPERATURES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'HIGHER MINIMUM NIGHTIME TEMPERATURES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'STRATOSPHERIC TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE TRENDS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE VARIABILITY'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TROPOSPHERIC TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE INDICATORS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'COMMON SENSE CLIMATE INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'COOLING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'FREEZING INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'GROWING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'HEATING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'RESIDENTIAL ENERGY DEMAND TEMPERATURE INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE CONCENTRATION INDEX (TCI)'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'THAWING INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE INDICES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'LAND SURFACE',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'POINT BAR'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'POINT BAR'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOTHERMAL DYNAMICS',
          VariableLevel1: 'TEMPERATURE GRADIENT'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOTHERMAL DYNAMICS',
          VariableLevel1: 'TEMPERATURE GRADIENT'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOTHERMAL DYNAMICS',
          VariableLevel1: 'TEMPERATURE PROFILES'
        }
      ],
      Scale: 1,
      Characteristics: {
        IndexRanges: {
          LatRange: [
            0,
            0
          ],
          LonRange: [
            0,
            0
          ]
        }
      },
      FillValues: [
        {
          Value: -9999,
          Type: 'ANCILLARY_FILLVALUE'
        }
      ],
      Sets: [
        {
          Name: 'Data_Fields',
          Type: 'Ascending',
          Size: 76,
          Index: 4
        }
      ],
      Dimensions: [
        {
          Name: 'XtraPressureLev',
          Size: 100,
          Type: 'PRESSURE_DIMENSION'
        },
        {
          Name: 'Latitude',
          Size: 180,
          Type: 'LATITUDE_DIMENSION'
        },
        {
          Name: 'Longitude',
          Size: 360,
          Type: 'LONGITUDE_DIMENSION'
        }
      ],
      Definition: ' 32-bit XtraPressureLev Atmospheric temperature floating (100) (Kelvin) point Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
      Name: 'TAirSup_A',
      AcquisitionSourceName: 'Not Provided',
      Units: 'hPa',
      LongName: 'TAirSup_A'
    },
    associations: {
      collections: [
        {
          'concept-id': 'C1200278964-E2E_18_4'
        },
        {
          'concept-id': 'C1200278965-E2E_18_4'
        },
        {
          'concept-id': 'C1200278966-E2E_18_4'
        },
        {
          'concept-id': 'C1200278971-E2E_18_4'
        },
        {
          'concept-id': 'C1200278972-E2E_18_4'
        },
        {
          'concept-id': 'C1200278974-E2E_18_4'
        }
      ]
    }
  },
  'V1200279064-E2E_18_4': {
    meta: {
      'revision-id': 6,
      deleted: false,
      format: 'application/vnd.nasa.cmr.umm+json',
      'provider-id': 'E2E_18_4',
      'user-id': 'mmorahan',
      'native-id': 'uvg_TAirSup_A_ct',
      'concept-id': 'V1200279064-E2E_18_4',
      'revision-date': '2018-10-02T19:28:21Z',
      'concept-type': 'variable'
    },
    umm: {
      VariableType: 'SCIENCE_VARIABLE',
      DataType: 'int16',
      Offset: 0,
      ScienceKeywords: [
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC RADIATION',
          VariableLevel1: 'ATMOSPHERIC HEATING'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'COMMON SENSE CLIMATE INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'COOLING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'FREEZING INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'GROWING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'HEAT INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'HEATING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'RESIDENTIAL ENERGY DEMAND TEMPERATURE INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE CONCENTRATION INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'THAWING INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'WIND CHILL INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'ATMOSPHERIC TEMPERATURE INDICES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE TENDENCY'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'HIGHER MAXIMUM DAYTIME TEMPERATURES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'HIGHER MINIMUM NIGHTIME TEMPERATURES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'STRATOSPHERIC TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE TRENDS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE VARIABILITY'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TROPOSPHERIC TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE INDICATORS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'COMMON SENSE CLIMATE INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'COOLING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'FREEZING INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'GROWING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'HEATING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'RESIDENTIAL ENERGY DEMAND TEMPERATURE INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE CONCENTRATION INDEX (TCI)'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'THAWING INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE INDICES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'LAND SURFACE',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'POINT BAR'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'POINT BAR'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOTHERMAL DYNAMICS',
          VariableLevel1: 'TEMPERATURE GRADIENT'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOTHERMAL DYNAMICS',
          VariableLevel1: 'TEMPERATURE GRADIENT'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOTHERMAL DYNAMICS',
          VariableLevel1: 'TEMPERATURE PROFILES'
        }
      ],
      Scale: 1,
      Characteristics: {
        IndexRanges: {
          LatRange: [
            0,
            0
          ],
          LonRange: [
            0,
            0
          ]
        }
      },
      FillValues: [
        {
          Value: 0,
          Type: 'ANCILLARY_FILLVALUE'
        }
      ],
      Sets: [
        {
          Name: 'TAirSup_A',
          Type: 'Ascending',
          Size: 5,
          Index: 1
        }
      ],
      Dimensions: [
        {
          Name: 'XtraPressureLev',
          Size: 100,
          Type: 'PRESSURE_DIMENSION'
        },
        {
          Name: 'Latitude',
          Size: 180,
          Type: 'LATITUDE_DIMENSION'
        },
        {
          Name: 'Longitude',
          Size: 360,
          Type: 'LONGITUDE_DIMENSION'
        }
      ],
      Definition: 'Input count of 32-bit XtraPressureLev Atmospheric temperature floating (100) (Kelvin) point Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
      Name: 'TAirSup_A_ct',
      AcquisitionSourceName: 'Not Provided',
      Units: 'hPa',
      LongName: 'TAirSup_A_ct'
    },
    associations: {
      collections: [
        {
          'concept-id': 'C1200278964-E2E_18_4'
        },
        {
          'concept-id': 'C1200278965-E2E_18_4'
        },
        {
          'concept-id': 'C1200278966-E2E_18_4'
        },
        {
          'concept-id': 'C1200278971-E2E_18_4'
        },
        {
          'concept-id': 'C1200278972-E2E_18_4'
        },
        {
          'concept-id': 'C1200278974-E2E_18_4'
        }
      ]
    }
  },
  'V1200279044-E2E_18_4': {
    meta: {
      'revision-id': 6,
      deleted: false,
      format: 'application/vnd.nasa.cmr.umm+json',
      'provider-id': 'E2E_18_4',
      'user-id': 'mmorahan',
      'native-id': 'uvg_TAirSup_A_err',
      'concept-id': 'V1200279044-E2E_18_4',
      'revision-date': '2018-10-02T19:28:09Z',
      'concept-type': 'variable'
    },
    umm: {
      VariableType: 'SCIENCE_VARIABLE',
      DataType: 'float32',
      Offset: 0,
      ScienceKeywords: [
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC RADIATION',
          VariableLevel1: 'ATMOSPHERIC HEATING'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'COMMON SENSE CLIMATE INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'COOLING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'FREEZING INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'GROWING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'HEAT INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'HEATING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'RESIDENTIAL ENERGY DEMAND TEMPERATURE INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE CONCENTRATION INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'THAWING INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'WIND CHILL INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'ATMOSPHERIC TEMPERATURE INDICES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE TENDENCY'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'HIGHER MAXIMUM DAYTIME TEMPERATURES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'HIGHER MINIMUM NIGHTIME TEMPERATURES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'STRATOSPHERIC TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE TRENDS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE VARIABILITY'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TROPOSPHERIC TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE INDICATORS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'COMMON SENSE CLIMATE INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'COOLING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'FREEZING INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'GROWING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'HEATING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'RESIDENTIAL ENERGY DEMAND TEMPERATURE INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE CONCENTRATION INDEX (TCI)'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'THAWING INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE INDICES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'LAND SURFACE',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'POINT BAR'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'POINT BAR'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOTHERMAL DYNAMICS',
          VariableLevel1: 'TEMPERATURE GRADIENT'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOTHERMAL DYNAMICS',
          VariableLevel1: 'TEMPERATURE GRADIENT'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOTHERMAL DYNAMICS',
          VariableLevel1: 'TEMPERATURE PROFILES'
        }
      ],
      Scale: 1,
      Characteristics: {
        IndexRanges: {
          LatRange: [
            0,
            0
          ],
          LonRange: [
            0,
            0
          ]
        }
      },
      FillValues: [
        {
          Value: -9999,
          Type: 'ANCILLARY_FILLVALUE'
        }
      ],
      Sets: [
        {
          Name: 'TAirSup_A',
          Type: 'Ascending',
          Size: 5,
          Index: 5
        }
      ],
      Dimensions: [
        {
          Name: 'XtraPressureLev',
          Size: 100,
          Type: 'PRESSURE_DIMENSION'
        },
        {
          Name: 'Latitude',
          Size: 180,
          Type: 'LATITUDE_DIMENSION'
        },
        {
          Name: 'Longitude',
          Size: 360,
          Type: 'LONGITUDE_DIMENSION'
        }
      ],
      Definition: 'Standard error of 32-bit XtraPressureLev Atmospheric temperature floating (100) (Kelvin) point Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
      Name: 'TAirSup_A_err',
      AcquisitionSourceName: 'Not Provided',
      Units: 'hPa',
      LongName: 'TAirSup_A_err'
    },
    associations: {
      collections: [
        {
          'concept-id': 'C1200278964-E2E_18_4'
        },
        {
          'concept-id': 'C1200278965-E2E_18_4'
        },
        {
          'concept-id': 'C1200278966-E2E_18_4'
        },
        {
          'concept-id': 'C1200278971-E2E_18_4'
        },
        {
          'concept-id': 'C1200278972-E2E_18_4'
        },
        {
          'concept-id': 'C1200278974-E2E_18_4'
        }
      ]
    }
  },
  'V1200279052-E2E_18_4': {
    meta: {
      'revision-id': 6,
      deleted: false,
      format: 'application/vnd.nasa.cmr.umm+json',
      'provider-id': 'E2E_18_4',
      'user-id': 'mmorahan',
      'native-id': 'uvg_TAirSup_A_max',
      'concept-id': 'V1200279052-E2E_18_4',
      'revision-date': '2018-10-02T19:28:16Z',
      'concept-type': 'variable'
    },
    umm: {
      VariableType: 'SCIENCE_VARIABLE',
      DataType: 'float32',
      Offset: 0,
      ScienceKeywords: [
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC RADIATION',
          VariableLevel1: 'ATMOSPHERIC HEATING'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'COMMON SENSE CLIMATE INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'COOLING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'FREEZING INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'GROWING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'HEAT INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'HEATING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'RESIDENTIAL ENERGY DEMAND TEMPERATURE INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE CONCENTRATION INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'THAWING INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'WIND CHILL INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'ATMOSPHERIC TEMPERATURE INDICES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE TENDENCY'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'HIGHER MAXIMUM DAYTIME TEMPERATURES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'HIGHER MINIMUM NIGHTIME TEMPERATURES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'STRATOSPHERIC TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE TRENDS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE VARIABILITY'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TROPOSPHERIC TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE INDICATORS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'COMMON SENSE CLIMATE INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'COOLING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'FREEZING INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'GROWING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'HEATING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'RESIDENTIAL ENERGY DEMAND TEMPERATURE INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE CONCENTRATION INDEX (TCI)'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'THAWING INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE INDICES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'LAND SURFACE',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'POINT BAR'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'POINT BAR'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOTHERMAL DYNAMICS',
          VariableLevel1: 'TEMPERATURE GRADIENT'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOTHERMAL DYNAMICS',
          VariableLevel1: 'TEMPERATURE GRADIENT'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOTHERMAL DYNAMICS',
          VariableLevel1: 'TEMPERATURE PROFILES'
        }
      ],
      Scale: 1,
      Characteristics: {
        IndexRanges: {
          LatRange: [
            0,
            0
          ],
          LonRange: [
            0,
            0
          ]
        }
      },
      FillValues: [
        {
          Value: -9999,
          Type: 'ANCILLARY_FILLVALUE'
        }
      ],
      Sets: [
        {
          Name: 'TAirSup_A',
          Type: 'Ascending',
          Size: 5,
          Index: 4
        }
      ],
      Dimensions: [
        {
          Name: 'XtraPressureLev',
          Size: 100,
          Type: 'PRESSURE_DIMENSION'
        },
        {
          Name: 'Latitude',
          Size: 180,
          Type: 'LATITUDE_DIMENSION'
        },
        {
          Name: 'Longitude',
          Size: 360,
          Type: 'LONGITUDE_DIMENSION'
        }
      ],
      Definition: 'Maximum value of 32-bit XtraPressureLev Atmospheric temperature floating (100) (Kelvin) point Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
      Name: 'TAirSup_A_max',
      AcquisitionSourceName: 'Not Provided',
      Units: 'hPa',
      LongName: 'TAirSup_A_max'
    },
    associations: {
      collections: [
        {
          'concept-id': 'C1200278964-E2E_18_4'
        },
        {
          'concept-id': 'C1200278965-E2E_18_4'
        },
        {
          'concept-id': 'C1200278966-E2E_18_4'
        },
        {
          'concept-id': 'C1200278971-E2E_18_4'
        },
        {
          'concept-id': 'C1200278972-E2E_18_4'
        },
        {
          'concept-id': 'C1200278974-E2E_18_4'
        }
      ]
    }
  },
  'V1200279061-E2E_18_4': {
    meta: {
      'revision-id': 6,
      deleted: false,
      format: 'application/vnd.nasa.cmr.umm+json',
      'provider-id': 'E2E_18_4',
      'user-id': 'mmorahan',
      'native-id': 'uvg_TAirSup_A_min',
      'concept-id': 'V1200279061-E2E_18_4',
      'revision-date': '2018-10-02T19:28:21Z',
      'concept-type': 'variable'
    },
    umm: {
      VariableType: 'SCIENCE_VARIABLE',
      DataType: 'float32',
      Offset: 0,
      ScienceKeywords: [
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC RADIATION',
          VariableLevel1: 'ATMOSPHERIC HEATING'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'COMMON SENSE CLIMATE INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'COOLING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'FREEZING INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'GROWING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'HEAT INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'HEATING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'RESIDENTIAL ENERGY DEMAND TEMPERATURE INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE CONCENTRATION INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'THAWING INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'WIND CHILL INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'ATMOSPHERIC TEMPERATURE INDICES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE TENDENCY'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'HIGHER MAXIMUM DAYTIME TEMPERATURES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'HIGHER MINIMUM NIGHTIME TEMPERATURES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'STRATOSPHERIC TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE TRENDS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE VARIABILITY'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TROPOSPHERIC TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE INDICATORS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'COMMON SENSE CLIMATE INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'COOLING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'FREEZING INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'GROWING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'HEATING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'RESIDENTIAL ENERGY DEMAND TEMPERATURE INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE CONCENTRATION INDEX (TCI)'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'THAWING INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE INDICES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'LAND SURFACE',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'POINT BAR'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'POINT BAR'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOTHERMAL DYNAMICS',
          VariableLevel1: 'TEMPERATURE GRADIENT'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOTHERMAL DYNAMICS',
          VariableLevel1: 'TEMPERATURE GRADIENT'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOTHERMAL DYNAMICS',
          VariableLevel1: 'TEMPERATURE PROFILES'
        }
      ],
      Scale: 1,
      Characteristics: {
        IndexRanges: {
          LatRange: [
            0,
            0
          ],
          LonRange: [
            0,
            0
          ]
        }
      },
      FillValues: [
        {
          Value: -9999,
          Type: 'ANCILLARY_FILLVALUE'
        }
      ],
      Sets: [
        {
          Name: 'TAirSup_A',
          Type: 'Ascending',
          Size: 5,
          Index: 3
        }
      ],
      Dimensions: [
        {
          Name: 'XtraPressureLev',
          Size: 100,
          Type: 'PRESSURE_DIMENSION'
        },
        {
          Name: 'Latitude',
          Size: 180,
          Type: 'LATITUDE_DIMENSION'
        },
        {
          Name: 'Longitude',
          Size: 360,
          Type: 'LONGITUDE_DIMENSION'
        }
      ],
      Definition: 'Minimum value of 32-bit XtraPressureLev Atmospheric temperature floating (100) (Kelvin) point Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
      Name: 'TAirSup_A_min',
      AcquisitionSourceName: 'Not Provided',
      Units: 'hPa',
      LongName: 'TAirSup_A_min'
    },
    associations: {
      collections: [
        {
          'concept-id': 'C1200278964-E2E_18_4'
        },
        {
          'concept-id': 'C1200278965-E2E_18_4'
        },
        {
          'concept-id': 'C1200278966-E2E_18_4'
        },
        {
          'concept-id': 'C1200278971-E2E_18_4'
        },
        {
          'concept-id': 'C1200278972-E2E_18_4'
        },
        {
          'concept-id': 'C1200278974-E2E_18_4'
        }
      ]
    }
  },
  'V1200279039-E2E_18_4': {
    meta: {
      'revision-id': 6,
      deleted: false,
      format: 'application/vnd.nasa.cmr.umm+json',
      'provider-id': 'E2E_18_4',
      'user-id': 'mmorahan',
      'native-id': 'uvg_TAirSup_A_sdev',
      'concept-id': 'V1200279039-E2E_18_4',
      'revision-date': '2018-10-02T19:28:06Z',
      'concept-type': 'variable'
    },
    umm: {
      VariableType: 'SCIENCE_VARIABLE',
      DataType: 'float32',
      Offset: 0,
      ScienceKeywords: [
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC RADIATION',
          VariableLevel1: 'ATMOSPHERIC HEATING'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'COMMON SENSE CLIMATE INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'COOLING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'FREEZING INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'GROWING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'HEAT INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'HEATING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'RESIDENTIAL ENERGY DEMAND TEMPERATURE INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE CONCENTRATION INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'THAWING INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'WIND CHILL INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'ATMOSPHERIC TEMPERATURE INDICES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE TENDENCY'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'HIGHER MAXIMUM DAYTIME TEMPERATURES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'HIGHER MINIMUM NIGHTIME TEMPERATURES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'STRATOSPHERIC TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE TRENDS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE VARIABILITY'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TROPOSPHERIC TEMPERATURE ANOMALIES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE INDICATORS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'COMMON SENSE CLIMATE INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'COOLING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'FREEZING INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'GROWING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'HEATING DEGREE DAYS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'RESIDENTIAL ENERGY DEMAND TEMPERATURE INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE CONCENTRATION INDEX (TCI)'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'THAWING INDEX'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'CLIMATE INDICATORS',
          Term: 'ATMOSPHERIC/OCEAN INDICATORS',
          VariableLevel1: 'TEMPERATURE INDICES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'LAND SURFACE',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'POINT BAR'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          VariableLevel1: 'POINT BAR'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOTHERMAL DYNAMICS',
          VariableLevel1: 'TEMPERATURE GRADIENT'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOTHERMAL DYNAMICS',
          VariableLevel1: 'TEMPERATURE GRADIENT'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'SOLID EARTH',
          Term: 'GEOTHERMAL DYNAMICS',
          VariableLevel1: 'TEMPERATURE PROFILES'
        }
      ],
      Scale: 1,
      Characteristics: {
        IndexRanges: {
          LatRange: [
            0,
            0
          ],
          LonRange: [
            0,
            0
          ]
        }
      },
      FillValues: [
        {
          Value: -9999,
          Type: 'ANCILLARY_FILLVALUE'
        }
      ],
      Sets: [
        {
          Name: 'TAirSup_A',
          Type: 'Ascending',
          Size: 5,
          Index: 2
        }
      ],
      Dimensions: [
        {
          Name: 'XtraPressureLev',
          Size: 100,
          Type: 'PRESSURE_DIMENSION'
        },
        {
          Name: 'Latitude',
          Size: 180,
          Type: 'LATITUDE_DIMENSION'
        },
        {
          Name: 'Longitude',
          Size: 360,
          Type: 'LONGITUDE_DIMENSION'
        }
      ],
      Definition: 'Standard deviation of 32-bit XtraPressureLev Atmospheric temperature floating (100) (Kelvin) point Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
      Name: 'TAirSup_A_sdev',
      AcquisitionSourceName: 'Not Provided',
      Units: 'hPa',
      LongName: 'TAirSup_A_sdev'
    },
    associations: {
      collections: [
        {
          'concept-id': 'C1200278964-E2E_18_4'
        },
        {
          'concept-id': 'C1200278965-E2E_18_4'
        },
        {
          'concept-id': 'C1200278966-E2E_18_4'
        },
        {
          'concept-id': 'C1200278971-E2E_18_4'
        },
        {
          'concept-id': 'C1200278972-E2E_18_4'
        },
        {
          'concept-id': 'C1200278974-E2E_18_4'
        }
      ]
    }
  },
  'V1200279075-E2E_18_4': {
    meta: {
      'revision-id': 6,
      deleted: false,
      format: 'application/vnd.nasa.cmr.umm+json',
      'provider-id': 'E2E_18_4',
      'user-id': 'mmorahan',
      'native-id': 'uvg_Temp_dof_A',
      'concept-id': 'V1200279075-E2E_18_4',
      'revision-date': '2018-10-02T19:28:27Z',
      'concept-type': 'variable'
    },
    umm: {
      VariableType: 'SCIENCE_VARIABLE',
      DataType: 'float32',
      Offset: 0,
      ScienceKeywords: [
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'CLOUDS',
          VariableLevel1: 'CLOUD TOP TEMPERATURE'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'LAND SURFACE',
          Term: 'SURFACE THERMAL PROPERTIES',
          VariableLevel1: 'SKIN TEMPERATURE'
        }
      ],
      Scale: 1,
      Characteristics: {
        IndexRanges: {
          LatRange: [
            0,
            0
          ],
          LonRange: [
            0,
            0
          ]
        }
      },
      FillValues: [
        {
          Value: -9999,
          Type: 'ANCILLARY_FILLVALUE'
        }
      ],
      Sets: [
        {
          Name: 'Data_Fields',
          Type: 'Ascending',
          Size: 76,
          Index: 5
        }
      ],
      Dimensions: [
        {
          Name: 'Latitude',
          Size: 180,
          Type: 'LATITUDE_DIMENSION'
        },
        {
          Name: 'Longitude',
          Size: 360,
          Type: 'LONGITUDE_DIMENSION'
        }
      ],
      Definition: ' 32-bit None Degrees of freedom from floating the physical retrieval of point temperature (unitless) Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
      Name: 'Temp_dof_A',
      AcquisitionSourceName: 'Not Provided',
      Units: 'None',
      LongName: 'Temp_dof_A'
    },
    associations: {
      collections: [
        {
          'concept-id': 'C1200278964-E2E_18_4'
        },
        {
          'concept-id': 'C1200278965-E2E_18_4'
        },
        {
          'concept-id': 'C1200278966-E2E_18_4'
        },
        {
          'concept-id': 'C1200278971-E2E_18_4'
        },
        {
          'concept-id': 'C1200278972-E2E_18_4'
        },
        {
          'concept-id': 'C1200278974-E2E_18_4'
        }
      ]
    }
  },
  'V1200279048-E2E_18_4': {
    meta: {
      'revision-id': 6,
      deleted: false,
      format: 'application/vnd.nasa.cmr.umm+json',
      'provider-id': 'E2E_18_4',
      'user-id': 'mmorahan',
      'native-id': 'uvg_Temp_dof_A_ct',
      'concept-id': 'V1200279048-E2E_18_4',
      'revision-date': '2018-10-02T19:28:11Z',
      'concept-type': 'variable'
    },
    umm: {
      VariableType: 'SCIENCE_VARIABLE',
      DataType: 'int16',
      Offset: 0,
      ScienceKeywords: [
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'CLOUDS',
          VariableLevel1: 'CLOUD TOP TEMPERATURE'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'LAND SURFACE',
          Term: 'SURFACE THERMAL PROPERTIES',
          VariableLevel1: 'SKIN TEMPERATURE'
        }
      ],
      Scale: 1,
      Characteristics: {
        IndexRanges: {
          LatRange: [
            0,
            0
          ],
          LonRange: [
            0,
            0
          ]
        }
      },
      FillValues: [
        {
          Value: 0,
          Type: 'ANCILLARY_FILLVALUE'
        }
      ],
      Sets: [
        {
          Name: 'Temp_dof_A',
          Type: 'Ascending',
          Size: 5,
          Index: 1
        }
      ],
      Dimensions: [
        {
          Name: 'Latitude',
          Size: 180,
          Type: 'LATITUDE_DIMENSION'
        },
        {
          Name: 'Longitude',
          Size: 360,
          Type: 'LONGITUDE_DIMENSION'
        }
      ],
      Definition: 'Input count of 32-bit None Degrees of freedom from floating the physical retrieval of point temperature (unitless) Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
      Name: 'Temp_dof_A_ct',
      AcquisitionSourceName: 'Not Provided',
      Units: 'None',
      LongName: 'Temp_dof_A_ct'
    },
    associations: {
      collections: [
        {
          'concept-id': 'C1200278964-E2E_18_4'
        },
        {
          'concept-id': 'C1200278965-E2E_18_4'
        },
        {
          'concept-id': 'C1200278966-E2E_18_4'
        },
        {
          'concept-id': 'C1200278971-E2E_18_4'
        },
        {
          'concept-id': 'C1200278972-E2E_18_4'
        },
        {
          'concept-id': 'C1200278974-E2E_18_4'
        }
      ]
    }
  },
  'V1200279060-E2E_18_4': {
    meta: {
      'revision-id': 6,
      deleted: false,
      format: 'application/vnd.nasa.cmr.umm+json',
      'provider-id': 'E2E_18_4',
      'user-id': 'mmorahan',
      'native-id': 'uvg_Temp_dof_A_max',
      'concept-id': 'V1200279060-E2E_18_4',
      'revision-date': '2018-10-02T19:28:19Z',
      'concept-type': 'variable'
    },
    umm: {
      VariableType: 'SCIENCE_VARIABLE',
      DataType: 'float32',
      Offset: 0,
      ScienceKeywords: [
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'CLOUDS',
          VariableLevel1: 'CLOUD TOP TEMPERATURE'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'LAND SURFACE',
          Term: 'SURFACE THERMAL PROPERTIES',
          VariableLevel1: 'SKIN TEMPERATURE'
        }
      ],
      Scale: 1,
      Characteristics: {
        IndexRanges: {
          LatRange: [
            0,
            0
          ],
          LonRange: [
            0,
            0
          ]
        }
      },
      FillValues: [
        {
          Value: -9999,
          Type: 'ANCILLARY_FILLVALUE'
        }
      ],
      Sets: [
        {
          Name: 'Temp_dof_A',
          Type: 'Ascending',
          Size: 5,
          Index: 4
        }
      ],
      Dimensions: [
        {
          Name: 'Latitude',
          Size: 180,
          Type: 'LATITUDE_DIMENSION'
        },
        {
          Name: 'Longitude',
          Size: 360,
          Type: 'LONGITUDE_DIMENSION'
        }
      ],
      Definition: 'Maximum value of 32-bit None Degrees of freedom from floating the physical retrieval of point temperature (unitless) Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
      Name: 'Temp_dof_A_max',
      AcquisitionSourceName: 'Not Provided',
      Units: 'None',
      LongName: 'Temp_dof_A_max'
    },
    associations: {
      collections: [
        {
          'concept-id': 'C1200278964-E2E_18_4'
        },
        {
          'concept-id': 'C1200278965-E2E_18_4'
        },
        {
          'concept-id': 'C1200278966-E2E_18_4'
        },
        {
          'concept-id': 'C1200278971-E2E_18_4'
        },
        {
          'concept-id': 'C1200278972-E2E_18_4'
        },
        {
          'concept-id': 'C1200278974-E2E_18_4'
        }
      ]
    }
  },
  'V1200279056-E2E_18_4': {
    meta: {
      'revision-id': 6,
      deleted: false,
      format: 'application/vnd.nasa.cmr.umm+json',
      'provider-id': 'E2E_18_4',
      'user-id': 'mmorahan',
      'native-id': 'uvg_Temp_dof_A_min',
      'concept-id': 'V1200279056-E2E_18_4',
      'revision-date': '2018-10-02T19:28:18Z',
      'concept-type': 'variable'
    },
    umm: {
      VariableType: 'SCIENCE_VARIABLE',
      DataType: 'float32',
      Offset: 0,
      ScienceKeywords: [
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'CLOUDS',
          VariableLevel1: 'CLOUD TOP TEMPERATURE'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'LAND SURFACE',
          Term: 'SURFACE THERMAL PROPERTIES',
          VariableLevel1: 'SKIN TEMPERATURE'
        }
      ],
      Scale: 1,
      Characteristics: {
        IndexRanges: {
          LatRange: [
            0,
            0
          ],
          LonRange: [
            0,
            0
          ]
        }
      },
      FillValues: [
        {
          Value: -9999,
          Type: 'ANCILLARY_FILLVALUE'
        }
      ],
      Sets: [
        {
          Name: 'Temp_dof_A',
          Type: 'Ascending',
          Size: 5,
          Index: 3
        }
      ],
      Dimensions: [
        {
          Name: 'Latitude',
          Size: 180,
          Type: 'LATITUDE_DIMENSION'
        },
        {
          Name: 'Longitude',
          Size: 360,
          Type: 'LONGITUDE_DIMENSION'
        }
      ],
      Definition: 'Minimum value of 32-bit None Degrees of freedom from floating the physical retrieval of point temperature (unitless) Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
      Name: 'Temp_dof_A_min',
      AcquisitionSourceName: 'Not Provided',
      Units: 'None',
      LongName: 'Temp_dof_A_min'
    },
    associations: {
      collections: [
        {
          'concept-id': 'C1200278964-E2E_18_4'
        },
        {
          'concept-id': 'C1200278965-E2E_18_4'
        },
        {
          'concept-id': 'C1200278966-E2E_18_4'
        },
        {
          'concept-id': 'C1200278971-E2E_18_4'
        },
        {
          'concept-id': 'C1200278972-E2E_18_4'
        },
        {
          'concept-id': 'C1200278974-E2E_18_4'
        }
      ]
    }
  },
  'V1200279038-E2E_18_4': {
    meta: {
      'revision-id': 6,
      deleted: false,
      format: 'application/vnd.nasa.cmr.umm+json',
      'provider-id': 'E2E_18_4',
      'user-id': 'mmorahan',
      'native-id': 'uvg_Temp_dof_A_sdev',
      'concept-id': 'V1200279038-E2E_18_4',
      'revision-date': '2018-10-02T19:28:05Z',
      'concept-type': 'variable'
    },
    umm: {
      VariableType: 'SCIENCE_VARIABLE',
      DataType: 'float32',
      Offset: 0,
      ScienceKeywords: [
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'CLOUDS',
          VariableLevel1: 'CLOUD TOP TEMPERATURE'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'LAND SURFACE',
          Term: 'SURFACE THERMAL PROPERTIES',
          VariableLevel1: 'SKIN TEMPERATURE'
        }
      ],
      Scale: 1,
      Characteristics: {
        IndexRanges: {
          LatRange: [
            0,
            0
          ],
          LonRange: [
            0,
            0
          ]
        }
      },
      FillValues: [
        {
          Value: -9999,
          Type: 'ANCILLARY_FILLVALUE'
        }
      ],
      Sets: [
        {
          Name: 'Temp_dof_A',
          Type: 'Ascending',
          Size: 5,
          Index: 2
        }
      ],
      Dimensions: [
        {
          Name: 'Latitude',
          Size: 180,
          Type: 'LATITUDE_DIMENSION'
        },
        {
          Name: 'Longitude',
          Size: 360,
          Type: 'LONGITUDE_DIMENSION'
        }
      ],
      Definition: 'Standard deviation of 32-bit None Degrees of freedom from floating the physical retrieval of point temperature (unitless) Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
      Name: 'Temp_dof_A_sdev',
      AcquisitionSourceName: 'Not Provided',
      Units: 'None',
      LongName: 'Temp_dof_A_sdev'
    },
    associations: {
      collections: [
        {
          'concept-id': 'C1200278964-E2E_18_4'
        },
        {
          'concept-id': 'C1200278965-E2E_18_4'
        },
        {
          'concept-id': 'C1200278966-E2E_18_4'
        },
        {
          'concept-id': 'C1200278971-E2E_18_4'
        },
        {
          'concept-id': 'C1200278972-E2E_18_4'
        },
        {
          'concept-id': 'C1200278974-E2E_18_4'
        }
      ]
    }
  },
  'V1200279053-E2E_18_4': {
    meta: {
      'revision-id': 10,
      deleted: false,
      format: 'application/vnd.nasa.cmr.umm+json',
      'provider-id': 'E2E_18_4',
      'user-id': 'jdfarley',
      'native-id': 'uvg_TotalCounts_A',
      'concept-id': 'V1200279053-E2E_18_4',
      'revision-date': '2018-11-01T17:52:41Z',
      'concept-type': 'variable'
    },
    umm: {
      VariableType: 'SCIENCE_VARIABLE',
      DataType: 'int16',
      Offset: 0,
      ScienceKeywords: [
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ALTITUDE',
          VariableLevel1: 'TROPOPAUSE'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC PRESSURE',
          VariableLevel1: 'SURFACE PRESSURE'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'AIR TEMPERATURE'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC TEMPERATURE',
          VariableLevel1: 'UPPER AIR TEMPERATURE'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC WATER VAPOR',
          VariableLevel1: 'TOTAL PRECIPITABLE WATER'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC WATER VAPOR',
          VariableLevel1: 'WATER VAPOR'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'CLOUDS',
          VariableLevel1: 'CLOUD HEIGHT'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'CLOUDS',
          VariableLevel1: 'CLOUD TOP PRESSURE'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'CLOUDS',
          VariableLevel1: 'CLOUD TOP TEMPERATURE'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'CLOUDS',
          VariableLevel1: 'CLOUD VERTICAL DISTRIBUTION'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'LAND SURFACE',
          Term: 'SURFACE RADIATIVE PROPERTIES',
          VariableLevel1: 'EMISSIVITY'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'OCEANS',
          Term: 'OCEAN TEMPERATURE',
          VariableLevel1: 'SEA SURFACE TEMPERATURE'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'LAND SURFACE',
          Term: 'SURFACE THERMAL PROPERTIES',
          VariableLevel1: 'SKIN TEMPERATURE'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'AIR QUALITY',
          VariableLevel1: 'CARBON MONOXIDE'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ALTITUDE',
          VariableLevel1: 'GEOPOTENTIAL HEIGHT'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC WATER VAPOR',
          VariableLevel1: 'HUMIDITY'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC WATER VAPOR',
          VariableLevel1: 'WATER VAPOR PROFILES'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'CLOUDS',
          VariableLevel1: 'CLOUD LIQUID WATER/ICE'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC RADIATION',
          VariableLevel1: 'OUTGOING LONGWAVE RADIATION'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC CHEMISTRY',
          VariableLevel1: 'METHANE'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'ATMOSPHERIC CHEMISTRY',
          VariableLevel1: 'OZONE'
        }
      ],
      Scale: 1,
      Characteristics: {
        IndexRanges: {
          LatRange: [
            89.5,
            -89.5
          ],
          LonRange: [
            -179.5,
            179.5
          ]
        },
        GroupPath: '/TotalCounts_A'
      },
      FillValues: [
        {
          Value: 0,
          Type: 'ANCILLARY_FILLVALUE'
        }
      ],
      Sets: [
        {
          Name: 'TotalCounts_A',
          Type: 'General',
          Size: 778,
          Index: 1
        }
      ],
      Dimensions: [
        {
          Name: 'Latitude',
          Size: 180,
          Type: 'LATITUDE_DIMENSION'
        },
        {
          Name: 'Longitude',
          Size: 360,
          Type: 'LONGITUDE_DIMENSION'
        }
      ],
      Definition: '  Information collected while the spacecraft is in the ascending part of its orbit. (Daytime data except near the poles.) Each field and level is individually quality controlled.',
      Name: 'TotalCounts_A',
      AcquisitionSourceName: 'Not Provided',
      Units: 'None',
      LongName: 'TotalCounts Ascending'
    },
    associations: {
      collections: [
        {
          'concept-id': 'C1200278965-E2E_18_4'
        },
        {
          'concept-id': 'C1200278968-E2E_18_4'
        },
        {
          'concept-id': 'C1200278973-E2E_18_4'
        },
        {
          'concept-id': 'C1200278972-E2E_18_4'
        },
        {
          'concept-id': 'C1200278970-E2E_18_4'
        },
        {
          'concept-id': 'C1200278964-E2E_18_4'
        },
        {
          'concept-id': 'C1200278974-E2E_18_4'
        },
        {
          'concept-id': 'C1200278966-E2E_18_4'
        },
        {
          'concept-id': 'C1200278971-E2E_18_4'
        },
        {
          'concept-id': 'C1200278967-E2E_18_4'
        }
      ]
    }
  }
}
