import { getByTestId } from '../../support/getByTestId'
import collectionsGraphJson from './download_mocks/collections_graph.json'
import timeline from './download_mocks/timeline.json'
import granules from './download_mocks/granules.json'
import granulesGraphqlBody from './download_mocks/granulesGraphqlBody.json'
import providers from './download_mocks/providers.json'
import accessMethods from './download_mocks/access_methods.json'
import retrievals from './download_mocks/retrievals.json'
import retrieval from './download_mocks/retrieval.json'
import { getAuthHeaders } from '../utils/getAuthHeaders'

describe('Download project spec', () => {
  it('downloading a collection sends gives the user download links', () => {
    cy.login()

    const authHeaders = getAuthHeaders()

    cy.intercept(
      'POST',
      '**/graphql',
      {
        body: collectionsGraphJson.body,
        headers: authHeaders
      }
    )
    cy.intercept(
      'POST',
      '**/granules/timeline',
      {
        body: timeline.body,
        headers: authHeaders
      }
    )
    cy.intercept(
      'POST',
      '**/dqs',
      {
        body: []
      }
    )
    cy.intercept(
      'POST',
      '**/granules',
      {
        body: granules.body,
        headers: {
          ...authHeaders,
          'cmr-hits': '42'
        }
      }
    )
    cy.intercept(
      'GET',
      '**/providers',
      {
        body: providers.body
      }
    )
    cy.intercept(
      'POST',
      '**/access_methods',
      {
        body: accessMethods.body
      }
    )

    cy.visit('/projects?p=!C1443528505-LAADS&sb=-77.15071678161621%2C38.78817179999825%2C-76.89801406860352%2C38.99784152603538&m=37.64643450971326!-77.407470703125!7!1!0!0%2C2&qt=2020-01-06T04%3A15%3A27.310Z%2C2020-01-13T07%3A32%3A50.962Z&ff=Map%20Imagery&tl=1563377338!4!!')

    // Check the download method
    getByTestId('C1443528505-LAADS_access-method__direct-download').click()

    // Click the done button
    getByTestId('project-panels-done').click()
    getByTestId('panels-section').should('not.have.class', 'panels--is-open')

    cy.intercept(
      'POST',
      '**/retrievals',
      {
        body: retrievals.body,
        headers: retrievals.headers
      }
    )
    cy.intercept(
      'GET',
      '**/retrievals/*',
      {
        body: retrieval.body,
        headers: retrieval.headers
      }
    )

    // Click the download button
    getByTestId('project-download-data').click()

    cy.intercept(
      'POST',
      '**/graphql',
      {
        body: granulesGraphqlBody,
        headers: authHeaders
      }
    )

    // view download links
    cy.contains('https://ladsweb.modaps.eosdis.nasa.gov/archive/allData/61/MYD04_3K/2020/006/MYD04_3K.A2020006.1720.061.2020008170450.hdf').should('be.visible')
    cy.contains('https://ladsweb.modaps.eosdis.nasa.gov/archive/allData/61/MYD04_3K/2020/006/MYD04_3K.A2020006.1900.061.2020008170003.hdf').should('be.visible')
    cy.contains('https://ladsweb.modaps.eosdis.nasa.gov/archive/allData/61/MYD04_3K/2020/007/MYD04_3K.A2020007.1805.061.2020008182434.hdf').should('be.visible')
    cy.contains('https://ladsweb.modaps.eosdis.nasa.gov/archive/allData/61/MYD04_3K/2020/008/MYD04_3K.A2020008.1850.061.2020010183913.hdf').should('be.visible')
    cy.contains('https://ladsweb.modaps.eosdis.nasa.gov/archive/allData/61/MYD04_3K/2020/009/MYD04_3K.A2020009.1755.061.2020010200250.hdf').should('be.visible')
    cy.contains('https://ladsweb.modaps.eosdis.nasa.gov/archive/allData/61/MYD04_3K/2020/010/MYD04_3K.A2020010.1835.061.2020011153413.hdf').should('be.visible')
    cy.contains('https://ladsweb.modaps.eosdis.nasa.gov/archive/allData/61/MYD04_3K/2020/011/MYD04_3K.A2020011.1740.061.2020012150910.hdf').should('be.visible')
    cy.contains('https://ladsweb.modaps.eosdis.nasa.gov/archive/allData/61/MYD04_3K/2020/012/MYD04_3K.A2020012.1825.061.2020013152621.hdf').should('be.visible')
  })
})
