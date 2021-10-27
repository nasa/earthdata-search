import { getByTestId } from '../../support/getByTestId'
import { interceptUnauthenticatedCollections } from '../../support/interceptUnauthenticatedCollections'
import { graphQlGetCollection } from '../../support/graphQlGetCollection'

import boundingBoxBody from './__mocks__/bounding_box_collections.body.json'
import circleBody from './__mocks__/circle_collections.body.json'
import cmrGranulesBody from './__mocks__/cmr_granules/granules.body.json'
import cmrGranulesCollectionBody from './__mocks__/cmr_granules/collections.body.json'
import cmrGranulesCollectionGraphQlBody from './__mocks__/cmr_granules/collection_graphql.body.json'
import granuleGraphQlBody from './__mocks__/cmr_granules/granule_graphql.body.json'
import cmrGranulesCollectionGraphQlHeaders from './__mocks__/cmr_granules/graphql.headers.json'
import cmrGranulesHeaders from './__mocks__/cmr_granules/granules.headers.json'
import cmrGranulesTimelineBody from './__mocks__/cmr_granules/timeline.body.json'
import cmrGranulesTimelineHeaders from './__mocks__/cmr_granules/timeline.headers.json'
import commonBody from './__mocks__/common_collections.body.json'
import commonHeaders from './__mocks__/common_collections.headers.json'
import multipleShapesShapefileBody from './__mocks__/multiple_shapes_shapefile_collections.body.json'
import opensearchGranulesBody from './__mocks__/opensearch_granules/granules_body'
import opensearchGranulesCollectionBody from './__mocks__/opensearch_granules/collections.body.json'
import opensearchGranulesCollectionGraphQlBody from './__mocks__/opensearch_granules/graphql.body.json'
import opensearchGranulesCollectionGraphQlHeaders from './__mocks__/opensearch_granules/graphql.headers.json'
import opensearchGranulesHeaders from './__mocks__/opensearch_granules/granules.headers.json'
import opensearchGranulesTimelineBody from './__mocks__/opensearch_granules/timeline.body.json'
import opensearchGranulesTimelineHeaders from './__mocks__/opensearch_granules/timeline.headers.json'
import pointBody from './__mocks__/point_collections.body.json'
import pointBodyEdited from './__mocks__/point_collections_edited.body.json'
import polygonBody from './__mocks__/polygon_collections.body.json'
import simpleShapefileBody from './__mocks__/simple_shapefile_collections.body.json'
import tooManyPointsShapefileBody from './__mocks__/too_many_points_shapefile_collections.body.json'

