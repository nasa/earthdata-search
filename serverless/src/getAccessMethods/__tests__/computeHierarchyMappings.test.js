import { computeHierarchyMappings } from '../computeHierarchyMappings'

describe('computeHierarchyMappings', () => {
  test('correctly returns mapped hierarchy', () => {
  // '/gt1r/bckgrd_atlas/bckgrd_counts'
  // '/gt1r/geolocation/altitude_sc'
  // '/gt1r/geolocation/ph_index_beg'
  // '/gt1r/geolocation/reference_photon_lat'
  // '/gt1r/geolocation/reference_photon_lon'
  // '/gt1r/geophys_corr/geoid'
  // '/gt1r/heights/h_ph'
  // '/gt1r/heights/lat_ph'
  // '/gt1r/heights/lon_ph',
  // '/gt1r/signal_find_output/ocean/bckgrd_mean'
  // '/orbit_info/orbit_number'

    const items = [
      {
        conceptId: 'V1237329971-EEDTEST',
        longName: 'ATLAS 50-shot background count',
        name: '/gt1r/bckgrd_atlas/bckgrd_counts'
      },
      {
        conceptId: 'V1237329747-EEDTEST',
        longName: 'Altitude',
        name: '/gt1r/geolocation/altitude_sc'
      },
      {
        conceptId: 'V1237332705-EEDTEST',
        longName: 'Photon Index Begin',
        name: 'gt1r/geolocation/ph_index_beg' // leading slash missing on purpose
      },
      {
        conceptId: 'V1237332539-EEDTEST',
        longName: 'Segment latitude',
        name: '/gt1r/geolocation/reference_photon_lat'
      },
      {
        conceptId: 'V1237332577-EEDTEST',
        longName: 'Segment longitude',
        name: '/gt1r/geolocation/reference_photon_lon'
      },
      {
        conceptId: 'V1237331975-EEDTEST',
        longName: 'Geoid',
        name: '/gt1r/geophys_corr/geoid'
      },
      {
        conceptId: 'V1237332106-EEDTEST',
        longName: 'Photon WGS84 Height',
        name: '/gt1r/heights/h_ph'
      },
      {
        conceptId: 'V1237332209-EEDTEST',
        longName: 'Latitude',
        name: '/gt1r/heights/lat_ph'
      },
      {
        conceptId: 'V1237332444-EEDTEST',
        longName: 'Longitude',
        name: '/gt1r/heights/lon_ph'
      },
      {
        conceptId: 'V1237330070-EEDTEST',
        longName: 'background counts per bin',
        name: '/gt1r/signal_find_output/ocean/bckgrd_mean'
      },
      {
        conceptId: 'V1237332633-EEDTEST',
        longName: 'Orbit Number',
        name: '/orbit_info/orbit_number'
      }
    ]

    const expectedResult = [
      {
        label: 'gt1r',
        children: [
          {
            label: 'bckgrd_atlas',
            children: [
              {
                id: 'V1237329971-EEDTEST'
              }
            ]
          },
          {
            label: 'geolocation',
            children: [
              {
                id: 'V1237329747-EEDTEST'
              },
              {
                id: 'V1237332705-EEDTEST'
              },
              {
                id: 'V1237332539-EEDTEST'
              },
              {
                id: 'V1237332577-EEDTEST'
              }
            ]
          },
          {
            label: 'geophys_corr',
            children: [
              {
                id: 'V1237331975-EEDTEST'
              }
            ]
          },
          {
            label: 'heights',
            children: [
              {
                id: 'V1237332106-EEDTEST'
              },
              {
                id: 'V1237332209-EEDTEST'
              },
              {
                id: 'V1237332444-EEDTEST'
              }
            ]
          },
          {
            label: 'signal_find_output',
            children: [
              {
                label: 'ocean',
                children: [
                  {
                    id: 'V1237330070-EEDTEST'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        label: 'orbit_info',
        children: [
          {
            id: 'V1237332633-EEDTEST'
          }
        ]
      }
    ]

    const hierarchyMappings = computeHierarchyMappings(items)

    expect(hierarchyMappings).toEqual(expectedResult)
  })

  test('correctly returns mapped hierarchy when names are not hierarchical', () => {
    const items = [
      {
        conceptId: 'V1237329971-EEDTEST',
        longName: 'ATLAS 50-shot background count',
        name: 'bckgrd_counts'
      },
      {
        conceptId: 'V1237329747-EEDTEST',
        longName: 'Altitude',
        name: 'gt1r/geolocation/altitude_sc'
      },
      {
        conceptId: 'V1237332705-EEDTEST',
        longName: 'Photon Index Begin',
        name: 'ph_index_beg'
      },
      {
        conceptId: 'V1237332539-EEDTEST',
        longName: 'Segment latitude',
        name: 'reference_photon_lat'
      }
    ]

    const expectedResult = [
      {
        id: 'V1237329971-EEDTEST'
      },
      {
        label: 'gt1r',
        children: [
          {
            label: 'geolocation',
            children: [
              {
                id: 'V1237329747-EEDTEST'
              }
            ]
          }
        ]
      },
      {
        id: 'V1237332705-EEDTEST'
      },
      {
        id: 'V1237332539-EEDTEST'
      }
    ]

    const hierarchyMappings = computeHierarchyMappings(items)

    expect(hierarchyMappings).toEqual(expectedResult)
  })
})
