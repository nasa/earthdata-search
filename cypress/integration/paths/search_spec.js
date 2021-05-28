import { getByTestId } from '../../support/getByTestId'

import awsCloudBody from './__mocks__/aws_cloud.body.json'
import commonBody from './__mocks__/common.body.json'
import commonHeaders from './__mocks__/common.headers.json'
import customizableBody from './__mocks__/customizable.body.json'
import dataFormatBody from './__mocks__/data_format.body.json'
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
import spatialBody from './__mocks__/spatial.body.json'
import temporalBody from './__mocks__/temporal.body.json'
import tilingSystemBody from './__mocks__/tiling_system.body.json'

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

  facetGroups.filter(group => group !== facetGroup).forEach((collapsedFacetGroup) => {
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

describe('Path /search', () => {
  describe('When the path is loaded without any url params', () => {
    it('loads correctly', () => {
      cy.intercept({
        method: 'POST',
        url: '**/search/collections.json'
      },
      (req) => {
        expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.extra.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

        req.reply({
          body: commonBody,
          headers: commonHeaders
        })
      })

      cy.visit('/search')

      // Keyword input is empty
      getByTestId('keyword-search-input').should('have.value', '')

      // Ensure facet group bodies are shown correctly
      testFacetGroupExistence('features')
    })
  })

  describe('When the path is loaded with a keyword query', () => {
    it('loads correctly', () => {
      cy.intercept({
        method: 'POST',
        url: '**/search/collections.json'
      },
      (req) => {
        expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.extra.%2A%2Copensearch.granule.osdd&keyword=modis%2A&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

        req.reply({
          body: keywordBody,
          headers: commonHeaders
        })
      })

      cy.visit('/search?q=modis')

      // Keyword input is populated
      getByTestId('keyword-search-input').should('have.value', 'modis')

      // Ensure facet group bodies are shown correctly
      testFacetGroupExistence('features')
    })
  })

  describe('When the path is loaded with a temporal query', () => {
    // TODO: Add test for recurring temporal range
    describe('When the temporal range is not recurring', () => {
      it('loads correctly', () => {
        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.extra.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&temporal=2020-01-01T00%3A00%3A00.000Z%2C2021-01-01T23%3A59%3A59.999Z&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

          req.reply({
            body: temporalBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '2434'
            }
          })
        })

        cy.visit('/search?qt=2020-01-01T00%3A00%3A00.000Z%2C2021-01-01T23%3A59%3A59.999Z')

        // Keyword input is empty
        getByTestId('keyword-search-input').should('have.value', '')

        // Ensure facet group bodies are shown correctly
        testFacetGroupExistence('features')

        cy.get('.filter-stack-contents__body').first().should('have.text', '2020-01-01 00:00:00')
        cy.get('.filter-stack-contents__body').last().should('have.text', '2021-01-01 23:59:59')
      })
    })
  })

  describe('When the path is loaded with a spatial query', () => {
    // TODO: Add test for point
    // TODO: Add test for polygon
    // TODO: Add test for circle
    // TODO: Add test for shapefile
    describe('When the spatial query is a bounding box', () => {
      it('loads correctly', () => {
        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.extra.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&bounding_box%5B%5D=5.02679%2C0.99949%2C32.8678%2C26.17555&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

          req.reply({
            body: spatialBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5,209'
            }
          })
        })

        cy.visit('/search?sb[0]=5.02679%2C0.99949%2C32.8678%2C26.17555')

        // Keyword input is empty
        getByTestId('keyword-search-input').should('have.value', '')

        // Ensure facet group bodies are shown correctly
        testFacetGroupExistence('features')

        getByTestId('spatial-display_southwest-point').should('have.value', '0.99949,5.02679')
        getByTestId('spatial-display_northeast-point').should('have.value', '26.17555,32.8678')
      })
    })
  })

  describe('Feature Facets Group', () => {
    describe('When the path is loaded with the `Available from AWS Cloud` feature facet param', () => {
      it('loads correctly', () => {
        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.extra.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score&tag_key%5B%5D=gov.nasa.earthdatacloud.s3')

          req.reply({
            body: awsCloudBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '720'
            }
          })
        })

        cy.visit('/search?ff=Available%20from%20AWS%20Cloud')

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
      it('loads correctly', () => {
        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.extra.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score&service_type%5B%5D=esi&service_type%5B%5D=opendap&service_type%5B%5D=harmony')

          req.reply({
            body: customizableBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '233'
            }
          })
        })

        cy.visit('/search?ff=Customizable')

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
      it('loads correctly', () => {
        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.extra.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score&tag_key%5B%5D=edsc.extra.serverless.gibs')

          req.reply({
            body: mapImageryBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '394'
            }
          })
        })

        cy.visit('/search?ff=Map%20Imagery')

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
      it('loads correctly', () => {
        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.extra.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&collection_data_type%5B%5D=NEAR_REAL_TIME&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

          req.reply({
            body: nearRealTimeBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '228'
            }
          })
        })

        cy.visit('/search?ff=Near%20Real%20Time')

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
      it('loads correctly', () => {
        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.extra.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&science_keywords_h%5B0%5D%5Btopic%5D=Aerosols&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

          req.reply({
            body: keywordsBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '1'
            }
          })
        })

        cy.visit('/search?fst0=Aerosols')

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
      })
    })
  })

  describe('Platforms Facets Group', () => {
    describe('When the path is loaded with the `AIRCRAFT` platforms param', () => {
      it('loads correctly', () => {
        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.extra.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&platform_h%5B%5D=AIRCRAFT&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

          req.reply({
            body: platformsBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '108'
            }
          })
        })

        cy.visit('/search?fp=AIRCRAFT')

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
      })
    })
  })

  describe('Instruments Facets Group', () => {
    describe('When the path is loaded with the `AIRS` instruments param', () => {
      it('loads correctly', () => {
        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.extra.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

          req.reply({
            body: instrumentsBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '104'
            }
          })
        })

        cy.visit('/search?ffi=AIRS')

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
      })
    })
  })

  describe('Organizations Facets Group', () => {
    describe('When the path is loaded with the `Alaska Satellite Facility` organizations param', () => {
      it('loads correctly', () => {
        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.extra.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&data_center_h%5B%5D=Alaska%20Satellite%20Facility&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

          req.reply({
            body: organizationsBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '128'
            }
          })
        })

        cy.visit('/search?fdc=Alaska%20Satellite%20Facility')

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
      })
    })
  })

  describe('Projects Facets Group', () => {
    describe('When the path is loaded with the `ABoVE` projects param', () => {
      it('loads correctly', () => {
        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.extra.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&project_h%5B%5D=ABoVE&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

          req.reply({
            body: projectsBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '175'
            }
          })
        })

        cy.visit('/search?fpj=ABoVE')

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
      })
    })
  })

  describe('Processing Levels Facets Group', () => {
    describe('When the path is loaded with the `0 - Raw Data` processing levels param', () => {
      it('loads correctly', () => {
        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.extra.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&processing_level_id_h%5B%5D=0%20-%20Raw%20Data&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

          req.reply({
            body: processingLevelsBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '50'
            }
          })
        })

        cy.visit('/search?fl=0%20-%20Raw%20Data')

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
      })
    })
  })

  describe('Data Format Facets Group', () => {
    describe('When the path is loaded with the `ArcGIS` data format param', () => {
      it('loads correctly', () => {
        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.extra.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&granule_data_format_h%5B%5D=ArcGIS&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

          req.reply({
            body: dataFormatBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5'
            }
          })
        })

        cy.visit('/search?gdf=ArcGIS')

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
      })
    })
  })

  describe('Tiling System Facets Group', () => {
    describe('When the path is loaded with the `CALIPSO` tiling system param', () => {
      it('loads correctly', () => {
        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.extra.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score&two_d_coordinate_system_name%5B%5D=CALIPSO')

          req.reply({
            body: tilingSystemBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '69'
            }
          })
        })

        cy.visit('/search?s2n=CALIPSO')

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
      })
    })
  })

  describe('Horizontal Data Resolution Facets Group', () => {
    describe('When the path is loaded with the `0 - 1 meter` horizontal data resolution param', () => {
      it('loads correctly', () => {
        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.extra.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&horizontal_data_resolution_range%5B%5D=0%20to%201%20meter&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

          req.reply({
            body: horizontalDataResolutionBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '41'
            }
          })
        })

        cy.visit('/search?hdr=0%20to%201%20meter')

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
      })
    })
  })

  describe('Collections without granules', () => {
    describe('When the path is loaded with the ac param', () => {
      it('loads correctly', () => {
        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.extra.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

          req.reply({
            body: noGranulesBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '7704'
            }
          })
        })

        cy.visit('/search?ac=true')

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
      it('loads correctly', () => {
        cy.intercept({
          method: 'POST',
          url: '**/search/collections.json'
        },
        (req) => {
          expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.extra.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score&tag_key%5B%5D=gov.nasa.eosdis')

          req.reply({
            body: nonEosdisBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '28270'
            }
          })
        })

        cy.visit('/search?tag_key=gov.nasa.eosdis')

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
})
