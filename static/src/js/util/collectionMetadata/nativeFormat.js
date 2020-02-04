import { uniq } from 'lodash'

/**
 * Extracts the native format(s) from the UMM-C metadata
 * @param {Object} ummJson UMM-C JSON metadata
 */
export const buildNativeFormat = (ummJson) => {
  const { ArchiveAndDistributionInformation = {} } = ummJson
  const { FileDistributionInformation = [] } = ArchiveAndDistributionInformation

  const formats = []

  FileDistributionInformation.forEach((info) => {
    const { Format, FormatType } = info
    if (FormatType.toLowerCase() === 'native' && Format.toLowerCase() !== 'not provided') formats.push(Format)
  })

  return uniq(formats)
}
