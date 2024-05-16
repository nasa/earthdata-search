import vitePreprocessor from 'cypress-vite'

export default ({
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
    setupNodeEvents(on) {
      on('file:preprocessor', vitePreprocessor({}))
    },
    baseUrl: 'http://localhost:8080',
    specPattern: 'cypress/e2e/**/*.cy.js'
  }
})