describe('Map interactions', () => {
  describe('When drawing point spatial', () => {
    describe('When drawing a new point from the spatial selection', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'pointAlias',
            body: pointBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5151'
            },
            params: 'include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&point%5B%5D=42.1875%2C-2.40647&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score'
          }]
        )

        cy.visit('/')

        // Select the point spatial type
        getByTestId('spatial-selection-dropdown').click()
        getByTestId('spatial-selection-dropdown').within(() => {
          cy.contains('Point').click()
        })

        // Add the point to the map
        cy.get('.map').click(1000, 450)

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?sp[0]=42.1875%2C-2.40647')

        // draws a point on the map
        cy.get('.leaflet-marker-pane img').should('have.attr', 'style', 'margin-left: -12px; margin-top: -41px; width: 25px; height: 41px; transform: translate3d(1000px, 450px, 0px); z-index: 450;')

        // populates the spatial display field
        getByTestId('spatial-display_point').should('have.value', '-2.40647,42.1875')
      })
    })

    describe('When drawing a new point from the leaflet controls', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'pointAlias',
            body: pointBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5151'
            },
            params: 'include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&point%5B%5D=42.1875%2C-2.40647&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score'
          }]
        )

        cy.visit('/')

        // Select the point spatial type
        cy.get('.leaflet-draw-draw-marker').click({ force: true })

        // Add the point to the map
        cy.get('.map').click(1000, 450)

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?sp[0]=42.1875%2C-2.40647')

        // draws a point on the map
        cy.get('.leaflet-marker-pane img').should('have.attr', 'style', 'margin-left: -12px; margin-top: -41px; width: 25px; height: 41px; transform: translate3d(1000px, 450px, 0px); z-index: 450;')

        // populates the spatial display field
        getByTestId('spatial-display_point').should('have.value', '-2.40647,42.1875')
      })
    })

    describe('When typing a new point in the spatial display', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'pointAlias',
            body: pointBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5151'
            },
            params: 'include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&point%5B%5D=42.1875%2C-2.40647&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score'
          }]
        )

        cy.visit('/')

        // Select the point spatial type
        getByTestId('spatial-selection-dropdown').click()
        getByTestId('spatial-selection-dropdown').within(() => {
          cy.contains('Point').click()
        })

        // Enter the spatial point
        getByTestId('spatial-display_point').type('-2.40647,42.1875{enter}')

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?sp[0]=42.1875%2C-2.40647&ac=true&m=-2.406005859375!42.1875!7!1!0!0%2C2')

        // draws a point on the map
        cy.get('.leaflet-marker-pane img').should('have.attr', 'style', 'margin-left: -12px; margin-top: -41px; width: 25px; height: 41px; transform: translate3d(700px, 434px, 0px); z-index: 434;')

        // populates the spatial display field
        getByTestId('spatial-display_point').should('have.value', '-2.40647,42.1875')
      })
    })

    // This isn't working because cypress is unable to drag the edit icons for the leaflet-draw shape
    describe.skip('When editing a point', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'pointAlias',
            body: pointBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5151'
            },
            params: 'include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&point%5B%5D=42.1875%2C-2.40647&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score'
          },
          {
            alias: 'pointEditedAlias',
            body: pointBodyEdited,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5151'
            },
            params: 'include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&point%5B%5D=42%2C-2&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score'
          }]
        )

        cy.visit('/')

        // Select the point spatial type
        getByTestId('spatial-selection-dropdown').click()
        getByTestId('spatial-selection-dropdown').within(() => {
          cy.contains('Point').click()
        })

        // Add the point to the map
        cy.get('.map').click(1000, 450)

        // Edit the point
        cy.get('.leaflet-draw-edit-edit').click()

        cy.get('.leaflet-edit-marker-selected')
          .trigger('pointerdown', {
            pointerId: 1,
            clientX: 1000,
            clientY: 450,
            force: true
          })
          .trigger('pointermove', {
            pointerId: 1,
            clientX: 1200,
            clientY: 450,
            force: true
          })
          .trigger('pointerup', {
            pointerId: 1,
            force: true
          })
        cy.get('.leaflet-draw-actions').within(() => {
          cy.contains('Save').click()
        })

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?sp[0]=42%2C-2&ac=true')

        // draws a point on the map
        cy.get('.leaflet-marker-pane img').should('have.attr', 'style', 'margin-left: -12px; margin-top: -41px; width: 25px; height: 41px; transform: translate3d(700px, 433px, 0px); z-index: 433;')

        // populates the spatial display field
        getByTestId('spatial-display_point').should('have.value', '-2,42')
      })
    })
  })

  describe('When drawing circle spatial', () => {
    describe('When drawing a new circle from the spatial selection', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'circleAlias',
            body: circleBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5157'
            },
            params: 'include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&circle%5B%5D=42.1875%2C2.2329%2C156326&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score'
          }]
        )

        cy.visit('/')

        // Select the circle spatial type
        getByTestId('spatial-selection-dropdown').click()
        getByTestId('spatial-selection-dropdown').within(() => {
          cy.contains('Circle').click()
        })

        // Add the circle to the map
        cy.get('.map')
          .trigger('pointerdown', {
            pointerId: 1,
            clientX: 1000,
            clientY: 450,
            force: true
          })
          .trigger('pointermove', {
            pointerId: 1,
            clientX: 1000,
            clientY: 460,
            force: true
          })
          .trigger('pointerup', { pointerId: 1, force: true })

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?circle[0]=42.1875%2C2.2329%2C156326&ac=true')

        // draws a circle on the map
        cy.get('.leaflet-interactive').should('have.attr', 'd', 'M990,417.12161504783523a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0 ')

        // populates the spatial display field
        getByTestId('spatial-display_circle-center').should('have.value', '2.2329,42.1875')
        getByTestId('spatial-display_circle-radius').should('have.value', '156326')
      })
    })

    describe('When drawing a new circle from the leaflet controls', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'circleAlias',
            body: circleBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5157'
            },
            params: 'include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&circle%5B%5D=42.1875%2C2.2329%2C156326&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score'
          }]
        )

        cy.visit('/')

        // Select the circle spatial type
        cy.get('.leaflet-draw-draw-circle').click({ force: true })

        // Add the circle to the map
        cy.get('.map')
          .trigger('pointerdown', {
            pointerId: 1,
            clientX: 1000,
            clientY: 450,
            force: true
          })
          .trigger('pointermove', {
            pointerId: 1,
            clientX: 1000,
            clientY: 460,
            force: true
          })
          .trigger('pointerup', { pointerId: 1, force: true })

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?circle[0]=42.1875%2C2.2329%2C156326')

        // draws a circle on the map
        cy.get('.leaflet-interactive').should('have.attr', 'd', 'M990,417.12161504783523a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0 ')

        // populates the spatial display field
        getByTestId('spatial-display_circle-center').should('have.value', '2.2329,42.1875')
        getByTestId('spatial-display_circle-radius').should('have.value', '156326')
      })
    })

    describe('When typing a new circle in the spatial display', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'circleAlias',
            body: circleBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5157'
            },
            params: 'include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&circle%5B%5D=42.1875%2C2.2329%2C156326&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score'
          }]
        )

        cy.visit('/')

        // Select the circle spatial type
        getByTestId('spatial-selection-dropdown').click()
        getByTestId('spatial-selection-dropdown').within(() => {
          cy.contains('Circle').click()
        })

        // Enter the circle values
        getByTestId('spatial-display_circle-center').type('2.2329,42.1875')
        getByTestId('spatial-display_circle-radius').type('156326{enter}')

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?circle[0]=42.1875%2C2.2329%2C156326&ac=true&m=2.23681640625!42.1875!6!1!0!0%2C2')

        // draws a circle on the map
        cy.get('.leaflet-interactive').should('have.attr', 'd', 'M540,433.9455999999991a160,160 0 1,0 320,0 a160,160 0 1,0 -320,0 ')

        // populates the spatial display field
        getByTestId('spatial-display_circle-center').should('have.value', '2.2329,42.1875')
        getByTestId('spatial-display_circle-radius').should('have.value', '156326')
      })
    })

    describe.skip('When editing a circle', () => {})
  })

  describe('When drawing bounding box spatial', () => {
    describe('When drawing a new bounding box from the spatial selection', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'boundingBoxAlias',
            body: boundingBoxBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5151'
            },
            params: 'include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&bounding_box%5B%5D=42.1875%2C-16.46517%2C56.25%2C-2.40647&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score'
          }]
        )

        cy.visit('/')

        // Select the bounding box spatial type
        getByTestId('spatial-selection-dropdown').click()
        getByTestId('spatial-selection-dropdown').within(() => {
          cy.contains('Rectangle').click()
        })

        // Add the bounding box to the map
        cy.get('.map')
          .click(1000, 450)
          .click(1100, 550)

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?sb[0]=42.1875%2C-16.46517%2C56.25%2C-2.40647')

        // draws a bounding box on the map
        cy.get('.leaflet-interactive').should('have.attr', 'd', 'M1000 550L1000 450L1100 450L1100 550L1000 550z')

        // populates the spatial display field
        getByTestId('spatial-display_southwest-point').should('have.value', '-16.46517,42.1875')
        getByTestId('spatial-display_northeast-point').should('have.value', '-2.40647,56.25')
      })
    })

    describe('When drawing a new bounding box from the leaflet controls', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'boundingBoxAlias',
            body: boundingBoxBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5151'
            },
            params: 'include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&bounding_box%5B%5D=42.1875%2C-16.46517%2C56.25%2C-2.40647&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score'
          }]
        )

        cy.visit('/')

        // Select the bounding box spatial type
        cy.get('.leaflet-draw-draw-rectangle').click({ force: true })

        // Add the bounding box to the map
        cy.get('.map')
          .click(1000, 450)
          .click(1100, 550)

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?sb[0]=42.1875%2C-16.46517%2C56.25%2C-2.40647&ac=true')

        // draws a bounding box on the map
        cy.get('.leaflet-interactive').should('have.attr', 'd', 'M1000 550L1000 450L1100 450L1100 550L1000 550z')

        // populates the spatial display field
        getByTestId('spatial-display_southwest-point').should('have.value', '-16.46517,42.1875')
        getByTestId('spatial-display_northeast-point').should('have.value', '-2.40647,56.25')
      })
    })

    describe('When typing a new bounding box in the spatial display', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'boundingBoxAlias',
            body: boundingBoxBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5151'
            },
            params: 'include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&bounding_box%5B%5D=42.1875%2C-16.46517%2C56.25%2C-2.40647&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score'
          }]
        )

        cy.visit('/')

        // Select the bounding box spatial type
        getByTestId('spatial-selection-dropdown').click()
        getByTestId('spatial-selection-dropdown').within(() => {
          cy.contains('Rectangle').click()
        })

        // Enter the bounding box values
        getByTestId('spatial-display_southwest-point').type('-16.46517,42.1875')
        getByTestId('spatial-display_northeast-point').type('-2.40647,56.25{enter}')

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?sb[0]=42.1875%2C-16.46517%2C56.25%2C-2.40647&ac=true&m=-9.439453125!49.21875!4!1!0!0%2C2')

        // draws a bounding box on the map
        cy.get('.leaflet-interactive').should('have.attr', 'd', 'M500 633L500 233L900 233L900 633L500 633z')

        // populates the spatial display field
        getByTestId('spatial-display_southwest-point').should('have.value', '-16.46517,42.1875')
        getByTestId('spatial-display_northeast-point').should('have.value', '-2.40647,56.25')
      })
    })

    describe.skip('When editing a bounding box', () => {})
  })

  describe('When drawing polygon spatial', () => {
    describe('When drawing a new polygon from the spatial selection', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'polygonAlias',
            body: polygonBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5160'
            },
            params: 'include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&polygon%5B%5D=42.1875%2C-2.40647%2C42.1875%2C-16.46517%2C56.25%2C-16.46517%2C42.1875%2C-2.40647&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score'
          }]
        )

        cy.visit('/')

        // Select the polygon spatial type
        getByTestId('spatial-selection-dropdown').click()
        getByTestId('spatial-selection-dropdown').within(() => {
          cy.contains('Polygon').click()
        })

        // Add the polygon to the map
        cy.get('.map')
          .click(1000, 450)
          .click(1100, 550)
          .click(1000, 550)
          .click(1000, 450)

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?polygon[0]=42.1875%2C-2.40647%2C42.1875%2C-16.46517%2C56.25%2C-16.46517%2C42.1875%2C-2.40647&ac=true')

        // draws a polygon on the map
        cy.get('.leaflet-interactive').should('have.attr', 'd', 'M1000 450L1049 501L1100 550L1000 550L1000 450z')

        // populates the spatial display field
        getByTestId('filter-stack__spatial').get('.filter-stack-item__secondary-title').should('have.text', 'Polygon')
        getByTestId('spatial-display_polygon').should('have.text', '3 Points')
      })
    })

    describe('When drawing a new polygon from the leaflet controls', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'polygonAlias',
            body: polygonBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5160'
            },
            params: 'include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&polygon%5B%5D=42.1875%2C-2.40647%2C42.1875%2C-16.46517%2C56.25%2C-16.46517%2C42.1875%2C-2.40647&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score'
          }]
        )

        cy.visit('/')

        // Select the polygon spatial type
        cy.get('.leaflet-draw-draw-polygon').click({ force: true })

        // Add the polygon to the map
        cy.get('.map')
          .click(1000, 450)
          .click(1100, 550)
          .click(1000, 550)
          .click(1000, 450)

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?polygon[0]=42.1875%2C-2.40647%2C42.1875%2C-16.46517%2C56.25%2C-16.46517%2C42.1875%2C-2.40647&ac=true')

        // draws a polygon on the map
        cy.get('.leaflet-interactive').should('have.attr', 'd', 'M1000 450L1049 501L1100 550L1000 550L1000 450z')

        // populates the spatial display field
        getByTestId('filter-stack__spatial').get('.filter-stack-item__secondary-title').should('have.text', 'Polygon')
        getByTestId('spatial-display_polygon').should('have.text', '3 Points')
      })
    })

    describe.skip('When editing a polygon', () => {})
  })

  describe('When uploading a shapefile', () => {
    describe('When the shapefile has a single polygon shape', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'polygonAlias',
            body: simpleShapefileBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5160'
            },
            params: 'include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&polygon%5B%5D=42.1875%2C-16.46517%2C56.25%2C-16.46517%2C42.1875%2C-2.40647%2C42.1875%2C-16.46517&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score'
          }]
        )

        cy.fixture('shapefiles/simple.geojson').then((fileContent) => {
          cy.intercept(
            'POST',
            '**/convert',
            {
              body: fileContent,
              headers: { 'content-type': 'application/json; charset=utf-8' }
            }
          )
        }).as('shapefileConvertRequest')

        cy.intercept(
          'POST',
          '**/shapefiles',
          {
            body: { shapefile_id: '1' },
            headers: { 'content-type': 'application/json; charset=utf-8' }
          }
        ).as('shapefilesApiRequest')

        cy.visit('/')

        // Upload the shapefile
        getByTestId('shapefile-dropzone').attachFile(
          {
            filePath: 'shapefiles/simple.geojson',
            mimeType: 'application/json',
            encoding: 'utf-8'
          },
          { subjectType: 'drag-n-drop' }
        )

        cy.wait('@shapefileConvertRequest')
        cy.wait('@shapefilesApiRequest')
        // Wait for the large shape to be drawn
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(2000)

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?polygon[0]=42.1875%2C-16.46517%2C56.25%2C-16.46517%2C42.1875%2C-2.40647%2C42.1875%2C-16.46517&sf=1&sfs[0]=0&ac=true&m=-9.4306640625!49.21875!5!1!0!0%2C2')

        // draws a polygon on the map
        cy.get('.leaflet-interactive').first().should('have.attr', 'd', 'M300 34L300 834L600 840L900 839L1100 834L996 736L792 538L692 438L300 34z')
        cy.get('.leaflet-interactive').last().should('have.attr', 'd', 'M300 834L600 840L900 839L1100 834L996 736L792 538L692 438L300 34L300 834z')

        // populates the spatial display field
        getByTestId('filter-stack__spatial').get('.filter-stack-item__secondary-title').should('have.text', 'Shape File')
        getByTestId('spatial-display_shapefile-name').should('have.text', 'simple.geojson')
        getByTestId('filter-stack-item__hint').should('have.text', '1 shape selected')
      })
    })

    describe('When the shapefile has a line shape', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'lineShapeAlias',
            body: multipleShapesShapefileBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5197'
            },
            params: 'include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&line%5B%5D=31%2C-15%2C36%2C-17%2C41%2C-15&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score'
          }]
        )

        cy.fixture('shapefiles/multiple_shapes.geojson').then((fileContent) => {
          cy.intercept(
            'POST',
            '**/convert',
            {
              body: fileContent,
              headers: { 'content-type': 'application/json; charset=utf-8' }
            }
          )
        }).as('shapefileConvertRequest')

        cy.intercept(
          'POST',
          '**/shapefiles',
          {
            body: { shapefile_id: '1' },
            headers: { 'content-type': 'application/json; charset=utf-8' }
          }
        ).as('shapefilesApiRequest')

        cy.visit('/')

        // Upload the shapefile
        getByTestId('shapefile-dropzone').attachFile(
          {
            filePath: 'shapefiles/multiple_shapes.geojson',
            mimeType: 'application/json',
            encoding: 'utf-8'
          },
          { subjectType: 'drag-n-drop' }
        )

        cy.wait('@shapefileConvertRequest')
        cy.wait('@shapefilesApiRequest')
        // Wait for the large shape to be drawn
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(2000)

        // Select the line
        cy.get('.leaflet-interactive').eq(2).click({ force: true })

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?line[0]=31%2C-15%2C36%2C-17%2C41%2C-15&sf=1&sfs[0]=2&ac=true&m=-8.279296875!44.61328125!4!1!0!0%2C2')

        // draws the shapes on the map
        // Line
        cy.get('.leaflet-interactive').eq(2).should('have.attr', 'd', 'M313 625L455 682L597 625')

        // Selected Line
        cy.get('.leaflet-interactive').eq(4).should('have.attr', 'd', 'M313 625L455 682L597 625')

        // populates the spatial display field
        getByTestId('filter-stack__spatial').get('.filter-stack-item__secondary-title').should('have.text', 'Shape File')
        getByTestId('spatial-display_shapefile-name').should('have.text', 'multiple_shapes.geojson')
        getByTestId('filter-stack-item__hint').should('have.text', '1 shape selected')
      })
    })

    describe('When the shapefile has a circle shape', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'circleShapeAlias',
            body: multipleShapesShapefileBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5197'
            },
            params: 'include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&circle%5B%5D=35%2C-5%2C50000&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score'
          }]
        )

        cy.fixture('shapefiles/multiple_shapes.geojson').then((fileContent) => {
          cy.intercept(
            'POST',
            '**/convert',
            {
              body: fileContent,
              headers: { 'content-type': 'application/json; charset=utf-8' }
            }
          )
        }).as('shapefileConvertRequest')

        cy.intercept(
          'POST',
          '**/shapefiles',
          {
            body: { shapefile_id: '1' },
            headers: { 'content-type': 'application/json; charset=utf-8' }
          }
        ).as('shapefilesApiRequest')

        cy.visit('/')

        // Upload the shapefile
        getByTestId('shapefile-dropzone').attachFile(
          {
            filePath: 'shapefiles/multiple_shapes.geojson',
            mimeType: 'application/json',
            encoding: 'utf-8'
          },
          { subjectType: 'drag-n-drop' }
        )

        cy.wait('@shapefileConvertRequest')
        cy.wait('@shapefilesApiRequest')
        // Wait for the large shape to be drawn
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(2000)

        // Select the circle
        cy.get('.leaflet-interactive').eq(3).click({ force: true })

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?circle[0]=35%2C-5%2C50000&sf=1&sfs[0]=3&ac=true&m=-8.279296875!44.61328125!4!1!0!0%2C2')

        // draws the shapes on the map
        // Circle
        cy.get('.leaflet-interactive').eq(3).should('have.attr', 'd', 'M413.55555555555566,340.2222222222222a13,13 0 1,0 26,0 a13,13 0 1,0 -26,0 ')

        // Selected Circle
        cy.get('.leaflet-interactive').eq(4).should('have.attr', 'd', 'M413.55555555555566,340.2222222222222a13,13 0 1,0 26,0 a13,13 0 1,0 -26,0 ')

        // populates the spatial display field
        getByTestId('filter-stack__spatial').get('.filter-stack-item__secondary-title').should('have.text', 'Shape File')
        getByTestId('spatial-display_shapefile-name').should('have.text', 'multiple_shapes.geojson')
        getByTestId('filter-stack-item__hint').should('have.text', '1 shape selected')
      })
    })

    describe('When the shapefile has a point shape', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'pointShapeAlias',
            body: multipleShapesShapefileBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5197'
            },
            params: 'include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&point%5B%5D=35%2C0&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score'
          }]
        )

        cy.fixture('shapefiles/multiple_shapes.geojson').then((fileContent) => {
          cy.intercept(
            'POST',
            '**/convert',
            {
              body: fileContent,
              headers: { 'content-type': 'application/json; charset=utf-8' }
            }
          )
        }).as('shapefileConvertRequest')

        cy.intercept(
          'POST',
          '**/shapefiles',
          {
            body: { shapefile_id: '1' },
            headers: { 'content-type': 'application/json; charset=utf-8' }
          }
        ).as('shapefilesApiRequest')

        cy.visit('/')

        // Upload the shapefile
        getByTestId('shapefile-dropzone').attachFile(
          {
            filePath: 'shapefiles/multiple_shapes.geojson',
            mimeType: 'application/json',
            encoding: 'utf-8'
          },
          { subjectType: 'drag-n-drop' }
        )

        cy.wait('@shapefileConvertRequest')
        cy.wait('@shapefilesApiRequest')
        // Wait for the large shape to be drawn
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(2000)

        // Select the point
        cy.get('.leaflet-marker-icon.leaflet-interactive').click({ force: true })

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?sp[0]=35%2C0&sf=1&sfs[0]=4&ac=true&m=-8.279296875!44.61328125!4!1!0!0%2C2')

        // draws the shapes on the map
        // Point
        cy.get('.leaflet-marker-icon.leaflet-interactive').eq(0).should('have.attr', 'style', 'margin-left: -12px; margin-top: -41px; width: 25px; height: 41px; transform: translate3d(427px, 198px, 0px); z-index: 198; outline: none;')

        // Selected point
        cy.get('.leaflet-marker-icon.leaflet-interactive').eq(1).should('have.attr', 'style', 'margin-left: -12px; margin-top: -41px; width: 25px; height: 41px; transform: translate3d(427px, 198px, 0px); z-index: 198;')

        // populates the spatial display field
        getByTestId('filter-stack__spatial').get('.filter-stack-item__secondary-title').should('have.text', 'Shape File')
        getByTestId('spatial-display_shapefile-name').should('have.text', 'multiple_shapes.geojson')
        getByTestId('filter-stack-item__hint').should('have.text', '1 shape selected')
      })
    })

    describe('When the shapefile has multiple shapes selected', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'twoShapesAlias',
            body: multipleShapesShapefileBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5197'
            },
            params: 'include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&polygon%5B%5D=42.1875%2C-16.46517%2C56.25%2C-16.46517%2C42.1875%2C-2.40647%2C42.1875%2C-16.46517&polygon%5B%5D=58.25%2C-14.46517%2C58.25%2C0.40647%2C44.1875%2C0.40647%2C58.25%2C-14.46517&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score'
          }]
        )

        cy.fixture('shapefiles/multiple_shapes.geojson').then((fileContent) => {
          cy.intercept(
            'POST',
            '**/convert',
            {
              body: fileContent,
              headers: { 'content-type': 'application/json; charset=utf-8' }
            }
          )
        }).as('shapefileConvertRequest')

        cy.intercept(
          'POST',
          '**/shapefiles',
          {
            body: { shapefile_id: '1' },
            headers: { 'content-type': 'application/json; charset=utf-8' }
          }
        ).as('shapefilesApiRequest')

        cy.visit('/')

        // Upload the shapefile
        getByTestId('shapefile-dropzone').attachFile(
          {
            filePath: 'shapefiles/multiple_shapes.geojson',
            mimeType: 'application/json',
            encoding: 'utf-8'
          },
          { subjectType: 'drag-n-drop' }
        )

        cy.wait('@shapefileConvertRequest')
        cy.wait('@shapefilesApiRequest')
        // Wait for the large shape to be drawn
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(2000)

        // Select two shapes
        cy.get('.geojson-svg.leaflet-interactive').eq(0).click({ force: true })
        cy.get('.geojson-svg.leaflet-interactive').eq(1).click({ force: true })

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?polygon[0]=42.1875%2C-16.46517%2C56.25%2C-16.46517%2C42.1875%2C-2.40647%2C42.1875%2C-16.46517&polygon[1]=58.25%2C-14.46517%2C58.25%2C0.40647%2C44.1875%2C0.40647%2C58.25%2C-14.46517&sf=1&sfs[0]=0&sfs[1]=1&ac=true&m=-8.279296875!44.61328125!4!1!0!0%2C2')

        // draws the shapes on the map
        // First polygon
        cy.get('.leaflet-interactive').eq(0).should('have.attr', 'd', 'M631 266L631 666L831 670L1031 666L877 518L728 368L631 266z')

        // Second polygon
        cy.get('.leaflet-interactive').eq(1).should('have.attr', 'd', 'M688 186L786 293L985 505L1088 609L1088 186L688 186z')

        // Selected first polygon
        cy.get('.leaflet-interactive').eq(4).should('have.attr', 'd', 'M631 666L831 670L1031 666L877 518L728 368L631 266L631 666z')

        // Selected second polygon
        cy.get('.leaflet-interactive').eq(5).should('have.attr', 'd', 'M1088 609L1088 186L688 186L786 293L985 505L1088 609z')

        // populates the spatial display field
        getByTestId('filter-stack__spatial').get('.filter-stack-item__secondary-title').should('have.text', 'Shape File')
        getByTestId('spatial-display_shapefile-name').should('have.text', 'multiple_shapes.geojson')
        getByTestId('filter-stack-item__hint').should('have.text', '2 shapes selected')
      })
    })

    describe('When the shapefile has a polygon with too many points', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'polygonAlias',
            body: tooManyPointsShapefileBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5479'
            },
            params: 'include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&polygon%5B%5D=-114.04999%2C36.95777%2C-114.0506%2C37.0004%2C-114.04826%2C41.99381%2C-119.99917%2C41.99454%2C-120.00101%2C38.99957%2C-118.71431%2C38.10218%2C-117.50012%2C37.22038%2C-116.0936%2C36.15581%2C-114.63667%2C35.00881%2C-114.63689%2C35.02837%2C-114.60362%2C35.06423%2C-114.64435%2C35.1059%2C-114.57852%2C35.12875%2C-114.56924%2C35.18348%2C-114.60431%2C35.35358%2C-114.67764%2C35.48974%2C-114.65431%2C35.59759%2C-114.68941%2C35.65141%2C-114.68321%2C35.68939%2C-114.70531%2C35.71159%2C-114.69571%2C35.75599%2C-114.71211%2C35.80618%2C-114.67742%2C35.87473%2C-114.73116%2C35.94392%2C-114.74376%2C35.9851%2C-114.73043%2C36.03132%2C-114.75562%2C36.08717%2C-114.57203%2C36.15161%2C-114.51172%2C36.15096%2C-114.50217%2C36.1288%2C-114.45837%2C36.13859%2C-114.44661%2C36.12597%2C-114.40547%2C36.14737%2C-114.37211%2C36.14311%2C-114.30843%2C36.08244%2C-114.31403%2C36.05817%2C-114.25265%2C36.02019%2C-114.14819%2C36.02801%2C-114.11416%2C36.09698%2C-114.12086%2C36.1146%2C-114.09987%2C36.12165%2C-114.04684%2C36.19407%2C-114.04999%2C36.95777&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score'
          }]
        )

        cy.fixture('shapefiles/too_many_points.geojson').then((fileContent) => {
          cy.intercept(
            'POST',
            '**/convert',
            {
              body: fileContent,
              headers: { 'content-type': 'application/json; charset=utf-8' }
            }
          )
        }).as('shapefileConvertRequest')

        cy.intercept(
          'POST',
          '**/shapefiles',
          {
            body: { shapefile_id: '1' },
            headers: { 'content-type': 'application/json; charset=utf-8' }
          }
        ).as('shapefilesApiRequest')

        cy.visit('/')

        // Upload the shapefile
        getByTestId('shapefile-dropzone').attachFile(
          {
            filePath: 'shapefiles/too_many_points.geojson',
            mimeType: 'application/json',
            encoding: 'utf-8'
          },
          { subjectType: 'drag-n-drop' }
        )

        cy.wait('@shapefileConvertRequest')
        cy.wait('@shapefilesApiRequest')
        // Wait for the large shape to be drawn
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(2000)

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?polygon[0]=-114.04999%2C36.95777%2C-114.0506%2C37.0004%2C-114.04826%2C41.99381%2C-119.99917%2C41.99454%2C-120.00101%2C38.99957%2C-118.71431%2C38.10218%2C-117.50012%2C37.22038%2C-116.0936%2C36.15581%2C-114.63667%2C35.00881%2C-114.63689%2C35.02837%2C-114.60362%2C35.06423%2C-114.64435%2C35.1059%2C-114.57852%2C35.12875%2C-114.56924%2C35.18348%2C-114.60431%2C35.35358%2C-114.67764%2C35.48974%2C-114.65431%2C35.59759%2C-114.68941%2C35.65141%2C-114.68321%2C35.68939%2C-114.70531%2C35.71159%2C-114.69571%2C35.75599%2C-114.71211%2C35.80618%2C-114.67742%2C35.87473%2C-114.73116%2C35.94392%2C-114.74376%2C35.9851%2C-114.73043%2C36.03132%2C-114.75562%2C36.08717%2C-114.57203%2C36.15161%2C-114.51172%2C36.15096%2C-114.50217%2C36.1288%2C-114.45837%2C36.13859%2C-114.44661%2C36.12597%2C-114.40547%2C36.14737%2C-114.37211%2C36.14311%2C-114.30843%2C36.08244%2C-114.31403%2C36.05817%2C-114.25265%2C36.02019%2C-114.14819%2C36.02801%2C-114.11416%2C36.09698%2C-114.12086%2C36.1146%2C-114.09987%2C36.12165%2C-114.04684%2C36.19407%2C-114.04999%2C36.95777&sf=1&sfs[0]=0&ac=true&m=38.50048828125!-117.02636718749999!6!1!0!0%2C2')

        // displays the too many points modal
        cy.get('.edsc-modal__too-many-points-modal').within(() => {
          cy.get('.modal-title').should('have.text', 'Shape file has too many points')
        })

        // draws a polygon on the map
        cy.get('.edsc-modal__too-many-points-modal').within(() => {
          cy.get('.close').click()
        })

        cy.get('.leaflet-interactive').first().should('have.attr', 'd', 'M1039 604L1039 696L1037 696L1033 704L1030 706L1031 707L1029 713L1027 715L1016 716L1009 711L1010 709L1000 701L994 704L992 702L988 703L986 701L979 701L975 703L973 702L968 705L962 706L958 709L961 711L961 724L967 731L963 740L965 742L964 751L967 754L966 757L970 762L969 771L967 775L969 781L973 785L976 792L976 798L980 811L979 817L973 818L971 820L976 824L972 828L972 832L834 721L831 720L644 577L441 431L362 377L362 36L1039 36L1039 604z')
        cy.get('.leaflet-interactive').last().should('have.attr', 'd', 'M1039 609L1039 36L785 32L531 33L362 36L362 377L508 479L687 609L890 765L972 831L976 824L971 820L979 817L980 811L976 792L967 776L970 764L966 758L967 753L964 751L965 746L963 740L967 732L960 722L961 714L958 708L979 701L986 701L990 703L992 702L994 704L1000 701L1006 705L1012 714L1016 716L1027 715L1031 705L1039 696L1039 609z')

        // populates the spatial display field
        getByTestId('filter-stack__spatial').get('.filter-stack-item__secondary-title').should('have.text', 'Shape File')
        getByTestId('spatial-display_shapefile-name').should('have.text', 'too_many_points.geojson')
        getByTestId('filter-stack-item__hint').should('have.text', '1 shape selected')
      })
    })
  })

  describe('When moving the map', () => {
    describe('When dragging the map', () => {
      it('updates the URL with the new map parameter', () => {
        const aliases = interceptUnauthenticatedCollections(commonBody, commonHeaders)

        cy.visit('/')

        // Drag the map
        cy.get('.map').dragMapFromCenter({
          yMoveFactor: 1 / 8
        })

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        cy.url().should('include', '?ac=true&m=14.410148015647792!0!2!1!0!0%2C2')
      })
    })

    describe('When zooming the map', () => {
      it('updates the URL with the new map parameter', () => {
        const aliases = interceptUnauthenticatedCollections(commonBody, commonHeaders)

        cy.visit('/')

        // Zoom the map
        cy.get('.leaflet-control-zoom-in').click()

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // Ignoring the lat!lon in this param, because it doesn't always end up at 0,0
        cy.url().should('include', '!3!1!0!0%2C2')
      })
    })
  })

  describe('When switching projections', () => {
    describe('When switching to the North Polar Stereographic projection', () => {
      before(() => {
        const aliases = interceptUnauthenticatedCollections(commonBody, commonHeaders)

        cy.visit('/')

        // Change the projection
        getByTestId('projection-switcher__arctic').click()

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })
      })

      it('updates the URL with the new map parameter', () => {
        cy.url().should('include', '?ac=true&m=90!0!0!0!0!0%2C2')
      })

      it('updates the src of tile images', () => {
        cy.get('.leaflet-tile-pane').within(() => {
          cy.get('.leaflet-layer')
            .first()
            .within(() => {
              cy.get('img.leaflet-tile')
                .first()
                .should('have.attr', 'src')
                .and('match', /epsg3413/)
            })
        })
      })
    })

    describe('When switching to the Geographic projection', () => {
      before(() => {
        const aliases = interceptUnauthenticatedCollections(commonBody, commonHeaders)

        cy.visit('/')

        // Change the projection
        getByTestId('projection-switcher__arctic').click()
        // Switch back to Geographic
        getByTestId('projection-switcher__geo').click()

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })
      })

      it('updates the URL with the new map parameter', () => {
        // Removes the map parameter when it is centered
        cy.url().should('not.include', '?m')
      })

      it('updates the src of tile images', () => {
        cy.get('.leaflet-tile-pane').within(() => {
          cy.get('.leaflet-layer')
            .first()
            .within(() => {
              cy.get('img.leaflet-tile')
                .first()
                .should('have.attr', 'src')
                .and('match', /epsg4326/)
            })
        })
      })
    })

    describe('When switching to the South Polar Stereographic projection', () => {
      before(() => {
        const aliases = interceptUnauthenticatedCollections(commonBody, commonHeaders)

        cy.visit('/')

        // Change the projection
        getByTestId('projection-switcher__antarctic').click()

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })
      })

      it('updates the URL with the new map parameter', () => {
        cy.url().should('include', '?ac=true&m=-90!0!0!2!0!0%2C2')
      })

      it('updates the src of tile images', () => {
        cy.get('.leaflet-tile-pane').within(() => {
          cy.get('.leaflet-layer')
            .first()
            .within(() => {
              cy.get('img.leaflet-tile')
                .first()
                .should('have.attr', 'src')
                .and('match', /epsg3031/)
            })
        })
      })
    })
  })

  describe('When changing the map layers', () => {
    describe('When changing the base layer to Blue Marble', () => {
      before(() => {
        const aliases = interceptUnauthenticatedCollections(commonBody, commonHeaders)

        cy.visit('/')

        // Change the base layer
        cy.get('.leaflet-control-layers').rightclick()
        cy.get('.leaflet-control-layers').within(() => {
          cy.contains('Corrected Reflectance (True Color)').click()
          // Change it back to Blue Marble
          cy.contains('Blue Marble').click()
        })

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })
      })

      it('updates the URL with the new map parameter', () => {
        cy.url().should('not.include', '?m')
      })

      it('updates the src of tile images', () => {
        cy.get('.leaflet-tile-pane').within(() => {
          cy.get('.leaflet-layer')
            .last()
            .within(() => {
              cy.get('img.leaflet-tile')
                .first()
                .should('have.attr', 'src')
                .and('match', /BlueMarble_ShadedRelief_Bathymetry/)
            })
        })
      })
    })

    describe('When changing the base layer to Corrected Reflectance', () => {
      before(() => {
        const aliases = interceptUnauthenticatedCollections(commonBody, commonHeaders)

        cy.visit('/')

        // Change the base layer
        cy.get('.leaflet-control-layers').rightclick()
        cy.get('.leaflet-control-layers').within(() => {
          cy.contains('Corrected Reflectance (True Color)').click()
        })

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })
      })

      it('updates the URL with the new map parameter', () => {
        cy.url().should('include', '?ac=true&m=0!0!2!1!1!0%2C2')
      })

      it('updates the src of tile images', () => {
        cy.get('.leaflet-tile-pane').within(() => {
          cy.get('.leaflet-layer')
            .last()
            .within(() => {
              cy.get('img.leaflet-tile')
                .first()
                .should('have.attr', 'src')
                .and('match', /VIIRS_SNPP_CorrectedReflectance_TrueColor/)
            })
        })
      })
    })

    describe('When changing the base layer to Land / Water Map', () => {
      before(() => {
        const aliases = interceptUnauthenticatedCollections(commonBody, commonHeaders)

        cy.visit('/')

        // Change the base layer
        cy.get('.leaflet-control-layers').rightclick()
        cy.get('.leaflet-control-layers').within(() => {
          cy.contains('Land / Water Map').click()
        })

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })
      })

      it('updates the URL with the new map parameter', () => {
        cy.url().should('include', '?ac=true&m=0!0!2!1!2!0%2C2')
      })

      it('updates the src of tile images', () => {
        cy.get('.leaflet-tile-pane').within(() => {
          cy.get('.leaflet-layer')
            .last()
            .within(() => {
              cy.get('img.leaflet-tile')
                .first()
                .should('have.attr', 'src')
                .and('match', /OSM_Land_Water_Map/)
            })
        })
      })
    })

    describe('When changing the Borders and Roads overlay layer', () => {
      before(() => {
        const aliases = interceptUnauthenticatedCollections(commonBody, commonHeaders)

        // Visit with no overlays loaded
        cy.visit('/search?m=0!0!2!1!0!')

        // Add the overlay layer
        cy.get('.leaflet-control-layers').rightclick()
        cy.get('.leaflet-control-layers').within(() => {
          cy.contains('Borders and Roads').click()
        })

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })
      })

      it('updates the URL with the new map parameter', () => {
        cy.url().should('include', 'm=0!0!2!1!0!0')
      })

      it('updates the src of tile images', () => {
        cy.get('.leaflet-tile-pane').within(() => {
          cy.get('.leaflet-layer')
            .last() // the new layer will be added last
            .within(() => {
              cy.get('img.leaflet-tile')
                .first()
                .should('have.attr', 'src')
                .and('match', /Reference_Features/)
            })
        })
      })
    })

    describe('When changing the Coastlines overlay layer', () => {
      before(() => {
        const aliases = interceptUnauthenticatedCollections(commonBody, commonHeaders)

        // Visit with no overlays loaded
        cy.visit('/search?m=0!0!2!1!0!')

        // Add the overlay layer
        cy.get('.leaflet-control-layers').rightclick()
        cy.get('.leaflet-control-layers').within(() => {
          cy.contains('Coastlines').click()
        })

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })
      })

      it('updates the URL with the new map parameter', () => {
        cy.url().should('include', 'm=0!0!2!1!0!1')
      })

      it('updates the src of tile images', () => {
        cy.get('.leaflet-tile-pane').within(() => {
          cy.get('.leaflet-layer')
            .last() // the new layer will be added last
            .within(() => {
              cy.get('img.leaflet-tile')
                .first()
                .should('have.attr', 'src')
                .and('match', /Coastlines/)
            })
        })
      })
    })

    describe('When changing the Place Labels overlay layer', () => {
      before(() => {
        const aliases = interceptUnauthenticatedCollections(commonBody, commonHeaders)

        // Visit with no overlays loaded
        cy.visit('/search?m=0!0!2!1!0!')

        // Add the overlay layer
        cy.get('.leaflet-control-layers').rightclick()
        cy.get('.leaflet-control-layers').within(() => {
          cy.contains('Place Labels').click()
        })

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })
      })

      it('updates the URL with the new map parameter', () => {
        cy.url().should('include', '?ac=true&m=0!0!2!1!0!2')
      })

      it('updates the src of tile images', () => {
        cy.get('.leaflet-tile-pane').within(() => {
          cy.get('.leaflet-layer')
            .last() // the new layer will be added last
            .within(() => {
              cy.get('img.leaflet-tile')
                .first()
                .should('have.attr', 'src')
                .and('match', /Reference_Labels/)
            })
        })
      })
    })
  })

  describe('When viewing granule results', () => {
    describe('When viewing CMR granules', () => {
      before(() => {
        const conceptId = 'C1214470488-ASF'

        cy.clock(new Date(2021, 5, 1, 0, 0, 0), ['Date'])

        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'keywordAlias',
            body: cmrGranulesCollectionBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '1'
            },
            params: 'include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&keyword=C1214470488-ASF%2A&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score'
          },
          {
            alias: 'cmrGranulesCollectionAlias',
            body: cmrGranulesCollectionBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '1'
            },
            params: 'include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&keyword=C1214470488-ASF%2A&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&polygon%5B%5D=42.1875%2C-2.40647%2C42.1875%2C-9.43582%2C49.21875%2C-9.43582%2C42.1875%2C-2.40647&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score'
          }]
        )

        cy.intercept({
          method: 'POST',
          url: '**/search/granules.json'
        },
        (req) => {
          expect(req.body).to.eq('echo_collection_id=C1214470488-ASF&options%5Bspatial%5D%5Bor%5D=true&page_num=1&page_size=20&polygon%5B%5D=42.1875%2C-2.40647%2C42.1875%2C-9.43582%2C49.21875%2C-9.43582%2C42.1875%2C-2.40647&sort_key=-start_date')

          req.alias = 'granulesRequest'
          req.reply({
            body: cmrGranulesBody,
            headers: cmrGranulesHeaders
          })
        })

        cy.intercept({
          method: 'POST',
          url: '**/search/granules/timeline'
        },
        (req) => {
          expect(req.body).to.eq('end_date=2023-12-01T00%3A00%3A00.000Z&interval=day&start_date=2018-12-01T00%3A00%3A00.000Z&concept_id%5B%5D=C1214470488-ASF')

          req.reply({
            body: cmrGranulesTimelineBody,
            headers: cmrGranulesTimelineHeaders
          })
        })

        cy.intercept({
          method: 'POST',
          url: '**/api'
        },
        (req) => {
          expect(req.body).to.eq(graphQlGetCollection(conceptId))

          req.reply({
            body: cmrGranulesCollectionGraphQlBody,
            headers: cmrGranulesCollectionGraphQlHeaders
          })
        })

        cy.intercept({
          method: 'POST',
          url: '**/autocomplete'
        }, {
          body: { feed: { entry: [] } }
        })

        cy.visit('/search')

        getByTestId('keyword-search-input').type(`${conceptId}{enter}`)

        // Select the polygon spatial type
        getByTestId('spatial-selection-dropdown').click()
        getByTestId('spatial-selection-dropdown').within(() => {
          cy.contains('Polygon').click()
        })

        // Add the polygon to the map
        cy.get('.map')
          .click(1000, 450)
          .click(1050, 500)
          .click(1000, 500)
          .click(1000, 450)

        getByTestId('collection-results-item').click()

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })
        cy.wait('@granulesRequest')
      })

      // TODO find a way to verify the granules are drawn on the map

      describe('When hovering over a granule', () => {
        before(() => {
          cy.get('.map').rightclick(1000, 450)
        })

        it('highlights the granule in the granule results list', () => {
          getByTestId('granule-results-item').should('have.class', 'granule-results-item--active')
        })
      })

      describe('When clicking on a granule', () => {
        before(() => {
          cy.intercept({
            method: 'POST',
            url: '**/api'
          },
          (req) => {
            expect(req.body).to.eq('{"query":"\\n    query GetGranule(\\n      $id: String!\\n    ) {\\n      granule(\\n        conceptId: $id\\n      ) {\\n        granuleUr\\n        granuleSize\\n        title\\n        onlineAccessFlag\\n        dayNightFlag\\n        timeStart\\n        timeEnd\\n        dataCenter\\n        originalFormat\\n        conceptId\\n        collectionConceptId\\n        spatialExtent\\n        temporalExtent\\n        relatedUrls\\n        dataGranule\\n        measuredParameters\\n        providerDates\\n      }\\n    }","variables":{"id":"G2061183408-ASF"}}')

            req.reply({
              body: granuleGraphQlBody,
              headers: {
                'content-type': 'application/json'
              }
            })
          })

          cy.get('.map').click(1000, 450)
        })

        it('focuses the selected granule', () => {
          getByTestId('granule-results-item').should('have.class', 'granule-results-item--active')
        })

        it('updates the URL', () => {
          cy.url().should('match', /\/search\/granules.*g=G2061183408-ASF/)
        })
      })
    })

    describe('When viewing OpenSearch granules with polygon spatial', () => {
      before(() => {
        cy.clock(new Date(2021, 5, 1, 0, 0, 0), ['Date'])

        const conceptId = 'C1972468359-SCIOPS'

        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'keywordAlias',
            body: opensearchGranulesCollectionBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '1'
            },
            params: 'include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&keyword=C1972468359-SCIOPS%2A&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score'
          },
          {
            alias: 'opensearchGranulesCollectionAlias',
            body: opensearchGranulesCollectionBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '1'
            },
            params: 'include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&keyword=C1972468359-SCIOPS%2A&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&polygon%5B%5D=42.1875%2C-2.40647%2C42.1875%2C-9.43582%2C49.21875%2C-9.43582%2C42.1875%2C-2.40647&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score'
          }]
        )

        cy.intercept({
          method: 'POST',
          url: '**/opensearch/granules'
        },
        (req) => {
          expect(JSON.parse(req.body).params).to.eql({
            boundingBox: '42.18750000000001,-9.453289809825428,49.218749999999986,-2.4064699999999886',
            conceptId: [],
            echoCollectionId: 'C1972468359-SCIOPS',
            exclude: {},
            openSearchOsdd: 'http://47.90.244.40/glass/osdd/fapar_modis_0.05d.xml',
            options: {
              spatial: {
                or: true
              }
            },
            pageNum: 1,
            pageSize: 20,
            sortKey: '-start_date',
            twoDCoordinateSystem: {}
          })

          req.alias = 'granulesRequest'
          req.reply({
            body: opensearchGranulesBody,
            headers: opensearchGranulesHeaders
          })
        })

        cy.intercept({
          method: 'POST',
          url: '**/search/granules/timeline'
        },
        (req) => {
          expect(req.body).to.eq('end_date=2023-12-01T00%3A00%3A00.000Z&interval=day&start_date=2018-12-01T00%3A00%3A00.000Z&concept_id%5B%5D=C1972468359-SCIOPS')

          req.reply({
            body: opensearchGranulesTimelineBody,
            headers: opensearchGranulesTimelineHeaders
          })
        })

        cy.intercept({
          method: 'POST',
          url: '**/api'
        },
        (req) => {
          expect(req.body).to.eq(graphQlGetCollection(conceptId))

          req.reply({
            body: opensearchGranulesCollectionGraphQlBody,
            headers: opensearchGranulesCollectionGraphQlHeaders
          })
        })

        cy.intercept({
          method: 'POST',
          url: '**/autocomplete'
        }, {
          body: { feed: { entry: [] } }
        })

        cy.visit('/search')

        getByTestId('keyword-search-input').type(`${conceptId}{enter}`)

        // Select the polygon spatial type
        getByTestId('spatial-selection-dropdown').click()
        getByTestId('spatial-selection-dropdown').within(() => {
          cy.contains('Polygon').click()
        })

        // Add the polygon to the map
        cy.get('.map')
          .click(1000, 450)
          .click(1050, 500)
          .click(1000, 500)
          .click(1000, 450)

        getByTestId('collection-results-item').click()

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })
        cy.wait('@granulesRequest')
      })

      it('displays an outline of the minimum bounding rectangle', () => {
        cy.get('.leaflet-interactive').first().should('have.attr', 'd', 'M1000 450L1050 500L1000 500L1000 450z')
        cy.get('.leaflet-interactive').last().should('have.attr', 'd', 'M1000 500L1000 450L1050 450L1050 500L1000 500z')
      })

      it('displays a hint about using a bounding box instead of polygon', () => {
        getByTestId('filter-stack__spatial').get('.filter-stack-item__error').should('have.text', 'This collection does not support polygon search. Your polygon has been converted to a bounding box.')
      })
    })
  })
})
