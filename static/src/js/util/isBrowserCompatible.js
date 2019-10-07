import browser from 'browser-detect'

export const isBrowserCompatible = () => {
  const {
    name,
    versionNumber
  } = browser()

  if (name === 'ie' && versionNumber <= 10) {
    return false
  }

  return true
}
