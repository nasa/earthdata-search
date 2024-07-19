import { isDownloadable } from '../../../../../../sharedUtils/isDownloadable'

/**
 * Builds the Downloads access method
 * @param {object} granules granules object pulled from the collectionMetdata
 * @param {boolean} isOpenSearch Is the collection an open search collection
 * @returns {object} Access method for Downloads
 */
export const buildDownload = (granules, isOpenSearch) => {
  const accessMethods = {}

  // Determine if the collection should have the downloadable accessMethod
  let onlineAccessFlag = false

  if (granules) {
    // If the collection has granules, check their online access flags to
    // determine if this collection is downloadable
    const { items: granuleItems } = granules

    if (granuleItems) {
      onlineAccessFlag = isDownloadable(granuleItems)
    }

    if (onlineAccessFlag || isOpenSearch) {
      accessMethods.download = {
        isValid: true,
        type: 'download'
      }
    }
  }

  return accessMethods
}
