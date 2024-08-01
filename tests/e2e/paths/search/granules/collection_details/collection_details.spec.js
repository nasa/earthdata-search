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
const testCollectionTitle = (page, title) => {
  const panelGroupGranuleResults = page.getByTestId('panel-group_granule-results')

  const panelText = panelGroupGranuleResults
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
  const panelGroupCollectionsResults = page.getByTestId('panel-group_granules-collections-results')
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
  const infoSection = page.getByTestId('collection-details-body__info-science-keywords')

  // Check the number of science keywords
  const keywordsList = infoSection.locator('.collection-details-body__keywords')
  await expect(keywordsList.locator('li')).toHaveCount(count)

  // Check the values of the science keywords
  for (let keywordIndex = 0; keywordIndex < keywords.length; keywordIndex += 1) {
    const keyword = keywords[keywordIndex]
    const keywordList = keywordsList.locator('li > ul').nth(keywordIndex)

    for (let partIndex = 0; partIndex < keyword.length; partIndex += 1) {
      const keywordPart = keyword[partIndex]
      expect(keywordList.locator('li').nth(partIndex)).toHaveText(keywordPart)
    }
  }
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
      // TODO move globally
      await page.route('**/*.{png,jpg,jpeg}', (route) => route.abort())

      const conceptId = 'C1240222820-ECHO_REST'
      const cmrHits = 12345
      const granuleHits = 100

      // Const authHeaders = getAuthHeaders()

      await page.route(/collections.json/, async (route) => {
        await route.fulfill({
          json: collectionsBody.body,
          headers: {
            ...commonHeaders,
            'cmr-hits': cmrHits.toString()
          }
        })
      })

      // TODO Granule hits 0?
      await page.route(/granules.json/, async (route) => {
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

        if (query === graphQlGetSubscriptionsQuery) {
          await route.fulfill({
            json: getSubscriptionsGraphQlBody,
            headers: graphQlHeaders
          })
        }

        if (query === JSON.parse(graphQlGetCollection(conceptId)).query) {
          await route.fulfill({
            json: assocatedDoisGraphQlBody,
            headers: graphQlHeaders
          })
        }
      })

      await page.goto('/search/granules/collection-details?p=C1240222820-ECHO_REST&ee=uat&ac=true')
      login(context)

      // Ensure title renders on page correctly
      const title = 'Mapping Example for UMM-C 1.16.1'

      testCollectionTitle(page, title)

      // Ensure short-name, version are present
      const shortName = 'Mapping Short Name 1.16.1'
      expect(page.getByTestId('collection-details-header__short-name').filter({ hasText: shortName })).toBeVisible()
      const version = 'Version 1.16.1'
      expect(page.getByTestId('collection-details-header__version-id').filter({ hasText: version })).toBeVisible()

      const temporalSpan = '2001-01-01 to 2001-06-01'
      const collectionTemporalSpane = page.getByTestId('collection-details-body__info-temporal')
        .filter({ hasText: temporalSpan })
      expect(collectionTemporalSpane).toBeVisible()

      // Ensure that the collections request ocurred and the component is displaying the correct results
      testCollectionResults(page, cmrHits)
      // Expect(page.getByRole('list').length).toBe(2)

      // expect(await page
      //   .getByRole('listitem')
      //   .filter({ hasText: 'Terrestrial Hydrosphere' })
      //   .first())
      //   .toBeVisible()

      // // Expect(page.getByText('Earth Science')).toBeVisible()
      // expect(await page
      //   .getByRole('listitem')
      //   .filter({ hasText: 'Cryosphere' })
      //   .first())
      //   .toBeVisible()

      // // Expect(page.getByText('Earth Science')).toBeVisible()
      // expect(await page
      //   .getByRole('listitem')
      //   .filter({ hasText: 'Snow Ice' })
      //   .count())
      //   .toBe(2)

      // expect(await page
      //   .getByRole('listitem')
      //   .filter({ hasText: 'Earth Science' })
      //   .count())
      //   .toBe(2)

      // const listItems = await page.getByRole('list').locator('li')
      // console.log('🚀 ~ file: collection_details.spec.js:141 ~ test ~ listItems:', listItems)
      // const listLength = await listItems.count()
      // expect(listLength).toBe(12)
      // TODO this is 8 because things are being counted multiple times over
      testCollectionScienceKeywords(page, 8, [
        ['Earth Science', 'Terrestrial Hydrosphere', 'Snow Ice'],
        ['Earth Science', 'Cryosphere', 'Snow Ice']
      ])

      // Test cloud distribution
      expect(await page
        .getByTestId('direct-distribution-information__cloud-access__region'))
        .toHaveText('us-east-2')

      expect(await page
        .getByTestId('direct-distribution-information__cloud-access__bucket-name'))
        .toHaveText('TestBucketOrObjectPrefix')

      // Expect(page.getByRole('listitem', { name: 'Earth Science' })).toBeVisible()
      // expect(page.getByRole('listitem', { name: 'Terrestrial Hydrosphere' })).toBeVisible()
      // expect(page.getByRole('listitem', { name: 'Snow Ice' })).toBeVisible()

      // 2, [
      //   ['Earth Science', 'Terrestrial Hydrosphere', 'Snow Ice'],
      //   ['Earth Science', 'Cryosphere', 'Snow Ice']
      // ]

      // Await expect(page.getByTestId('panel-group-header__heading-primary')).toHaveText(title)
      // Cy.intercept(
      //   {
      //     method: 'POST',
      //     url: '**/collections'
      //   },
      //   (req) => {
      //     expect(JSON.parse(req.body).params).to.eql({
      //       consortium: [],
      //       include_facets: 'v2',
      //       include_granule_counts: true,
      //       include_has_granules: true,
      //       include_tags: 'edsc.*,opensearch.granule.osdd',
      //       options: {},
      //       page_num: 1,
      //       page_size: 20,
      //       service_type: [],
      //       sort_key: [
      //         '-usage_score'
      //       ],
      //       tag_key: []
      //     })

      //     req.reply({
      //       body: collectionsBody,
      //       headers: {
      //         ...commonHeaders,
      //         'cmr-hits': cmrHits.toString()
      //       }
      //     })
      //   }
      // )

      // cy.intercept(
      //   {
      //     method: 'POST',
      //     url: '**/granules'
      //   },
      //   (req) => {
      //     expect(JSON.parse(req.body).params).to.eql({
      //       concept_id: [],
      //       echo_collection_id: 'C1240222820-ECHO_REST',
      //       exclude: {},
      //       options: {},
      //       page_num: 1,
      //       page_size: 20,
      //       two_d_coordinate_system: {}
      //     })

      //     req.reply({
      //       body: associatedDoisGranulesBody,
      //       headers: {
      //         ...commonHeaders,
      //         'cmr-hits': granuleHits.toString()
      //       }
      //     })
      //   }
      // )

      // cy.intercept(
      //   {
      //     method: 'POST',
      //     url: '**/graphql'
      //   },
      //   (req) => {
      //     if (JSON.parse(req.body).data.query === graphQlGetSubscriptionsQuery) {
      //       req.alias = 'graphQlSubscriptionsQuery'
      //       req.reply({
      //         body: getSubscriptionsGraphQlBody,
      //         headers: graphQlHeaders
      //       })
      //     }

      //     if (
      //       JSON.parse(req.body).data.query === JSON.parse(graphQlGetCollection(conceptId)).query
      //     ) {
      //       req.alias = 'graphQlCollectionQuery'
      //       req.reply({
      //         body: assocatedDoisGraphQlBody,
      //         headers: graphQlHeaders
      //       })
      //     }
      //   }
      // )

      // Cy.visit('/search/granules/collection-details?p=C1240222820-ECHO_REST&ee=uat&ac=true')
      // cy.wait('@graphQlSubscriptionsQuery')
      // cy.wait('@graphQlCollectionQuery')

      // testCollectionTitle('Mapping Example for UMM-C 1.16.1')

      // getByTestId('collection-details-header__short-name').should('have.text', 'Mapping Short Name 1.16.1')
      // getByTestId('collection-details-header__version-id').should('have.text', 'Version 1.16.1')

      // // Ensure that the collections request ocurred and the component is displaying the correct results
      // testCollectionResults(cmrHits)

      // testCollectionTemporal('2001-01-01 to 2001-06-01')

      // testCollectionGibsProjections('None')

      // testCollectionScienceKeywords(2, [
      //   ['Earth Science', 'Terrestrial Hydrosphere', 'Snow Ice'],
      //   ['Earth Science', 'Cryosphere', 'Snow Ice']
      // ])

      // getByTestId('collection-details-body__provider-list').children().should('have.length', 4)

      // testCollectionCloudAccessDetails('us-east-2', 'TestBucketOrObjectPrefix')
    })
  })

  test.describe('When collection has multiple reformatting options', () => {
    test('loads correctly', async ({ page }) => {
      // TODO move globally
      await page.route('**/*.{png,jpg,jpeg}', (route) => route.abort())
      const conceptId = 'C1996546500-GHRC_DAAC'
      const cmrHits = 8180
      const granuleHits = 6338
      // TODO do we need the .body
      await page.route(/collections.json/, async (route) => {
        await route.fulfill({
          json: collectionsBody,
          headers: {
            ...commonHeaders,
            'cmr-hits': cmrHits.toString()
          }
        })
      })

      await page.route(/granules.json/, async (route) => {
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
      const collectionTitle = 'RSS SSMIS OCEAN PRODUCT GRIDS DAILY FROM DMSP F16 NETCDF V7'
      // Expect(page.getByTitle(collectionTitle)).toBeVisible()
      // TODO why do these have to be first etc
      expect(page.getByRole('heading', { name: collectionTitle }).first()).toBeVisible()

      // Ensure short-name, version are present
      const shortName = 'rssmif16d'
      expect(page.getByTestId('collection-details-header__short-name').filter({ hasText: shortName })).toBeVisible()
      const version = 'Version 7'
      expect(page.getByTestId('collection-details-header__version-id').filter({ hasText: version })).toBeVisible()

      // Ensure that the collections request ocurred and the component is displaying the correct results
      const searchResultsCollectionsText = `Search Results (${commafy(cmrHits)} ${pluralize('Collection', cmrHits)})`
      const panelGroupCollectionsResults = page.getByTestId('panel-group_granules-collections-results')
      const panelCollectionText = await panelGroupCollectionsResults
        .filter({ has: page.getByTestId('panel-group-header__breadcrumbs') })
        .filter({ hasText: searchResultsCollectionsText })
      expect(panelCollectionText).toBeVisible()

      // Granules sidebar
      // TODO continue for now but, this does not actually render it on the screen oddly
      testGranulesSidebar(page, 5, granuleHits)

      // Check temporal time
      const temporalSpan = '2003-10-26 ongoing'
      const collectionTemporalSpane = page.getByTestId('collection-details-body__info-temporal')
        .filter({ hasText: temporalSpan })
      expect(collectionTemporalSpane).toBeVisible()

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
      // TODO why is this different
      const totalCount = 24
      testCollectionScienceKeywords(page, totalCount, [
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
      // This test required us to make a call to the map (PNGs etc) which is problematic for isolated testing
      const conceptId = 'C1996546500-GHRC_DAAC'
      const cmrHits = 8180
      const granuleHits = 6338

      await page.route(/collections.json/, async (route) => {
        await route.fulfill({
          json: collectionsBody.body,
          headers: {
            ...commonHeaders,
            'cmr-hits': cmrHits.toString()
          }
        })
      })

      await page.route(/granules.json/, async (route) => {
        await route.fulfill({
          json: reformattingsGranulesBody.body,
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
      await expect(page.locator('.collection-details-minimap .leaflet-interactive')).toHaveAttribute('d', 'M0 180L360 180L360 0L0 0z')
    })
  })
})
