module.exports = {
  roots: ["<rootDir>/client"],
  displayName: "client",
  setupFilesAfterEnv: ["<rootDir>/jest-setup.js"],
  testMatch: ["<rootDir>/**/__tests__/*.jest.(ts|tsx)"],
  testPathIgnorePatterns: ["<rootDir>/test/"],
  moduleNameMapper: {
    "\\.(css|scss)$": "<rootDir>/__mocks__/styleMock.js",
  },
  coverageDirectory: "test-coverage/client/jest",
  coverageThreshold: {
    global: {
      branches: 39,
      functions: 35,
      lines: 40,
      statements: 40,
    },
  },
  moduleNameMapper: {
    "^.+.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2|ico|svg)$":
      "jest-transform-stub",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(govuk-react-jsx))",
    "\\.pnp\\.[^\\/]+$",
  ],
};
