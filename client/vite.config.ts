/**
 * @license
 * Copyright (C) 2024-2025 Burak Günaydin
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

// Package imports
import { defineConfig } from 'vite';
import fs from 'fs';
import react from '@vitejs/plugin-react';
import Terminal from 'vite-plugin-terminal'

// Read environment variables
const VITE_PORT = Number(process.env.VITE_PORT) || 443;
const VITE_SSL_CERT_PATH = process.env.VITE_SSL_CERT_PATH;
const VITE_SSL_KEY_PATH = process.env.VITE_SSL_KEY_PATH;
const AUTH_TARGET = `http://${process.env.HOMEPIE_AUTH_HOST || '127.0.0.1'}:${process.env.HOMEPIE_AUTH_PORT || 8000}`;

// https://vitejs.dev/config/
/**
 * Vite configuration file for the HomePie client application.
 * 
 * This configuration includes settings for:
 * - Global SCSS constants
 * - Workaround for missing global variable in simple-peer
 * - Plugin configuration
 * - Path aliasing for nested components
 * - HTTPS development server settings
 */

export default defineConfig({
  /**
   * CSS preprocessor options.
   * 
   * Enables global usage of SCSS constants by importing global mixins and variables.
   */
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "./src/_style/global-assets.scss";
          @import "./src/_style/global-variables.scss";
          @import "./src/_style/global-z-indices.scss";
        `,
      },
    },
  },

  /**
   * Build output.
   * 
   * Not the default 'dist', because vite empties it on every build and 'dist/ssl' holds the dev certificates.
   * `deploy client` publishes this directory to /var/www/homepie/client.
   */
  build: {
    outDir: 'build'
  },

  /**
   * Define global variables.
   * 
   * Workaround for simple-peer missing global variable.
   */
  define: {
    global: {}
  },

  /**
   * Plugin configuration.
   * 
   * Not using mkcert() anymore, because it overwrites the SSL certificate served by the development server.
   * 
   * The terminal plugin only forwards the browser console to the dev server's terminal, so it is applied to
   * `vite serve` only. During `vite build` it injects a virtual module that rollup cannot resolve.
   */
  plugins: [
    react(),
    ...Terminal({
      console: 'terminal',
      output: ['terminal', 'console']
    }).map((plugin) => plugin && { ...plugin, apply: 'serve' as const })
  ],

  /**
   * Module resolution configuration.
   * 
   * Allows nested components in source code to resolve the absolute path via "@".
   */
  resolve: {
    alias: [{ find: '@', replacement: '/src' }],
  },

  /**
   * HTTPS development server settings.
   * 
   * - Enables CORS.
   * - Sets the host to 'localhost' to circumvent insecure SSL certificate warnings in browsers.
   * - Configures HTTPS with specified certificate and key files (only if both paths are set, so that
   *   `vite build` works on the server, where nginx terminates TLS with the Let's Encrypt certificate).
   * - Automatically opens the browser on server start.
   * - Sets the server port to 443 (override with VITE_PORT, e.g. while nginx is running on this machine).
   */
  server: {
    cors: true,
    host: '0.0.0.0', // Circumvents the insecure-ssl-certificate-warning in browsers
    https: VITE_SSL_CERT_PATH && VITE_SSL_KEY_PATH ? {
      cert: fs.readFileSync(VITE_SSL_CERT_PATH),
      key: fs.readFileSync(VITE_SSL_KEY_PATH)
    } : undefined,
    open: false, // Set this to false to prevent opening a browser
    port: VITE_PORT,
    // Same origin for the page and the auth API, so the session cookie works without CORS (see `scripts/server/start --env dev`)
    proxy: {
      '/api/auth': { changeOrigin: false, target: AUTH_TARGET }
    }
  }
});