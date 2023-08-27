// stryker.conf.js

const config = {
  buildCommand: "npm run build",
  mutate: ["lib/**/*.ts"],
  testRunner: "mocha",
  reporters: ["progress", "html", "json", "dashboard"],
  coverageAnalysis: "perTest",
  mochaOptions: {
    spec: [ "built/test" ]
  },
  dashboard: {
    project: "github.com/bmordue/puzzle",
    version: "main"
  }
};

module.exports = config;

