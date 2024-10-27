/**
 * @license
 * Copyright (c) 2024-2024 Burak Günaydin
 * All Rights Reserved
 * 
 * This software is the confidential and proprietary information of
 * Burak Günaydin. You may not use, modify, or distribute this
 * software (unless you have the permission of the copyright holder)
 * except in accordance with the terms of any applicable license agreement.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALI* NGS IN THE
 * SOFTWARE.
 */

// Package imports
import { defineConfig } from 'vite';
import fs from 'fs';
import react from '@vitejs/plugin-react';

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
  plugins: [react()],

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