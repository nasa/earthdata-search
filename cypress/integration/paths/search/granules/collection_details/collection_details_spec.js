import { getByTestId } from '../../../../../support/getByTestId'
import { graphQlGetCollection } from '../../../../../support/graphQlGetCollection'

import { commafy } from '../../../../../../static/src/js/util/commafy'
import { pluralize } from '../../../../../../static/src/js/util/pluralize'

import assocatedDoisGraphQlBody from './__mocks__/associated_dois/graphql.body.json'
import collectionsBody from './__mocks__/common/collections.body.json'
import commonHeaders from './__mocks__/common/common.headers.json'
import associatedDoisGranulesBody from './__mocks__/associated_dois/granules.body.json'
import graphQlHeaders from './__mocks__/common/graphql.headers.json'
import reformattingGraphQlBody from './__mocks__/reformattings/graphql.body.json'
import reformattingsGranulesBody from './__mocks__/reformattings/granules.body.json'

/**
 * Tests the search panel header and meta text for results size
 * @param {Integer} cmrHits Total number of collections that match the query
 */
const testCollectionResults = (cmrHits) => {
  getByTestId('panel-group_granules-collections-results').within(() => {
    getByTestId('panel-group-header__breadcrumbs').should('have.text', `Search Results (${commafy(cmrHits)} ${pluralize('Collection', cmrHits)})`)
  })
}

/**
 * Tests the display of the cloud access details
 * @param {String} region The AWS region the data resides in
 * @param {String} bucketName The AWS bucket the data resides in
 */
const testCollectionCloudAccessDetails = (region, bucketName) => {
  getByTestId('collection-details-body__cloud-access__region').should('have.text', region)
  getByTestId('collection-details-body__cloud-access__bucket-name').should('have.text', bucketName)
}

/**
 * Test the display of the gibs projections in the collection details
 * @param {String} projections Projections supported by GIBS
 */
const testCollectionGibsProjections = (projections) => {
  getByTestId('collection-details-body__info-gibs-projections').within(() => {
    cy.get('dd').should('have.text', projections)
  })
}

/**
 * Test the display of the gibs projections in the collection details
 * @param {String} projections Projections supported by GIBS
 */
const testCollectionDataCenters = (dataCenters) => {
  getByTestId('collection-details-body__provider-list').within(() => {
    dataCenters.forEach((dataCenter, index) => {
      const {
        email,
        fax,
        telephone,
        role,
        title
      } = dataCenter

      getByTestId(`collection-details-data-center-${index}`).within(() => {
        if (!email && !fax && !telephone) {
          getByTestId('collection-details-data-center__no-contact-info').should('have.text', 'No contact information for this data center.')
        }

        if (email) getByTestId('collection-details-data-center__email').should('have.text', email)
        if (telephone) getByTestId('collection-details-data-center__telephone').should('have.text', telephone)
        if (fax) getByTestId('collection-details-data-center__fax').should('have.text', fax)

        getByTestId('collection-details-data-center__title').should('have.text', title)
        getByTestId('collection-details-data-center__role').should('have.text', role)
      })
    })
  })
}

/**
 * Test the display of native data formats in the collection details
 * @param {String} format Native data format belonging to the collection
 */
const testCollectionNativeDataFormats = (format) => {
  getByTestId('collection-details-body__info-native-data-formats').within(() => {
    cy.get('dd').should('have.text', format)
  })
}

/**
 * Test the display of native data formats in the collection details
 * @param {String} format Native data format belonging to the collection
 */
const testCollectionReformattingOptions = (reformattingOptions) => {
  getByTestId('collection-details-body__info-reformattings').within(() => {
    reformattingOptions.forEach((currentReformatting, index) => {
      const { input, outputs } = currentReformatting

      cy.get('.collection-details-body__reformatting-item').eq(index).within(() => {
        cy.get('.collection-details-body__reformatting-item-heading').should('have.text', input)
        cy.get('.collection-details-body__reformatting-item-body').should('have.text', outputs)
      })
    })
  })
}

/**
 * Test the display of science keywords in the collection details
 * @param {Integer} count Number of science keywords
 * @param {Array<Array>} keywords An array of array of strings representing science keywords
 */
const testCollectionScienceKeywords = (count, keywords) => {
  getByTestId('collection-details-body__info-science-keywords').within(() => {
    // Check the number of science keywords
    cy.get('.collection-details-body__keywords').children('li').should('have.length', count)

    // Check the values of the science keywords
    cy.get('.collection-details-body__keywords').children('li').within(() => {
      keywords.forEach((keyword, keywordIndex) => {
        keyword.forEach((keywordPart, partIndex) => {
          cy.get('li')
            .eq((keyword.length * keywordIndex) + partIndex)
            .should('have.text', keywordPart)
        })
      })
    })
  })
}

/**
 * Tests the temporal string displayed in the collection details
 * @param {String} temporal The temporal range of the collection represented as a string
 */
const testCollectionTemporal = (temporal) => {
  getByTestId('collection-details-body__info-temporal').within(() => {
    cy.get('dd').should('have.text', temporal)
  })
}

/**
 * Tests the title displayed in the collection details
 * @param {String} title Title of the collection being displayed
 */
const testCollectionTitle = (title) => {
  getByTestId('panel-group_granule-results').within(() => {
    getByTestId('panel-group-header__heading-primary').should('have.text', title)
  })
}

/**
 * Test the granules that appear in the sidebar of collection details
 * @param {Integer} pageSize Number of results per page
 * @param {Number} totalResults Total number of granules in the collection
 */
const testGranulesSidebar = (pageSize, totalResults) => {
  cy.get('.granule-results-highlights__count').should('have.text', `Showing ${pageSize} of ${commafy(totalResults)} matching granules`)
  cy.get('.granule-results-highlights__item').should('have.length', pageSize)
}

