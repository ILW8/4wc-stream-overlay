import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import vue from '@vitejs/plugin-vue';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import NodeCGPlugin from 'vite-plugin-nodecg';

// Getting __dirname with ES Modules.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set if we're in dev mode
const isDevMode = process.env.INJECT_DEV_MODE === 'true';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    quasar({ autoImportComponentCase: 'pascal' }),
    checker({ vueTsc: { tsconfigPath: 'tsconfig.browser.json' } }),
    NodeCGPlugin({
      inputs: {
        'graphics/*/main.ts': './src/graphics/template.html',
        'dashboard/*/main.ts': './src/dashboard/template.html',
      },
    }),
  ],
  define: {
    // Make INJECT_DEV_MODE available to client code
    'import.meta.env.INJECT_DEV_MODE': JSON.stringify(isDevMode)
  },
  resolve: {
    alias: {
      '@4wc-stream-overlay': `${__dirname}/src/`,
    },
  },
});
