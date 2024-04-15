import postcss from '@vituum/vite-plugin-postcss';
import { resolve } from 'path';

export default {
  plugins: [postcss()],
  resolve: {
    alias: {
      '~bootstrap': resolve(__dirname, 'node_modules/bootstrap')
    }
  },
  build: {
    outDir: resolve(__dirname, 'static/dist/app'),
    emptyOutDir: true,
    minify: 'esbuild',
    cssMinify: 'lightningcss',
    rollupOptions: {
      input: 'static/src/index.jsx'
    }
  }
}
