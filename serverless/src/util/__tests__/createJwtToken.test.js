import jwt from 'jsonwebtoken'

import { createJwtToken } from '../createJwtToken'
import mapLayers from '../../../../static/src/js/constants/mapLayers'
import projectionCodes from '../../../../static/src/js/constants/projectionCodes'

describe('util#createJwtToken', () => {
  test('correctly returns the JWT token', () => {
    const user = {
      id: 1,
      urs_id: 'testuser',
      site_preferences: {
        mapView: {
          zoom: 4,
          latitude: 39,
          baseLayer: mapLayers.worldImagery,
          longitude: -95,
          projection: projectionCodes.geographic,
          overlayLayers: [
            mapLayers.bordersRoads,
            mapLayers.placeLabels
          ]
        },
        panelState: 'default',
        granuleSort: 'default',
        collectionSort: 'default',
        granuleListView: 'default',
        collectionListView: 'default'
      },
      urs_profile: {
        email_address: 'test@example.com',
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
          baseLayer: mapLayers.worldImagery,
          longitude: -95,
          projection: projectionCodes.geographic,
          overlayLayers: [
            mapLayers.bordersRoads,
            mapLayers.placeLabels
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
        email_address: 'test@example.com',
        first_name: 'test'
      }
    }))
  })
})
