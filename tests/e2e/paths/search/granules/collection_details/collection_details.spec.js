import { test, expect } from 'playwright-test-coverage'

import { graphQlGetCollection } from '../../../../../support/graphQlGetCollection'
import { graphQlGetSubscriptionsQuery } from '../../../../../support/graphQlGetSubscriptionsQuery'

import { commafy } from '../../../../../../static/src/js/util/commafy'
import { pluralize } from '../../../../../../static/src/js/util/pluralize'
import reformattingGraphQlBody from './__mocks__/reformattings/graphql.body.json'
import reformattingsGranulesBody from './__mocks__/reformattings/granules.body.json'
import assocatedDoisGraphQlBody from './__mocks__/associated_dois/graphql.body.json'
import collectionsBody from './__mocks__/common/collections.body.json'
import commonHeaders from './__mocks__/common/common.headers.json'
import associatedDoisGranulesBody from './__mocks__/associated_dois/granules.body.json'
import graphQlHeaders from './__mocks__/common/graphql.headers.json'
import getSubscriptionsGraphQlBody from './__mocks__/common/getSubscriptions.graphql.body.json'
import { login } from '../../../../../support/login'

/**
 * Tests the title displayed in the collection details
 * @param {String} title Title of the collection being displayed
 * @param {Page} page Playwright page object
 */
const testCollectionTitle = async (page, title) => {
  const panelGroupGranuleResults = await page.getByTestId('panel-group_granule-results')

  const panelText = await panelGroupGranuleResults
    .filter({ has: page.getByTestId('panel-group-header__heading-primary') })
    .filter({ hasText: title })

  expect(panelText).toBeVisible()
}

/**
 * Tests the search panel header and meta text for results size
 * @param {Page} page Playwright page object
 * @param {Integer} cmrHits Total number of collections that match the query
 */
const testCollectionResults = async (page, cmrHits) => {
  const panelGroupCollectionsResults = await page.getByTestId('panel-group_granules-collections-results')
  const searchResultsCollectionsText = `Search Results (${commafy(cmrHits)} ${pluralize('Collection', cmrHits)})`
  const panelCollectionText = await panelGroupCollectionsResults
    .filter({ has: page.getByTestId('panel-group-header__breadcrumbs') })
    .filter({ hasText: searchResultsCollectionsText })

  expect(panelCollectionText).toBeVisible()
}

/**
 * Test the display of the data centers in the collection details
 * @param {Page} page Playwright page object
 * @param {Array} dataCenters Array of data centers with properties like email, fax, telephone, role, title
 */
const testCollectionDataCenters = async (page, dataCenters) => {
  // Select the parent element containing the data centers list
  const providerListElement = await page.getByTestId('collection-details-body__provider-list')

  // Iterate through each data center
  dataCenters.forEach(async (dataCenter, index) => {
    const {
      email,
      fax,
      telephone,
      role,
      title
    } = dataCenter

    // Select each data center item within the provider list
    const dataCenterElement = await providerListElement.getByTestId(`collection-details-data-center-${index}`)

    // Check if there is no contact information available
    if (!email && !fax && !telephone) {
      const noContactInfo = await dataCenterElement.getByTestId('collection-details-data-center__no-contact-info')
      expect(noContactInfo).toHaveText('No contact information for this data center.')
    } else {
      // Check for email, telephone, and fax if available
      if (email) {
        const emailElement = await dataCenterElement.getByTestId('collection-details-data-center__email')
        expect(emailElement).toHaveText(email)
      }

      if (telephone) {
        const telephoneElement = await dataCenterElement.getByTestId('collection-details-data-center__telephone')
        expect(telephoneElement).toHaveText(telephone)
      }

      if (fax) {
        const faxElement = await dataCenterElement.getByTestId('collection-details-data-center__fax')
        expect(faxElement).toHaveText(fax)
      }
    }

    // Check for title and role
    const dataCenterTitle = await dataCenterElement.getByTestId('collection-details-data-center__title')
    const dataCenterRole = await dataCenterElement.getByTestId('collection-details-data-center__role')

    expect(dataCenterTitle).toHaveText(title)
    expect(dataCenterRole).toHaveText(role)
  })
}

/**
 * Test the granules that appear in the sidebar of collection details
 * @param {Page} page Playwright page object
 * @param {Integer} pageSize Number of results per page
 * @param {Number} totalResults Total number of granules in the collection
 */
