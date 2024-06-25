import { defineConfig } from 'cypress'
import path from 'path'
import { build } from 'vite'
import chokidar from 'chokidar'

const watchers = {}

function customVitePreprocessor(userConfig) {
  const config = typeof userConfig === 'string' ? { configFile: userConfig } : userConfig ?? {}

  return async (file) => {
    const { outputPath, filePath, shouldWatch } = file
    const fileName = path.basename(outputPath)
    const filenameWithoutExtension = path.basename(
      outputPath,
      path.extname(outputPath)
    )
    if (shouldWatch && !watchers[filePath]) {
      let initial = true
      watchers[filePath] = chokidar.watch(filePath)
      file.on('close', async () => {
        await watchers[filePath].close()
        delete watchers[filePath]
      })

      watchers[filePath].on('all', () => {
        if (!initial) {
          file.emit('rerun')
        }

        initial = false
      })
    }

    const defaultConfig = {
      logLevel: 'warn',
      define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      },
      build: {
        emptyOutDir: false,
        minify: false,
        outDir: path.dirname(outputPath),
        sourcemap: true,
        write: true,
        watch: null,
        lib: {
          entry: filePath,
          fileName: () => fileName,
          formats: ['es'],
          name: filenameWithoutExtension
        },
        rollupOptions: {
          output: {
            manualChunks: false
          }
        }
      }
    }
    await build({
      ...config,
      ...defaultConfig
    })

    return outputPath
  }
}

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
      on('file:preprocessor', customVitePreprocessor())
    }
  }
})
