module.exports = {
  collectCoverage: true,
  moduleNameMapper: {
    '^.+\\.(css|less|scss)$': 'babel-jest'
  },
  coveragePathIgnorePatterns: [
    'package.json',
    'package-lock.json'
  ]
}
