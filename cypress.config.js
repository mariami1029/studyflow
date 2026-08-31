const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://studyflow.ge",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});