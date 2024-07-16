import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteEjsPlugin } from 'vite-plugin-ejs'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import rollupNodePolyFill from 'rollup-plugin-polyfill-node'
import { resolve } from 'path'

import availablePortals from './portals/availablePortals.json'

import { getApplicationConfig } from './sharedUtils/config'

const {
  analytics,
  defaultPortal,
  env,
  feedbackApp
} = getApplicationConfig()

const { [defaultPortal]: portalConfig } = availablePortals
const { ui } = portalConfig
const { showTophat } = ui

export default defineConfig({
  server: {
    host: true,
    port: 8080
  },
  plugins: [
    ViteEjsPlugin({
      env,
      environment: process.env.NODE_ENV,
      feedbackApp,
      gaPropertyId: analytics.localIdentifier.propertyId,
      gtmPropertyId: analytics.gtmPropertyId,
      includeDevGoogleAnalytics: analytics.localIdentifier.enabled,
      showTophat
    }),
    react(),
    nodePolyfills()
  ],
  css: {
    devSourcemap: true
  },
  resolve: {
    alias: {
      '~bootstrap': resolve(__dirname, 'node_modules/bootstrap'),
      '~Fonts': resolve(__dirname, 'static/src/assets/fonts'),
      '~Images': resolve(__dirname, 'static/src/assets/images')
    }
  },
  build: {
    outDir: 'static/dist',
    rollupOptions: {
      plugins: [
        rollupNodePolyFill()
      ]
    }
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