describe('Path /search/granules/collection-details', () => {
  describe('When collection has associated DOIs', () => {
    it('loads correctly', () => {
      const conceptId = 'C1240222820-ECHO_REST'
      const cmrHits = 19874
      const granuleHits = 0

      cy.login()

      cy.intercept({
        method: 'POST',
        url: '**/collections'
      },
      (req) => {
        expect(JSON.parse(req.body).params).to.eql({
          include_facets: 'v2',
          include_granule_counts: true,
          include_has_granules: true,
          include_tags: 'edsc.*,opensearch.granule.osdd',
          options: {
            science_keywords_h: {
              or: true
            },
            spatial: {
              or: true
            },
            temporal: {
              limit_to_granules: true
            }
          },
          page_num: 1,
          page_size: 20,
          service_type: [],
          sort_key: [
            'has_granules_or_cwic',
            '-usage_score'
          ],
          tag_key: []
        })

        req.reply({
          body: collectionsBody,
          headers: {
            ...commonHeaders,
            'cmr-hits': cmrHits.toString()
          }
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/granules'
      },
      (req) => {
        expect(JSON.parse(req.body).params).to.eql({
          concept_id: [],
          echo_collection_id: 'C1240222820-ECHO_REST',
          exclude: {},
          options: {
            spatial: {
              or: true
            }
          },
          page_num: 1,
          page_size: 20,
          two_d_coordinate_system: {}
        })

        req.reply({
          body: associatedDoisGranulesBody,
          headers: {
            ...commonHeaders,
            'cmr-hits': granuleHits.toString()
          }
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/graphql'
      },
      (req) => {
        expect(JSON.parse(req.body).data).to.eql(JSON.parse(graphQlGetCollection(conceptId)))

        req.reply({
          body: assocatedDoisGraphQlBody,
          headers: graphQlHeaders
        })
      })

      cy.visit('/search/granules/collection-details?p=C1240222820-ECHO_REST&ee=uat&ac=true')

      testCollectionTitle('Mapping Example for UMM-C 1.16.1')

      getByTestId('collection-details-header__short-name').should('have.text', 'Mapping Short Name 1.16.1')
      getByTestId('collection-details-header__version-id').should('have.text', 'Version 1.16.1')

      // Ensure that the collections request ocurred and the component is displaying the correct results
      testCollectionResults(cmrHits)

      testCollectionTemporal('2001-01-01 to 2001-06-01')

      testCollectionGibsProjections('None')

      testCollectionScienceKeywords(2, [
        ['Earth Science', 'Terrestrial Hydrosphere', 'Snow Ice'],
        ['Earth Science', 'Cryosphere', 'Snow Ice']
      ])

      getByTestId('collection-details-body__provider-list').children().should('have.length', 4)

      testCollectionCloudAccessDetails('us-east-2', 'TestBucketOrObjectPrefix')
    })
  })

  describe('When collection has multiple reformatting options', () => {
    it('loads correctly', () => {
      const conceptId = 'C1996546500-GHRC_DAAC'
      const cmrHits = 8180
      const granuleHits = 6338

      cy.intercept({
        method: 'POST',
        url: '**/search/collections.json'
      },
      (req) => {
        expect(req.body).to.eq('include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

        req.reply({
          body: collectionsBody,
          headers: {
            ...commonHeaders,
            'cmr-hits': cmrHits.toString()
          }
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/search/granules.json'
      },
      (req) => {
        expect(req.body).to.eq('echo_collection_id=C1996546500-GHRC_DAAC&options%5Bspatial%5D%5Bor%5D=true&page_num=1&page_size=20')

        req.reply({
          body: reformattingsGranulesBody,
          headers: {
            ...commonHeaders,
            'cmr-hits': granuleHits.toString()
          }
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/api'
      },
      (req) => {
        expect(req.body).to.eq(graphQlGetCollection(conceptId))

        req.reply({
          body: reformattingGraphQlBody,
          headers: graphQlHeaders
        })
      })

      cy.visit('/search/granules/collection-details?p=C1996546500-GHRC_DAAC')

      testCollectionTitle('RSS SSMIS OCEAN PRODUCT GRIDS DAILY FROM DMSP F16 NETCDF V7')

      getByTestId('collection-details-header__short-name').should('have.text', 'rssmif16d')
      getByTestId('collection-details-header__version-id').should('have.text', 'Version 7')

      // Ensure that the collections request ocurred and the component is displaying the correct results
      testCollectionResults(cmrHits)

      // Granules sidebar
      testGranulesSidebar(5, granuleHits)

      testCollectionTemporal('2003-10-26 ongoing')

      testCollectionNativeDataFormats('netCDF-4')

      testCollectionReformattingOptions([{
        input: 'NETCDF-4',
        outputs: 'ASCII, CSV, NETCDF-3, NETCDF-4'
      }, {
        input: 'HDF5',
        outputs: 'ASCII, CSV, NETCDF-3, NETCDF-4'
      }])

      testCollectionGibsProjections('Geographic')

      testCollectionScienceKeywords(6, [
        ['Earth Science', 'Spectral Engineering', 'Precipitation'],
        ['Earth Science', 'Oceans', 'Ocean Winds'],
        ['Earth Science', 'Atmosphere', 'Precipitation'],
        ['Earth Science', 'Atmosphere', 'Atmospheric Winds'],
        ['Earth Science', 'Atmosphere', 'Clouds'],
        ['Earth Science', 'Atmosphere', 'Atmospheric Water Vapor']
      ])

      getByTestId('collection-details-body__provider-list').children().should('have.length', 2)

      testCollectionDataCenters([{
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
})
