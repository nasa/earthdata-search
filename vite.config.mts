import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { ViteEjsPlugin } from 'vite-plugin-ejs'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { resolve } from 'path'
import istanbul from 'vite-plugin-istanbul'
import { imagetools } from 'vite-imagetools'
import graphqlLoader from 'vite-plugin-graphql-loader'

import availablePortals from './portals/availablePortals.json'

import { getApplicationConfig } from './sharedUtils/config'
import { preloadImagePlugin } from './vite_plugins/preloadImagePlugin'

const {
  analytics,
  defaultPortal,
  env,
  feedbackApp,
  version
} = getApplicationConfig()

// @ts-expect-error: this is a workaround for the issue with the types
const { [defaultPortal]: portalConfig } = availablePortals
const { footer, ui } = portalConfig
const { showTophat } = ui
const { attributionText } = footer

export default defineConfig({
  publicDir: 'static/src/public',
  server: {
    host: true,
    port: 8080,
    watch: {
      ignored: [
        '**/coverage/**',
        '**/playwright-coverage/**',
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
      showTophat,
      version
    }),
    react({
      babel: {
        plugins: [
          [
            "babel-plugin-react-compiler",
            {
              target: "18"
            }
          ]
        ]
      }
    }),
    nodePolyfills({
      include: [
        'buffer',
        'stream',
        'util'
      ]
    }),
    istanbul({
      include: 'static/src/*',
      exclude: ['node_modules', 'test/'],
      extension: ['.js', '.jsx', '.ts', '.tsx'],
      requireEnv: true,
      forceBuildInstrument: process.env.VITE_COVERAGE === 'true'
    }),
    svgr({
      include: '**/*.svg?react'
    }),
    imagetools(),
    preloadImagePlugin(),
    graphqlLoader()
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
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '~bootstrap': resolve(__dirname, 'node_modules/bootstrap'),
      '~Fonts': resolve(__dirname, 'static/src/assets/fonts'),
      '~Images': resolve(__dirname, 'static/src/assets/images'),
      lodash: 'lodash-es'
    }
  },
  build: {
    outDir: 'static/dist',
    rollupOptions: {
      output: {
        // These manual chunks are used to split the code into separate files
        // to reduce the size of the main bundle and improve loading times
        // These libraries are some of the largest in the app and are rarely updated
        // so the browser can cache them to further improve loading times for returning users
        manualChunks: {
          edscUtils: ['@edsc/timeline', '@edsc/geo-utils'],
          lodash: ['lodash-es'],
          moment: ['moment'],
          react: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'vitestConfigs/test-env.ts',
    clearMocks: true,
    reporters: process.env.GITHUB_ACTIONS ? ['default', 'github-actions'] : ['default'],
    include: [
      'serverless/src/**/*.test.{js,ts}',
      'static/src/**/*.test.{js,jsx,ts,tsx}',
      'sharedUtils/**/*.test.js'
    ],
    coverage: {
      enabled: true,
      include: [
        'serverless/src/**/*.{js,ts}',
        'static/src/**/*.{js,jsx,ts,tsx}',
        'sharedUtils/**/*.js'
      ],
      exclude: [
        '**/vitestConfigs/**',
        '**/*.d.ts'
      ],
      reporter: ['text', 'lcov', 'clover', 'json', 'html'],
      reportOnFailure: true
    }
  }
})
