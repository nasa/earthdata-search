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
    rollupOptions: {
      input: 'static/src/index.jsx'
    }
  }
}
