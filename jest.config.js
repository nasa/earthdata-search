module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'serverless/src/**/*.js',
    'static/src/**/*.js',
    'sharedUtils/**/*.js'
  ],
  moduleNameMapper: {
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/static/src/js/util/mocks/fileMock.js',
    '^.+\\.(css|less|scss)$': 'babel-jest'
  },
  coveragePathIgnorePatterns: [
    'package.json',
    'package-lock.json'
  ],
  setupFiles: [
    '<rootDir>/test-env.js'
  ],
  testPathIgnorePatterns: [
    'mocks.js'
  ],
  testEnvironment: 'jsdom'
}
