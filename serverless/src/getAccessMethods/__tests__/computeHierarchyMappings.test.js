import { computeHierarchyMappings } from '../computeHierarchyMappings'

// /science/grids/data/amplitude
// /science/otherStuff/data/unwrappedPhase
// /science/grids/data/coherence
// /gt1r/heights
// /science/grids/data/connectedComponents
// /lat_ph/gt1r/heights
describe('computeHierarchyMappings', () => {
  test('correctly returns mapped hierarchy', () => {
    const items = [
      {
        conceptId: 'V10000-EDSC',
        name: '/science/grids/data/amplitude',
        longName: 'Amplitude'
      },
      {
        conceptId: 'V10003-EDSC',
        name: '/science/otherStuff/data/unwrappedPhase',
        longName: 'Unwrapped Phase'
      },
      {
        conceptId: 'V10001-EDSC',
        name: '/science/grids/data/coherence',
        longName: 'Coherence'
      },
      {
        conceptId: 'V10004-EDSC',
        name: '/gt1r/heights',
        longName: 'Heights'
      },
      {
        conceptId: 'V10002-EDSC',
        name: '/science/grids/data/connectedComponents',
        longName: 'Connected Components'
      },
      {
        conceptId: 'V10005-EDSC',
        name: '/lat_ph/gt1r/heights',
        longName: '/lat_ph/gt1r/heights'
      }
    ]

    const expectedResult = [
      {
        children: [
          {
            children: [
              {
                children: [
                  {
                    id: 'V10000-EDSC'
                  },
                  {
                    id: 'V10001-EDSC'
                  },
                  {
                    id: 'V10002-EDSC'
                  }
                ],
                label: 'data'
              }
            ],
            label: 'grids'
          },
          {
            children: [
              {
                children: [
                  {
                    id: 'V10003-EDSC'
                  }
                ],
                label: 'data'
              }
            ],
            label: 'otherStuff'
          }
        ],
        label: 'science'
      },
      {
        children: [
          {
            id: 'V10004-EDSC'
          }
        ],
        label: 'gt1r'
      },
      {
        children: [
          {
            children: [
              {
                id: 'V10005-EDSC'
              }
            ],
            label: 'gt1r'
          }
        ],
        label: 'lat_ph'
      }
    ]

    const hierarchyMappings = computeHierarchyMappings(items)

    expect(hierarchyMappings).toEqual(expectedResult)
  })

  test('correctly returns mapped hierarchy when no hierarchical names exist', () => {
    const emptyKeywordResponse = [
      {
        conceptId: 'V1200279034-E2E_18_4',
        name: 'Dust_Score_A',
        longName: 'Dust_Score_A'
      }
    ]

    const hierarchyMappings = computeHierarchyMappings(emptyKeywordResponse)

    expect(hierarchyMappings).toEqual([])
  })
})