const testGranulesSidebar = async (page, pageSize, totalResults) => {
  await expect(page.locator('.granule-results-highlights__count')).toHaveText(`Showing ${pageSize} of ${commafy(totalResults)} matching granules`)
  // Await expect(page.locator('.granule-results-highlights__item')).toHaveCount(pageSize)
}

/**
 * Test the display of science keywords in the collection details
 * @param {Page} page Playwright page object
 * @param {Integer} count Number of science keywords
 * @param {Array<Array>} keywords An array of array of strings representing science keywords
 */
const testCollectionScienceKeywords = async (page, count, keywords) => {
  const infoSection = await page.getByTestId('collection-details-body__info-science-keywords')

  // Check the number of science keywords
  const keywordsList = await infoSection.locator('.collection-details-body__keywords')

  // `<` prepend to match only the direct child elements
  await expect(keywordsList.locator('>li')).toHaveCount(count)

  // Check the values of the science keywords
  keywords.forEach(async (keyword, keywordIndex) => {
    const keywordList = await keywordsList.locator('li > ul').nth(keywordIndex)

    keyword.forEach(async (keywordPart, partIndex) => {
      await expect(keywordList.locator('li').nth(partIndex)).toHaveText(keywordPart)
    })
  })
}

/**
 * Tests the temporal string displayed in the collection details
 * @param {String} temporal The temporal range of the collection represented as a string
 */
const testCollectionTemporal = async (page, temporalSpan) => {
  const collectionTemporalSpane = await page.getByTestId('collection-details-body__info-temporal')
    .filter({ hasText: temporalSpan })
  expect(collectionTemporalSpane).toBeVisible()
}

/**
 * Test the display of reformatting options in the collection details
 * @param {Page} page Playwright page object
 * @param {Array} reformattingOptions Array of objects containing input and outputs
 */
const testCollectionReformattingOptions = async (page, reformattingOptions) => {
  const collectionDetailsBody = await page.getByTestId('collection-details-body__info-reformattings')

  // Loop through each reformatting option
  reformattingOptions.forEach(async (currentReformatting, index) => {
    const { input, outputs } = currentReformatting

    // Find the reformatting item within the collection details body
    const reformattingItem = await collectionDetailsBody.locator('.collection-details-body__reformatting-item').nth(index)

    // Assert the input and outputs within the reformatting item
    const reformattingHeaderElement = await reformattingItem.locator('.collection-details-body__reformatting-item-heading')
    const reformattingItemBody = await reformattingItem.locator('.collection-details-body__reformatting-item-body')

    expect(reformattingHeaderElement).toHaveText(input)
    expect(reformattingItemBody).toHaveText(outputs)
  })
}

/**
 * Test the display of native data formats in the collection details
 * @param {Page} page Playwright page object
 * @param {String} format Native data format belonging to the collection
 */
const testCollectionNativeDataFormats = async (page, format) => {
  const collectionDetailsBody = await page.getByTestId('collection-details-body__info-native-data-formats')
  const nativeFormat = await collectionDetailsBody.locator('dd')
  expect(nativeFormat).toHaveText(format)
}

/**
 * Tests the display of the cloud access details
 * @param {Page} page Playwright page object
 * @param {String} region The AWS region the data resides in
 * @param {String} bucketName The AWS bucket the data resides in
 */
const testCollectionCloudAccessDetails = async (page, region, bucketName) => {
  expect(await page
    .getByTestId('direct-distribution-information__cloud-access__region'))
    .toHaveText(region)

  expect(await page
    .getByTestId('direct-distribution-information__cloud-access__bucket-name'))
    .toHaveText(bucketName)
}

/**
 * Test the display of native data formats in the collection details
 * @param {Page} page Playwright page object
 * @param {String} projections projections Projections supported by GIBS
 */
const testCollectionGibsProjections = async (page, projections) => {
  const collectionDetailsBody = await page.getByTestId('collection-details-body__info-gibs-projections')
  const gibsProjections = await collectionDetailsBody.locator('dd')
  expect(gibsProjections).toHaveText(projections)
}

