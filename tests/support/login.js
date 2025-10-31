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
          affiliation: 'OTHER',
          country: 'United States',
          emailAddress: 'test@example.com',
          firstName: 'test',
          lastName: 'user',
          organization: null,
          studyArea: 'Other',
          uid: 'testuser',
          userType: 'Public User'
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
  await page.route('http://localhost:3001/graphql', async (route) => {
    const request = JSON.parse(route.request().postData())
    const { query } = request

    if (query.includes('query GetUser')) {
      await MockGetUserRoute(route)
    }
  })

  await context.addCookies([{
    name: 'edlToken',
    value: testJwtToken,
    url: 'http://localhost:8080'
  }])
}
