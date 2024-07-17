import { test, expect } from 'playwright-test-coverage'

import collectionsGraphJson from './__mocks__/collections_graph.json'
import timeline from './__mocks__/timeline.json'
import granules from './__mocks__/granules.json'
import retrievals from './__mocks__/retrievals.json'
import retrieval from './__mocks__/retrieval.json'

import { login } from '../../support/login'
import { getAuthHeaders } from '../../support/getAuthHeaders'

test.describe('Download spec', () => {
  test('get to the download page', async ({ page, context }) => {
    login(context)

    const authHeaders = getAuthHeaders()

    const downloadLinks = [
      'https://ladsweb.modaps.eosdis.nasa.gov/archive/allData/61/MYD04_3K/2020/006/MYD04_3K.A2020006.1720.061.2020008170450.hdf',
      'https://ladsweb.modaps.eosdis.nasa.gov/archive/allData/61/MYD04_3K/2020/006/MYD04_3K.A2020006.1900.061.2020008170003.hdf',
      'https://ladsweb.modaps.eosdis.nasa.gov/archive/allData/61/MYD04_3K/2020/007/MYD04_3K.A2020007.1805.061.2020008182434.hdf',
      'https://ladsweb.modaps.eosdis.nasa.gov/archive/allData/61/MYD04_3K/2020/008/MYD04_3K.A2020008.1850.061.2020010183913.hdf',
      'https://ladsweb.modaps.eosdis.nasa.gov/archive/allData/61/MYD04_3K/2020/009/MYD04_3K.A2020009.1755.061.2020010200250.hdf',
      'https://ladsweb.modaps.eosdis.nasa.gov/archive/allData/61/MYD04_3K/2020/010/MYD04_3K.A2020010.1835.061.2020011153413.hdf',
      'https://ladsweb.modaps.eosdis.nasa.gov/archive/allData/61/MYD04_3K/2020/011/MYD04_3K.A2020011.1740.061.2020012150910.hdf',
      'https://ladsweb.modaps.eosdis.nasa.gov/archive/allData/61/MYD04_3K/2020/012/MYD04_3K.A2020012.1825.061.2020013152621.hdf'
    ]

    await page.route(/graphql/, async (route) => {
      await route.fulfill({
        json: collectionsGraphJson.body,
        headers: authHeaders
      })
    })

    await page.route(/timeline/, async (route) => {
      await route.fulfill({
        json: timeline.body,
        headers: authHeaders
      })
    })

    // Load the download data and mock the results
    await page.route(/retrievals/, async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          json: retrieval.body,
          headers: retrieval.headers
        })
      } else {
        await route.fulfill({
          json: retrievals.body,
          headers: retrievals.headers
        })
      }
    })

    await page.route(/granule_links/, async (route) => {
      if (route.request().url().includes('pageNum=1')) {
        await route.fulfill({
          json: {
            cursor: 'mock-cursor',
            links: {
              browse: [],
              download: downloadLinks,
              s3: []
            }
          },
          headers: authHeaders
        })
      } else {
        await route.fulfill({
          json: {
            cursor: null,
            links: {
              browse: [],
              download: [],
              s3: []
            }
          }
        })
      }
    })

    await page.route(/dqs/, async (route) => {
      await route.fulfill({
        json: []
      })
    })

    await page.route(/granules$/, async (route) => {
      await route.fulfill({
        json: granules.body,
        headers: {
          ...authHeaders,
          'cmr-hits': '42'
        }
      })
    })

    await page.route(/saved_access_configs/, async (route) => {
      await route.fulfill({
        json: {}
      })
    })

    await page.goto('/projects?p=!C1443528505-LAADS&sb=-77.15071%2C38.78817%2C-76.89801%2C38.99784&lat=37.64643450971326&long=-77.407470703125&zoom=7&qt=2020-01-06T04%3A15%3A27.310Z%2C2020-01-13T07%3A32%3A50.962Z&ff=Map%20Imagery&tl=1563377338!4!!')

    await page.getByTestId('C1443528505-LAADS_access-method__direct-download').click()

    // Click the done panel
    await page.getByTestId('project-panels-done').click()
    await expect(page.getByTestId('panels-section')).toBeVisible()

    // Click the Download Data button
    await page.getByTestId('project-download-data').click()

    // Make sure all links that are in the download list are visible on the page
    await Promise.all(downloadLinks.map(async (link) => {
      await expect(page.getByText(link).first()).toBeVisible()
    }))
  })
})
