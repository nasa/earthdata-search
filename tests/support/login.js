import { testJwtToken } from './getJwtToken'

export const sitePreferences = {
  panelState: 'default',
  collectionListView: 'default',
  granuleListView: 'default',
  collectionSort: 'default',
  granuleSort: 'default',
  mapView: {
    zoom: 4,
    latitude: 39,
    baseLayer: 'worldImagery',
    longitude: -95,
    projection: 'epsg4326',
    overlayLayers: [
      'bordersRoads',
      'placeLabels'
    ],
    rotation: 0
  }
}

export const MockGetUserRoute = async (route) => route.fulfill({
  json: {
    data: {
      user: {
        id: '1',
        sitePreferences,
        ursId: 'testuser',
        ursProfile: {
          firstName: 'test'
        }
      }
    }
  },
  headers: {
    'content-type': 'application/json'
  }
})

/**
 * Sets a cookie that will result in the user being logged in for a test
 */
export const login = async (page, context) => {
  await page.route(/graphql$/, async (route) => {
    const { query } = JSON.parse(route.request().postData())

    if (query.includes('query GetUser')) {
      await MockGetUserRoute(route)
    }
  })

  await context.addCookies([{
    name: 'authToken',
    value: testJwtToken,
    url: 'http://localhost:8080'
  }])
}
