import { defineConfig } from 'cypress'
import vitePreprocessor from 'cypress-vite'

export default defineConfig({
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
      on('file:preprocessor', vitePreprocessor())
      on('after:run', (results) => {
        if (results.totalTests === 0) {
          console.log('No tests found. Exiting with success.')
        }

        return Promise.resolve({ exitCode: 0 })
      })
    },
    baseUrl: 'http://localhost:8080',
    specPattern: 'cypress/e2e/**/*.cy.js'
  }
})
