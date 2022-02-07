import { getByTestId } from '../../../support/getByTestId'

import { commafy } from '../../../../static/src/js/util/commafy'
import { getApplicationConfig } from '../../../../sharedUtils/config'
import { pluralize } from '../../../../static/src/js/util/pluralize'

import awsCloudBody from './__mocks__/aws_cloud.body.json'
import commonBody from './__mocks__/common.body.json'
import commonHeaders from './__mocks__/common.headers.json'
import customizableBody from './__mocks__/customizable.body.json'
import dataFormatBody from './__mocks__/data_format.body.json'
import eeBody from './__mocks__/ee.body.json'
import horizontalDataResolutionBody from './__mocks__/horizontal_data_resolution.body.json'
import instrumentsBody from './__mocks__/instruments.body.json'
import keywordBody from './__mocks__/keyword.body.json'
import keywordsBody from './__mocks__/keywords.body.json'
import mapImageryBody from './__mocks__/map_imagery.body.json'
import nearRealTimeBody from './__mocks__/near_real_time.body.json'
import noGranulesBody from './__mocks__/no_granules.body.json'
import nonEosdisBody from './__mocks__/non_eosdis.body.json'
import organizationsBody from './__mocks__/organizations.body.json'
import platformsBody from './__mocks__/platforms.body.json'
import processingLevelsBody from './__mocks__/processing_levels.body.json'
import projectsBody from './__mocks__/projects.body.json'
import spatialBoundingBoxBody from './__mocks__/spatial_bounding_box.body.json'
import spatialCircleBody from './__mocks__/spatial_circle.body.json'
import spatialPointBody from './__mocks__/spatial_point.body.json'
import spatialPolygonBody from './__mocks__/spatial_polygon.body.json'
import temporalBody from './__mocks__/temporal.body.json'
import temporalRecurringBody from './__mocks__/temporal_recurring.body.json'
import tilingSystemBody from './__mocks__/tiling_system.body.json'

const { defaultCmrPageSize } = getApplicationConfig()

/**
 * Test that the provided facet group is expanded and the others not
 * @param {String} facetGroup Name of the facet that should be expanded
 */
const testFacetGroupExistence = (facetGroup) => {
  getByTestId(`facet-${facetGroup}`).should('exist')

  const facetGroups = [
    'features',
    'keywords',
    'platforms',
    'instruments',
    'organizations',
    'projects',
    'processing-levels',
    'data-format',
    'tiling-system',
    'horizontal-data-resolution'
  ]

  facetGroups.filter((group) => group !== facetGroup).forEach((collapsedFacetGroup) => {
    getByTestId(`facet-${collapsedFacetGroup}`).should('not.exist')
  })
}

/**
 * Test that the provided facet group is dislaying the correct number of selected elements
 * @param {String} facetGroup Name of the facet that should have selected elements
 * @param {Number} selectedCount How many elements are selected within the facet group
 */
const testFacetGroupSelectedCount = (facetGroup, selectedCount) => {
  getByTestId(`facet_group-${facetGroup}`).get('.facets-group__selected-count').should('have.text', `${selectedCount} Selected`)
}

/**
 * Tests the search panel header and meta text for results size
 * @param {Integer} cmrHits Total number of collections that match the query
 */
const testResultsSize = (cmrHits) => {
  const expectedSize = Math.min(defaultCmrPageSize, cmrHits)

  getByTestId('panel-group_collection-results').within(() => {
    getByTestId('panel-group-header__heading-meta-text').should('have.text', `Showing ${expectedSize} of ${commafy(cmrHits)} matching ${pluralize('collection', cmrHits)}`)
  })

  getByTestId('panel-group_collection-results').within(() => {
    getByTestId('panel-group-header__heading-primary').should('have.text', `${commafy(cmrHits)} Matching ${pluralize('Collection', cmrHits)}`)
  })
}

