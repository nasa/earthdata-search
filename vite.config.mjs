import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteEjsPlugin } from 'vite-plugin-ejs'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { resolve } from 'path'
import istanbul from 'vite-plugin-istanbul'

import availablePortals from './portals/availablePortals.json'

import { getApplicationConfig } from './sharedUtils/config'

const {
  analytics,
  defaultPortal,
  env,
  feedbackApp
} = getApplicationConfig()

const { [defaultPortal]: portalConfig } = availablePortals
const { footer, ui } = portalConfig
const { showTophat } = ui
const { attributionText } = footer

export default defineConfig({
  server: {
    host: true,
    port: 8080,
    watch: {
      ignored: [
        '**/coverage/**',
        '**/playwright-report/**',
        '**/tests/**',
        '**/test-results/**'
      ]
    }
  },
  plugins: [
    ViteEjsPlugin({
      env,
      attributionText,
      environment: process.env.NODE_ENV,
      feedbackApp,
      gaPropertyId: analytics.localIdentifier.propertyId,
      gtmPropertyId: analytics.gtmPropertyId,
      includeDevGoogleAnalytics: analytics.localIdentifier.enabled,
      showTophat
    }),
    react(),
    nodePolyfills(),
    istanbul({
      include: 'static/src/*',
      exclude: ['node_modules', 'test/'],
      extension: ['.js', '.jsx'],
      requireEnv: true,
      forceBuildInstrument: process.env.VITE_COVERAGE === 'true'
    })
  ],
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        api: 'modern',
        silenceDeprecations: ['mixed-decls', 'color-functions', 'global-builtin', 'import']
      }
    }
  },
  resolve: {
    alias: {
      '~bootstrap': resolve(__dirname, 'node_modules/bootstrap'),
      '~Fonts': resolve(__dirname, 'static/src/assets/fonts'),
      '~Images': resolve(__dirname, 'static/src/assets/images'),
      lodash: 'lodash-es'
    }
  },
  build: {
    outDir: 'static/dist'
  },
  // TODO: vitest is currently blocked by enzyme removal ticket EDSC-4201
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'test-setup.js',
    clearMocks: true,
    coverage: {
      enabled: true,
      include: [
        'serverless/src/**/*.js',
        'static/src/**/*.js',
        'static/src/**/*.jsx'
      ],
      provider: 'istanbul',
      reporter: ['text', 'lcov', 'clover', 'json'],
      reportOnFailure: true
    }
  }
})