test.describe('Path /search/granules/collection-details', () => {
  test.describe('When collection has associated DOIs', () => {
    test('loads correctly', async ({ page, context }) => {
      await page.route('**/*.{png,jpg,jpeg}', (route) => route.abort())

      const conceptId = 'C1240222820-ECHO_REST'
      const cmrHits = 12345
      const granuleHits = 0

      await page.route(/collections.json/, async (route) => {
        const query = route.request().postData()
        expect(query).toEqual('include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&sort_key[]=-score')

        await route.fulfill({
          json: collectionsBody.body,
          headers: {
            ...commonHeaders,
            'cmr-hits': cmrHits.toString()
          }
        })
      })

      await page.route(/granules.json/, async (route) => {
        const query = route.request().postData()
        expect(query).toBe('echo_collection_id=C1240222820-ECHO_REST&page_num=1&page_size=20')

        await route.fulfill({
          json: associatedDoisGranulesBody.body,
          headers: {
            ...commonHeaders,
            'cmr-hits': granuleHits.toString()
          }
        })
      })

      await page.route(/graphql/, async (route) => {
        const { query } = JSON.parse(route.request().postData())

        if (query === JSON.parse(graphQlGetCollection(conceptId)).query) {
          await route.fulfill({
            json: assocatedDoisGraphQlBody,
            headers: graphQlHeaders
          })
        }

        if (query === graphQlGetSubscriptionsQuery) {
          await route.fulfill({
            json: getSubscriptionsGraphQlBody,
            headers: graphQlHeaders
          })
        }
      })

      await page.goto('/search/granules/collection-details?p=C1240222820-ECHO_REST&ee=uat&ac=true')

      // Log-in
      await login(context)

      // Ensure title renders on page correctly
      testCollectionTitle(page, 'Mapping Example for UMM-C 1.16.1')

      // Ensure short-name, version are present
      const shortName = 'Mapping Short Name 1.16.1'
      await expect(page.getByTestId('collection-details-header__short-name').filter({ hasText: shortName })).toBeVisible()
      const version = 'Version 1.16.1'
      await expect(page.getByTestId('collection-details-header__version-id').filter({ hasText: version })).toBeVisible()

      // Ensure that the collections request ocurred and the component is displaying the correct results
      testCollectionResults(page, cmrHits)

      // Test temporal range
      testCollectionTemporal(page, '2001-01-01 to 2001-06-01')

      testCollectionScienceKeywords(page, 2, [
        ['Earth Science', 'Terrestrial Hydrosphere', 'Snow Ice'],
        ['Earth Science', 'Cryosphere', 'Snow Ice']
      ])

      const providersList = await page.getByTestId('collection-details-body__provider-list')
        .getByRole('listitem')
      expect(providersList).toHaveCount(4)

      testCollectionCloudAccessDetails(page, 'us-east-2', 'TestBucketOrObjectPrefix')
    })
  })

  test.describe('When collection has multiple reformatting options', () => {
    test('loads correctly', async ({ page }) => {
      await page.route('**/*.{png,jpg,jpeg}', (route) => route.abort())
      const conceptId = 'C1996546500-GHRC_DAAC'
      const cmrHits = 8180
      const granuleHits = 6338

      await page.route(/collections.json/, async (route) => {
        const query = route.request().postData()
        expect(query).toEqual('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&sort_key[]=has_granules_or_cwic&sort_key[]=-score')

        await route.fulfill({
          json: collectionsBody,
          headers: {
            ...commonHeaders,
            'cmr-hits': cmrHits.toString()
          }
        })
      })

      await page.route(/granules.json/, async (route) => {
        const query = route.request().postData()
        expect(query).toEqual('echo_collection_id=C1996546500-GHRC_DAAC&page_num=1&page_size=20')

        await route.fulfill({
          json: reformattingsGranulesBody,
          headers: {
            ...commonHeaders,
            'cmr-hits': granuleHits.toString()
          }
        })
      })

      await page.route(/graphql/, async (route) => {
        const { query } = JSON.parse(route.request().postData())
        if (query === JSON.parse(graphQlGetCollection(conceptId)).query) {
          await route.fulfill({
            json: reformattingGraphQlBody,
            headers: graphQlHeaders
          })
        }

        if (query === graphQlGetSubscriptionsQuery) {
          await route.fulfill({
            json: getSubscriptionsGraphQlBody,
            headers: graphQlHeaders
          })
        }
      })

      await page.goto('/search/granules/collection-details?p=C1996546500-GHRC_DAAC')

      // Ensure title renders on page correctly
      testCollectionTitle(page, 'RSS SSMIS OCEAN PRODUCT GRIDS DAILY FROM DMSP F16 NETCDF V7')

      // Ensure short-name, version are present
      const shortName = 'rssmif16d'
      await expect(page.getByTestId('collection-details-header__short-name').filter({ hasText: shortName })).toBeVisible()
      const version = 'Version 7'
      await expect(page.getByTestId('collection-details-header__version-id').filter({ hasText: version })).toBeVisible()

      // Ensure that the collections request ocurred and the component is displaying the correct results
      testCollectionResults(page, cmrHits)

      // Granules sidebar
      testGranulesSidebar(page, 5, granuleHits)

      // Check temporal time
      testCollectionTemporal(page, '2003-10-26 ongoing')

      // Check native-id
      testCollectionNativeDataFormats(page, 'netCDF-4')

      // Check reformatting options
      testCollectionReformattingOptions(page, [{
        input: 'NETCDF-4',
        outputs: 'ASCII, CSV, NETCDF-3, NETCDF-4'
      }, {
        input: 'HDF5',
        outputs: 'ASCII, CSV, NETCDF-3, NETCDF-4'
      }])

      // Check projection
      testCollectionGibsProjections(page, 'Geographic')

      // Testing the science keywords
      testCollectionScienceKeywords(page, 6, [
        ['Earth Science', 'Spectral Engineering', 'Precipitation'],
        ['Earth Science', 'Oceans', 'Ocean Winds'],
        ['Earth Science', 'Atmosphere', 'Precipitation'],
        ['Earth Science', 'Atmosphere', 'Atmospheric Winds'],
        ['Earth Science', 'Atmosphere', 'Clouds'],
        ['Earth Science', 'Atmosphere', 'Atmospheric Water Vapor']
      ])

      const providersList = page.getByTestId('collection-details-body__provider-list')
        .getByRole('listitem')
      expect(providersList).toHaveCount(2)

      // Test the data centers
      testCollectionDataCenters(page, [{
        title: 'NASA/MSFC/GHRC',
        role: 'ARCHIVER'
      }, {
        title: 'Global Hydrology Resource Center, Marshall Space Flight Center, NASA',
        role: 'ARCHIVER',
        email: 'support-ghrc@earthdata.nasa.gov',
        telephone: '+1 256-961-7932',
        fax: '+1 256-824-5149'
      }])
    })
  })

  test.describe('When collection has spatial', () => {
    test('displays the spatial on the minimap', async ({ page }) => {
      const conceptId = 'C1996546500-GHRC_DAAC'
      const cmrHits = 8180
      const granuleHits = 6338

      // The minim-map is coming from `static/src/assets/images/plate_carree_earth_scaled@2x.png` stored locally in the component
      await page.route('**/*.{/^(?!.*plate_carree_earth_scaled@2x.png$).*.png$/,jpg,jpeg}', (route) => route.abort())

      await page.route(/collections.json/, async (route) => {
        const query = route.request().postData()
        expect(query).toEqual('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&sort_key[]=has_granules_or_cwic&sort_key[]=-score')

        await route.fulfill({
          json: collectionsBody,
          headers: {
            ...commonHeaders,
            'cmr-hits': cmrHits.toString()
          }
        })
      })

      await page.route(/granules.json/, async (route) => {
        const query = route.request().postData()
        expect(query).toEqual('echo_collection_id=C1996546500-GHRC_DAAC&page_num=1&page_size=20')

        await route.fulfill({
          json: reformattingsGranulesBody,
          headers: {
            ...commonHeaders,
            'cmr-hits': granuleHits.toString()
          }
        })
      })

      await page.route(/graphql/, async (route) => {
        const { query } = JSON.parse(route.request().postData())

        if (query === graphQlGetSubscriptionsQuery) {
          await route.fulfill({
            json: getSubscriptionsGraphQlBody,
            headers: graphQlHeaders
          })
        }

        if (query === JSON.parse(graphQlGetCollection(conceptId)).query) {
          await route.fulfill({
            json: reformattingGraphQlBody,
            headers: graphQlHeaders
          })
        }
      })

      await page.goto('/search/granules/collection-details?p=C1996546500-GHRC_DAAC')

      // Use regex here to account for small differences between browsers and flakiness with the tests on CI
      await expect(page.locator('.collection-details-minimap .leaflet-interactive')).toHaveAttribute('d', /M0 180L360 180L360 0L0/)
    })
  })
})
