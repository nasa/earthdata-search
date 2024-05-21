// https://github.com/ai/nanoid/issues/363#issuecomment-1140906651
const esModulesToIgnore = ['nanoid', 'lodash-es'].join('|')

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'serverless/src/**/*.js',
    'static/src/**/*.js',
    'sharedUtils/**/*.js'
  ],
  moduleNameMapper: {
    // Use the moduleNameMapper for all images except the logo.png that exist in the portals directory
    '(?<!/portals)(?<!/logo).(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/static/src/js/util/mocks/fileMock.js',
    '^.+\\.(css|less|scss)$': 'babel-jest',
    // Force module uuid to resolve with the CJS entry point, because Jest does not support package.json.exports. See https://github.com/uuidjs/uuid/issues/451
    uuid: require.resolve('uuid'),
    '^nanoid(/(.*)|$)': 'nanoid$1',
    'react-leaflet': '<rootDir>/static/src/js/util/mocks/reactLeafletMock.js',
    // After the update to 1.x the CJS changed import method. Adding a module mapper to resolve issues. See https://stackoverflow.com/a/74079349
    '^axios$': require.resolve('axios')
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
    'node_modules',
    '/tests'
  ],
  transform: {
    // Use the fileTransformer for all the logo.pngs that exist in the portals directory
    '(?<=/portals)(?<=/logo).png':
      '<rootDir>/static/src/js/util/jest/fileTransformer.js',
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [`/node_modules/(?!${esModulesToIgnore})`]
}
