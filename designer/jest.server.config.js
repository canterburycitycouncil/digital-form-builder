module.exports = {
  roots: ["<rootDir>/server"],
  displayName: "server",
  setupFilesAfterEnv: ["<rootDir>/jest-server-setup.js"],
  testMatch: ["<rootDir>/**/__tests__/*.jest.(ts|tsx)"],
  testPathIgnorePatterns: ["<rootDir>/test/"],
  coverageDirectory: "test-coverage/server/jest",
  coverageThreshold: {
    global: {
      branches: 54,
      functions: 48,
      lines: 56,
      statements: 55,
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
