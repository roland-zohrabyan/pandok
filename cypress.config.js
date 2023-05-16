const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: 'f77xn6',
  env: {
    username: '', // removed for security reasons
    password: '' // removed for security reasons
  },
  watchForFileChanges: false,
  downloadsFolder: "cypress/downloads",
  includeShadowDom: true,
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
    baseUrl: '', // removed for security reasons
    experimentalSessionAndOrigin: true,
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})
