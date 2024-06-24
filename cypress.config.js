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
    }
  }
})
