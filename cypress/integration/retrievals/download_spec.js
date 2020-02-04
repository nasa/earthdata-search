import { getByTestId } from '../../support/getByTestId'
import collectionsJson from './download_mocks/collections_json'
import collectionsUmmJson from './download_mocks/collections_umm_json'
import timeline from './download_mocks/timeline'
import granules from './download_mocks/granules'
import providers from './download_mocks/providers'
import accessMethods from './download_mocks/access_methods'
import retrievals from './download_mocks/retrievals'
import retrieval from './download_mocks/retrieval'
import { getAuthHeaders } from '../utils/getAuthHeaders'

describe('Download project spec', () => {
  it('downloading a collection sends gives the user download links', () => {
    cy.server()

    cy.login()

    const authHeaders = getAuthHeaders()

    cy.route({
      method: 'POST',
      url: '**/collections/json',
      response: collectionsJson.body,
      headers: authHeaders
    })
    cy.route({
      method: 'POST',
      url: '**/collections/umm_json',
      response: collectionsUmmJson.body,
      headers: authHeaders
    })
    cy.route({
      method: 'POST',
      url: '**/granules/timeline',
      response: timeline.body,
      headers: authHeaders
    })
    cy.route({
      method: 'POST',
      url: '**/dqs',
      response: []
    })
    cy.route({
      method: 'POST',
      url: '**/granules',
      response: granules.body,
      headers: authHeaders
    })
    cy.route({
      method: 'GET',
      url: '**/providers',
      response: providers.body
    })
    cy.route({
      method: 'POST',
      url: '**/access_methods',
      response: accessMethods.body
    })

    cy.visit('/projects?p=!C1443528505-LAADS&sb=-77.15071678161621%2C38.78817179999825%2C-76.89801406860352%2C38.99784152603538&m=37.64643450971326!-77.407470703125!7!1!0!0%2C2&qt=2020-01-06T04%3A15%3A27.310Z%2C2020-01-13T07%3A32%3A50.962Z&ff=Map%20Imagery&tl=1563377338!4!!')

    getByTestId('C1443528505-LAADS_access-method__direct-download').check()

    cy.route({
      method: 'POST',
      url: '**/retrievals',
      response: retrievals.body,
      headers: retrievals.headers
    })
    cy.route({
      method: 'GET',
      url: '**/retrievals/*',
      response: retrieval.body,
      headers: retrieval.headers
    })

    getByTestId('project-download-data').click()

    // view download links
    getByTestId('download-data-links').then((link) => {
      // The link opens in a new tab, which we can't do
      // Copy to href out of the link and visit that page
      const href = link.prop('href')

      cy.route({
        method: 'POST',
        url: '**/granules',
        response: granules.body,
        headers: granules.headers
      })

      cy.visit(href)
      cy.url().should('include', '/links')
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
})
