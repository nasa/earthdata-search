import { uniq } from 'lodash'

/**
 * Extracts the native format(s) from the UMM-C metadata
 * @param {Object} json GraphQL query result]
 */
export const buildNativeFormat = (json) => {
  const {
    archiveAndDistributionInformation = {}
  } = json

  let fileDistributionInformation = []

  if (archiveAndDistributionInformation) {
    ({ fileDistributionInformation = [] } = archiveAndDistributionInformation)
  }

  const formats = []

  fileDistributionInformation.forEach((info) => {
    const {
      format,
      formatType
    } = info

    if (
      formatType
      && formatType.toLowerCase() === 'native'
      && format.toLowerCase() !== 'not provided'
    ) {
      formats.push(format)
    }
  })

  return uniq(formats)
}
