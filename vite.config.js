import postcss from '@vituum/vite-plugin-postcss'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import react from '@vitejs/plugin-react'
import {ViteEjsPlugin} from "vite-plugin-ejs"
import { resolve } from 'path'
import availablePortals from './portals/index'

const config = require('./sharedUtils/config')

const {
  analytics,
  defaultPortal,
  env,
  feedbackApp
} = config.getApplicationConfig()

const { [defaultPortal]: portalConfig } = availablePortals
const { ui } = portalConfig
const { showTophat } = ui

export default {
  root: resolve(__dirname, 'static/src'),
  server: {
    host: 'localhost',
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
    postcss(),
    // Handle crypto and stream polyfills.
    nodePolyfills({
      protocolImports: true
    })
  ],
  resolve: {
    alias: {
      '~bootstrap': resolve(__dirname, 'node_modules/bootstrap'),
      '~Fonts': resolve(__dirname, 'static/src/assets/fonts'),
      '~Images': resolve(__dirname, 'static/src/assets/images'),
      process: 'process/browser'
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  build: {
    outDir: resolve(__dirname, 'static/dist'),
    commonjsOptions: { transformMixedEsModules: true },
    emptyOutDir: true,
    minify: 'esbuild',
    cssMinify: 'cssnano',
    rollupOptions: {
      input: [
        resolve(__dirname, 'static/src/index.jsx'),
        'core-js/stable',
        'regenerator-runtime/runtime'],
      output: {
        entryFileNames: '[name].bundle.js',
        assetFileNames: 'assets/[name].[hash].[ext]',
        dir: resolve(__dirname, 'static/dist'),
        chunkFileNames: '[name].bundle.js'
      }
    }
  }
}
