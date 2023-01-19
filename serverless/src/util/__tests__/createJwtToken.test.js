import jwt from 'jsonwebtoken'

import { createJwtToken } from '../createJwtToken'

describe('util#createJwtToken', () => {
  test('correctly returns the JWT token', () => {
    const user = {
      id: 1,
      urs_id: 'testuser',
      site_preferences: {
        mapView: {
          zoom: 4,
          latitude: 39,
          baseLayer: 'blueMarble',
          longitude: -95,
          projection: 'epsg4326',
          overlayLayers: [
            'referenceFeatures',
            'referenceLabels'
          ]
        },
        panelState: 'default',
        granuleSort: 'default',
        collectionSort: 'default',
        granuleListView: 'default',
        collectionListView: 'default'
      },
      urs_profile: {
        first_name: 'test'
      }
    }

    const result = createJwtToken(user, 'prod')
    const decoded = jwt.decode(result)

    expect(decoded).toEqual(expect.objectContaining({
      id: 1,
      preferences: {
        mapView: {
          zoom: 4,
          latitude: 39,
          baseLayer: 'blueMarble',
          longitude: -95,
          projection: 'epsg4326',
          overlayLayers: [
            'referenceFeatures',
            'referenceLabels'
          ]
        },
        panelState: 'default',
        granuleSort: 'default',
        collectionSort: 'default',
        granuleListView: 'default',
        collectionListView: 'default'
      },
      username: 'testuser',
      ursProfile: {
        first_name: 'test'
      }
    }))
  })
})
