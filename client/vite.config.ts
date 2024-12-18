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
const VITE_SSL_CERT_PATH = process.env.VITE_SSL_CERT_PATH;
const VITE_SSL_KEY_PATH = process.env.VITE_SSL_KEY_PATH;

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
   */
  plugins: [react(), Terminal({
    console: 'terminal',
    output: ['terminal', 'console']
  })],

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
   * - Configures HTTPS with specified certificate and key files.
   * - Automatically opens the browser on server start.
   * - Sets the server port to 443.
   */
  server: {
    cors: true,
    host: '0.0.0.0', // Circumvents the insecure-ssl-certificate-warning in browsers
    https: {
      cert: fs.readFileSync(VITE_SSL_CERT_PATH),
      key: fs.readFileSync(VITE_SSL_KEY_PATH)
    },
    open: false, // Set this to false to prevent opening a browser
    port: 443
  }
});