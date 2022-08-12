const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: 'f77xn6',
  env: {
    username: 'super',
    password: '000000'
  },
  watchForFileChanges: false,
  downloadsFolder: "cypress/downloads",
  includeShadowDom: true,
  experimentalShadowDomSupport: true,
  viewportWidth: 1920,
  viewportHeight: 1080,
  screenshotOnRunFailure: true,
  trashAssetsBeforeRuns: false,
  video: true,
  videoUploadOnPasses: false,
  retries: {
    runMode: 0,
    openMode: 0,
  },
  chromeWebSecurity: false,
  defaultCommandTimeout: 20000,
  e2e: {
    baseUrl: 'https://yp-dev.essentialsln.com',
    experimentalSessionAndOrigin: true,
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})