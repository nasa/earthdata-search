import { devServer } from '@cypress/vite-dev-server'

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
    setupNodeEvents(on, config) {
      on('dev-server:start', (options) => {
        return devServer({
          ...options
        })
      })

      return config
    },
    baseUrl: 'http://localhost:8080',
    specPattern: 'cypress/e2e/**/*.cy.js'
  }
})
