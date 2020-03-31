import { uniq } from 'lodash'

/**
 * Extracts the native format(s) from the UMM-C metadata
 * @param {Object} ummJson UMM-C JSON metadata
 */
export const buildNativeFormat = (ummJson) => {
  const {
    ArchiveAndDistributionInformation: archiveAndDistributionInformation = {}
  } = ummJson
  const {
    FileDistributionInformation: fileDistributionInformation = []
  } = archiveAndDistributionInformation

  const formats = []

  fileDistributionInformation.forEach((info) => {
    const {
      Format: format,
      FormatType: formatType
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
