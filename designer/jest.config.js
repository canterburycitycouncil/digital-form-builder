module.exports = {
  moduleNameMapper: {
    "^.+.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2|ico|svg)$":
      "jest-transform-stub",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(govuk-react-jsx))",
    "\\.pnp\\.[^\\/]+$",
  ],
  projects: [
    {
      roots: ["<rootDir>/client"],
      displayName: "client",
      setupFilesAfterEnv: ["<rootDir>/jest-setup.js"],
      preset: "ts-jest",
      testMatch: ["<rootDir>/**/__tests__/*.jest.(ts|tsx)"],
      testPathIgnorePatterns: ["<rootDir>/test/"],
      coverageThreshold: {
        global: {
          branches: 85,
          functions: 83,
          lines: 93,
          statements: 92,
        },
      },
    },
    {
      displayName: "server",
      roots: ["<rootDir>/server"],
      setupFilesAfterEnv: ["<rootDir>/jest-server-setup.js"],
      preset: "ts-jest",
      testMatch: ["<rootDir>/**/__tests__/*.jest.(ts|tsx)"],
      testPathIgnorePatterns: ["<rootDir>/test/"],
      coverageThreshold: {
        global: {
          branches: 85,
          functions: 83,
          lines: 93,
          statements: 92,
        },
      },
    },
  ],
};