describe('Path /search', () => {
  describe('When the path is loaded without any url params', () => {
    it('loads correctly', () => {
      const cmrHits = 8098

      cy.intercept({
        method: 'POST',
        url: '**/search/collections.json'
      },
      (req) => {
        expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

        req.reply({
          body: commonBody,
          headers: {
            ...commonHeaders,
            'cmr-hits': cmrHits.toString()
          }
        })
      })

      cy.visit('/search')

      // Ensure the correct number of results were loaded
      testResultsSize(cmrHits)

      // Keyword input is empty
      getByTestId('keyword-search-input').should('have.value', '')

      // Ensure facet group bodies are shown correctly
      testFacetGroupExistence('features')
    })
  })

  describe('When the path is loaded with a keyword query', () => {
    it('loads with the keyword query populated', () => {
      const cmrHits = 1248

      cy.intercept({
        method: 'POST',
        url: '**/search/collections.json'
      },
      (req) => {
        expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&keyword=modis%2A&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

        req.reply({
          body: keywordBody,
          headers: {
            ...commonHeaders,
            'cmr-hits': cmrHits.toString()
          }
        })
      })

      cy.visit('/search?q=modis')

      // Ensure the correct number of results were loaded
      testResultsSize(cmrHits)

      // Keyword input is populated
      getByTestId('keyword-search-input').should('have.value', 'modis')

      // Ensure facet group bodies are shown correctly
      testFacetGroupExistence('features')
    })
  })

  describe('When the path is loaded with a temporal query', () => {
    describe('When the temporal range is not recurring', () => {
      it('loads with the temporal query applied', () => {
        const cmrHits = 2434

        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&temporal=2020-01-01T00%3A00%3A00.000Z%2C2021-01-01T23%3A59%3A59.999Z&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

          req.reply({
            body: temporalBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': cmrHits.toString()
            }
          })
        })

        cy.visit('/search?qt=2020-01-01T00%3A00%3A00.000Z%2C2021-01-01T23%3A59%3A59.999Z')

        // Ensure the correct number of results were loaded
        testResultsSize(cmrHits)

        // Keyword input is empty
        getByTestId('keyword-search-input').should('have.value', '')

        // Ensure facet group bodies are shown correctly
        testFacetGroupExistence('features')

        cy.get('.filter-stack-contents__body').first().should('have.text', '2020-01-01 00:00:00')
        cy.get('.filter-stack-contents__body').last().should('have.text', '2021-01-01 23:59:59')
      })
    })

    describe('When the temporal range is recurring', () => {
      it('loads with the temporal query applied', () => {
        const cmrHits = 5521

        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&temporal=2000-01-01T00%3A00%3A00.000Z%2C2021-01-31T23%3A59%3A59.999Z%2C1%2C31&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

          req.reply({
            body: temporalRecurringBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': cmrHits.toString()
            }
          })
        })

        cy.visit('/search?qt=2000-01-01T00%3A00%3A00.000Z%2C2021-01-31T23%3A59%3A59.999Z%2C1%2C31')

        // Ensure the correct number of results were loaded
        testResultsSize(cmrHits)

        // Keyword input is empty
        getByTestId('keyword-search-input').should('have.value', '')

        // Ensure facet group bodies are shown correctly
        testFacetGroupExistence('features')

        cy.get('.filter-stack-contents__body').first().should('have.text', '01-01 00:00:00')
        cy.get('.filter-stack-contents__body').eq(1).should('have.text', '01-31 23:59:59')
        cy.get('.filter-stack-contents__body').last().should('have.text', '2000 - 2021')
      })
    })
  })

  describe('When the path is loaded with a spatial query', () => {
    describe('When the spatial query is a point', () => {
      it('loads with the spatial query applied', () => {
        const cmrHits = 5079

        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&point%5B%5D=65.44171%2C4.33676&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

          req.reply({
            body: spatialPointBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': cmrHits.toString()
            }
          })
        })

        cy.visit('/search?sp[0]=65.44171%2C4.33676')

        // Ensure the correct number of results were loaded
        testResultsSize(cmrHits)

        // Keyword input is empty
        getByTestId('keyword-search-input').should('have.value', '')

        // Ensure facet group bodies are shown correctly
        testFacetGroupExistence('features')

        getByTestId('spatial-display_point').should('have.value', '4.33676,65.44171')

        // Test leaflet has drawn the shape correctly
        cy.get('.leaflet-marker-pane img').should('have.attr', 'style', 'margin-left: -12px; margin-top: -41px; width: 25px; height: 41px; transform: translate3d(1165px, 402px, 0px); z-index: 402;')
      })
    })

    describe('When the spatial query is a polygon', () => {
      it('loads with the spatial query applied', () => {
        const cmrHits = 5133

        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&polygon%5B%5D=64.87748%2C1.3704%2C59.34354%2C-9.21839%2C78.35163%2C-11.89902%2C64.87748%2C1.3704&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

          req.reply({
            body: spatialPolygonBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': cmrHits.toString()
            }
          })
        })

        cy.visit('/search?polygon[0]=64.87748%2C1.3704%2C59.34354%2C-9.21839%2C78.35163%2C-11.89902%2C64.87748%2C1.3704')

        // Ensure the correct number of results were loaded
        testResultsSize(cmrHits)

        // Keyword input is empty
        getByTestId('keyword-search-input').should('have.value', '')

        // Ensure facet group bodies are shown correctly
        testFacetGroupExistence('features')

        getByTestId('spatial-display_polygon').should('have.text', '3 Points')

        // Test leaflet has drawn the shape correctly
        cy.get('.leaflet-interactive').should('have.attr', 'd', 'M1161 423L1122 499L1257 518L1161 423z')
      })
    })

    describe('When the spatial query is a circle', () => {
      it('loads with the spatial query applied', () => {
        const cmrHits = 5080

        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&circle%5B%5D=62.18209%2C2.22154%2C100000&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

          req.reply({
            body: spatialCircleBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': cmrHits.toString()
            }
          })
        })

        cy.visit('/search?circle[0]=62.18209%2C2.22154%2C100000')

        // Ensure the correct number of results were loaded
        testResultsSize(cmrHits)

        // Keyword input is empty
        getByTestId('keyword-search-input').should('have.value', '')

        // Ensure facet group bodies are shown correctly
        testFacetGroupExistence('features')

        getByTestId('spatial-display_circle-center').should('have.value', '2.22154,62.18209')
        getByTestId('spatial-display_circle-radius').should('have.value', '100000')

        // Test leaflet has drawn the shape correctly
        cy.get('.leaflet-interactive').should('have.attr', 'd', 'M1136.1837511111112,417.20238222222224a6,6 0 1,0 12,0 a6,6 0 1,0 -12,0 ')
      })
    })

    describe('When the spatial query is a bounding box', () => {
      it('loads with the spatial query applied', () => {
        const cmrHits = 5209

        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&bounding_box%5B%5D=5.02679%2C0.99949%2C32.8678%2C26.17555&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

          req.reply({
            body: spatialBoundingBoxBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': cmrHits.toString()
            }
          })
        })

        cy.visit('/search?sb[0]=5.02679%2C0.99949%2C32.8678%2C26.17555')

        // Ensure the correct number of results were loaded
        testResultsSize(cmrHits)

        // Keyword input is empty
        getByTestId('keyword-search-input').should('have.value', '')

        // Ensure facet group bodies are shown correctly
        testFacetGroupExistence('features')

        getByTestId('spatial-display_southwest-point').should('have.value', '0.99949,5.02679')
        getByTestId('spatial-display_northeast-point').should('have.value', '26.17555,32.8678')

        // Test leaflet has drawn the shape correctly
        cy.get('.leaflet-interactive').should('have.attr', 'd', 'M736 426L736 247L934 247L934 426L736 426z')
      })
    })

    describe('When the spatial query is a shapefile', () => {
      it('loads with the spatial query applied', () => {
        const cmrHits = 5133

        // Retrieve the shapefile from lambda
        cy.intercept('**/shapefiles/123', {
          body: {
            file: {
              type: 'FeatureCollection',
              features: [{
                type: 'Feature', id: 'simple-id', properties: { id: 'simple-id', prop0: 'value0', prop1: { this: 'that' } }, geometry: { type: 'Polygon', coordinates: [[[64.87748, 1.3704], [59.34354, -9.21839], [78.35163, -11.89902], [64.87748, 1.3704]]] }
              }]
            },
            shapefileName: 'test.geojson'
          }
        })

        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          // TODO: This intercept is called twice, the first time is cancelled because a new request is launched after the shapefile polygon is added. How do we only run this expect on the second run?
          // expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&polygon%5B%5D=59.34354%2C-9.21839%2C78.35163%2C-11.89902%2C64.87748%2C1.3704%2C59.34354%2C-9.21839&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

          req.reply({
            body: spatialPolygonBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': cmrHits.toString()
            }
          })
        })

        cy.visit('/search?sf=123')

        // Ensure the correct number of results were loaded
        testResultsSize(cmrHits)

        // URL has the polygon added from the shapefile
        cy.url().should('include', '?polygon[0]=59.34354%2C-9.21839%2C78.35163%2C-11.89902%2C64.87748%2C1.3704%2C59.34354%2C-9.21839&sf=123&sfs[0]=0')

        // Keyword input is empty
        getByTestId('keyword-search-input').should('have.value', '')

        // Ensure facet group bodies are shown correctly
        testFacetGroupExistence('features')

        getByTestId('spatial-display_shapefile-name').should('have.text', 'test.geojson')
        getByTestId('filter-stack-item__hint').should('have.text', '1 shape selected')

        // Test leaflet has drawn the shape correctly
        cy.get('.leaflet-interactive').should('have.attr', 'd', 'M1161 423L1122 499L1257 518L1161 423z')
      })
    })
  })

  describe('Feature Facets Group', () => {
    describe('When the path is loaded with the `Available from AWS Cloud` feature facet param', () => {
      it('loads with the feature facet applied', () => {
        const cmrHits = 720

        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('cloud_hosted=true&has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

          req.reply({
            body: awsCloudBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': cmrHits.toString()
            }
          })
        })

        cy.visit('/search?ff=Available%20from%20AWS%20Cloud')

        // Ensure the correct number of results were loaded
        testResultsSize(cmrHits)

        // Ensure that the correct feature facets are selected
        getByTestId('facet_item-available-from-aws-cloud').should('be.checked')
        getByTestId('facet_item-customizable').should('be.not.checked')
        getByTestId('facet_item-map-imagery').should('be.not.checked')
        getByTestId('facet_item-near-real-time').should('be.not.checked')

        // Keyword input is empty
        getByTestId('keyword-search-input').should('have.value', '')

        // Ensure facet group bodies are shown correctly
        testFacetGroupExistence('features')
      })
    })

    describe('When the path is loaded with the `Customizable` feature facet param', () => {
      it('loads with the feature facet applied', () => {
        const cmrHits = 233

        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score&service_type%5B%5D=esi&service_type%5B%5D=opendap&service_type%5B%5D=harmony')

          req.reply({
            body: customizableBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': cmrHits.toString()
            }
          })
        })

        cy.visit('/search?ff=Customizable')

        // Ensure the correct number of results were loaded
        testResultsSize(cmrHits)

        // Ensure that the correct feature facets are selected
        getByTestId('facet_item-available-from-aws-cloud').should('not.be.checked')
        getByTestId('facet_item-customizable').should('be.checked')
        getByTestId('facet_item-map-imagery').should('be.not.checked')
        getByTestId('facet_item-near-real-time').should('be.not.checked')

        // Keyword input is empty
        getByTestId('keyword-search-input').should('have.value', '')

        // Ensure facet group bodies are shown correctly
        testFacetGroupExistence('features')
      })
    })

    describe('When the path is loaded with the `Map Imagery` feature facet param', () => {
      it('loads with the feature facet applied', () => {
        const cmrHits = 394

        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score&tag_key%5B%5D=edsc.extra.serverless.gibs')

          req.reply({
            body: mapImageryBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': cmrHits.toString()
            }
          })
        })

        cy.visit('/search?ff=Map%20Imagery')

        // Ensure the correct number of results were loaded
        testResultsSize(cmrHits)

        // Ensure that the correct feature facets are selected
        getByTestId('facet_item-available-from-aws-cloud').should('not.be.checked')
        getByTestId('facet_item-customizable').should('be.not.checked')
        getByTestId('facet_item-map-imagery').should('be.checked')
        getByTestId('facet_item-near-real-time').should('be.not.checked')

        // Keyword input is empty
        getByTestId('keyword-search-input').should('have.value', '')

        // Ensure facet group bodies are shown correctly
        testFacetGroupExistence('features')
      })
    })

    describe('When the path is loaded with the `Near Real Time` feature facet param', () => {
      it('loads with the feature facet applied', () => {
        const cmrHits = 228

        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&collection_data_type%5B%5D=NEAR_REAL_TIME&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

          req.reply({
            body: nearRealTimeBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': cmrHits.toString()
            }
          })
        })

        cy.visit('/search?ff=Near%20Real%20Time')

        // Ensure the correct number of results were loaded
        testResultsSize(cmrHits)

        // Ensure that the correct feature facets are selected
        getByTestId('facet_item-available-from-aws-cloud').should('not.be.checked')
        getByTestId('facet_item-customizable').should('be.not.checked')
        getByTestId('facet_item-map-imagery').should('be.not.checked')
        getByTestId('facet_item-near-real-time').should('be.checked')

        // Keyword input is empty
        getByTestId('keyword-search-input').should('have.value', '')

        // Ensure facet group bodies are shown correctly
        testFacetGroupExistence('features')
      })
    })
  })

  describe('Keywords Facets Group', () => {
    describe('When the path is loaded with the `Aerosols` keywords param', () => {
      it('loads with the facet applied', () => {
        const cmrHits = 1

        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&science_keywords_h%5B0%5D%5Btopic%5D=Aerosols&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

          req.reply({
            body: keywordsBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': cmrHits.toString()
            }
          })
        })

        cy.visit('/search?fst0=Aerosols')

        // Ensure the correct number of results were loaded
        testResultsSize(cmrHits)

        // Ensure the number of selected elements is displayed correctly
        testFacetGroupSelectedCount('keywords', 1)

        // Ensure that the correct feature facets are selected
        getByTestId('facet_item-available-from-aws-cloud').should('be.not.checked')
        getByTestId('facet_item-customizable').should('be.not.checked')
        getByTestId('facet_item-map-imagery').should('be.not.checked')
        getByTestId('facet_item-near-real-time').should('be.not.checked')

        // Keyword input is empty
        getByTestId('keyword-search-input').should('have.value', '')

        // Ensure facet group bodies are shown correctly
        testFacetGroupExistence('features')

        // Ensure the facet is selected
        getByTestId('facet_group-keywords').click()
        cy.contains('Aerosols').get('[type="checkbox"]').should('be.checked')
      })
    })
  })

  describe('Platforms Facets Group', () => {
    describe('When the path is loaded with the `AIRCRAFT` platforms param', () => {
      it('loads with the facet applied', () => {
        const cmrHits = 108

        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&platform_h%5B%5D=AIRCRAFT&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

          req.reply({
            body: platformsBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': cmrHits.toString()
            }
          })
        })

        cy.visit('/search?fp=AIRCRAFT')

        // Ensure the correct number of results were loaded
        testResultsSize(cmrHits)

        // Ensure the number of selected elements is displayed correctly
        testFacetGroupSelectedCount('platforms', 1)

        // Ensure that the correct feature facets are selected
        getByTestId('facet_item-available-from-aws-cloud').should('be.not.checked')
        getByTestId('facet_item-customizable').should('be.not.checked')
        getByTestId('facet_item-map-imagery').should('be.not.checked')
        getByTestId('facet_item-near-real-time').should('be.not.checked')

        // Keyword input is empty
        getByTestId('keyword-search-input').should('have.value', '')

        // Ensure facet group bodies are shown correctly
        testFacetGroupExistence('features')

        // Ensure the facet is selected
        getByTestId('facet_group-platforms').click()
        cy.contains('AIRCRAFT').get('[type="checkbox"]').should('be.checked')
      })
    })
  })

  describe('Instruments Facets Group', () => {
    describe('When the path is loaded with the `AIRS` instruments param', () => {
      it('loads with the facet applied', () => {
        const cmrHits = 104

        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

          req.reply({
            body: instrumentsBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': cmrHits.toString()
            }
          })
        })

        cy.visit('/search?ffi=AIRS')

        // Ensure the correct number of results were loaded
        testResultsSize(cmrHits)

        // Ensure the number of selected elements is displayed correctly
        testFacetGroupSelectedCount('instruments', 1)

        // Ensure that the correct feature facets are selected
        getByTestId('facet_item-available-from-aws-cloud').should('be.not.checked')
        getByTestId('facet_item-customizable').should('be.not.checked')
        getByTestId('facet_item-map-imagery').should('be.not.checked')
        getByTestId('facet_item-near-real-time').should('be.not.checked')

        // Keyword input is empty
        getByTestId('keyword-search-input').should('have.value', '')

        // Ensure facet group bodies are shown correctly
        testFacetGroupExistence('features')

        // Ensure the facet is selected
        getByTestId('facet_group-instruments').click()
        cy.contains('AIRS').get('[type="checkbox"]').should('be.checked')
      })
    })
  })

  describe('Organizations Facets Group', () => {
    describe('When the path is loaded with the `Alaska Satellite Facility` organizations param', () => {
      it('loads with the facet applied', () => {
        const cmrHits = 128

        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&data_center_h%5B%5D=Alaska%20Satellite%20Facility&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

          req.reply({
            body: organizationsBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': cmrHits.toString()
            }
          })
        })

        cy.visit('/search?fdc=Alaska%20Satellite%20Facility')

        // Ensure the correct number of results were loaded
        testResultsSize(cmrHits)

        // Ensure the number of selected elements is displayed correctly
        testFacetGroupSelectedCount('organizations', 1)

        // Ensure that the correct feature facets are selected
        getByTestId('facet_item-available-from-aws-cloud').should('be.not.checked')
        getByTestId('facet_item-customizable').should('be.not.checked')
        getByTestId('facet_item-map-imagery').should('be.not.checked')
        getByTestId('facet_item-near-real-time').should('be.not.checked')

        // Keyword input is empty
        getByTestId('keyword-search-input').should('have.value', '')

        // Ensure facet group bodies are shown correctly
        testFacetGroupExistence('features')

        // Ensure the facet is selected
        getByTestId('facet_group-organizations').click()
        cy.contains('Alaska Satellite Facility').get('[type="checkbox"]').should('be.checked')
      })
    })
  })

  describe('Projects Facets Group', () => {
    describe('When the path is loaded with the `ABoVE` projects param', () => {
      it('loads with the facet applied', () => {
        const cmrHits = 175

        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&project_h%5B%5D=ABoVE&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

          req.reply({
            body: projectsBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': cmrHits.toString()
            }
          })
        })

        cy.visit('/search?fpj=ABoVE')

        // Ensure the correct number of results were loaded
        testResultsSize(cmrHits)

        // Ensure the number of selected elements is displayed correctly
        testFacetGroupSelectedCount('projects', 1)

        // Ensure that the correct feature facets are selected
        getByTestId('facet_item-available-from-aws-cloud').should('be.not.checked')
        getByTestId('facet_item-customizable').should('be.not.checked')
        getByTestId('facet_item-map-imagery').should('be.not.checked')
        getByTestId('facet_item-near-real-time').should('be.not.checked')

        // Keyword input is empty
        getByTestId('keyword-search-input').should('have.value', '')

        // Ensure facet group bodies are shown correctly
        testFacetGroupExistence('features')

        // Ensure the facet is selected
        getByTestId('facet_group-projects').click()
        cy.contains('ABoVE').get('[type="checkbox"]').should('be.checked')
      })
    })
  })

  describe('Processing Levels Facets Group', () => {
    describe('When the path is loaded with the `0 - Raw Data` processing levels param', () => {
      it('loads with the facet applied', () => {
        const cmrHits = 50

        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&processing_level_id_h%5B%5D=0%20-%20Raw%20Data&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

          req.reply({
            body: processingLevelsBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': cmrHits.toString()
            }
          })
        })

        cy.visit('/search?fl=0%20-%20Raw%20Data')

        // Ensure the correct number of results were loaded
        testResultsSize(cmrHits)

        // Ensure the number of selected elements is displayed correctly
        testFacetGroupSelectedCount('processing-levels', 1)

        // Ensure that the correct feature facets are selected
        getByTestId('facet_item-available-from-aws-cloud').should('be.not.checked')
        getByTestId('facet_item-customizable').should('be.not.checked')
        getByTestId('facet_item-map-imagery').should('be.not.checked')
        getByTestId('facet_item-near-real-time').should('be.not.checked')

        // Keyword input is empty
        getByTestId('keyword-search-input').should('have.value', '')

        // Ensure facet group bodies are shown correctly
        testFacetGroupExistence('features')

        // Ensure the facet is selected
        getByTestId('facet_group-processing-levels').click()
        cy.contains('0 - Raw Data').get('[type="checkbox"]').should('be.checked')
      })
    })
  })

  describe('Data Format Facets Group', () => {
    describe('When the path is loaded with the `ArcGIS` data format param', () => {
      it('loads with the facet applied', () => {
        const cmrHits = 5

        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&granule_data_format_h%5B%5D=ArcGIS&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

          req.reply({
            body: dataFormatBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': cmrHits.toString()
            }
          })
        })

        cy.visit('/search?gdf=ArcGIS')

        // Ensure the correct number of results were loaded
        testResultsSize(cmrHits)

        // Ensure the number of selected elements is displayed correctly
        testFacetGroupSelectedCount('data-format', 1)

        // Ensure that the correct feature facets are selected
        getByTestId('facet_item-available-from-aws-cloud').should('be.not.checked')
        getByTestId('facet_item-customizable').should('be.not.checked')
        getByTestId('facet_item-map-imagery').should('be.not.checked')
        getByTestId('facet_item-near-real-time').should('be.not.checked')

        // Keyword input is empty
        getByTestId('keyword-search-input').should('have.value', '')

        // Ensure facet group bodies are shown correctly
        testFacetGroupExistence('features')

        // Ensure the facet is selected
        getByTestId('facet_group-data-format').click()
        cy.contains('ArcGIS').get('[type="checkbox"]').should('be.checked')
      })
    })
  })

  describe('Tiling System Facets Group', () => {
    describe('When the path is loaded with the `CALIPSO` tiling system param', () => {
      it('loads with the facet applied', () => {
        const cmrHits = 69

        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score&two_d_coordinate_system_name%5B%5D=CALIPSO')

          req.reply({
            body: tilingSystemBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': cmrHits.toString()
            }
          })
        })

        cy.visit('/search?s2n=CALIPSO')

        // Ensure the correct number of results were loaded
        testResultsSize(cmrHits)

        // Ensure the number of selected elements is displayed correctly
        testFacetGroupSelectedCount('tiling-system', 1)

        // Ensure that the correct feature facets are selected
        getByTestId('facet_item-available-from-aws-cloud').should('be.not.checked')
        getByTestId('facet_item-customizable').should('be.not.checked')
        getByTestId('facet_item-map-imagery').should('be.not.checked')
        getByTestId('facet_item-near-real-time').should('be.not.checked')

        // Keyword input is empty
        getByTestId('keyword-search-input').should('have.value', '')

        // Ensure facet group bodies are shown correctly
        testFacetGroupExistence('features')

        // Ensure the facet is selected
        getByTestId('facet_group-tiling-system').click()
        cy.contains('CALIPSO').get('[type="checkbox"]').should('be.checked')
      })
    })
  })

  describe('Horizontal Data Resolution Facets Group', () => {
    describe('When the path is loaded with the `0 - 1 meter` horizontal data resolution param', () => {
      it('loads with the facet applied', () => {
        const cmrHits = 41

        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&horizontal_data_resolution_range%5B%5D=0%20to%201%20meter&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

          req.reply({
            body: horizontalDataResolutionBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': cmrHits.toString()
            }
          })
        })

        cy.visit('/search?hdr=0%20to%201%20meter')

        // Ensure the correct number of results were loaded
        testResultsSize(cmrHits)

        // Ensure the number of selected elements is displayed correctly
        testFacetGroupSelectedCount('horizontal-data-resolution', 1)

        // Ensure that the correct feature facets are selected
        getByTestId('facet_item-available-from-aws-cloud').should('be.not.checked')
        getByTestId('facet_item-customizable').should('be.not.checked')
        getByTestId('facet_item-map-imagery').should('be.not.checked')
        getByTestId('facet_item-near-real-time').should('be.not.checked')

        // Keyword input is empty
        getByTestId('keyword-search-input').should('have.value', '')

        // Ensure facet group bodies are shown correctly
        testFacetGroupExistence('features')

        // Ensure the facet is selected
        getByTestId('facet_group-horizontal-data-resolution').click()
        cy.contains('0 to 1 meter').get('[type="checkbox"]').should('be.checked')
      })
    })
  })

  describe('Collections without granules', () => {
    describe('When the path is loaded with the ac param', () => {
      it('loads with the checkbox selected', () => {
        const cmrHits = 28270

        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

          req.reply({
            body: noGranulesBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': cmrHits.toString()
            }
          })
        })

        cy.visit('/search?ac=true')

        // Ensure the correct number of results were loaded
        testResultsSize(cmrHits)

        // Ensure that the correct feature facets are selected
        getByTestId('facet_item-available-from-aws-cloud').should('be.not.checked')
        getByTestId('facet_item-customizable').should('be.not.checked')
        getByTestId('facet_item-map-imagery').should('be.not.checked')
        getByTestId('facet_item-near-real-time').should('be.not.checked')

        // Keyword input is empty
        getByTestId('keyword-search-input').should('have.value', '')

        // Ensure facet group bodies are shown correctly
        testFacetGroupExistence('features')

        // Ensure the correct checkbox is checked
        getByTestId('input_only-granules').should('be.checked')
      })
    })
  })

  describe('EOSDIS only collections', () => {
    describe('When the path is loaded with the tag_key param', () => {
      it('loads with the checkbox selected', () => {
        const cmrHits = 7704

        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score&tag_key%5B%5D=gov.nasa.eosdis')

          req.reply({
            body: nonEosdisBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': cmrHits.toString()
            }
          })
        })

        cy.visit('/search?tag_key=gov.nasa.eosdis')

        // Ensure the correct number of results were loaded
        testResultsSize(cmrHits)

        // Ensure that the correct feature facets are selected
        getByTestId('facet_item-available-from-aws-cloud').should('be.not.checked')
        getByTestId('facet_item-customizable').should('be.not.checked')
        getByTestId('facet_item-map-imagery').should('be.not.checked')
        getByTestId('facet_item-near-real-time').should('be.not.checked')

        // Keyword input is empty
        getByTestId('keyword-search-input').should('have.value', '')

        // Ensure facet group bodies are shown correctly
        testFacetGroupExistence('features')

        // Ensure the correct checkbox is checked
        getByTestId('input_non-eosdis').should('be.checked')
      })
    })
  })

  describe('When the path is loaded with an ee parameter', () => {
    it('loads in the correct environment', () => {
      const cmrHits = 6209

      cy.intercept({
        method: 'POST',
        url: '**/search/collections.json'
      },
      (req) => {
        expect(req.headers.host).to.eq('cmr.uat.earthdata.nasa.gov')

        req.reply({
          body: eeBody,
          headers: {
            ...commonHeaders,
            'cmr-hits': cmrHits.toString()
          }
        })
      })

      cy.visit('/search?ee=uat')

      // Ensure the correct number of results were loaded
      getByTestId('panel-group-header__heading-meta-text').should('have.text', 'Showing 20 of 6,209 matching collections')

      // Keyword input is empty
      getByTestId('keyword-search-input').should('have.value', '')

      // Ensure facet group bodies are shown correctly
      testFacetGroupExistence('features')
    })
  })
})
