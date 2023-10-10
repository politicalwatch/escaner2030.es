import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue2 from '@vitejs/plugin-vue2';
import legacy from '@vitejs/plugin-legacy';
import vitePluginRequire from 'vite-plugin-require';
import { createSvgPlugin } from 'vite-plugin-vue2-svg';

const svgoConfig = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
        },
      },
    },
  ],
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue2(),
    legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    }),
    vitePluginRequire(),
    // createSvgPlugin({
    //   svgoConfig,
    // }),
  ],
  optimizeDeps: {
    include: ['save-svg-as-png', 'd3', 'd3-cloud', 'd3-dispatch'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/_variables.scss";`,
      },
    },
  },
});
