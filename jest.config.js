module.exports = {
  /* moduleDirectories: [
    "node_modules",
    "<rootDir>",
    "<rootDir>/test",
    "./test"
  ], */
  globalSetup: './test/globalSetup.js',
  globalTeardown: './test/teardown.js',
  testEnvironment: './test/puppeteer_environment.js',
  maxWorkers: 1,
};