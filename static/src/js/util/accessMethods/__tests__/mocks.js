export const harmonyVariablesResponse = {
  count: 2,
  items: [
    {
      name: 'Dust_Score_A_min',
      href: 'https://cmr.earthdata.nasa.gov/search/concepts/V1200279069-E2E_18_4',
      scienceKeywords: [
        {
          category: 'EARTH SCIENCE',
          topic: 'LAND SURFACE',
          term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          variableLevel1: 'POINT BAR'
        },
        {
          category: 'EARTH SCIENCE',
          topic: 'SOLID EARTH',
          term: 'GEOMORPHIC LANDFORMS/PROCESSES',
          variableLevel1: 'POINT BAR'
        }
      ]
    },
    {
      name: 'SO2_Indicator_A',
      href: 'https://cmr.earthdata.nasa.gov/search/concepts/V1200279065-E2E_18_4',
      scienceKeywords: [
        {
          category: 'EARTH SCIENCE',
          topic: 'ATMOSPHERE',
          term: 'ATMOSPHERIC TEMPERATURE',
          variableLevel1: 'TEMPERATURE ANOMALIES'
        },
        {
          category: 'EARTH SCIENCE',
          topic: 'ATMOSPHERE',
          term: 'ATMOSPHERIC TEMPERATURE',
          variableLevel1: 'TEMPERATURE TENDENCY'
        }
      ]
    }
  ]
}

export const mockHarmonyKeywordMappings = [
  {
    children: [
      {
        id: 'V1200279069-E2E_18_4'
      }
    ],
    label: 'POINT BAR'
  },
  {
    children: [
      {
        id: 'V1200279065-E2E_18_4'
      }
    ],
    label: 'TEMPERATURE ANOMALIES'
  },
  {
    children: [
      {
        id: 'V1200279065-E2E_18_4'
      }
    ],
    label: 'TEMPERATURE TENDENCY'
  }
]

export const mockHarmonyVariables = {
  'V1200279065-E2E_18_4': {
    href: 'https://cmr.earthdata.nasa.gov/search/concepts/V1200279065-E2E_18_4',
    name: 'SO2_Indicator_A',
    scienceKeywords: [
      {
        category: 'EARTH SCIENCE',
        term: 'ATMOSPHERIC TEMPERATURE',
        topic: 'ATMOSPHERE',
        variableLevel1: 'TEMPERATURE ANOMALIES'
      },
      {
        category: 'EARTH SCIENCE',
        term: 'ATMOSPHERIC TEMPERATURE',
        topic: 'ATMOSPHERE',
        variableLevel1: 'TEMPERATURE TENDENCY'
      }
    ]
  },
  'V1200279069-E2E_18_4': {
    href: 'https://cmr.earthdata.nasa.gov/search/concepts/V1200279069-E2E_18_4',
    name: 'Dust_Score_A_min',
    scienceKeywords: [
      {
        category: 'EARTH SCIENCE',
        term: 'GEOMORPHIC LANDFORMS/PROCESSES',
        topic: 'LAND SURFACE',
        variableLevel1: 'POINT BAR'
      },
      {
        category: 'EARTH SCIENCE',
        term: 'GEOMORPHIC LANDFORMS/PROCESSES',
        topic: 'SOLID EARTH',
        variableLevel1: 'POINT BAR'
      }
    ]
  }
}
