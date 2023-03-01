/* eslint-disable global-require */
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  viewportWidth: 1400,
  viewportHeight: 900,
  fixturesFolder: 'cypress/fixtures',
  chromeWebSecurity: false,
  retries: {
    runMode: 2
  },
  env: {
    test_cyress: true
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index')(on, config)
    },
    baseUrl: 'http://localhost:8080',
    specPattern: 'cypress/e2e/**/*.cy.js'
  }
})
