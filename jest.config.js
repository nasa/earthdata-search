// https://github.com/ai/nanoid/issues/363#issuecomment-1140906651
const esModulesToIgnore = ['nanoid'].join('|')

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'serverless/src/**/*.js',
    'static/src/**/*.js',
    'sharedUtils/**/*.js'
  ],
  moduleNameMapper: {
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/static/src/js/util/mocks/fileMock.js',
    '^.+\\.(css|less|scss)$': 'babel-jest',
    // Force module uuid to resolve with the CJS entry point, because Jest does not support package.json.exports. See https://github.com/uuidjs/uuid/issues/451
    uuid: require.resolve('uuid'),
    '^nanoid(/(.*)|$)': 'nanoid$1',
    'react-leaflet': '<rootDir>/static/src/js/util/mocks/reactLeafletMock.js'
  },
  coveragePathIgnorePatterns: [
    'package.json',
    'package-lock.json'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/test-env.js'
  ],
  testPathIgnorePatterns: [
    'mocks.js',
    'node_modules'
  ],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  transformIgnorePatterns: [`/node_modules/(?!${esModulesToIgnore})`]
}
